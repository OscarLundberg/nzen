import { NzBaseConfig } from "../base";

export interface NzModuleConfigBase extends NzBaseConfig {
  /**
   * A list of glob patterns of the files that should be included in the final bundle (after compilation)
   * 
   * can be omitted if the module is single file
   */
  includePaths?: string[]
  /**
   * should point to the entrypoint file, relative to the config file (after compilation)
   */
  entrypoint: string
  [key: string]: any
}