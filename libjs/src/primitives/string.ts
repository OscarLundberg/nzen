import { NzEngine } from "../engine/engine";

export class NzString {
  constructor(private readonly key: string, private readonly engine: NzEngine) { }

  get value(): string {
    return this.engine.readString(this.key);
  }
  set value(s: string) {
    this.engine.writeString(this.key, s);
  }
  valueOf() { return this.value; }
  toString() { return this.value; }
}
