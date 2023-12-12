export interface SystemConfig {
  [alias: string]: Config
}

export interface Option {
  name: string
  type: 'boolean' | 'string'
  description: string
}

export interface Config {
  path: string
  options: Option[]
  target?: string
  camelize?: boolean
}

export type AppConfig  = Map<string, Config>

export interface CompilerConfig {
  path: string
  name: string
  camelize: boolean
  target: string
  options: Record<string, string | boolean>
}