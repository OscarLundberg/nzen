import { NzCompiledModuleCtr } from "./nzcompiledmodule";
import { NzMemSlot } from "./nzmemslot";
import { NzPrimitive } from "./nzprimitive";

/**
 * Interface for an nzengine implementation
 *  @param TMemSlot what type is returned on allocation
 */
export interface NzEngine {
  allocate<T extends NzPrimitive>(key: string, type: T, initialValue: string | number | boolean): NzMemSlot<T>;
  register(mod: NzCompiledModuleCtr, values: Record<string, any>): void;
}