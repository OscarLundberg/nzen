import { NzInstance } from "./nzinstance";
/**
 * Represents an object instance that the project is currently running
 */
export interface NzEntity {
  createInstance(): NzInstance;
}
