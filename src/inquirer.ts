import inquirer from "inquirer"
import _ from "lodash"
import picocolors from "picocolors"
import yaml from "yaml"
import { Config, Configuration } from "./config"

function validate(config: Config) {
  const { alias, origin, options } = config
  if (!alias) {
    console.log(
      picocolors.red(
        `[Ng] Failed to found alias, boilerplate alias must be defined.`
      )
    )
    return false
  }

  if (!origin) {
    console.log(
      picocolors.red(
        `[Ng] Failed to found origin, boilerplate origin must be defined.`
      )
    )
    return false
  }

  if (origin === "local" && !config.path) {
    console.log(
      picocolors.red(
        `[Ng] Failed to found path, boilerplate path must be defined when the origin is local`
      )
    )
    return false
  }

  if (origin === "remote" && !config.url) {
    console.log(
      picocolors.red(
        `[Ng] Failed to found url, boilerplate url must be defined when the origin is remote`
      )
    )
    return false
  }

  if (options.length) {
    for (let option of options) {
      if (!option.value) {
        console.log(
          picocolors.red(
            `[Ng] Failed to found value for ${option.label} option`
          )
        )
        return false
      }
    }
  }

  return true
}

async function addBoilerplate(): Promise<Config | undefined> {
  try {
    const answer = await inquirer.prompt([
      {
        type: "editor",
        name: "config",
        message: "Please enter boilerplate configuration.",
      },
    ])
    const config = yaml.parse(answer.config)
    if (validate(config)) {
      return config
    }
  } catch (error) {
    console.log(error)
  }
}

interface DeleteChoice {
  value: string
  name: string
}

async function deleteBoilerplate(
  choices: DeleteChoice[]
): Promise<string | undefined> {
  try {
    const answer = await inquirer.prompt([
      {
        type: "checkbox",
        name: "alias",
        message: "Please select the boilerplate you want to delete.",
        choices,
      },
    ])
    return answer.alias
  } catch (error) {
    console.log(error)
  }
}

async function updateBoilerplate(
  config: Configuration
): Promise<Configuration | undefined> {
  try {
    const answer = await inquirer.prompt([
      {
        type: "list",
        name: "alias",
        message: "Please select the boilerplate you want to update.",
        default: 0,
        choices: Object.keys(config).map((alias) => ({
          name: alias,
          value: alias,
        })),
      },
      {
        type: "editor",
        name: "config",
        message: "Please update boilerplate configuration.",
        default: (answer: Record<"alias", string>) => {
          return yaml.stringify(config[answer.alias])
        },
      },
    ])
    const res: Config = yaml.parse(answer.config)
    if (validate(res)) {
      config[answer.alias] = res
      return config
    }
  } catch (error) {
    console.log(error)
  }
}

export async function useInquirer(
  config: Configuration
): Promise<Configuration> {
  try {
    const { method } = await inquirer.prompt({
      type: "list",
      name: "method",
      message: "Please select an operation method.",
      choices: [
        {
          name: "Add Boilterplate",
          value: 1,
        },
        {
          name: "Delete Boilterplate",
          value: 2,
        },
        {
          name: "Update Boilterplate",
          value: 3,
        },
      ],
    })
    if (method === 1) {
      const res = { ...config }
      const input = await addBoilerplate()
      if (input) {
        res[input.alias] = input
        return res
      }
    } else if (method === 2) {
      const choices = Object.keys(config).map((alias) => ({
        value: alias,
        name: alias,
      }))
      const alias = await deleteBoilerplate(choices)
      const res = { ...config }
      if (alias) {
        delete res[alias]
        return res
      }
    } else if (method === 3) {
      const res = await updateBoilerplate(config)
      if (res) return res
    }
  } catch (error) {
    console.log(error)
  }
  return config
}
