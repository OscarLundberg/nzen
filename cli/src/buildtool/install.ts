import { execSync } from "child_process";
import { paths } from "./capabilities";

export const install = {
  wasmpack: () => {
    try {
      execSync(`${paths.cargo} install wasm-pack`);
    } catch (err) {
      console.error("Err")
    }
  }
}