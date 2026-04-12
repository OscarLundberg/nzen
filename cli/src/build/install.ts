import shelljs from "shelljs";
import { paths } from "./capabilities";

export const install = {
  wasmpack: () => {
    try {
      shelljs.cmd(paths.cargo, "install", "wasm-pack");
    } catch (err) {
      console.error("Err")
    }
  }
}