import { Config } from 'src/config'
import { AnyObject } from 'src/shared'
import downloadLocal from './local'
import downloadRemote from './remote'

export default async function download(name: string, config: Config, args: AnyObject): Promise<void>{
  if(config.origin === 'local'){
    return downloadLocal(name, config, args)
  }else {
    return downloadRemote(name, config, args)
  }
}