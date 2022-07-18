import { Config } from '../config'
import { AnyObject } from '../shared'
import downloadLocal from './local'
import downloadRemote from './remote'

export default async function download(name: string, config: Config, args: AnyObject): Promise<void>{
  if(config.origin === 'local'){
    return downloadLocal(name, config, args)
  }else {
    return downloadRemote(name, config, args)
  }
}