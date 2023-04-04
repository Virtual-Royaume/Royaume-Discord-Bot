import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["dotenv/config"]
  },
  resolve: {
    alias: {
      "$core/": "./src/"
    }
  }
});