import { defineConfig } from "cypress";

export default defineConfig({
  defaultCommandTimeout: 24000, // 2x average block time
  e2e: {
    baseUrl: "http://localhost:5173",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
