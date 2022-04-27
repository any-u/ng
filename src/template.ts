import fs from "fs-extra"
import path from "path"
import Handlebars from "handlebars"

const templatesDir = path.resolve(__dirname, "../templates")
const resolve = (p: string) => path.resolve(templatesDir, p)



export async function createTemplate(src: string, dest: string) {
  return await fs.copy(src, dest)
}

async function generate<T>(src: string, config: T) {
  const rawContent = fs.readFileSync(src, "utf-8")
  const template = Handlebars.compile(rawContent)
  return template(config)
}

export async function writeTemplate<T>(src: string, dest: string, config: T) {
  const content = await generate(src, config)
  await fs.ensureFileSync(dest)
  await fs.writeFile(dest, content)
}
