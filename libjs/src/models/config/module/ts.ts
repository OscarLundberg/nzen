import { NzModuleConfigBase } from "./base";

export interface NzTsModuleConfig extends NzModuleConfigBase {
  type: "ts"
  /**
   * path to tsconfig.json
   */
  tsconfig?: string;
}