import { NzProjectConfig } from "@nzen/core";
import { getCodeFromViteBuild } from "../../../utils/vitebuild";
import { NzJsModuleConfig } from "../../modules";
import { nzassetPlugin } from "./nzassetplugin";
import babel from '@rolldown/plugin-babel'

function decoratorPreset(options: Record<string, unknown>) {
  return {
    preset: () => ({
      plugins: [['@babel/plugin-proposal-decorators', options]],
    }),
    rolldown: {
      // Only run this transform if the file contains a decorator.
      filter: {
        code: '@',
      },
    },
  }
}


export async function js(conf: NzJsModuleConfig, nzproj: NzProjectConfig) {
  const modules = Object.keys(nzproj.modules)

  const w = !!(nzproj?.writeToDisk ?? false);
  const external = w
    ? []
    : modules.flatMap(e => [
      "@nzen/engine",
      new RegExp(`(.*)${e}\\.nzmod`),
      new RegExp(`(.*)${e}\\.nzasset`),
    ]);
  const code = await getCodeFromViteBuild({
    configFile: false,
    root: conf.nz.rootDir,
    plugins: [
      nzassetPlugin(nzproj),
      babel({ presets: [decoratorPreset({ version: '2023-11' })] }),
    ],
    build: {
      sourcemap: false,
      // write: w,
      // outDir: nzproj?.writeToDisk,
      lib: {
        entry: conf.entrypoint,
        formats: ["es"],
        fileName: (a, b) => `${conf.name}.compiled.js`,
      },
      rolldownOptions: {
        external,
        transform: {
          target: "esnext",
        }
      }
    },

  });

  return {
    ...conf,
    sourceCode: code,
    entrypoint: `${conf.name}.compiled.js`
  };
}