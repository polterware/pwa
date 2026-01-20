import { defineConfig } from "tsup";

export default defineConfig([
  // Main entry point
  {
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    outDir: "dist",
  },
  // React entry point
  {
    entry: ["src/react/index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    splitting: false,
    sourcemap: true,
    outDir: "dist/react",
    external: ["react", "react-dom"],
  },
]);
