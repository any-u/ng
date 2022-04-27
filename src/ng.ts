import chalk from "chalk"
import fs from "fs-extra"
import minimist from "minimist"
import * as path from "path"
import { performance } from "perf_hooks"
import configProvider from "./config"
import { getFiles } from "./shared"
import { writeTemplate } from "./template"

const args = minimist(process.argv.slice(2))
const scripts = args._

interface AnyObject {
  [key: string]: any
}

const getConfiguration = (): AnyObject => {
  let res = {} as AnyObject
  for (let key in args) {
    if (key !== "_") {
      res[key] = args[key]
    }
  }
  return res
}

async function run() {
  if (!scripts.length) {
    console.log(
      chalk.red(`[Ng] Failed to find <Template>, have you initialized it?'`)
    )
    return
  }

  if (scripts.length === 1) {
    console.log(
      chalk.red(`[Ng] Generate requires exactly two args, but got one`)
    )
    return
  }

  if (scripts.length > 2) {
    console.log(
      chalk.yellow(
        "[Ng] You provide more than two arguments. The first will be used as the name of the template, the second will be used as the path of the template, and the rest will be ignored."
      )
    )
  }

  const [alias, dest] = scripts

  const allConfig = configProvider.getConfig()
  if (!allConfig[alias]) {
    console.log(
      chalk.red(
        `[Ng] You provided a wrong template <${alias}>, please check your alias`
      )
    )
    return
  }

  const config = allConfig[alias]

  if (!fs.existsSync(config.path)) {
    console.log(chalk.red(`[Ng] Failed to find <Template>, have you add it?`))
    return
  }

  const realPath = path.isAbsolute(dest)
    ? dest
    : path.resolve(process.cwd(), dest)

  if (fs.existsSync(realPath)) {
    console.log(
      chalk.yellow(
        `[Ng] You provided an existing path <${realPath}>, please try a new path`
      )
    )
    return
  }

  const userConfig = getConfiguration()
  const required = config.config.some((item) => item in userConfig)
  if (!required) {
    console.log(
      chalk.yellow(
        `[Ng] <${config.name}> requires ${
          config.config.length
        } configurations, but got ${Object.keys(userConfig)}`
      )
    )
    return
  }

  if (config.type === "file") {
    await writeTemplate(config.path, realPath, userConfig)
  } else {
    const files = getFiles(config.path)

    const response = await Promise.allSettled(
      files.map((item) => {
        const basename = path.basename(item)
        return writeTemplate(item, `${realPath}/${basename}`, userConfig)
      })
    )
    for (let res of response) {
      if (res.status === "rejected") {
        console.log(
          chalk.yellow(`[Ng] Failed to write <Template>, Please try agin`)
        )
        res.reason && console.log(chalk.red(`${res.reason}\n`))
      }
    }
  }

  console.log(`✨  Done in ${performance.now()}ms.\n`)
}

run()
