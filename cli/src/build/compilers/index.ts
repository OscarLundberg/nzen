import { NzProjectConfig } from "@nzen/core";
import { install } from "../install";
import { NzJsModuleConfig, NzRustModuleConfig, NzTsModuleConfig } from "../modules";
import { c } from "./c";
import { js } from "./js";

export const compilers = {
  js,
  async ts(conf: NzTsModuleConfig, proj) {
    /** Vite supports ts out of the box */
    return js({ ...conf, type: "js" }, proj);
  },
  c
} satisfies Record<string, (arg0: never, arg1: NzProjectConfig) => Promise<NzJsModuleConfig>>;
