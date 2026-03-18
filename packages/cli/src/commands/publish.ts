import { existsSync, readFileSync } from "fs"
import { join } from "path"
import chalk from "chalk"
import { validatePack } from "./validate.js"

const REGISTRY_URL = process.env.PROMPTKIT_REGISTRY_URL || "https://promptkit.dev/api/packs/publish"

export async function publishPack(dir: string = process.cwd()) {
  console.log(chalk.blue("\n  Publishing widget pack...\n"))

  // 1. Validate first
  const valid = await validatePack(dir)
  if (!valid) {
    console.log(chalk.red("  ✗ Fix errors before publishing\n"))
    process.exit(1)
  }

  // 2. Read metadata
  const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf-8"))
  const promptkitJson = existsSync(join(dir, "promptkit.json"))
    ? JSON.parse(readFileSync(join(dir, "promptkit.json"), "utf-8"))
    : {}

  const packData = {
    name: pkg.name,
    slug: pkg.name.replace("@promptkit/pack-", "").replace(/^@.*\//, ""),
    version: pkg.version,
    description: pkg.description || "",
    category: promptkitJson.category || "other",
    tags: promptkitJson.tags || [],
    npmPackage: pkg.name,
    priceCents: promptkitJson.price === "free" ? 0 : promptkitJson.priceCents || 0,
  }

  console.log(chalk.gray(`  Name:     ${chalk.white(packData.name)}`))
  console.log(chalk.gray(`  Version:  ${chalk.white(packData.version)}`))
  console.log(chalk.gray(`  Category: ${chalk.white(packData.category)}`))
  console.log(chalk.gray(`  Price:    ${chalk.white(packData.priceCents === 0 ? "Free" : `$${packData.priceCents / 100}`)}`))
  console.log("")

  // 3. Check auth
  const token = process.env.PROMPTKIT_TOKEN
  if (!token) {
    console.log(chalk.yellow("  ⚠ PROMPTKIT_TOKEN not set"))
    console.log(chalk.gray("  Set your token: export PROMPTKIT_TOKEN=pk_..."))
    console.log(chalk.gray("  Get a token at: https://promptkit.dev/dashboard\n"))

    // For MVP: skip auth, show what would happen
    console.log(chalk.blue("  [MVP Mode] Simulating publish...\n"))
    console.log(chalk.green(`  ✓ Pack "${packData.name}" would be published to the marketplace`))
    console.log(chalk.gray(`  URL: https://promptkit.dev/marketplace/${packData.slug}`))
    console.log(chalk.gray(`  Install: npm install ${packData.npmPackage}\n`))
    return
  }

  // 4. POST to registry
  try {
    const res = await fetch(REGISTRY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(packData),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      console.log(chalk.red(`  ✗ Publish failed: ${(err as any).error || res.statusText}\n`))
      process.exit(1)
    }

    const result = await res.json()
    console.log(chalk.green(`  ✓ Published! ${chalk.bold(packData.name)} v${packData.version}`))
    console.log(chalk.gray(`  URL: https://promptkit.dev/marketplace/${packData.slug}\n`))
  } catch (e: any) {
    console.log(chalk.red(`  ✗ Network error: ${e.message}\n`))
    process.exit(1)
  }
}
