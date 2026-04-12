const kib = 1024;
const mib = 1024 * kib;
const gib = 1024 * mib;
const bytesPerPage = 64 * 1024;

const MAXIMUM_MEMORY_GB = 1
export interface WasmMemSlotAddr {
  address: number;
  len: number;
}

export class WasmMemory {
  //@ts-ignore
  protected mem: WebAssembly.Memory = new WebAssembly.Memory({
    //@ts-ignore
    initial: BigInt(1),
    address: "i64",
    //@ts-ignore
    maximum: BigInt((MAXIMUM_MEMORY_GB * gib) / bytesPerPage),
    shared: true
  });
  protected offset = 0;
  protected get byteLength() {
    return this.mem.buffer.byteLength;
  }

  /**
   * If n is greater than zero, grows the memory to n bytes
   * @param n 
   */
  protected growToLength(bytes: number) {
    const pagesRequired = Math.ceil(bytes / bytesPerPage)
    const currentPages = Math.ceil(this.byteLength / bytesPerPage);
    const delta = pagesRequired - currentPages;
    if (delta > 0) {
      this.mem.grow(delta);
    }
  }

  public initializeSlot(len: number): WasmMemSlotAddr {
    if (this.offset + len > this.byteLength) {
      this.growToLength(this.offset + len)
    }
    new Uint8Array(this.mem.buffer, this.offset, len).fill(0);
    const address = this.offset;
    this.offset = this.offset + len;
    return {
      address,
      len
    };
  }

  public getBytes(slot: WasmMemSlotAddr) {
    return new Uint8Array(this.mem.buffer, slot.address, slot.len);
  }
}
