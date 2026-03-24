import { NzEntityConfig } from "./config/entity"
import { NzJsModuleConfig } from "./config/module/js"

export type NzProject = {
  rootDir: string,
  /**
   * Only NzJsModuleConfig are allowed
   * 
   * other module types must already be compiled to js by this point
   */
  modules: Record<string, NzJsModuleConfig>
  entities: Record<string, NzEntityConfig>
  config: NzEntityConfig,
  // a list of every file that is included in the built project
  files: string[]
}