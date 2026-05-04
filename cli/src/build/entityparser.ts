import fs from "fs";
import toml from "toml";

import { basename } from "path";
import { NzEntityConfig } from "@nzen/core";

/**
 * Parses `.nzentity` files 
 * 
 * Currently only `.toml` syntax is supported
 * @param filepath 
 * @returns 
 */
export function parseEntity(filepath: string, rootDir: string) {
  const contents = fs.readFileSync(filepath, "utf-8");
  let conf = toml.parse(contents);
  return <NzEntityConfig>{
    ...conf,
    name: conf?.name ?? basename(filepath),
    nz: {
      ...conf.nz,
      rootDir,
      filepath
    }
  }
}

export function isModule(path: string) {
  return path.includes(".nzmod")
}

export function isAsset(path: string) {
  return path.includes(".nzasset")
}
