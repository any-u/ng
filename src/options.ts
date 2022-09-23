export type Pick<T extends Record<string, any>, K extends (keyof T)[]> = {
  [P in K[number]]: T[P]
}

export type Omit<T extends Record<string, any>, K extends (keyof T)[]> = {
  [P in keyof T as P extends K[number] ? never : P]: T[P]
}

export function pick<T extends Record<string, any>, K extends (keyof T)[]>(
  options: T,
  keys: K
) {
  const res = {} as Pick<T, K>
  for (let key in options) {
    if (keys.includes(key)) {
      res[key] = options[key]
    }
  }
  return res
}

export function omit<T extends Record<string, any>, K extends (keyof T)[]>(
  options: T,
  args: K
) {
  const res = {} as Omit<T, K>
  Object.keys(options).forEach((key) => {
    if (!args.includes(key)) {
      res[key as keyof Omit<T, K>] = options[key]
    }
  })
  return res
}

export function createOptions<T extends Record<string, any>>(
  config: T,
  options: Record<string, string>
) {
  return pick(
    options,
    config.options.map((item: any) => item.value)
  )
}

interface Complated {
  name: string
}

export function complateOptions<T extends Record<string, any>>(
  options: T,
  complated: Complated
) {
  const res = Object.create(options)

  res.name = options.name || complated.name

  return res
}
