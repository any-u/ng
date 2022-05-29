import { Table } from "console-table-printer"
import _ from "lodash"
import picocolors from "picocolors"
import config, { Configuration, Option } from "./config"
import download from "./download"
import { useInquirer } from "./inquirer"
import { excludeOptions } from "./options"

export default function displayCommand(configuration: Configuration) {
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

export function deleteCommand(
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

export async function inquirerCommand(configuration: Configuration, global = false) {
  const res = await useInquirer(configuration)
  config.write(res, global)
}

export function setCommand(
  configuration: Configuration,
  options: string[],
  global = false
) {
  if (!options.length) return
  const res = config.generate(options)
  const newConfig = _.merge(configuration, res)
  config.write(newConfig, global)
}

export async function downloadCommand(
  name: string,
  alias: string,
  configuration: Configuration,
  options: string[]
) {
  const args = excludeOptions(options, ["g", "global", "_"])
  await download(name, configuration[alias], args)
}
