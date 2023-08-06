import fg from "fast-glob";
import { basename, extname, join, parse, relative } from "path";
import { isFile } from "./shared";
import { writeTemplate } from "./template";
import { Config, Option } from "./_config";

export async function download(filename: string, config: Config, options: Record<string, any>) {
  const opt = loadOptions(config.options, options)
  if (config.path && isFile(config.path)) {
    const path = loadPath(filename, config.path)
    opt.name = basename(path, extname(path))
    await writeTemplate(config.path, path, opt)
  } else {

    const root = join(process.cwd(), filename)
    await Promise.allSettled(fg.sync(`${config.path}/**/*`, { dot: true }).map(item => {
      const path = join(root, relative(config.path, item))
      return writeTemplate(item, path, options)
    }))
  }
}


function loadPath(filename: string, path: string) {
  const root = process.cwd()

  const parsed = parse(filename)
  if (parsed.root === '') {
    const name = parsed.name + (parsed.ext || extname(path))
    return join(root, name)
  }

  return join(root, parsed.dir, parsed.ext || extname(path))
}


function loadOptions(options: Option[], input: Record<string, any>) {
  const res: Record<string, any> = {}

  for (let { value } of options) {
    if (input[value]) {
      res[value] = input[value]
    }
  }

  return res
}