import { mkdirSync, writeFileSync, existsSync } from "fs"
import { join } from "path"
import chalk from "chalk"
import {
  getPackageJson,
  getIndexTs,
  getSampleWidget,
  getTsConfig,
  getPromptKitJson,
  getReadme,
} from "../templates/pack-scaffold.js"

export function createPack(name: string) {
  const dir = join(process.cwd(), name)

  if (existsSync(dir)) {
    console.error(chalk.red(`\n  Error: Directory "${name}" already exists.\n`))
    process.exit(1)
  }

  console.log(chalk.blue(`\n  Creating widget pack: ${chalk.bold(name)}\n`))

  // Create directories
  mkdirSync(join(dir, "src", "widgets"), { recursive: true })

  // Write files
  const files: [string, string][] = [
    ["package.json", getPackageJson(name)],
    ["tsconfig.json", getTsConfig()],
    ["promptkit.json", getPromptKitJson(name)],
    ["README.md", getReadme(name)],
    ["src/index.ts", getIndexTs(name)],
    ["src/widgets/sample.ts", getSampleWidget()],
  ]

  for (const [path, content] of files) {
    const fullPath = join(dir, path)
    writeFileSync(fullPath, content, "utf-8")
    console.log(chalk.gray(`  ${chalk.green("+")} ${path}`))
  }

  console.log(chalk.green(`\n  ✓ Pack scaffolded at ./${name}\n`))
  console.log(chalk.gray("  Next steps:"))
  console.log(chalk.gray(`    cd ${name}`))
  console.log(chalk.gray("    npm install"))
  console.log(chalk.gray("    # Edit src/widgets/sample.ts"))
  console.log(chalk.gray("    npm run build"))
  console.log(chalk.gray("    promptkit validate"))
  console.log(chalk.gray("    promptkit publish\n"))
}
