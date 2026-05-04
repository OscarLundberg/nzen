import { PluginOption } from "vite";
import fs from "fs/promises";
import { NzProjectConfig } from "@nzen/core";
import path, { dirname, join } from "path";
import { existsSync } from "fs";


export function nzassetPlugin(proj: NzProjectConfig): PluginOption {

  const types = proj?.assetTypes ?? {};

  const allExtensions = new Set(Object.values(types).flatMap(e => e.extensions));

  const re = new RegExp(`.*\\.(${[...allExtensions].join("|")}).*`)

  const moduleId = "\0nzassethandler";

  let rec: Record<string, any> = {}

  return {
    name: "nzasset-importer",
    resolveId: {
      filter: { id: re },
      order: "pre",
      handler(targetFile, importer, options) {
        const rndId = `${targetFile}.${Math.floor(Math.random() * 1000000).toString(16)}`;
        rec[rndId] = {
          targetFile,
          importer
        }
        return `${moduleId}|${rndId}`
      },
    },

    load: {
      filter: { id: /\0nzassethandler\|.*/ },
      async handler(id, opts) {
        const [_, rndId] = id.split("|");

        let { targetFile, importer } = rec[rndId];
        const rootDir = dirname(importer);

        const targetPath = join(rootDir, targetFile);
        if (!existsSync(targetPath)) { throw new Error(`\n\n No file present on given path '${targetPath}'\nCheck the path and try again`) }

        const ext = path.extname(targetPath).replace(".", "");
        const fileContents = await fs.readFile(targetPath)
        const bytes = Array.from(new Uint8Array(fileContents));

        const targetAssetType = Object.values(proj?.assetTypes ?? {}).find(e => e.extensions.includes(ext));

        return {
          moduleSideEffects: false,
          code: `
        import { NzEngine } from "@nzen/engine"
        import Mod from "${targetAssetType?.name}.nzasset"

        const decodedBuffer = new Uint8Array(${JSON.stringify(bytes)}).buffer;
        const inst = NzEngine.instance.register(Mod)
        
        inst.preprocess(decodedBuffer);

        export default inst;
        `,
          moduleType: "js",
        }

      },
    },
  }
}


