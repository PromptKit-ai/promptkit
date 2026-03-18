import { Command } from "commander"
import { createPack } from "./commands/create-pack.js"
import { validatePack } from "./commands/validate.js"
import { publishPack } from "./commands/publish.js"

const program = new Command()

program
  .name("promptkit")
  .description("CLI for PromptKit — create, validate, and publish widget packs")
  .version("0.1.0")

program
  .command("create-pack <name>")
  .description("Scaffold a new widget pack project")
  .action((name: string) => {
    createPack(name)
  })

program
  .command("validate")
  .description("Validate the widget pack in the current directory")
  .option("-d, --dir <path>", "Pack directory", process.cwd())
  .action(async (opts: { dir: string }) => {
    const valid = await validatePack(opts.dir)
    process.exit(valid ? 0 : 1)
  })

program
  .command("publish")
  .description("Publish the widget pack to the PromptKit marketplace")
  .option("-d, --dir <path>", "Pack directory", process.cwd())
  .action(async (opts: { dir: string }) => {
    await publishPack(opts.dir)
  })

program.parse()
