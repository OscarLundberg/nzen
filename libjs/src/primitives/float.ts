import { NzEngine } from "../engine/engine";

export class NzFloat {
  constructor(private readonly key: string, private readonly engine: NzEngine) { }

  get value(): number {
    return this.engine.readFloat(this.key);
  }
  set value(n: number) {
    this.engine.writeFloat(this.key, n);
  }
  valueOf() { return this.value; }
  toString() { return String(this.value); }
}
