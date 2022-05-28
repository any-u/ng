import fs from "fs-extra"
import Handlebars from "handlebars"

async function generate<T>(src: string, config: T) {
  const raw = fs.readFileSync(src, "utf-8")
  return Handlebars.compile(raw)(config)
}

export function combile<T>(raw: string, config: T) {
  return Handlebars.compile(raw)(config)
}

export async function writeTemplate<T>(src: string, dest: string, config: T) {
  const content = await generate(src, config)
  await fs.ensureFileSync(dest)
  await fs.writeFile(dest, content)
}
