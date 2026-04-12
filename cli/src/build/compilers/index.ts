import { install } from "../install";
import { NzJsModuleConfig, NzRustModuleConfig, NzTsModuleConfig } from "../modules";
import { c } from "./c";
import { js } from "./js";

export const compilers = {
  js,
  async ts(conf: NzTsModuleConfig) {
    /** Vite supports ts out of the box */
    return js({ ...conf, type: "js" });
  },
  // async rust(conf: NzRustModuleConfig) {
  //   install.wasmpack()
  //   throw new Error("NotImplemented");
  // },
  c
} satisfies Record<string, (arg0: never) => Promise<NzJsModuleConfig>>;
