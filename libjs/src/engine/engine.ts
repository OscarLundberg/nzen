import { NzEntity } from "../lib";
import { NzModule } from "../models/module";
import { NzProject } from "../models/project";
import { NzArray } from "../primitives/array";
import { NzBool } from "../primitives/bool";
import { NzFloat } from "../primitives/float";
import { NzString } from "../primitives/string";
import { MemSlot, MemSlotType } from "./memslot";

const FLOAT_BYTES = 8;   // Float64
const BOOL_BYTES = 1;
const ARRAY_HDR_BYTES = 4;   // Uint32 element count at start of every array slot

interface InternalMem {
  slots: Record<string, MemSlot>;
  ptr: number;
}

export class NzEngine {
  private static readonly NZ_INTERNAL_MEM_KEY = `##_NzEngine_##`;
  private static readonly NZ_SHARED_MEM_KEY = `##_NzEngine_Shared_##`;
  public static instance: NzEngine | null = null;

  private readonly modules: NzModule[] = [];
  private readonly encoder = new TextEncoder();
  private readonly decoder = new TextDecoder();

  private constructor(public project: NzProject) {
    if (globalThis[NzEngine.NZ_INTERNAL_MEM_KEY] == null) {
      globalThis[NzEngine.NZ_INTERNAL_MEM_KEY] = { slots: {}, ptr: 0 } satisfies InternalMem;
    }
    if (globalThis[NzEngine.NZ_SHARED_MEM_KEY] == null) {
      globalThis[NzEngine.NZ_SHARED_MEM_KEY] = new WebAssembly.Memory({
        initial: 1,
        maximum: 1000,
        shared: true,
      });
    }
  }



  public static init(project: NzProject): NzEngine {
    if (NzEngine.instance != null) return NzEngine.instance;
    NzEngine.instance = new NzEngine(project);

    const root = new NzEntity(project.config).createInstance();

    let start = 0;
    function step(timestamp) {
      if (start === undefined) {
        start = timestamp;
      }
      const elapsed = timestamp - start;

      NzEngine.instance.updateAll(elapsed);
      requestAnimationFrame(step);
    }

    requestAnimationFrame(step);


    return NzEngine.instance;
  }

  private get internal(): InternalMem {
    return globalThis[NzEngine.NZ_INTERNAL_MEM_KEY] as InternalMem;
  }

  private get sharedMemory(): WebAssembly.Memory {
    return globalThis[NzEngine.NZ_SHARED_MEM_KEY] as WebAssembly.Memory;
  }

  /** Grow shared memory if needed, then bump-allocate `byteSize` bytes. */
  private allocate(key: string, byteSize: number, slot: Omit<MemSlot, "offset" | "byteLen">): MemSlot {
    const mem = this.internal;
    if (mem.slots[key]) return mem.slots[key]; // idempotent

    const needed = mem.ptr + byteSize;
    const currentBytes = this.sharedMemory.buffer.byteLength;
    if (needed > currentBytes) {
      const pagesNeeded = Math.ceil((needed - currentBytes) / 65536);
      this.sharedMemory.grow(pagesNeeded);
    }

    const full: MemSlot = { ...slot, offset: mem.ptr, byteLen: byteSize };
    mem.slots[key] = full;
    mem.ptr += byteSize;
    return full;
  }

  /** Zero-initialise a region of shared memory. */
  private initializeSlot(offset: number, byteLen: number): void {
    new Uint8Array(this.sharedMemory.buffer, offset, byteLen).fill(0);
  }

  // ── Public slot accessor (for NzArray capacity/type reads) ────────────────

  public getSlot(key: string): MemSlot {
    const s = this.internal.slots[key];
    if (!s) throw new Error(`NzEngine: unknown key "${key}"`);
    return s;
  }

  //#region float

