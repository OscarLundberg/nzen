import fs from "fs";
import shelljs from "shelljs";

export function mkdirIfNotExists(dir: string) {
  if (!fs.existsSync(dir)) {
    shelljs.mkdir("-p", dir)
  }
}