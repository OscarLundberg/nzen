import { NzRustModuleConfig } from "./rust"
import { NzJsModuleConfig } from "./js"
import { NzTsModuleConfig } from "./ts"
import { NzCModuleConfig } from "./c"

export type AnyNzModuleConfig = NzJsModuleConfig | NzTsModuleConfig | NzRustModuleConfig | NzCModuleConfig
export type NzModuleType = AnyNzModuleConfig["type"];
export {
  NzTsModuleConfig,
  NzJsModuleConfig,
  NzRustModuleConfig,
  NzCModuleConfig
}