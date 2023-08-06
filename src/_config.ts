import yaml from 'yaml'
import fs from "fs-extra"
import path from 'path'

const rcPath = path.join(__dirname, '../.ng.yaml')

export interface Config {
  path: string
  options: Option[]
}

export interface Option {
  label: string
  value: string
}

export interface Configuration {
  [key: string]: Config
}


let config: Configuration | undefined

export async function getConfig(): Promise<Configuration> {
  if (!config) {
      fs.ensureFileSync(rcPath)
      config = yaml.parse(fs.readFileSync(rcPath, 'utf-8')) as Configuration
  }

  return config
}