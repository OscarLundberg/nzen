export const enum NzPrimitive {
  Float = "f",
  Bool = "b",
  String = "s",
  // FloatArray = "f[]",
  // BoolArray = "b[]",
  // StringArray = "s[]",
}


type PrimitiveTypes = {
  [NzPrimitive.Bool]: boolean,
  [NzPrimitive.Float]: number,
  [NzPrimitive.String]: string,
}



export type UnderlyingPrimitiveType<T extends NzPrimitive> = PrimitiveTypes[T]