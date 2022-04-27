import chalk from "chalk"
import fs from "fs-extra"
import minimist from "minimist"
import * as path from "path"
import { performance } from "perf_hooks"
import configProvider, { FileType } from "./config"
import { isFile } from "./shared"

const args = minimist(process.argv.slice(2))
const scripts = args._
const config = args.config || args.c

const templatesDir = path.resolve(__dirname, "../templates")
const resolve = (p: string) => path.resolve(templatesDir, p)

async function run() {
  let alias = "",
    origin = ""

  if (!scripts.length) {
    console.log(
      chalk.red(`[Ng] Failed to find <Template>, have you initialized it?'`)
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

  if (scripts.length === 1) {
    const script = scripts[0]
    origin = script
    alias = path.basename(script, path.extname(script))
  }

  ;[alias, origin] = scripts

  const destPath = resolve(alias)
  if (fs.existsSync(destPath)) {
    console.log(
      chalk.red(
        `[Ng] You provided an existing alias <${alias}>, please try a new alias`
      )
    )
    return
  }

  const realPath = path.isAbsolute(origin)
    ? origin
    : path.resolve(process.cwd(), origin)

  const basename = path.basename(realPath)

  // 检测路径是否存在，不存在，则抛出异常
  if (!fs.existsSync(realPath)) {
    console.log(
      chalk.red(
        `[Ng] You provided a wrong path <${realPath}>, please check your path`
      )
    )
    return
  }

  const type: FileType = isFile(realPath) ? "file" : "folder"

  const dest = type === "file" ? `${destPath}/${basename}` : destPath
  await fs.copy(realPath, dest)

  const res = {
    name: alias,
    path: dest,
    type,
    config: config.split("&"),
  }

  await configProvider.setConfig(alias, res)

  console.log(`✨  Done in ${performance.now()}ms.`)
}

run().catch((err) => console.error(err))