  public allocateFloat(key: string, initial = 0): NzFloat {
    const slot = this.allocate(key, FLOAT_BYTES, { type: MemSlotType.Float });
    this.initializeSlot(slot.offset, FLOAT_BYTES);
    new Float64Array(this.sharedMemory.buffer, slot.offset, 1)[0] = initial;
    return new NzFloat(key, this);
  }

  public readFloat(key: string): number {
    const { offset } = this.getSlot(key);
    return new Float64Array(this.sharedMemory.buffer, offset, 1)[0];
  }

  public writeFloat(key: string, value: number): void {
    const { offset } = this.getSlot(key);
    new Float64Array(this.sharedMemory.buffer, offset, 1)[0] = value;
  }

  //#endregion

  //#region bool

  public allocateBool(key: string, initial = false): NzBool {
    const slot = this.allocate(key, BOOL_BYTES, { type: MemSlotType.Bool });
    new Uint8Array(this.sharedMemory.buffer, slot.offset, 1)[0] = initial ? 1 : 0;
    return new NzBool(key, this);
  }

  public readBool(key: string): boolean {
    const { offset } = this.getSlot(key);
    return new Uint8Array(this.sharedMemory.buffer, offset, 1)[0] !== 0;
  }

  public writeBool(key: string, value: boolean): void {
    const { offset } = this.getSlot(key);
    new Uint8Array(this.sharedMemory.buffer, offset, 1)[0] = value ? 1 : 0;
  }

  //#endregion

  //#region string

  public allocateString(key: string, initial = "", capacityBytes = 256): NzString {
    const encoded = this.encoder.encode(initial);
    const cap = Math.max(capacityBytes, encoded.byteLength);
    const slot = this.allocate(key, cap, { type: MemSlotType.String });
    this.initializeSlot(slot.offset, slot.byteLen);
    new Uint8Array(this.sharedMemory.buffer, slot.offset, encoded.byteLength).set(encoded);
    return new NzString(key, this);
  }

  public readString(key: string): string {
    const { offset, byteLen } = this.getSlot(key);
    const view = new Uint8Array(this.sharedMemory.buffer, offset, byteLen);
    const end = view.indexOf(0);
    return this.decoder.decode(end === -1 ? view : view.subarray(0, end));
  }

  public writeString(key: string, value: string): void {
    const { offset, byteLen } = this.getSlot(key);
    const encoded = this.encoder.encode(value);
    const view = new Uint8Array(this.sharedMemory.buffer, offset, byteLen);
    view.fill(0);
    view.set(encoded.subarray(0, byteLen));
  }

  //#endregion

  //#region Array

  public allocateFloatArray(key: string, capacity: number, initial: number[] = []): NzArray<number> {
    const byteLen = ARRAY_HDR_BYTES + capacity * FLOAT_BYTES;
    const slot = this.allocate(key, byteLen, {
      type: MemSlotType.FloatArray,
      capacity,
      elemBytes: FLOAT_BYTES,
    });
    this.initializeSlot(slot.offset, byteLen);
    this.writeArrayLength(key, 0);
    initial.slice(0, capacity).forEach((v, i) => {
      this.writeArrayElement(key, i, v);
      this.writeArrayLength(key, i + 1);
    });
    return new NzArray<number>(key, this, MemSlotType.FloatArray);
  }

  public allocateBoolArray(key: string, capacity: number, initial: boolean[] = []): NzArray<boolean> {
    const byteLen = ARRAY_HDR_BYTES + capacity * BOOL_BYTES;
    const slot = this.allocate(key, byteLen, {
      type: MemSlotType.BoolArray,
      capacity,
      elemBytes: BOOL_BYTES,
    });
    this.initializeSlot(slot.offset, byteLen);
    this.writeArrayLength(key, 0);
    initial.slice(0, capacity).forEach((v, i) => {
      this.writeArrayElement(key, i, v);
      this.writeArrayLength(key, i + 1);
    });
    return new NzArray<boolean>(key, this, MemSlotType.BoolArray);
  }

