import chalk from "chalk"
import fs from "fs-extra"
import minimist from "minimist"
import configProvider from "./config"
import { performance } from "perf_hooks"
import path from "path"

const args = minimist(process.argv.slice(2))
const templates = args._

const templatesDir = path.resolve(__dirname, "../templates")
const resolve = (p: string) => path.resolve(templatesDir, p)

async function run() {
  if (!templates.length) {
    console.log(
      chalk.red(`[Ng] Failed to find <Templates>, have you initialized it?'`)
    )
    return
  }

  // 删除scripts中所有的文件或文件夹
  const allConfig = configProvider.getConfig()
  for (let alias of templates) {
    if (alias in allConfig) {
      const config = allConfig[alias]
      const dest = resolve(config.name)
      if (fs.existsSync(dest)) {
        await fs.remove(dest)
      }

      configProvider.deleteConfig(alias)
    }
  }

  console.log(`✨  Done in ${performance.now()}ms.`)
}

run()
