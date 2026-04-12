import shell from "shelljs";
import { NzCModuleConfig } from "../modules";
import { js } from "./js";

export async function c(conf: NzCModuleConfig) {

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
  })
}