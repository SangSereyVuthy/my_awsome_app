/// <reference types="vitest" />
import { defineConfig } from "vitest/config"; // ✅ ប្រើ vitest/config ជំនួស vite
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
});