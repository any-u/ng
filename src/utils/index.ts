import fs from "fs-extra"

export function isFile(path: string): boolean {
  return fs.existsSync(path) && fs.statSync(path).isFile()
}

const camelizeRE = /-(\w)/g
export const camelize = (str: string): string => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''))
}