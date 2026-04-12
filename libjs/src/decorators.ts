import { NzPrimitive } from "@nzen/core";

export const DECORATOR_META_PREFIX = "$$_NZ_"
export type DecoratorMeta = {
  type: NzPrimitive,
  key: string;
  propertyKey: string;
  initialValue: string | number | boolean
}

export function nzfloat(key?: string) {
  return (target: any, propertyKey: ClassFieldDecoratorContext<unknown, number>) => {
    target[DECORATOR_META_PREFIX + propertyKey] = {
      type: NzPrimitive.Float,
      key: key ?? propertyKey,
      propertyKey,
      initialValue: 0
    }
  };
}
export function nzbool(key?: string) {
  return (target: any, propertyKey: ClassFieldDecoratorContext<unknown, boolean>) => {
    target[DECORATOR_META_PREFIX + propertyKey] = {
      type: NzPrimitive.Bool,
      key: key ?? propertyKey,
      propertyKey,
      initialValue: false
    }
  };
}
export function nzstring(key?: string) {
  return (target: any, propertyKey: ClassFieldDecoratorContext<unknown, string>) => {
    target[DECORATOR_META_PREFIX + propertyKey] = {
      type: NzPrimitive.String,
      key: key ?? propertyKey,
      propertyKey,
      initialValue: ""
    }
  };
}