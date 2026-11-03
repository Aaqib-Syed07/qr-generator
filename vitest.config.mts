import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/*
  Test runner per docs/PRD.md P1-4 and P1-8. Node environment: all tests
  are pure library code plus the decode suite (svg rendering with the
  jsdom window, rasterized with resvg, decoded with jsQR and zxing).
*/

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts", "lib/**/*.test.tsx"],
  },
});
