import { NzMemSlot } from "@nzen/core/src/nzmemslot";
import "./global.d.ts"
import { createSlot } from "./wasmmemslot";
import { NzEntity } from "./models/entity.js";
import { NzCompiledModule, NzCompiledModuleCtr, NzPrimitive, NzProjectConfig, type NzEngine as INzEngine } from "@nzen/core";
import { WasmMemory } from "./wasmmemory";

export class NzEngine implements INzEngine {
  public static instance: NzEngine | null = null;

  private readonly modules: NzCompiledModule[] = [];

  private constructor(public project: NzProjectConfig) {
    if (globalThis.$$_NzEngine_Shared_$$ == null) {
      globalThis.$$_NzEngine_Shared_$$ = new WasmMemory()
    }
  }


  allocate<T extends NzPrimitive>(key: string, type: T, initialValue: string | number | boolean): NzMemSlot<T> {
    if (!NzEngine.instance) { throw new Error("No engine instance present, stopping allocation") };
    return createSlot(NzEngine.instance.sharedMemory, type, initialValue);
  }

  frameStart = 0;
  private start() {
    if (!NzEngine.instance) { throw new Error("No engine instance present, stopping game loop") };
    requestAnimationFrame(NzEngine.instance.gameLoop);
  }

  private gameLoop(timestamp: number) {
    if (!NzEngine.instance) { throw new Error("No engine instance present, stopping game loop") };

    if (NzEngine.instance.frameStart === undefined) {
      NzEngine.instance.frameStart = timestamp;
    }
    const elapsed = timestamp - NzEngine.instance.frameStart;

    NzEngine.instance.updateAll(elapsed);
    requestAnimationFrame(NzEngine.instance.gameLoop);
  }

  public static init(project: NzProjectConfig): NzEngine {
    if (NzEngine.instance != null) return NzEngine.instance;
    const engine = new NzEngine(project);
    NzEngine.instance = engine;

    const root = new NzEntity(project.config).createInstance();
    engine.start()
    return engine;
  }

  private get sharedMemory() {
    return globalThis.$$_NzEngine_Shared_$$;
  }

  //#region lifecycle hooks
  public register(module: NzCompiledModuleCtr, values: Record<string, any>): void {
    if (!NzEngine.instance) { throw new Error("No engine instance present, stopping registration") };

    const modInstance = new module(NzEngine.instance, values)
    NzEngine.instance.modules.push(modInstance);
    modInstance.setup();
  }

  public updateAll(dt: number): void {
    if (!NzEngine.instance) { throw new Error("No engine instance present, stopping update") };
    for (const m of NzEngine.instance.modules) m.update();
  }
  //#endregion
}

