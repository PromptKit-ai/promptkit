import { existsSync, readFileSync } from "fs"
import { join } from "path"
import chalk from "chalk"

interface ValidationResult {
  errors: string[]
  warnings: string[]
}

export async function validatePack(dir: string = process.cwd()) {
  console.log(chalk.blue(`\n  Validating pack in ${chalk.bold(dir)}\n`))

  const result: ValidationResult = { errors: [], warnings: [] }

  // 1. Check package.json
  const pkgPath = join(dir, "package.json")
  if (!existsSync(pkgPath)) {
    result.errors.push("Missing package.json")
  } else {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"))
    if (!pkg.name) result.errors.push("package.json missing 'name'")
    if (!pkg.version) result.errors.push("package.json missing 'version'")
    if (!pkg.dependencies?.["@promptkit/protocol"] && !pkg.peerDependencies?.["@promptkit/protocol"]) {
      result.warnings.push("@promptkit/protocol not in dependencies — recommended for type safety")
    }
  }

  // 2. Check promptkit.json
  const pkitPath = join(dir, "promptkit.json")
  if (!existsSync(pkitPath)) {
    result.warnings.push("Missing promptkit.json — marketplace metadata won't be available")
  } else {
    const pkit = JSON.parse(readFileSync(pkitPath, "utf-8"))
    if (!pkit.category) result.warnings.push("promptkit.json missing 'category'")
  }

  // 3. Check source entry
  const srcIndex = join(dir, "src", "index.ts")
  if (!existsSync(srcIndex)) {
    result.errors.push("Missing src/index.ts — the main entry point")
  } else {
    const content = readFileSync(srcIndex, "utf-8")
    if (!content.includes("WidgetPack")) {
      result.warnings.push("src/index.ts doesn't export a WidgetPack — make sure you export your pack definition")
    }
  }

  // 4. Check for widget files
  const widgetsDir = join(dir, "src", "widgets")
  if (!existsSync(widgetsDir)) {
    result.warnings.push("No src/widgets/ directory found")
  }

  // 5. Try to build and import (if built)
  const distIndex = join(dir, "dist", "index.js")
  if (existsSync(distIndex)) {
    try {
      const mod = await import(distIndex)
      const packExports = Object.values(mod).filter(
        (v: any) => v && typeof v === "object" && "name" in v && "widgets" in v
      ) as any[]

      if (packExports.length === 0) {
        result.errors.push("No WidgetPack export found in dist/index.js")
      } else {
        for (const pack of packExports) {
          console.log(chalk.gray(`  Found pack: ${chalk.white(pack.name)} (${pack.widgets?.length || 0} widgets)`))

          if (!pack.widgets || pack.widgets.length === 0) {
            result.errors.push(`Pack "${pack.name}" has no widgets`)
          } else {
            // Validate each widget
            const types = new Set<string>()
            for (const widget of pack.widgets) {
              if (!widget.type) result.errors.push("Widget missing 'type'")
              if (!widget.category) result.errors.push(`Widget "${widget.type}" missing 'category'`)
              if (!widget.serialize) result.errors.push(`Widget "${widget.type}" missing 'serialize' function`)
              if (!widget.deserialize) result.errors.push(`Widget "${widget.type}" missing 'deserialize' function`)
              if (!widget.humanReadable) result.errors.push(`Widget "${widget.type}" missing 'humanReadable' function`)

              if (types.has(widget.type)) {
                result.errors.push(`Duplicate widget type: "${widget.type}"`)
              }
              types.add(widget.type)

              // Round-trip test
              if (widget.serialize && widget.deserialize && widget.defaultValue !== undefined) {
                try {
                  const testWidget = { id: "test", type: widget.type, category: widget.category, value: widget.defaultValue, meta: widget.defaultMeta || {}, display: widget.defaultDisplay || {} }
                  const serialized = widget.serialize(testWidget)
                  if (!serialized) result.warnings.push(`Widget "${widget.type}" serialize returned empty`)
                } catch (e: any) {
                  result.errors.push(`Widget "${widget.type}" serialize threw: ${e.message}`)
                }
              }
            }
          }
        }
      }
    } catch (e: any) {
      result.errors.push(`Failed to import dist/index.js: ${e.message}`)
    }
  } else {
    console.log(chalk.yellow("  ⚠ dist/ not found — run 'npm run build' first for full validation"))
  }

  // Report
  console.log("")
  if (result.errors.length === 0 && result.warnings.length === 0) {
    console.log(chalk.green("  ✓ Pack is valid!\n"))
    return true
  }

  for (const error of result.errors) {
    console.log(chalk.red(`  ✗ ${error}`))
  }
  for (const warning of result.warnings) {
    console.log(chalk.yellow(`  ⚠ ${warning}`))
  }
  console.log("")

  if (result.errors.length > 0) {
    console.log(chalk.red(`  ${result.errors.length} error(s), ${result.warnings.length} warning(s)\n`))
    return false
  }

  console.log(chalk.green(`  ✓ Valid with ${result.warnings.length} warning(s)\n`))
  return true
}
