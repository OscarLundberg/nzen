import { type NzJsModuleConfig } from "./modules";
import { assertIsCapableOfCompiling } from "./capabilities";
import { NzModuleConfig, NzProjectConfig } from "@nzen/core";
import { compilers } from "./compilers";

/**
 * compile any parsed `*.nzmod.*`-file into wasm and/or js that is runnable by nzen
 * @param param0 
 * @returns 
 */
export async function compile(config: NzModuleConfig, proj: NzProjectConfig): Promise<NzJsModuleConfig> {
  if (config?.type == "js") {
    await assertIsCapableOfCompiling("js");
    return compilers.js({
      ...config,
      entrypoint: config.nz.filepath,
      type: "js"
    }, proj);
  } else if (config?.type == "ts") {
    await assertIsCapableOfCompiling("ts");
    return compilers.ts({
      ...config,
      entrypoint: config.nz.filepath,
      type: "ts"
    }, proj);
  }
  else if (config?.type == "c") {
    await assertIsCapableOfCompiling("c");
    return compilers.c({
      ...config,
      entrypoint: config.nz.filepath,
      type: "c"
    }, proj);
  }

  throw new Error(`Invalid module type found - '${config.type}'\n\nSupported types: ${Object.keys(compilers)}`)
}