export interface AnyObject {
  [key: string]: any
}


export function isEmptyObject(object: AnyObject) {
  return Object.keys(object).length === 0
}
