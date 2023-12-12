import fs from 'fs-extra'
import fg from "fast-glob"
import Handlebars from "handlebars"
import { join, basename } from 'node:path'
import { camelize } from "../utils";
import { CompilerConfig } from "../types";

const IGNORE_FILES = ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'bun.lockb']

export default function folderCompiler(config: CompilerConfig) {
  const name = config.camelize ? camelize(config.name) : config.name

  const folderPath = join(config.target, name)
  fs.ensureDirSync(folderPath)

  const path = `${config.path}/**/*`

  const files = fg.sync(path, { dot: true })

  files.forEach(file => {
    const raw = fs.readFileSync(file, 'utf-8')
    const content = IGNORE_FILES.includes(basename(file)) ? raw :  Handlebars.compile(raw)({
      name,
      ...config.options
    })

    const restName = file.replace(config.path, '')

    const target = join(folderPath, restName)
    fs.ensureFileSync(target)
    fs.writeFile(target, content)
  })

}