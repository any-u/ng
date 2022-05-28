import { cac } from "cac"
import { performance } from "perf_hooks"
import picocolors from "picocolors"
import displayCommand, {
  deleteCommand,
  downloadCommand,
  inquirerCommand,
  setCommand
} from "./command"
import config from "./config"
import { isEmptyObject } from "./shared"

const cli = cac("ng")

cli
  .command("<alias> [name]", "generate files based on boilerplate")
  .alias("generate")
  .alias("g")
  .allowUnknownOptions()
  .action(async (alias, name, options) => {
    const global = options.g || options.global
    const userConfig = await config.get(global)

    if (isEmptyObject(userConfig) || !userConfig[alias]) {
      console.log(
        picocolors.red(
          `[Ng] Failed to found data for ${picocolors.yellow(
            alias
          )}, all boilerplate aliases must be defined.`
        )
      )
      return
    }

    await downloadCommand(name, alias, userConfig, options)

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
    const userConfig = await config.get(global, true)

    if (options.l || options.list) {
      displayCommand(userConfig)
    } else if (options.d || options.delete) {
      deleteCommand(userConfig, args)
    } else if (options.i || options.interactive) {
      await inquirerCommand(userConfig)
    } else {
      setCommand(userConfig, args, !!global)
    }

    console.log(`✨  Done in ${(performance.now() / 1000).toFixed(2)}s.\n`)
  })

// Display help message when `-h` or `--help` appears
cli.help()
// Display version number when `-v` or `--version` appears
// It's also used in help message
cli.version(require("../package.json").version)

cli.parse()
