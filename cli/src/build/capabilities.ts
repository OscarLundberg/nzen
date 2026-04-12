import type { NzModuleType } from "./modules";
import shelljs from "shelljs"
class NotCapableError extends Error {
  static installationGuides: Record<NzModuleType, string> = {
    js: "https://nodejs.org/en/download",
    ts: "https://nodejs.org/en/download",
    rust: "https://rust-lang.org/tools/install",
    c: "https://emscripten.org/docs/getting_started",
  }

  constructor(type: NzModuleType) {
    super(`Was not able to verify '${type}' installation. Follow this guide to install the dependencies ${NotCapableError.installationGuides[type]}`)
  }
}

const capabilityChecks: Record<NzModuleType, () => boolean | Promise<boolean>> = {
  js() { return true; },
  ts() { return true; },
  rust() {
    return !!shelljs.which(paths.cargo)
  },
  c() {
    return !!shelljs.which(paths.emcc)
  }
}

export async function assertIsCapableOfCompiling(type: NzModuleType) {
  const check = capabilityChecks[type];
  const isCapable = await check();
  if (!isCapable) {
    throw new NotCapableError(type);
  }
}

export const paths = {
  cargo: process?.env?.PATH_TO_CARGO ?? "~/.cargo/bin/cargo",
  emcc: process?.env?.PATH_TO_EMCC ?? "/usr/local/bin/emcc"
}