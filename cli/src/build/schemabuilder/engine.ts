import { NzPrimitive, NzProjectConfig, NzEngine, NzCompiledModuleCtr, NzMemSlot, UnderlyingPrimitiveType } from "@nzen/core"
import { schemaBuilderMockMemSlot } from "./memslot";

function nzPrimitiveToJsonSchema(type: NzPrimitive) {
  return {
    [NzPrimitive.Bool]: { type: "boolean" },
    [NzPrimitive.Float]: { type: "number" },
    [NzPrimitive.String]: { type: "string" },
  }[type];
}

/**
 * NzEngine implementation that extracts the JSON schema for instantiated modules
 */
export class SchemaBuilderEngine implements NzEngine {
  schema = {
    type: "object",
    properties: {} as Record<string, any>
  };
  allocate<T extends NzPrimitive>(key: string, type: T, initialValue: string | number | boolean): NzMemSlot<T> {
    this.schema.properties = {
      ...(this.schema.properties ?? {}),
      [key]: nzPrimitiveToJsonSchema(type)
    }
    return schemaBuilderMockMemSlot<T>();
  }

  register(mod: NzCompiledModuleCtr): void {
    new mod(this, {});
  }
}