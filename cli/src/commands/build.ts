import { Command } from "commander";
import path from "path";
import shelljs, { ShellString } from "shelljs";
import { build } from "../build";
import { mkdirIfNotExists } from "../utils/mkdirifnotexists";
import { htmlTemplate } from "../template";

export function registerCommandBuild(cli: Command) {
  const buildCmd = cli.command("build")
    .description("Perform a build of the current project")
    .argument("[project]", 'Path to the project file', "./project.nzproj.toml")
    .option("--port,-p", "Which port the server should listen on", "8080")
    .option("--host", "Which host the server should listen on", "localhost")
    .option("--output,-o", "Path to the output directory", "./dist")


  buildCmd.action(async (project: string) => {
    const opts = buildCmd.opts();
    const proj = await build({ project })
    const outPath = path.join(process.cwd(), opts.output);
    const projectPath = path.join(outPath, "project.js");
    const htmlPath = path.join(outPath, "index.html")

    mkdirIfNotExists(outPath);

    for (let m in proj.modules) {
      const mod = proj.modules[m]
      if (mod.sourceCode) {
        const entrypointOut = path.join(outPath, mod.entrypoint);
        ShellString(mod.sourceCode).to(entrypointOut);
      }
    }

    for (let f of proj.files) {
      const projectFileOut = path.join(outPath, f);
      mkdirIfNotExists(path.dirname(projectFileOut));
      shelljs.cp(f, outPath);
    }

    const engineOutPath = path.join(outPath, "nzen.js");

    shelljs
      .cat(path.join(__dirname, "../../../engine/dist/nzen.mjs"))
      .to(engineOutPath);

    ShellString(`export default ${JSON.stringify(proj, null, 4)}`).to(projectPath);
    ShellString(htmlTemplate).to(htmlPath);
  });
}