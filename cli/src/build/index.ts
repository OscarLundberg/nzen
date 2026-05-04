import toml from "toml";
import fs from "fs";
import { glob } from "glob"
import path from "path";
import { isAsset, isModule, parseEntity } from "./entityparser";
import { compile } from "./compiler";
import { parseModule } from "./moduleparser";
import { NzProjectConfig } from "@nzen/core";
import { parseAssetType } from "./assetparser";

export async function build(opts: { project: string, writeToDisk?: string }) {
  const c = fs.readFileSync(opts.project, "utf-8");
  const config = toml.parse(c);
  const includes = await glob([
    "**/*.nzentity*",
    "**/*.nzmod*",
    "**/*.nzasset*"
  ], { absolute: false })
  const rootDir = path.dirname(opts.project);
  let proj: NzProjectConfig = {
    config,
    rootDir,
    assetTypes: {},
    entities: {},
    modules: {},
    files: [],
    writeToDisk: opts?.writeToDisk
  };

  let pats: string[] = []

  let deferred: (() => Promise<void>)[] = []
  function defer(fn: () => Promise<void>) { deferred = [...deferred, fn] }


  function deferModule(name: string, data: any) {
    proj.modules[name] = data;
    defer(async () => {
      proj.modules[name] = await compile(data, proj);
    })
  }

  for (const conf of includes) {
    if (isModule(conf)) {
      const moduleInfo = await parseModule(conf, rootDir);
      deferModule(moduleInfo.name, moduleInfo);
    } else if (isAsset(conf)) {
      const assetType = await parseAssetType(conf, rootDir)
      proj.assetTypes[assetType.name] = assetType;
      deferModule(assetType.name, assetType);
    } else {
      const mod = parseEntity(conf, rootDir);
      proj.entities[mod.name] = mod;
    }
  }

  await Promise.all(deferred.map(e => e()));

  proj.files = await glob(pats, { absolute: false })

  return proj;
}


