import { NzEngine } from "./nzengine";

/**
 * Represents a constructor for a `compiled` wasm module (or plain js class) that is ready for use within the engine
 */
export interface NzCompiledModuleCtr {
  new(arg0: NzEngine, values: Record<string, any>): NzCompiledModule
}

/**
 * Represents an instantiated {@link NzCompiledModuleCtr}
 */
export interface NzCompiledModule {
  update(): void;
  setup(): void;
}