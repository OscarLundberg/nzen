export const enum MemSlotType {
  Float = "f",
  Bool = "b",
  String = "s",
  FloatArray = "f[]",
  BoolArray = "b[]",
  StringArray = "s[]",
}

export interface MemSlot {
  type: MemSlotType;
  offset: number;
  byteLen: number;
  capacity?: number;
  elemBytes?: number;
}
