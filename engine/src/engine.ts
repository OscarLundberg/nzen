import { NzMemSlot } from "@nzen/core";
import "./global.d.ts"
import { createSlot } from "./wasmmemslot";
import { NzEntity } from "./models/entity.js";
import { NzCompiledModule, NzCompiledModuleCtr, type NzInstance as INzInstance, NzPrimitive, NzProjectConfig, type NzEngine as INzEngine, ModuleRegistrationOptions } from "@nzen/core";
import { WasmMemory } from "./wasmmemory";

export class NzEngine implements INzEngine {
  public static instance: NzEngine | null = null;

  private get modules() {
    let res: NzCompiledModule[] = [];
    for (let instanceId in this.entityInstances) {
      res = [...res, ...(this.moduleInstancesByEntityInstanceId?.[instanceId] ?? [])]
    }
    return res;
  }

  private constructor(public project: NzProjectConfig) {
    if (globalThis.$$_NzEngine_Shared_$$ == null) {
      globalThis.$$_NzEngine_Shared_$$ = new WasmMemory()
    }
  }

  listModulesForOwningEntity(moduleId: string): NzCompiledModule[] {
    const owner = this.entityByModule[moduleId];
    return (this.moduleInstancesByEntityInstanceId?.[owner] ?? []);
  }

  private incrementingId = 1000;
  /**
   * @returns session-unique id
   */
  getNextId() {
    const id = `${this.incrementingId}`;
    this.incrementingId++;
    return id;
  }

  private entityInstances: Record<string, boolean> = {}
  issueNzInstance(): string {
    const id = this.getNextId();
    this.entityInstances[id] = true;
    return id;
  }
  revokeNzInstance(id: string): void {
    delete this.entityInstances[id];
    delete this.moduleInstancesByEntityInstanceId[id];
  }

  getOwningInstance(moduleId: string): string {
    const owner = this.entityByModule?.[moduleId]
    if (!owner) throw new Error("Invalid module id" + moduleId);
    return owner;
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

  moduleInstancesByEntityInstanceId: Record<string, NzCompiledModule[]> = {}
  entityByModule: Record<string, string> = {}

  //#region lifecycle hooks
  public register(module: NzCompiledModuleCtr, entityId: string, values?: Record<string, any>, opts?: ModuleRegistrationOptions) {
    if (!NzEngine.instance) { throw new Error("No engine instance present, stopping registration") };


    const id = this.getNextId();
    this.entityByModule[id] = entityId;


    const target = new module(NzEngine.instance, id, values)
    target.allocateAndBindProps()

    // @ts-ignore
    const singleton = target?.["$$NZ_IS_SINGLETON"] ?? false;

    const modules = singleton
      ? this.modules
      : (this.moduleInstancesByEntityInstanceId?.[entityId] ?? []);


    const targetName = target.name

    const mod = modules.find(e => e.name == targetName);
    if (mod != null) {
      return mod;
    }

    this.moduleInstancesByEntityInstanceId[entityId] = [...modules, target];
    target.setup();
    return target;
  }

  public updateAll(dt: number): void {
    if (!NzEngine.instance) { throw new Error("No engine instance present, stopping update") };
    for (const m of NzEngine.instance.modules) m.update();
  }
  //#endregion
}

