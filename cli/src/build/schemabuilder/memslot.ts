import { NzPrimitive, NzMemSlot } from "@nzen/core";

const MockError = () => new Error("SchemaBuilderMock")

export function schemaBuilderMockMemSlot<T extends NzPrimitive>() {
  return <NzMemSlot<T>>{
    set(_) {
      throw MockError();
    },
    get() {
      throw MockError();
    }
  }
}