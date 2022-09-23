export interface AnyObject {
  [key: string]: any
}


export function isEmpty(object: Record<string, any>) {
  return Object.keys(object).length === 0
}
