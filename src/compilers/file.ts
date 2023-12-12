import fs from 'fs-extra'
import Handlebars from "handlebars"
import path from 'path';
import { CompilerConfig } from "../types";
import { camelize } from '../utils';

export default function fileCompiler(config: CompilerConfig) {
  const name = config.camelize ? camelize(config.name) : config.name

    // load raw content
  const raw = fs.readFileSync(config.path, 'utf-8')
  const content = Handlebars.compile(raw)({
    name,
    ...config.options
  })

  // get extname
  const extname = path.extname(config.path)

  // generate target path
  const target = path.join(config.target, name + extname)
  fs.ensureFileSync(target)
  fs.writeFile(target, content)
}
