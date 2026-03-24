import toml from "toml";
import fs from "fs";
import { glob } from "glob"
import { NzProject } from "@nzen/libjs";
import path, { dirname } from "path";
import { isModule, parseEntity } from "./entityparser";
import type { CLIOpts } from "../cli";
import { compile } from "./compiler";
import { parseModule } from "./moduleparser";

export async function build(opts: CLIOpts) {
  const c = fs.readFileSync(opts.project, "utf-8");
  const config = toml.parse(c);
  const includes = await glob([
    "**/*.nzentity*",
    "**/*.nzmod*",
  ], { absolute: false })

  const rootDir = path.dirname(opts.project);
  let proj: NzProject = {
    config,
    rootDir,
    entities: {},
    modules: {},
    files: [],
  };

  let pats = []
  for (const conf of includes) {

    if (isModule(conf)) {
      const moduleInfo = parseModule(conf, rootDir);
      proj.modules[moduleInfo.name] = await compile(moduleInfo);
    } else {
      const mod = parseEntity(conf, rootDir);
      proj.entities[mod.name] = mod;
    }
  }

  proj.files = await glob(pats, { absolute: false })

  return proj;
}


