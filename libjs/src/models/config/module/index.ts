import { NzRustModuleConfig } from "./rust"
import { NzJsModuleConfig } from "./js"
import { NzTsModuleConfig } from "./ts"

export type NzModuleConfig = NzJsModuleConfig | NzTsModuleConfig | NzRustModuleConfig

export {
  NzTsModuleConfig,
  NzJsModuleConfig,
  NzRustModuleConfig
}