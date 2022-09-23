import download from "@any-u/git-downloader"
import { resolve, parse, dirname } from "path"
import picocolors from "picocolors"
import { RemoteConfig } from "../config"
import { complateOptions, createOptions } from "../options"
import { combile, genFilename, usePath, usePath1 } from "../template"

function useValidate(name: string, { url, token }: RemoteConfig) {
  if (!url) {
    console.log(
      picocolors.red(
        `[Ng] Failed to found boilerplate for ${picocolors.yellow(
          name
        )}, please check the boilerplate url.`
      )
    )
    return false
  }

  if (!token) {
    console.log(
      picocolors.red(
        `[Ng] Failed to found token, boilerplate token must be provided.`
      )
    )
    return false
  }
  return true
}

export default async function downloadRemote(
  name: string,
  config: RemoteConfig,
  matched: Record<string, any>
) {
  if (!useValidate(name, config)) return

  const { url, token, dir } = config

  let options = createOptions(config, matched)

  const root = resolve(process.cwd(), dir || "")

  options = complateOptions(options, { name: genFilename(name) })

  const downloadOptions = {
    url,
    dest: root,
    token,
  }

  const triggerProcess = (path: string) => {
    const parsed = parse(name)
     // TODO 报错
    const res = usePath1({
      src: path,
      srcRoot: root,
      // name: parsed.base,
      // dir: parsed.dir,
      dest: name,
      dir: ""
    })
    // const res = usePath(path, name, root)
    console.log(res)
    return res
  }

  const triggerCombine = (content: string) => combile(content, options)

  await download(downloadOptions, triggerProcess, triggerCombine)
}
