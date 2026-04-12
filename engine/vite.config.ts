import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    assetsDir: ".",
    outDir: "dist",
    lib: {
      fileName: "nzen",
      entry: path.join(__dirname, "./src/engine.ts"),
      formats: ["es"]
    },
  },
});