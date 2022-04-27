import fs from "fs-extra"
import path from "path"

// 函数，检测路径是文件还是目录
export function isFile(path: string): boolean {
  return fs.existsSync(path) && fs.statSync(path).isFile()
}

export function getFiles(src: string): string[] {
  if (isFile(src)) return []
  const files = fs.readdirSync(src)
  return files.map((file) => path.join(src, file))
}
