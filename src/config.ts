import fs from "fs-extra"
import path from "path"
import { once } from "./shared"

const templatesDir = path.resolve(__dirname, "../templates")
const configPath = path.resolve(templatesDir, "config.json")

export type FileType = "file" | "folder"

export interface Config {
  [alias: string]: BaseConfig
}

export interface BaseConfig {
  name: string
  type: FileType
  path: string
  config: string[]
}

// 确保配置文件存在
const ensureConfig = once(async () => {
  return await fs.ensureFileSync(configPath)
})

const writeConfig = (config: Config) => {
  return fs.writeFileSync(configPath, JSON.stringify(config))
}

function getConfig(): Config {
  const content = fs.readFileSync(configPath)
  const config = content.toString() 
  return config ? JSON.parse(config) : {}
}

async function setConfig(alias: string, config: BaseConfig) {
  await ensureConfig()

  const origin = getConfig()
  origin[alias] = config

  return writeConfig(origin)
}

async function deleteConfig(alias: string) {
  await ensureConfig()
  const origin = getConfig()
  delete origin[alias]

  return writeConfig(origin)
}

export default {
  getConfig,
  setConfig,
  deleteConfig,
}
