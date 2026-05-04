import { NzPrimitive } from "@nzen/core";
import { NzModule } from "./module";

export const DECORATOR_META_PREFIX = "$$_NZ_"
export type DecoratorMeta = {
  type: NzPrimitive,
  /**
   * The 'shared' key that is used in memory
   */
  key: string;
  /**
   * The key that is used on the module
   */
  propertyKey: string;
  initialValue: string | number | boolean
}

export function nzfloat(key?: string) {
  return (target: any, propertyKey: ClassFieldDecoratorContext<NzModule, number>) => {
    const propName = String(propertyKey.name)
    propertyKey.addInitializer(function () {
      Reflect.defineMetadata(
        {
          type: NzPrimitive.Float,
          key: key ?? propName,
          propertyKey: propName,
          initialValue: false
        },
        `${DECORATOR_META_PREFIX}:${propName}`,
        this
      )
    })
  };
}
export function nzbool(key?: string) {
  return (target: any, propertyKey: ClassFieldDecoratorContext<unknown, boolean>) => {
    const propName = String(propertyKey.name)

    propertyKey.metadata[DECORATOR_META_PREFIX] = {
      type: NzPrimitive.Bool,
      key: key ?? propName,
      propertyKey: propName,
      initialValue: false
    }
  };
}
export function nzstring(key?: string) {
  return (target: any, propertyKey: ClassFieldDecoratorContext<unknown, string>) => {

    const propName = String(propertyKey.name)

    propertyKey.metadata[DECORATOR_META_PREFIX] = {
      type: NzPrimitive.String,
      key: key ?? propName,
      propertyKey: propName,
      initialValue: ""
    }
  };
}