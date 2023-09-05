import { cac } from "cac"
import runner from "./runner"
import loadConfig from "./config"

const cli = cac("ng")

cli
  .command("", "create a project")
  .alias("create")
  .alias("c")
  .allowUnknownOptions()
  .action(async () => {
    const config = await loadConfig()
    return runner(config)
  })

// Display help message when `-h` or `--help` appears
cli.help()
// Display version number when `-v` or `--version` appears
// It's also used in help message
cli.version(require("../package.json").version)

cli.parse()
