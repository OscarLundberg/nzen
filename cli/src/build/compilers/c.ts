import shell from "shelljs";
import { NzCModuleConfig } from "../modules";
import { js } from "./js";
import { NzProjectConfig } from "@nzen/core";

export async function c(conf: NzCModuleConfig, proj: NzProjectConfig) {

  const compiledJs = `${conf.name}.compiled.js`

  shell.cmd(
    "emcc",
    conf.entrypoint,
    "-o",
    compiledJs
  );

  return js({
    ...conf,
    type: "js",
    entrypoint: compiledJs
  }, proj)
}