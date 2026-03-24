import fs from "fs";
import toml from "toml";

import { basename } from "path";
import { NzConfig, NzModuleConfig } from "@nzen/libjs";
import { NzEntityConfig } from "@nzen/libjs";

/**
 * Parses `.nzentity` files 
 * 
 * Currently only `.toml` syntax is supported
 * @param filepath 
 * @returns 
 */
export function parseEntity(filepath: string, rootDir: string): NzConfig {
  const contents = fs.readFileSync(filepath, "utf-8");
  let conf = toml.parse(contents);
  return {
    ...conf,
    name: conf?.name ?? basename(filepath),
    nz: {
      ...conf.nz,
      rootDir,
      filepath
    }
  } satisfies NzConfig
}

export function isModule(path: string) {
  return path.includes(".nzmod")
}
