import { NzEngine } from "../lib";
import { NzEntity } from "./entity";
import { NzModule } from "./module";


function formatForBrowser(rawPath) {
  // 1. Double backslash for the regex to survive the template literal
  let cleanPath = rawPath.replace(/\\/g, '/');

  // 2. Trim and remove leading slashes
  cleanPath = cleanPath.trim().replace(/^\/ +/, '');

  // 3. Prepend the relative marker
  return './' + cleanPath;
}

/**
 * Represents an object instance that the project is currently running
 */
export class NzInstance {
  constructor(private entity: NzEntity) {
    for (let moduleName in entity.config) {

      if (NzEngine.instance.project.modules?.[moduleName]) {
        console.log({ tru: true })
        const { entrypoint, ...moduleDefaults } = NzEngine.instance.project.modules?.[moduleName];
        (async () => {
          const mod = await import(
            formatForBrowser(entrypoint)
          );
          console.log("happened")


          const moduleOverrides = entity.config?.[moduleName]
          const modInst = new mod.default(NzEngine.instance, { ...moduleDefaults, ...moduleOverrides });
          console.log({ c: entity.config, moduleName })
        })();
      }
    }
  }
  getEntity(): NzEntity { return this.entity; }
  get<T extends NzModule>(): T | null;
  get<T extends NzModule>(ctr: new () => T): T | null
  get<T extends NzModule>(ctr?: new () => T): T | null { return null }
  destroy() { }
}
