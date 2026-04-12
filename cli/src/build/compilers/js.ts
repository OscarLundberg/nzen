import { getCodeFromViteBuild } from "../../utils/vitebuild";
import { NzJsModuleConfig } from "../modules";

export async function js(conf: NzJsModuleConfig) {
  const code = await getCodeFromViteBuild({
    configFile: false,
    root: conf.nz.rootDir,
    build: {
      sourcemap: "inline",
      write: false,
      lib: {
        entry: conf.entrypoint,
        formats: ['es'],
        fileName: 'bundle',
      },
      rolldownOptions: {
        transform: {
          target: "es2015"
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