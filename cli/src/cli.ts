import cli from "cli";
import fs, { cpSync } from "fs";
import { build } from "./buildtool/index";
import { build as viteBuild } from "vite";
import path from "path";
import { htmlTemplate } from "./template";

cli.setApp("nzen");


const CLIOpts = {
  project: ['p', 'Path to the project file', 'file', "./project.toml"],                 // -t, --time TIME   An access time
  port: [false, 'Which port the server should listen on', 'port', 8086],                 // -t, --time TIME   An access time
  host: [false, 'Which host the server should listen on', 'host', "localhost"],                 // -t, --time TIME   An access time
  outDir: ['o', "Path to the output directory", 'dir', "./dist"]
} as const;


export type CLIOpts = {
  [key in keyof typeof CLIOpts]: (typeof CLIOpts)[key][3]
}


const opts = cli.parse(CLIOpts, ["build"]);

function mkdirIfNotExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

(async () => {
  if (cli.command == "build") {
    mkdirIfNotExists(opts.outDir);
    const proj = await build(opts)

    const projectPath = path.join(opts.outDir, "project.js");
    const htmlPath = path.join(opts.outDir, "index.html")


    for (let m in proj.modules) {
      const mod = proj.modules[m]
      if (mod.sourceCode) {
        const outPath = path.join(opts.outDir, mod.entrypoint);
        fs.writeFileSync(outPath, mod.sourceCode)
      }
    }

    for (let f of proj.files) {
      const outPath = path.join(opts.outDir, f);
      mkdirIfNotExists(path.dirname(outPath));
      cpSync(f, outPath);
    }

    const outPath = path.join(opts.outDir, "nzen.js");
    const result = await viteBuild({
      configFile: false,
      build: {
        write: false,
        assetsDir: ".",
        lib: {
          fileName: "nzen",
          entry: path.join(__dirname, "../src/lib.ts"),
          formats: ["es"]
        },
      },
    })

    const code = result[0].output[0].code;

    fs.writeFileSync(outPath, code);
    fs.writeFileSync(projectPath, `export default ${JSON.stringify(proj, null, 4)}`, "utf-8");
    fs.writeFileSync(htmlPath, htmlTemplate, "utf-8");
  }
})();
