import { NzEngine } from "../engine/engine";

export class NzBool {
  constructor(private readonly key: string, private readonly engine: NzEngine) { }

  get value(): boolean {
    return this.engine.readBool(this.key);
  }
  set value(b: boolean) {
    this.engine.writeBool(this.key, b);
  }
  valueOf() { return this.value; }
  toString() { return String(this.value); }
}