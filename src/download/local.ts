import fs from "fs-extra"
import { basename, extname } from "path"
import picocolors from "picocolors"
import { LocalConfig, Option } from "../config"
import { pickOptions } from "../options"
import { cull, getFiles, isFile } from "../shared"
import { writeTemplate } from "../template"
import { AnyObject } from "../shared"

export default async function downloadLocal(
  name: string,
  config: LocalConfig,
  args: AnyObject
) {
  const { path, alias, dir, options } = config

  if (!path) {
    console.log(
      picocolors.red(
        `[Ng] Failed to found boilerplate for ${picocolors.yellow(
          alias
        )}, please check the boilerplate path.`
      )
    )
    return
  }

  if (!fs.existsSync(path)) {
    console.log(picocolors.red(`[Ng] no such file or directory, open ${path}`))
    return
  }

  const root = dir ? `${process.cwd()}/${dir}` : process.cwd()
  const opts = pickOptions(
    args,
    options.map((option: Option) => option.value)
  )

  if (isFile(path)) {
    const base = basename(path)
    const ext = extname(path)
    const dest = name ? `${root}/${name}${ext}` : `${root}/${base}`

    const filename = basename(path, ext)
    if (!opts.name) {
      opts.name = name ? name : filename
    }

    await writeTemplate(path, dest, opts)
  } else {
    const dir = name ? name : alias
    if (!opts.name) {
      opts.name = dir
    }

    const files = getFiles(path)
    const response = await Promise.allSettled(
      files.map((file) => {
        const basename = cull(file, path)
        return writeTemplate(file, `${root}/${dir}/${basename}`, opts)
      })
    )

    for (let res of response) {
      if (res.status === "rejected") {
        res.reason &&
          console.log(
            picocolors.red(
              `[Ng] Failed to write <Template>, because of ${res.reason}\n`
            )
          )
      }
    }
  }
}
