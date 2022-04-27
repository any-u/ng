export function once(fn: Function): Function {
  let called = false
  return (...args: any[]) => {
    if (!called) {
      called = true
      fn(args)
    }
  }
}
