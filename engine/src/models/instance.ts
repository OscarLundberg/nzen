import { NzEntity } from "./entity";
import { NzEngine } from "../engine";
import { NzCompiledModuleCtr, NzEntityConfig } from "@nzen/core";


function formatForBrowser(rawPath: string) {
  let cleanPath = rawPath.replace(/\\/g, '/');
  cleanPath = cleanPath.trim().replace(/^\/ +/, '');
  return './' + cleanPath;
}

/**
 * Represents an object instance that the project is currently running
 */
export class NzInstance {
  static Create(config: Partial<NzEntityConfig>) {
    return new NzInstance(new NzEntity({ ...config, name: config.name ?? "Unnamed_Entity", nz: { filepath: ".", rootDir: ".", ...config.nz } }))
  }
  constructor(private entity: NzEntity) {
    const { name, nz, ...rest } = entity.config;
    for (let moduleName in rest) {
      if (!NzEngine.instance) throw new Error("Attempted to construct a NzInstance with no NzEngine.instance present");
      if (NzEngine.instance.project.modules?.[moduleName]) {
        const { entrypoint, ...moduleDefaults } = NzEngine.instance.project.modules?.[moduleName];
        (async () => {
          const mod = await import(
            formatForBrowser(entrypoint)
          );

          const modCtr: NzCompiledModuleCtr = mod.default;
          const moduleOverrides = entity.config?.[moduleName]
          NzEngine.instance?.register(modCtr, { ...moduleDefaults, ...moduleOverrides });
        })();
      } else if (!moduleName.startsWith("_")) {
        console.warn(`NzEntity '${entity.config.name}' at ${entity.config.nz?.filepath} - references an unknown NzModule '${moduleName}'
          Prefix the table name with an underscore to disable this warning '_${moduleName}'`)
      }
    }
  }
  getEntity(): NzEntity { return this.entity; }

  destroy() { }
}
