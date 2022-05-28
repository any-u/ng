import fs from "fs-extra"
import _ from "lodash"
import { resolve } from "path"
import { parse, stringify } from "yaml"

export interface Option {
  label: string
  value: string
}

interface BaseConfig {
  alias: string
  options: Option[]
  dir: string
}
export interface LocalConfig extends BaseConfig {
  origin: "local"
  path: string
}

export interface RemoteConfig extends BaseConfig {
  origin: "remote"
  url: string
  token: string
}
export type Config = LocalConfig | RemoteConfig
export type Configuration = Record<string, Config>

const write = (config: Configuration, global = true) => {
  const path = global
    ? resolve(__dirname, "../.ng.yaml")
    : resolve(process.cwd(), ".ng.yaml")
  return fs.writeFileSync(path, stringify(config))
}

function get(path: string): Configuration {
  const content = fs.readFileSync(path)
  const config = content.toString()
  return config ? parse(config) : {}
}

async function ensureCofig(global: boolean = false) {
  const path = global
    ? resolve(__dirname, "../.ng.yaml")
    : resolve(process.cwd(), ".ng.yaml")
  if (!fs.existsSync(path)) {
    await fs.ensureFileSync(path)
    return {}
  }

  return get(path)
}

async function getConfig(global: boolean, ensure = false) {
  if (ensure) {
    return await ensureCofig(global)
  }

  const path = resolve(process.cwd(), ".ng.yaml")
  return global || !fs.existsSync(path) ? await ensureCofig(true) : get(path)
}

// TODO: 类型体操-返回值
function generate(options: string[]) {
  let res = {}

  while (options.length) {
    const path = options.shift() as string
    const value = options.shift()
    _.set(res, path, value)
  }

  return res
}

export default {
  get: getConfig,
  write,
  generate,
}
