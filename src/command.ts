import _ from "lodash"
import picocolors from "picocolors"
import config, { Config, Configuration, Option } from "./config"
import generate from "./generate"
import { omit } from "./options"


async function download(
  name: string,
  config: Config,
  options: Record<string, any>
) {
  const args = omit(options, ["g", "global", "_"])
  await generate(name, config, args)
}

export default {
  generate: download,
}
