import { NzPrimitive, UnderlyingPrimitiveType } from "./nzprimitive";

export interface NzMemSlot<T extends NzPrimitive> {
  set(type: UnderlyingPrimitiveType<T>): UnderlyingPrimitiveType<T>
  get(): UnderlyingPrimitiveType<T>;
}