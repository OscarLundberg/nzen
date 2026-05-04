import { NzEntity } from "./nzentity";

/**
 * Represents an object instance that the project is currently running
 */
export interface NzInstance {
  readonly id: string;
  getEntity(): NzEntity;
}
