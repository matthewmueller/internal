import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["src/**/*_test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text"], // only print to terminal
      thresholds: {
        lines: 80,
        functions: 100,
        branches: 50,
        statements: 80,
      },
    },
  },
})
