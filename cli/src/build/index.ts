import toml from "toml";
import fs from "fs";
import { glob } from "glob"
import path from "path";
import { isModule, parseEntity } from "./entityparser";
import { compile } from "./compiler";
import { parseModule } from "./moduleparser";
import { NzProjectConfig } from "@nzen/core";

export async function build(opts: { project: string }) {
  const c = fs.readFileSync(opts.project, "utf-8");
  const config = toml.parse(c);
  const includes = await glob([
    "**/*.nzentity*",
    "**/*.nzmod*",
  ], { absolute: false })

  const rootDir = path.dirname(opts.project);
  let proj: NzProjectConfig = {
    config,
    rootDir,
    entities: {},
    modules: {},
    files: [],
  };

  let pats: string[] = []
  for (const conf of includes) {

    if (isModule(conf)) {
      const moduleInfo = await parseModule(conf, rootDir);
      proj.modules[moduleInfo.name] = await compile(moduleInfo);
    } else {
      const mod = parseEntity(conf, rootDir);
      proj.entities[mod.name] = mod;
    }
  }

  proj.files = await glob(pats, { absolute: false })

  return proj;
}


