export function getPackageJson(name: string): string {
  return JSON.stringify(
    {
      name: `@promptkit/pack-${name}`,
      version: "1.0.0",
      description: `PromptKit widget pack: ${name}`,
      type: "module",
      main: "./dist/index.js",
      types: "./dist/index.d.ts",
      exports: {
        ".": {
          types: "./dist/index.d.ts",
          import: "./dist/index.js",
        },
      },
      files: ["dist"],
      scripts: {
        build: "tsup src/index.ts --format esm --dts",
        validate: "promptkit validate",
      },
      dependencies: {
        "@promptkit/protocol": "^0.1.0",
      },
      devDependencies: {
        tsup: "^8.4.0",
        typescript: "^5.7.0",
      },
      keywords: ["promptkit", "widget-pack", "vibe-coding"],
      license: "MIT",
    },
    null,
    2
  )
}

export function getIndexTs(name: string): string {
  return `import type { WidgetPack, WidgetDefinition } from "@promptkit/protocol"

// Import your widget definitions
import { sampleWidget } from "./widgets/sample"

export const ${camelCase(name)}Pack: WidgetPack = {
  name: "${name}",
  version: "1.0.0",
  description: "A custom PromptKit widget pack",
  widgets: [
    sampleWidget as WidgetDefinition,
  ],
}
`
}

export function getSampleWidget(): string {
  return `import type { WidgetDefinition } from "@promptkit/protocol"

/**
 * Sample widget — replace with your own!
 *
 * Each widget needs:
 * - type: unique identifier
 * - category: one of "color" | "typography" | "spacing" | "layout" | "effects" | "components" | "logic"
 * - defaultDisplay: { label, preview (emoji), inline: true }
 * - defaultValue: the starting value
 * - defaultMeta: extra config
 * - serialize: widget → string (for AI prompt)
 * - deserialize: string → widget (from AI prompt)
 * - humanReadable: widget → display string
 */
export const sampleWidget: WidgetDefinition<{ value: string }> = {
  type: "sample",
  category: "components",
  defaultDisplay: { label: "Sample", preview: "✨", inline: true },
  defaultValue: { value: "hello" },
  defaultMeta: {},
  serialize: (w) => \`value=\${w.value.value}\`,
  deserialize: (params) => ({
    value: { value: params.value || "hello" },
  }),
  humanReadable: (w) => \`[✨ \${w.value.value}]\`,
}
`
}

export function getTsConfig(): string {
  return JSON.stringify(
    {
      compilerOptions: {
        target: "ES2022",
        module: "ESNext",
        moduleResolution: "bundler",
        lib: ["ES2022"],
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        declaration: true,
        declarationMap: true,
        sourceMap: true,
        outDir: "./dist",
        rootDir: "./src",
      },
      include: ["src"],
    },
    null,
    2
  )
}

export function getPromptKitJson(name: string): string {
  return JSON.stringify(
    {
      name,
      category: "components",
      tags: [],
      price: "free",
    },
    null,
    2
  )
}

export function getReadme(name: string): string {
  return `# ${name}

A custom PromptKit widget pack.

## Install

\`\`\`bash
npm install @promptkit/pack-${name}
\`\`\`

## Usage

\`\`\`tsx
import { PromptKitInput } from "@promptkit/react"
import { ${camelCase(name)}Pack } from "@promptkit/pack-${name}"

<PromptKitInput packs={[${camelCase(name)}Pack]} onSubmit={handleSubmit} />
\`\`\`

## Widgets

| Widget | Type | Description |
|--------|------|-------------|
| Sample | sample | A sample widget — replace me! |
`
}

function camelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}
