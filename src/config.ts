import fs from "fs-extra"
import { resolve } from "path"
import { parse } from "yaml"
import { AppConfig, Config, SystemConfig } from "./types"

export default async function loadConfig() {
  const config: AppConfig = new Map<string, Config>()

  const path = resolve(__dirname, '../.ng.yaml')
  if (!fs.existsSync(path)) {
    await fs.ensureDirSync(path)
  } else {
    const data = fs.readFileSync(path, 'utf-8')
    const systemConfig = parse(data) as SystemConfig
    for (let alias in systemConfig) {
      config.set(alias, systemConfig[alias])
    }
  }
  return config
}