import { Command } from "commander";
import path from "path";
import shelljs, { ShellString } from "shelljs";
import { build } from "../build";
import { mkdirIfNotExists } from "../utils/mkdirifnotexists";
import { htmlTemplate } from "../template";
import { glob, globSync } from "fs";

export async function performBuild(project: string, outpath: string) {
  const proj = await build({ project })
  const outPath = path.join(process.cwd(), outpath);
  const projectPath = path.join(outPath, "project.js");
  const htmlPath = path.join(outPath, "index.html")

  mkdirIfNotExists(outPath);
  let importMap = {
    "imports": {
      "@nzen/engine": "./nzen.js"
    }
  };
  for (let m in proj.modules) {
    const mod = proj.modules[m]
    if (mod.sourceCode) {
      const entrypointOut = path.join(outPath, mod.entrypoint);
      const isAssetType = proj.assetTypes[mod.name] != null;

      const importPath = isAssetType
        ? mod.name + ".nzasset"
        : "./" + mod.name + ".nzmod"

      const actualPath = isAssetType
        ? `./${mod.entrypoint}`
        : `./${mod.entrypoint}`

      importMap.imports = { ...importMap.imports, [importPath]: actualPath };
      ShellString(mod.sourceCode).to(entrypointOut);
    }
  }

  for (let f of proj.files) {
    const projectFileOut = path.join(outPath, f);
    mkdirIfNotExists(path.dirname(projectFileOut));
    shelljs.cp(f, outPath);
  }

  const includes = globSync(proj.config?.includes ?? [])
  for (let file of includes) {
    const projectFileOut = path.join(outPath, file);
    const targetDir = path.dirname(projectFileOut);
    mkdirIfNotExists(targetDir);
    shelljs.cp(file, targetDir);
  }

  const engineOutPath = path.join(outPath, "nzen.js");

  shelljs
    .cat(path.join(__dirname, "../../../engine/dist/nzen.mjs"))
    .to(engineOutPath);

  const template = htmlTemplate.replace("{{IMPORTMAP}}", JSON.stringify(importMap, null, 4));
  ShellString(`export default ${JSON.stringify(proj, null, 4)}`).to(projectPath);
  ShellString(template).to(htmlPath);
}

export function registerCommandBuild(cli: Command) {
  const buildCmd = cli.command("build")
    .description("Perform a build of the current project")
    .argument("[project]", 'Path to the project file', "./project.nzproj.toml")
    .option("--port,-p", "Which port the server should listen on", "8080")
    .option("--host", "Which host the server should listen on", "localhost")
    .option("--output,-o", "Path to the output directory", "./dist")


  buildCmd.action(async (project: string) => {
    const opts = buildCmd.opts();
    await performBuild(project, opts.output);
  });
}