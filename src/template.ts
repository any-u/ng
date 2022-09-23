import fs from "fs-extra"
import Handlebars from "handlebars"
import {
  extname,
  basename,
  resolve,
  parse,
  join,
  relative,
  dirname,
} from "path"
import fg from "fast-glob"

async function generate<T>(src: string, config: T) {
  const raw = fs.readFileSync(src, "utf-8")
  return Handlebars.compile(raw)(config)
}

export function combile<T>(raw: string, config: T) {
  return Handlebars.compile(raw)(config)
}

export async function writeTemplate<T>(src: string, dest: string, config: T) {
  const content = await generate(src, config)
  await fs.ensureFileSync(dest)
  await fs.writeFile(dest, content)
}

/**
 * generate template default name
 * 1. 用户输入的name
 * 2. 配置里的path
 * 3. 配置alias
 * @return {*}
 */
export function genFilename<T extends Record<string, any>>(
  name: string,
  path?: string
) {
  return name ? basename(name) : path ? parse(path).name : ""
}

export function combineFilename(name: string, path: string) {}

export function resolveFolderPath<T extends Record<string, any>>(
  config: T,
  appName: string
) {
  const dir = appName ? basename(appName) : config.alias

  const path = `${config.path}/**/*`

  const files = fg.sync(path, { dot: true }).map((item) => {
    return {
      raw: item,
      path: join(
        process.cwd(),
        config.dir || "",
        dir,
        item.replace(config.path, "")
      ),
    }
  })

  return {
    name: dir,
    files,
  }
}

// 过滤文件，生成文件存放的目录
// path: "/Users/sillyy/Explore/ng-boilerplate/vue-init.vue"
// name: "/Users/sillyy/Desktop/temp/src/container/App"
// dest: "/Users/sillyy/Desktop/temp"
// from: "../../Explore/ng-boilerplate/vue-init.vue"
// to: "src/container/App"
// => src/container/App.vue

// case 2
// path: "/Users/sillyy/Desktop/temp/ts-init/.gitignore"
// name: "/Users/sillyy/Desktop/temp/src"
// dest: "/Users/sillyy/Desktop/temp"
// from: "ts-init/.gitignore"
// to: "src"
export function genRoot(path: string, dest: string, raw?: string) {
  // 文件
  // path: "/Users/sillyy/Desktop/temp/src/container/App"
  // dest: "/Users/sillyy/Desktop/temp"
  if (!raw) return join(relative(dest, path), "../")

  // 文件夹
  const RE = /^[^\/]+\/(.*)/

  const res = relative(dest, raw)
  const match = res.match(RE)
  if (match) {
    return join(relative(dest, path), dirname(match[1]))
  }

  return res
}

function useDir(src: string, root: string, dest?: string) {
  if (dest === undefined) return join(relative(root, src), "../")

  const REG = /^[^\/]+\/(.*)/

  const res = dest === "" ? root : relative(root, dest)
  const match = res.match(REG)
  if (match) {
    return join(relative(dest, src), dirname(match[1]))
  }

  return res
}

// // ng ti playground
// // case 1
// // src: "/Users/sillyy/Explore/ng-boilerplate/ts-init/src/index"
// // ??? srcRoot: "/Users/sillyy/Explore/ng-boilerplate/ts-init"
// // dest: "app"
// // root: "/Users/sillyy/Desktop/temp/playground"
// //   ----> process.cwd() + dir(playground)

// // ====> 'playground/src'

// function useRelative(from: string, to: string) {
//   return relative(from, to)
// }

// function main() {
//   const src = useRelative()
// }

// function useDir1(src: string, dest: string, root = process.cwd()) {

// }

export function usePath(src: string, dest: string, root = "", useFile = true) {
  const parsed = parse(src)
  const filename = dest ? basename(dest) + parsed.ext : parsed.base

  const dir = useFile ? useDir(src, root, dest) : useDir(src, root)

  return resolve(process.cwd(), dir, filename)
}

// 下面是新优化测试代码

function useRelative(from: string, to: string) {
  return relative(from, to)
}

// => playground/app/src/lib
function useDir1(src: string, dest: string) {
  return resolve(dest, parse(src).dir)
}

export function usePath1(config: any) {
  const src = useRelative(config.srcRoot, config.src)

  let dir = ""
  let filename = ""
  if (config.dest) {
    let root = resolve(process.cwd(), config.dir, config.dest)
    dir = useDir1(src, root)
    filename = basename(src)
  }

  if (config.name) {
    let root = resolve(process.cwd(), config.dir)
    dir = useDir1(src, root)
    filename = basename(config.name) + extname(src)
  }

  const res = resolve(dir, filename)
  return res
}
