import fs from "fs-extra"
import path from "path"

// 函数，检测路径是文件还是目录
export function isFile(path: string): boolean {
  return fs.existsSync(path) && fs.statSync(path).isFile()
}

export function getFiles(src: string, fileList: string[] = []): string[] {
  if (isFile(src)) return []
  const files = fs.readdirSync(src)
  files.forEach((file) => {
    const filePath = path.join(src, file)
    if (isFile(filePath)) {
      fileList.push(filePath)
    } else {
      getFiles(filePath, fileList)
    }
  })
  return fileList
}

/**
 * 剔除路径中的根路径
 */
export function cullPath(target: string, root: string): string {
  return target.replace(root, "")
}
