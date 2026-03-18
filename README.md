# PromptKit

**Interactive widgets for AI prompts. Stop describing, start dropping.**

PromptKit lets users drop interactive UI widgets (color pickers, sliders, animation presets, component references) directly into their AI prompts. The AI receives structured data instead of ambiguous text.

Inspired by [Spielwerk's Cheats](https://x.com/spielwerkapp) — but for vibe coding.

## The Problem

```
"Make the button kinda blue, like a nice blue, with rounded corners,
not too rounded but like medium, and add a bouncy animation..."
```

## The Solution

```
"Make the button [color: #3B82F6] with [border-radius: 12px]
and [animation: bounce 500ms] on click"
```

Every value is **precise, interactive, and WYSIWYG** — the user sees the color, adjusts the slider, picks the animation before sending.

## Quick Start

### Drop into any chat interface (3 lines)

```bash
npm install @promptkit/react @promptkit/widget-pack-essentials
```

```tsx
import { PromptKitInput } from "@promptkit/react"
import { essentialsPack } from "@promptkit/widget-pack-essentials"

<PromptKitInput
  packs={[essentialsPack]}
  onSubmit={(result) => {
    // result.forAI       → formatted prompt for any LLM
    // result.systemPrompt → teaches the LLM the widget format
    // result.structured   → full JSON with exact values
    const messages = [
      { role: "system", content: result.systemPrompt },
      { role: "user", content: result.forAI },
    ]
    callAnyLLM(messages) // GPT, Claude, Gemini, Llama...
  }}
/>
```

That's it. Works with **any LLM**.

## What the AI Receives

When a user sends a prompt with widgets, the AI gets:

```
Create a hero section with [color: #3B82F6] heading, [font-family: Inter],
[font-size: 48px], [font-weight: ExtraBold (800)].
Add a [button-style: shimmer-button (magicui)] CTA.
Use [background: aurora-background (aceternity)] behind it.

---
Widget Specifications:
- color: CSS color: #3B82F6
- font-family: CSS font-family: 'Inter', sans-serif
- font-size: CSS font-size: 48px
- font-weight: CSS font-weight: 800
- button-style: use magicui/shimmer-button (npx shadcn@latest add "https://21st.dev/r/magicui/shimmer-button")
- background: use aceternity/aurora-background (npx shadcn@latest add "https://21st.dev/r/aceternity/aurora-background")
```

Precise CSS values, Tailwind classes, and exact component install commands.

## 47 Built-in Widgets

### Color (4)
Color picker, Opacity, Gradient (dual picker + 8 directions), CSS Filters

### Typography (9)
Font Size, Font Family (with WYSIWYG preview), Font Weight (Thin-Black), Text Align, Line Height, Letter Spacing, Text Decoration, Text Transform, Text Overflow

### Spacing (3)
Padding/Margin/Gap, Border Radius, Border (width + style + color)

### Layout (10)
Grid Columns, Flex Direction, Justify Content, Align Items, Position, Display, Overflow, Aspect Ratio, Object Fit, Breakpoint

### Effects (7)
Box Shadow, Blur, Animation (12 presets), Visual Effects (shimmer, glow, aurora...), Transform (rotate, scale, skew), Decorations, Scroll Effects

### UI Components (12) — from 21st.dev
Text Effects (typing, word-rotate, sparkles-text...), Button Styles (shimmer, rainbow, shiny...), Backgrounds (dot-pattern, aurora, particles...), Card Styles (magic-card, bento-grid...), Navigation, Device Frames (iPhone, Safari, Terminal), Social Proof (avatars, marquee, tweet-card...), 3D (globe, orbiting circles)

### Logic (4)
Toggle (ON/OFF), Select (dropdown), Slider, Cursor

**Every widget is WYSIWYG** — the chip visually reacts to its value in real time (font changes, colors glow, animations play, borders render, etc.).

## Packages

| Package | Description |
|---------|-------------|
| `@promptkit/protocol` | TypeScript types for the widget protocol |
| `@promptkit/core` | Parser, serializer, registry, AI formatter |
| `@promptkit/react` | React components + `PromptKitInput` drop-in |
| `@promptkit/tui` | Terminal UI — interactive widgets in the terminal |
| `@promptkit/cli` | CLI: `create-pack`, `validate`, `publish` |
| `@promptkit/widget-pack-essentials` | 47 built-in widgets |

## Marketplace

Browse, search, and install community widget packs.

```
/                          → Home (featured + popular packs)
/marketplace               → Browse all packs with search + filters
/marketplace/[slug]        → Pack detail (widgets, reviews, install)
/dashboard                 → Creator dashboard (my packs, stats)
/dashboard/publish         → Publish a new pack (3-step form)
/playground                → Try all 47 widgets interactively
```

### Available Packs (seed)

| Pack | Widgets | Price |
|------|---------|-------|
| Tailwind Essentials | 24 | Free |
| MagicUI Effects | 32 | Free |
| Aceternity UI | 18 | $5 |
| 3D Scenes | 15 | $8 |
| Motion Presets | 45 | Free |
| E-Commerce UI | 22 | $10 |
| Dashboard Kit | 28 | Free |
| Accessibility Toolkit | 12 | Free |

## Create a Widget Pack

```bash
npx promptkit create-pack my-pack
cd my-pack
npm install
# Edit src/widgets/sample.ts
npm run build
npx promptkit validate
npx promptkit publish
```

### Widget Definition

```typescript
import type { WidgetDefinition } from "@promptkit/protocol"

export const myWidget: WidgetDefinition<{ value: string }> = {
  type: "my-widget",
  category: "components",
  defaultDisplay: { label: "My Widget", preview: "✨", inline: true },
  defaultValue: { value: "hello" },
  defaultMeta: {},
  serialize: (w) => `value=${w.value.value}`,
  deserialize: (params) => ({ value: { value: params.value || "hello" } }),
  humanReadable: (w) => `[✨ ${w.value.value}]`,
}
```

### Pack Export

```typescript
import type { WidgetPack } from "@promptkit/protocol"
import { myWidget } from "./widgets/my-widget"

export const myPack: WidgetPack = {
  name: "my-pack",
  version: "1.0.0",
  widgets: [myWidget],
}
```

## Terminal UI

Interactive widget editing directly in the terminal:

```bash
npx promptkit tui
```

```
🧩 PromptKit │ Typing │ 0 widgets
╭──────────────────────────────────────────╮
│ Type your prompt... (Tab = widgets)       │
╰──────────────────────────────────────────╯
❯ _

Tab: widgets │ Ctrl+W: palette │ Enter: send │ Ctrl+C: quit
```

Arrow keys to edit widget values. Tab to cycle between widgets. Full keyboard-driven workflow.

## Architecture

```
@promptkit/protocol        ← Type definitions (WidgetPack, Widget, etc.)
       ↓
@promptkit/core            ← Parser, serializer, registry, AI formatter
       ↓
@promptkit/react           ← UI components + PromptKitInput drop-in
@promptkit/tui             ← Terminal UI (ink)
@promptkit/cli             ← CLI tools (create, validate, publish)
       ↓
@promptkit/widget-pack-*   ← Widget packs (essentials + community)
```

### Protocol

The widget token format: `{{type:key=value,key2=value2}}`

```
{{color:value=#3B82F6}}
{{radius:value=12,unit=px}}
{{animation:value=bounce,duration=500ms}}
{{font-family:value=Inter}}
```

Parsed into `RichPrompt` → serialized for AI with `formatForAI()`.

### AI Integration

```typescript
import { PROMPTKIT_SYSTEM_PROMPT, formatForAI } from "@promptkit/core"

// Inject system prompt once
messages.push({ role: "system", content: PROMPTKIT_SYSTEM_PROMPT })

// Format each user message
messages.push({ role: "user", content: formatForAI(richPrompt, registry) })
```

The system prompt teaches any LLM to interpret widget notation. `formatForAI()` outputs human-readable widget descriptions + CSS/Tailwind specs + 21st.dev install commands.

## Tech Stack

- **Monorepo**: Turborepo
- **Language**: TypeScript (strict)
- **Build**: tsup (tree-shakeable ESM)
- **React**: v19 (supports 18+)
- **Styling**: Tailwind v4
- **Animations**: Framer Motion
- **Terminal**: Ink (React for CLI)
- **App**: Next.js 15 (Turbopack)
- **DB**: Drizzle ORM + Neon Postgres (marketplace)
- **Auth**: NextAuth v5 (marketplace)
- **Tests**: Vitest (30 tests)

## Development

```bash
git clone https://github.com/Onthelolow/promptkit.git
cd promptkit
npm install
npm run build        # Build all packages
npm run dev          # Start demo app on localhost:3099
npm run test         # Run 30 tests
```

## Roadmap

- [ ] Deploy marketplace to Vercel
- [ ] Stripe Connect for creator payouts
- [ ] npm publish all packages
- [ ] MCP Server for Cursor / Claude Code integration
- [ ] Stripe Agent Toolkit for AI-driven pack purchases
- [ ] Project indexer (Pro) — drag & drop your own components
- [ ] Figma sync (Enterprise) — design system to widgets
- [ ] VS Code extension

## License

MIT
