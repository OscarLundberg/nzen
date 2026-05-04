import { NzCompiledModule, NzCompiledModuleCtr } from "./nzcompiledmodule";
import { NzMemSlot } from "./nzmemslot";
import { NzModuleConfig } from "./nzmodule";
import { NzPrimitive } from "./nzprimitive";

export type ModuleRegistrationOptions = {
  forceCreate: boolean;
}

/**
 * Interface for an nzengine implementation
 *  @param TMemSlot what type is returned on allocation
 */
export interface NzEngine {
  allocate<T extends NzPrimitive>(key: string, type: T, initialValue: string | number | boolean): NzMemSlot<T>;
  register(mod: NzCompiledModuleCtr, instanceId: string, values?: Record<string, any>, options?: ModuleRegistrationOptions): NzCompiledModule;
  /**
   * registers a new {@link INzInstance}, returns a unique id for it
  */
  issueNzInstance(): string;
  /**
    * destroys a {@link INzInstance} by id
    */
  revokeNzInstance(id: string): void;

  /**
   * Returns a list of modules for the entity owning the given module
   * @param id 
   */
  listModulesForOwningEntity(moduleId: string): NzCompiledModule[];

  getOwningInstance(moduleId: string): string;
}