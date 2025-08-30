import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    include: ["src/**/*_test.ts"],
    browser: {
      provider: "playwright", // or 'webdriverio'
      enabled: true,
      headless: true,
      instances: [
        {
          browser: "chromium",
          screenshotFailures: false,
        },
        {
          browser: "firefox",
          screenshotFailures: false,
        },
        {
          browser: "webkit",
          screenshotFailures: false,
        },
      ],
    },
    coverage: {
      provider: "istanbul",
      reporter: ["text"], // only print to terminal
      thresholds: {
        lines: 80,
        functions: 90,
        branches: 50,
        statements: 80,
      },
    },
  },
})
