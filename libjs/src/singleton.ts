import { NzEngine } from "@nzen/core";
import { NzModule } from "./module";


/**
 * A NzModule singleton, 
 * inherit from this class to ensure the same module instance is reused across `.nzentities`
 * @param constructor 
 */
export abstract class NzSingleton extends NzModule {
  $$NZ_IS_SINGLETON = true;

}