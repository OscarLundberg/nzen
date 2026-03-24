import { NzEngine } from "../lib";
import { NzEntityConfig } from "./config/entity";
import { NzInstance } from "./instance";

/**
 * Represents a template object that can be instantiated in your project.
 * 
 * An NzEntity is a collection of modules and config, stored on disk as `.nzentity` files
 * 
 * This class is used to reference the templates that exist in your project
 * 
 * @example 
 * // searches all `.nzentity` files for an entity where name == "player"
 * let t1 = NzEntity.getByName("player") 
 * 
 * // creates a reference to the `.nzentity` located at the given project path
 * let t2 = new NzEntity("/path/to/player")       
 * 
 * // create instances from the template
 * let player1 = t1.createInstance();
 * let player2 = t1.createInstance();
 */
export class NzEntity {
  constructor(public config: NzEntityConfig) { }
  static getByName(name: string): NzEntity | null {
    const conf = NzEngine.instance.project.entities?.[name] ?? null;
    if (conf) { return new NzEntity(conf); }
    return null;
  }

  createInstance(): NzInstance {
    return new NzInstance(this);
  }
}