import { cac } from "cac"
import { performance } from "perf_hooks"
import picocolors from "picocolors"
import command from "./command"
import configuration from "./config"

const cli = cac("ng")

cli
  .command("<alias> [name]", "generate files based on boilerplate")
  .alias("generate")
  .alias("g")
  .allowUnknownOptions()
  .action(async (alias, name, options) => {
    const global = options.g || options.global
    const config = await configuration.get(global)

    if (!Object.keys(config).length || !config[alias]) {
      console.log(
        picocolors.red(
          `[Ng] Failed to found data for ${picocolors.yellow(
            alias
          )}, all boilerplate aliases must be defined.`
        )
      )
      return
    }

    await command.generate(name, config[alias], options)

    console.log(`✨  Done in ${(performance.now() / 1000).toFixed(2)}s.\n`)
  })

cli
  .command("config [...args]", "config for boilerplate")
  .option("-g, --global", "[boolean] use global config file")
  .option("-l, --list", "[boolean] list all")
  .option("-d, --delete", "[boolean] delete boilerplate")
  .option("-i, --interactive", "[boolean] Enable interactive input prompts.")
  .action(async (args, options) => {
    const global = options.g || options.global
    const userConfig = await configuration.get(global, true)

    if (options.l || options.list) {
      command.display(userConfig)
    } else if (options.d || options.delete) {
      command.delete(userConfig, args, !!global)
    } else if (options.i || options.interactive) {
      await command.inquirer(userConfig, !!global)
    } else {
      command.set(userConfig, args, !!global)
    }

    console.log(`✨  Done in ${(performance.now() / 1000).toFixed(2)}s.\n`)
  })

// Display help message when `-h` or `--help` appears
cli.help()
// Display version number when `-v` or `--version` appears
// It's also used in help message
cli.version(require("../package.json").version)

cli.parse()
