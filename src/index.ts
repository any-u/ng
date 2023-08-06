import { cac } from "cac"
import { performance } from "perf_hooks"
import c from "picocolors"
import command from "./command"
import configuration from "./config"
import { download } from "./download"
import { getConfig } from "./_config"

const cli = cac("ng")

cli
  .command("<name> [dest]", "generate files based on boilerplate")
  .alias("generate")
  .alias("g")
  .allowUnknownOptions()
  .action(async (name, dest, options) => {
    console.log(name, dest, options)
    if(!name) {
      console.log(c.red(`[ng] Failed to found name`))
      return 
    }

    const config = await getConfig()

    if(!config[name]) {
      console.log(c.red(`[ng] Failed to found config`))
      return 
    }

    await download(dest, config[name], options)
    
    console.log(`✨  Done in ${(performance.now() / 1000).toFixed(2)}s.\n`)

    // const global = options.g || options.global
    // const config = await configuration.get(global)

    // if (!Object.keys(config).length || !config[alias]) {
    //   console.log(
    //     c.red(
    //       `[Ng] Failed to found data for ${c.yellow(
    //         alias
    //       )}, all boilerplate aliases must be defined.`
    //     )
    //   )
    //   return
    // }

    // await command.generate(name, config[alias], options)

    // console.log(`✨  Done in ${(performance.now() / 1000).toFixed(2)}s.\n`)
  })

// Display help message when `-h` or `--help` appears
cli.help()
// Display version number when `-v` or `--version` appears
// It's also used in help message
cli.version(require("../package.json").version)

cli.parse()
