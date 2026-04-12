import { NzEngine, NzCompiledModule, NzPrimitive } from "@nzen/core";
import { DECORATOR_META_PREFIX, DecoratorMeta } from "./decorators";

export abstract class NzModule implements NzCompiledModule {
  protected readonly engine: NzEngine;

  constructor(engine: NzEngine, values: Record<string, any>) {
    Object.assign(this, values);
    this.engine = engine;

    for (let key in this.constructor) {
      if (key.startsWith(DECORATOR_META_PREFIX)) {
        // @ts-ignore
        const meta = this.constructor[key] as DecoratorMeta

        Reflect.set(this, meta.propertyKey, this.engine.allocate(meta.key, meta.type, meta.initialValue))
      }
    }
  }



  protected getFloat(key: string, initial = 0) { return this.engine.allocate(key, NzPrimitive.Float, initial); }
  protected getBool(key: string, initial = false) { return this.engine.allocate(key, NzPrimitive.Bool, initial); }
  protected getString(key: string, initial = "") { return this.engine.allocate(key, NzPrimitive.String, initial); }
  protected getModule<T extends NzModule>(arg0: new (...args: any[]) => T): T | null {
    throw new Error("NotImplemented");
  }

  setup(): void { }
  update(): void { }
}