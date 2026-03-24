import { NzModuleConfigBase } from "./base";

export interface NzJsModuleConfig extends NzModuleConfigBase {
  type: "js",
  sourceCode?: string
}