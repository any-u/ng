import { isFile } from "../utils";
import { CompilerConfig } from "../types";
import fileCompiler from './file'
import folderCompiler from "./folder";

export default function getCompiler(config: CompilerConfig) {
  return function() {
    return isFile(config.path) ? fileCompiler(config) : folderCompiler(config)
  } 
}