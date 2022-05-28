import { AnyObject } from "src/shared"


export function excludeOptions(options: AnyObject, args: string[]) {
  const res = {} as AnyObject
  for (let key in options) {
    if (!args.includes(key)) {
      res[key] = options[key]
    }
  }
  return res
}

export function pickOptions(options: any, args: string[]): AnyObject {
  const res = {} as AnyObject
  for (let key in options) {
    if (args.includes(key)) {
      res[key] = options[key]
    }
  }
  return res
}
