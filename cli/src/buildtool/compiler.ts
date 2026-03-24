import { build } from "vite";
import { NzModuleConfig, NzRustModuleConfig } from "@nzen/libjs";
import { NzJsModuleConfig } from "@nzen/libjs";
import { NzTsModuleConfig } from "@nzen/libjs";
import { NzBaseConfig } from "@nzen/libjs/src/models/config/base";
import { assertIsCapableOfCompiling, paths } from "./capabilities";
import { execSync } from "child_process";
import { install } from "./install";

const compilers = {
  async js(conf: NzJsModuleConfig) {
    const result = await build({
      configFile: false,
      root: conf.nz.rootDir,
      build: {
        write: false,
        lib: {
          entry: conf.entrypoint,
          formats: ['es'],
          fileName: 'bundle'
        },
        rollupOptions: {
          external: ["@nzen/libjs"]
        }
      }
    });

    const code = result[0].output[0].code;

    return {
      ...conf,
      sourceCode: code,
      entrypoint: `${conf.name}.compiled.js`
    };
  },
  async ts(conf: NzTsModuleConfig) {
    return { ...conf, type: "js" };
  },
  async rust(conf: NzRustModuleConfig) {
    install.wasmpack()

    return { ...conf, type: "js" };
  }
} satisfies Record<NzModuleConfig["type"], (conf: NzModuleConfig) => Promise<NzJsModuleConfig>>;


/**
 * compile any parsed `*.nzmod.*`-file into wasm and/or js that is runnable by nzen
 * @param param0 
 * @returns 
 */
export function compile({ extension, name, config }: { extension: string, name: string, config: NzBaseConfig }): Promise<NzJsModuleConfig> {

  if (extension == "js") {
    assertIsCapableOfCompiling("js");
    return compilers.js({
      ...config,
      name,
      entrypoint: config.nz.filepath,
      type: "js"
    });
  } else if (extension == "ts") {
    assertIsCapableOfCompiling("ts");
    return compilers.ts({
      ...config,
      name,
      entrypoint: config.nz.filepath,
      type: "ts"
    });
  } else if (extension == "rust") {
    assertIsCapableOfCompiling("rust");
    return compilers.rust({
      ...config,
      name,
      entrypoint: config.nz.filepath,
      type: "rust"
    });
  }

  throw new Error(`Invalid module type found - '${extension}'\n\nSupported types: ${Object.keys(compilers)}`)
}