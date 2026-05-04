import { NzEngine, NzCompiledModule, NzPrimitive } from "@nzen/core";
import { DECORATOR_META_PREFIX, DecoratorMeta } from "./decorators";
export abstract class NzModule implements NzCompiledModule {
  private readonly engine: NzEngine;
  allocateAndBindProps: () => void;
  get name() {
    // @ts-ignore
    return import.meta.url.split("/").at(-1) ?? ""
  }
  constructor(engine: NzEngine, private id: string, conf?: Record<string, any>) {
    const { name = "", ...values } = { name: "", ...conf };
    Object.assign(this, values);
    this.engine = engine;

    this.allocateAndBindProps = () => {
      {
        const keys = Reflect.getMetadataKeys(this) as DecoratorMeta[];
        for (let { propertyKey, key, type, initialValue } of keys) {
          Reflect.set(this, propertyKey, this.engine.allocate(key, type, initialValue))
        }
      }
    }
  }

  protected getFloat(key: string, initial = 0) { return this.engine.allocate(key, NzPrimitive.Float, initial); }
  protected getBool(key: string, initial = false) { return this.engine.allocate(key, NzPrimitive.Bool, initial); }
  protected getString(key: string, initial = "") { return this.engine.allocate(key, NzPrimitive.String, initial); }
  /**
   * Returns existing module or creates a new one if it doesn't exist
   * @param arg0 
   * @returns 
   */
  protected requireModule<T extends NzCompiledModule>(arg0: new (...args: any[]) => T) {
    return this.engine.register(arg0, this.engine.getOwningInstance(this.id), {},) as T;
  }

  protected createModule<T extends NzCompiledModule>(arg0: new (...args: any[]) => T, values?: Partial<T>) {
    return this.engine.register(arg0, this.engine.getOwningInstance(this.id), values, { forceCreate: true }) as T;
  }

  setup(): void { }
  update(): void { }
}