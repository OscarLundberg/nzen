import path from "path";
import toml from "toml";
import shell from "shelljs";
import { NzModuleConfig } from "@nzen/core";
import { AnyNzModuleConfig, NzCModuleConfig, NzJsModuleConfig, NzTsModuleConfig } from "./modules";


/**
 * Parse any kind of `.nzmod`-file, extract neccessary metadata before compile step. 
 * @param filepath 
 * @param rootDir 
 * @returns 
 */
export async function parseModule(filepath: string, rootDir: string, splitPattern = ".nzmod."): Promise<AnyNzModuleConfig> {
  const [name, extension] = path.basename(filepath).split(splitPattern)

  const config: NzModuleConfig = {
    name,
    nz: {
      rootDir,
      filepath: filepath
    },
    entrypoint: filepath,
  }


  if (extension == "toml") {
    const str = shell.cat(filepath);
    return {
      ...config,
      ...toml.parse(str)
    }
  } else {
    const conf = {
      "js": { ...config, type: "js" } as NzJsModuleConfig,
      "ts": { ...config, type: "ts" } as NzTsModuleConfig,
      "c": { ...config, type: "c" } as NzCModuleConfig,
    }[extension];

    if (!conf) { throw new Error("Unsupported module type"); }

    return conf;
  }
}