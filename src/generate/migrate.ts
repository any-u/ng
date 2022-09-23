import fg from "fast-glob"
import fs from "fs-extra"
import { dirname, resolve, parse } from "path"
import picocolors from "picocolors"
import { LocalConfig } from "../config"
import { complateOptions, createOptions } from "../options"
import { isFile } from "../shared"
import { genFilename, usePath, writeTemplate, usePath1 } from "../template"

function useValidate({ path, alias }: LocalConfig) {
  if (!path) {
    console.log(
      picocolors.red(
        `[Ng] Failed to found boilerplate for ${picocolors.yellow(
          alias
        )}, please check the boilerplate path.`
      )
    )
    return false
  }
  if (!fs.existsSync(path)) {
    console.log(picocolors.red(`[Ng] no such file or directory, open ${path}`))
    return false
  }

  return true
}

export default async function migrate(
  name: string,
  config: LocalConfig,
  matched: Record<string, any>
) {
  if (!useValidate(config)) return

  let options = createOptions(config, matched)

  const root = resolve(process.cwd(), config.dir || "")

  if (isFile(config.path)) {
    // const path = usePath(config.path, name, root, false)

    const parsed = parse(name)
    const path = usePath1({
      src: config.path,
      srcRoot: dirname(config.path),
      name: parsed.base,
      dir: parsed.dir,
    })

    console.log(path)

    // const filename = genFilename(name)

    // options = complateOptions(options, { name: filename })

    // await writeTemplate(config.path, path, options)
    return
  }

  // const { name: appName, files } = resolveFolderPath(config, name)

  // options = complateOptions(options, { name: appName })

  // await Promise.allSettled(
  //   files.map((file) => writeTemplate(file.raw, file.path, options))
  // )

  const ROOT = `${config.path}/**/*`
  await Promise.allSettled(
    fg.sync(ROOT, { dot: true }).map((item) => {
      // ts-init/src/index.ts
      // const path = usePath(item, "", root)

      const path = usePath1({
        src: item,
        srcRoot: config.path,
        dest: name,
        dir: "",
      })

      console.log(path)
    })
  )
}
