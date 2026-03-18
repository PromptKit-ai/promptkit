import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/cli.tsx", "src/index.ts"],
  format: ["esm"],
  dts: false, // Skip DTS due to React 18/19 type conflicts between ink and demo
  banner: {
    js: "#!/usr/bin/env node",
  },
  external: ["react", "ink", "ink-text-input"],
})