  public allocateStringArray(
    key: string,
    capacity: number,
    elemCapacityBytes = 256,
    initial: string[] = [],
  ): NzArray<string> {
    // Layout: [Uint32 length] [elemCapacityBytes × capacity bytes of string slots]
    const byteLen = ARRAY_HDR_BYTES + capacity * elemCapacityBytes;
    const slot = this.allocate(key, byteLen, {
      type: MemSlotType.StringArray,
      capacity,
      elemBytes: elemCapacityBytes,
    });
    this.initializeSlot(slot.offset, byteLen);
    this.writeArrayLength(key, 0);
    initial.slice(0, capacity).forEach((v, i) => {
      this.writeArrayElement(key, i, v);
      this.writeArrayLength(key, i + 1);
    });
    return new NzArray<string>(key, this, MemSlotType.StringArray);
  }


  public readArrayLength(key: string): number {
    const { offset } = this.getSlot(key);
    return new Uint32Array(this.sharedMemory.buffer, offset, 1)[0];
  }

  public writeArrayLength(key: string, len: number): void {
    const { offset } = this.getSlot(key);
    new Uint32Array(this.sharedMemory.buffer, offset, 1)[0] = len;
  }

  public readArrayElement(key: string, index: number): number | boolean | string {
    const slot = this.getSlot(key);
    this.boundsCheck(slot, index);

    const payloadOffset = slot.offset + ARRAY_HDR_BYTES;

    if (slot.type === MemSlotType.FloatArray) {
      return new Float64Array(this.sharedMemory.buffer, payloadOffset + index * FLOAT_BYTES, 1)[0];
    }
    if (slot.type === MemSlotType.BoolArray) {
      return new Uint8Array(this.sharedMemory.buffer, payloadOffset + index * BOOL_BYTES, 1)[0] !== 0;
    }
    // StringArray
    const elemOffset = payloadOffset + index * slot.elemBytes!;
    const view = new Uint8Array(this.sharedMemory.buffer, elemOffset, slot.elemBytes!);
    const end = view.indexOf(0);
    return this.decoder.decode(end === -1 ? view : view.subarray(0, end));
  }

  public writeArrayElement(key: string, index: number, value: number | boolean | string): void {
    const slot = this.getSlot(key);
    this.boundsCheck(slot, index, /* forWrite */ true);

    const payloadOffset = slot.offset + ARRAY_HDR_BYTES;

    if (slot.type === MemSlotType.FloatArray) {
      new Float64Array(this.sharedMemory.buffer, payloadOffset + index * FLOAT_BYTES, 1)[0] = value as number;
      return;
    }
    if (slot.type === MemSlotType.BoolArray) {
      new Uint8Array(this.sharedMemory.buffer, payloadOffset + index * BOOL_BYTES, 1)[0] = (value as boolean) ? 1 : 0;
      return;
    }
    // StringArray
    const elemOffset = payloadOffset + index * slot.elemBytes!;
    const view = new Uint8Array(this.sharedMemory.buffer, elemOffset, slot.elemBytes!);
    const encoded = this.encoder.encode(value as string);
    view.fill(0);
    view.set(encoded.subarray(0, slot.elemBytes!));
  }

  private boundsCheck(slot: MemSlot, index: number, forWrite = false): void {
    const limit = forWrite ? slot.capacity! : this.readArrayLength(slot.offset.toString());
    // Re-read length by offset key lookup
    const len = new Uint32Array(this.sharedMemory.buffer, slot.offset, 1)[0];
    const cap = slot.capacity!;
    if (index < 0 || index >= (forWrite ? cap : len)) {
      throw new RangeError(
        `NzArray index ${index} out of ${forWrite ? `capacity ${cap}` : `length ${len}`}`
      );
    }
  }

  //#endregion

  //#region lifecycle hooks

  public register(module: NzModule): void {
    this.modules.push(module);
    module.setup();
  }

  public updateAll(dt: number): void {
    for (const m of this.modules) m.update();
  }

  //#endregion
}

