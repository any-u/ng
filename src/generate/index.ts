import { Config } from '../config'
import migrate from './migrate'
import download from './download'

export default async function generate(name: string, config: Config, matched: Record<string, any>): Promise<void>{
  if(config.origin === 'local'){
    return migrate(name, config, matched)
  }else {
    return download(name, config, matched)
  }
}