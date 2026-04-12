import { NzEntityConfig } from "./nzentityconfig"
import { NzModuleConfig } from "./nzmodule"

/**
 * Represents a .nzproj file on disk
 */
export type NzProjectConfig = {
  rootDir: string,
  /**
   * Only "base" {@link NzModuleConfig} are allowed. On disk, there will be various different module configs - 
   * On parsing a .nzproj-file, all included modules should be compiled and their config should be transformed to the base/js version
   */
  modules: Record<string, NzModuleConfig>
  entities: Record<string, NzEntityConfig>
  config: NzEntityConfig,
  // a list of every file that is included in the built project
  files: string[]
}