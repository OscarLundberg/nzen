import { NzModuleConfig } from "@nzen/core";

export interface NzJsModuleConfig extends NzModuleConfig {
  type: "js",
  sourceCode?: string
}