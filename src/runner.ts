import inquirer, { Answers } from "inquirer";
import inquirerPrompt from 'inquirer-autocomplete-prompt';
import fuzzy from 'fuzzy'
import picocolors from 'picocolors'
import { AppConfig } from "./types";
import getCompiler from "./compilers";

const { reset } = picocolors

inquirer.registerPrompt('autocomplete', inquirerPrompt);

export default async function runner(config: AppConfig) {
  const configKeys = Array.from(config.keys())

  let result
  try {
    result = await inquirer.prompt([
      {
        name: 'templateName',
        type: 'autocomplete',
        message: reset('Template name:'),
        source: (answers: Answers, input = '') => {
          return fuzzy.filter(input, configKeys).map(el => el.original)
        },
      },
      {
        name: 'projectName',
        type: 'input',
        message: reset('Project name:')
      },
    ])
  } catch (cancelled: any) {
    console.log(cancelled.message)
    return
  }
  const appConfig = config.get(result.templateName)
  if(!appConfig || !appConfig.path) {
    return
  }

  let res
  try {
    if (appConfig.options) {
      res = await inquirer.prompt(appConfig.options.map((option, index)=> {
        return {
          name: option.name || 'option-' + index,
          type: option.type === 'boolean' ? 'confirm' : 'input',
          message: reset(option.description || 'Please enter an option value')
        }
      }))
    }
  } catch (cancelled: any) {
    console.log(cancelled.message)
    return
  }


  const compiler = getCompiler({
    name: result.projectName,
    path: appConfig.path,
    camelize: appConfig.camelize || false,
    options: res
  })

  return compiler()
}