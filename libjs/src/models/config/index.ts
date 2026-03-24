import { NzEntityConfig } from "./entity";
import { NzModuleConfig } from "./module";

export type NzConfig = NzModuleConfig | NzEntityConfig
export * from "./module";
export * from "./entity";