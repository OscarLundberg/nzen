import { MemSlotType } from "../engine/memslot";
import { NzEngine } from "../engine/engine";

export class NzArray<T extends string | number | boolean> {
  constructor(
    private readonly key: string,
    private readonly engine: NzEngine,
    private readonly elemType: MemSlotType.FloatArray | MemSlotType.BoolArray | MemSlotType.StringArray,
  ) { }

  get length(): number {
    return this.engine.readArrayLength(this.key);
  }

  get capacity(): number {
    return this.engine.getSlot(this.key).capacity;
  }

  get(index: number): T {
    return this.engine.readArrayElement(this.key, index) as T;
  }

  set(index: number, value: T): void {
    this.engine.writeArrayElement(this.key, index, value);
  }

  /** Push appends up to capacity; throws if full. */
  push(value: T): void {
    const len = this.length;
    if (len >= this.capacity) throw new RangeError(`NzArray "${this.key}" is at capacity (${this.capacity})`);
    this.engine.writeArrayElement(this.key, len, value);
    this.engine.writeArrayLength(this.key, len + 1);
  }

  /** Iterate current elements */
  [Symbol.iterator](): Iterator<T> {
    let i = 0;
    return {
      next: () => {
        if (i >= this.length) return { done: true, value: undefined as T };
        return { done: false, value: this.get(i++) };
      },
    };
  }

  toArray(): T[] {
    return Array.from(this);
  }

  toString() {
    return `[${this.toArray().join(", ")}]`;
  }
}
