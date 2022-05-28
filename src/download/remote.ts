import { Option, RemoteConfig } from "src/config"
import picocolors from "picocolors"
import { AnyObject } from "src/shared"
import download from "@any-u/git-downloader"
import { pickOptions } from "src/options"
import { basename, extname } from "path"
import { combile } from "src/template"

function isFile(url: string) {
  const pathRE = /[^\/\s]+/g
  const pathMatch = url.match(pathRE)
  if (pathMatch) {
    return pathMatch[pathMatch.length - 1].includes(".")
  }

  return false
}

function processPath(
  path: string,
  alias: string,
  name: string,
  options: AnyObject,
  isFile = true
): string {
  const pathList = path.split("/")
  const origin = basename(path)
  if (isFile) {
    const ext = extname(path)
    const base = basename(path, ext)
    const filename = options.name
      ? options.name + ext
      : name
      ? name + ext
      : origin
    if (!options.name) {
      options.name = name ? name : base
    }
    return pathList.slice(0, pathList.length - 1).join("/") + "/" + filename
  }

  const dirname = options.name ? options.name : name ? name : alias
  if (!options.name) {
    options.name = name ? name : alias
  }
  const res = pathList.map((path) => (path === alias ? dirname : path)).join("/")
  console.log()
  console.log(res)
  return res
}

export default async function downloadRemote(
  name: string,
  config: RemoteConfig,
  args: AnyObject
) {
  const { alias, url, token, dir, options } = config

  if (!url) {
    console.log(
      picocolors.red(
        `[Ng] Failed to found boilerplate for ${picocolors.yellow(
          name
        )}, please check the boilerplate url.`
      )
    )
    return
  }

  if (!token) {
    console.log(
      picocolors.red(
        `[Ng] Failed to found token, boilerplate token must be provided.`
      )
    )
    return
  }

  const root = dir ? `${process.cwd()}/${dir}` : process.cwd()
  const opts = pickOptions(
    args,
    options.map((option: Option) => option.value)
  )

  try {
    const options = {
      url,
      dest: root,
      token,
    }

    await download(
      options,
      (path: string) => processPath(path, alias, name, opts, isFile(url)),
      (content: string) => combile(content, opts)
    )
  } catch (error: any) {
    console.log(
      picocolors.red(
        `[Ng] Failed to download boilerplate, because of ${error.message}`
      )
    )
  }
}
