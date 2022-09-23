import { Table } from "console-table-printer"
import _ from "lodash"
import picocolors from "picocolors"
import config, { Config, Configuration, Option } from "./config"
import generate from "./generate"
import { useInquirer } from "./inquirer"
import { omit } from "./options"

function display(configuration: Configuration) {
  const p = new Table({
    title: "Boilerplate",
    columns: [
      {
        name: "alias",
        title: picocolors.cyan("alias"),
        alignment: "center",
      },
      {
        name: "origin",
        title: picocolors.cyan("origin"),
        alignment: "center",
      },
      {
        name: "address",
        title: picocolors.cyan("path/url"),
        alignment: "center",
      },
      {
        name: "options",
        title: picocolors.cyan("options"),
        alignment: "center",
      },
    ],
  })
  for (let key in configuration) {
    const config = configuration[key]
    const { alias, origin, options } = config
    if (origin === "local") {
      p.addRow(
        {
          alias,
          origin,
          address: config.path,
          options: options.map((item: Option) => item.value).join(" "),
        },
        {
          color: "green",
        }
      )
    } else {
      p.addRow(
        {
          alias,
          origin,
          address: config.url,
          options: options.map((item: Option) => item.value).join(" "),
        },
        {
          color: "yellow",
        }
      )
    }
  }
  p.printTable()
}

function deleteCommand(
  configuration: Configuration,
  args: string[],
  global = false
): void {
  let res = { ...configuration }
  for (let key of args) {
    if (key in res) {
      delete res[key]
    } else {
      console.log(
        picocolors.yellow(
          `[Ng] Failed to delete ${key}, alias ${key} is not defined in the configuration.`
        )
      )
      return
    }
  }
  config.write(res, global)
}

async function inquirer(configuration: Configuration, global = false) {
  const res = await useInquirer(configuration)
  config.write(res, global)
}

function set(configuration: Configuration, options: string[], global = false) {
  if (!options.length) return
  const res = config.generate(options)
  const newConfig = _.merge(configuration, res)
  config.write(newConfig, global)
}

async function download(
  name: string,
  config: Config,
  options: Record<string, any>
) {
  const args = omit(options, ["g", "global", "_"])
  await generate(name, config, args)
}

export default {
  display,
  inquirer,
  set,
  generate: download,
  delete: deleteCommand,
}
