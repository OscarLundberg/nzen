import { NzPrimitive, NzMemSlot, UnderlyingPrimitiveType } from "@nzen/core";
import { WasmMemory, WasmMemSlotAddr } from "./wasmmemory";

abstract class WasmMemSlot<T extends NzPrimitive> implements NzMemSlot<T> {
  private addr: WasmMemSlotAddr;
  constructor(protected memslot: WasmMemory, byteSize: number) {
    this.addr = this.memslot.initializeSlot(byteSize)
  }
  protected get buf() {
    return this.memslot.getBytes(this.addr);
  }
  abstract set(type: UnderlyingPrimitiveType<T>): UnderlyingPrimitiveType<T>;
  abstract get(): UnderlyingPrimitiveType<T>;
}

export function createSlot<T extends NzPrimitive>(mem: WasmMemory, primitive: NzPrimitive.Float, initialValue: number): WasmMemSlot<T>
export function createSlot<T extends NzPrimitive>(mem: WasmMemory, primitive: NzPrimitive.String, initialValue: string): WasmMemSlot<T>
export function createSlot<T extends NzPrimitive>(mem: WasmMemory, primitive: NzPrimitive.Bool, initialValue: boolean): WasmMemSlot<T>
export function createSlot<T extends NzPrimitive>(mem: WasmMemory, primitive: T, initialValue: string | number | boolean): WasmMemSlot<T>
export function createSlot<T extends NzPrimitive>(mem: WasmMemory, primitive: T, initialValue: string | number | boolean): WasmMemSlot<T> {
  const re = {
    [NzPrimitive.Bool]: WasmMemSlotBoolean,
    [NzPrimitive.Float]: WasmMemSlotFloat,
    [NzPrimitive.String]: WasmMemSlotString,
  } satisfies Record<NzPrimitive, any>

  //@ts-ignore
  const x = new re[primitive](mem, initialValue)
  return x as WasmMemSlot<T>;
}



class WasmMemSlotFloat extends WasmMemSlot<NzPrimitive.Float> {
  f64: Float64Array;
  constructor(memslot: WasmMemory, initialValue: number) {
    super(memslot, 64);
    this.f64 = new Float64Array(this.buf);
    this.set(initialValue);
  }
  override set(val: number): number {
    this.f64.set([val]);
    return val;
  }
  override get(): number {
    return this.f64[0];
  }
}

class WasmMemSlotString extends WasmMemSlot<NzPrimitive.String> {
  encoder = new TextEncoder();
  decoder = new TextDecoder();
  constructor(memslot: WasmMemory, initialValue: string) {
    super(memslot, 64);
    this.set(initialValue);
  }
  override set(val: string): string {
    this.buf.set(this.encoder.encode(val));
    return val;
  }
  override get(): string {
    return this.decoder.decode(this.buf)
  }
}

class WasmMemSlotBoolean extends WasmMemSlot<NzPrimitive.Bool> {
  constructor(memslot: WasmMemory, initialValue: boolean) {
    super(memslot, 64);
    // this.f64 = new Float64Array(this.buf);
    this.set(initialValue);
  }
  override set(val: boolean): boolean {
    this.buf.set([val ? 1 : 0])
    return val;
  }
  override get(): boolean {
    return !!this.buf[0];
  }
}