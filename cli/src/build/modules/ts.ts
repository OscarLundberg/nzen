import { NzModuleConfig } from "@nzen/core";

export interface NzTsModuleConfig extends NzModuleConfig {
  type: "ts"
  /**
   * path to tsconfig.json
   */
  tsconfig?: string;
}