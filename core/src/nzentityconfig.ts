import { NzBaseConfig } from "./nzbaseconfig";

export interface NzEntityConfig extends NzBaseConfig {
  [key: string]: any,
  // a list of glob patterns to be included in the build
  includes?: string[],
}