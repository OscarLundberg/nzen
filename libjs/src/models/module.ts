import { NzEngine } from "../engine/engine";
import { NzArray } from "../primitives/array";
import { NzBool } from "../primitives/bool";
import { NzFloat } from "../primitives/float";
import { NzString } from "../primitives/string";

export abstract class NzModule {
  protected readonly engine: NzEngine;

  constructor(engine: NzEngine, values: any) {
    Object.assign(this, values);
    this.engine = engine;
    this.engine.register(this);
  }

  protected getFloat(key: string, initial = 0, cap?: never): NzFloat { return this.engine.allocateFloat(key, initial); }
  protected getBool(key: string, initial = false, cap?: never): NzBool { return this.engine.allocateBool(key, initial); }
  protected getString(key: string, initial = "", capacityBytes = 256): NzString { return this.engine.allocateString(key, initial, capacityBytes); }

  protected getFloatArray(key: string, capacity: number, initial: number[] = []): NzArray<number> { return this.engine.allocateFloatArray(key, capacity, initial); }
  protected getBoolArray(key: string, capacity: number, initial: boolean[] = []): NzArray<boolean> { return this.engine.allocateBoolArray(key, capacity, initial); }
  protected getStringArray(key: string, capacity: number, elemBytes = 256, initial: string[] = []): NzArray<string> {
    return this.engine.allocateStringArray(key, capacity, elemBytes, initial);
  }

  setup(): void { }
  update(): void { }
}