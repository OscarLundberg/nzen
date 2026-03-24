import { NzModuleConfig } from "@nzen/libjs";
import { execSync } from "child_process"
const capabilities = {
  async js() { },
  async ts() { },
  async rust() {
    try {
      execSync(`${paths.cargo} --version`);
    } catch (err) {
      console.log(
        "Was not able to verify rust dependency. Please make sure you have installed rust https://rust-lang.org/tools/install/"
      )
    }

  }
} satisfies Record<NzModuleConfig["type"], Function>;


export function assertIsCapableOfCompiling(type: NzModuleConfig["type"]) {
  return capabilities[type];
}

export const paths = {
  cargo: process?.env?.PATH_TO_CARGO ?? "~/.cargo/bin/cargo"
}