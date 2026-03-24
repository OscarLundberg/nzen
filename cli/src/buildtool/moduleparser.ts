import path from "path";
import { compile } from "./compiler";

/**
 * Parse any kind of `.nzmod`-file, extract neccessary metadata before compile step. 
 * @param filepath 
 * @param rootDir 
 * @returns 
 */
export function parseModule(filepath: string, rootDir: string) {
  const [extension, name] = path.basename(filepath).split(".nzmod.").reverse();
  return {
    extension,
    name,
    config: {
      name,
      nz: {
        rootDir,
        filepath: filepath
      }
    }
  }
}