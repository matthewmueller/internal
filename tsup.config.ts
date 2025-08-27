// tsup.config.ts
import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/**/index.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  target: "ES2022",
  shims: false,
  minify: false,
  platform: "browser",
})
