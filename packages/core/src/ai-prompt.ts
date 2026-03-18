import type { RichPrompt, SerializedPrompt, Widget } from "@promptkit/protocol"
import type { WidgetRegistry } from "./registry"
import { defaultRegistry } from "./registry"

/**
 * System prompt that teaches any LLM to understand PromptKit widget format.
 * Inject this into the system prompt of your AI integration.
 */
export const PROMPTKIT_SYSTEM_PROMPT = `You understand PromptKit widget notation. When the user's message contains widgets, they appear as structured values in brackets.

## Widget Format
Each widget in the user message represents a precise design value:
- [color: #HEX] → exact CSS color
- [gradient: FROM → TO direction] → CSS linear-gradient
- [opacity: N%] → CSS opacity value
- [filter: TYPE(N%)] → CSS filter (grayscale, sepia, saturate, etc.)
- [font-size: Npx] → exact font-size
- [font-family: NAME] → exact font-family
- [font-weight: NAME (N)] → exact font-weight (100-900)
- [text-align: VALUE] → text-align property
- [line-height: LABEL (N)] → line-height value
- [letter-spacing: LABEL (Nem)] → letter-spacing value
- [text-decoration: VALUE] → text-decoration
- [text-transform: VALUE] → text-transform
- [spacing: Npx] → padding/margin/gap value
- [radius: Npx] → border-radius
- [border: Npx STYLE COLOR] → border shorthand
- [shadow: PRESET] → box-shadow (none/sm/md/lg/xl/2xl maps to Tailwind shadow classes)
- [blur: Npx] → backdrop-blur or filter blur
- [animation: NAME DURATIONms] → CSS animation or Framer Motion
- [effect: NAME (INTENSITY)] → decorative effect (shimmer, glow, aurora, particles, etc.)
- [transform: rotate(Ndeg) scale(N)] → CSS transform
- [grid-columns: N cols] → grid-template-columns with N columns
- [flex-direction: VALUE] → flex-direction property
- [justify-content: VALUE] → justify-content property
- [align-items: VALUE] → align-items property
- [position: VALUE] → CSS position
- [display: VALUE] → CSS display
- [overflow: VALUE] → CSS overflow
- [aspect-ratio: RATIO] → CSS aspect-ratio (e.g. 16/9)
- [object-fit: VALUE] → CSS object-fit
- [breakpoint: NAME (Npx)] → responsive breakpoint
- [toggle: KEY ON/OFF] → boolean feature flag
- [select: KEY: VALUE] → enum selection
- [cursor: VALUE] → CSS cursor
- [button-variant: VARIANT (SIZE)] → UI component variant (shadcn/ui style)
- [pattern: NAME N%] → background pattern (dots, grid, diagonal, etc.)
- [text-effect: NAME] → text animation component (from MagicUI/Aceternity: typing-animation, word-rotate, sparkles-text, etc.)
- [button-style: NAME] → fancy button component (shimmer-button, rainbow-button, etc.)
- [background: NAME] → decorative background (dot-pattern, aurora-background, particles, etc.)
- [card-style: NAME] → card component style (magic-card, neon-gradient-card, bento-grid, etc.)
- [decoration: NAME] → decorative element (sparkles, confetti, border-beam, etc.)
- [scroll-effect: NAME] → scroll-based animation (parallax-scroll, blur-fade, etc.)
- [nav-style: NAME] → navigation component (floating-navbar, dock, tabs)
- [device-frame: NAME] → device mockup (iphone-15-pro, safari, terminal)
- [social-proof: NAME] → social proof component (avatar-circles, marquee, tweet-card, etc.)
- [3d: NAME] → 3D component (globe, orbiting-circles)

## How to Use These Values
When you see a widget value, use the EXACT value specified — don't approximate. For example:
- [color: #3B82F6] → use exactly #3B82F6, not "blue"
- [radius: 12px] → use exactly 12px, not "rounded"
- [font-family: Inter] → use exactly the Inter font

For component-level widgets (text-effect, button-style, background, card-style, etc.), these reference specific components from MagicUI or Aceternity UI. Generate code that uses those exact components or creates equivalent visual effects.

## Additional Structured Data
The message may also include a JSON block with full widget details including IDs, types, meta-data, and exact configurations. Use this for precise implementation.`

/**
 * Format a RichPrompt for AI consumption — with clear, explicit descriptions.
 * This is the recommended format to send to any LLM.
 */
export function formatForAI(
  prompt: RichPrompt,
  registry: WidgetRegistry = defaultRegistry
): string {
  const widgetMap = new Map(prompt.widgets.map((w) => [w.id, w]))

  // Build the human-readable text with explicit widget descriptions
  const PLACEHOLDER_REGEX = /\{\{widget:([^}]+)\}\}/g
  const readable = prompt.text.replace(PLACEHOLDER_REGEX, (_match, id: string) => {
    const widget = widgetMap.get(id)
    if (!widget) return "[unknown widget]"
    return formatWidgetForAI(widget, registry)
  })

  // Build widget specifications block
  const specs = prompt.widgets.map((w) => formatWidgetSpec(w)).join("\n")

  return `${readable}

---
Widget Specifications:
${specs}`
}

/** Format a single widget as an explicit, human-readable description for the AI */
function formatWidgetForAI(widget: Widget, registry: WidgetRegistry): string {
  const v = widget.value as any
  switch (widget.type) {
    case "color": return `[color: ${v.hex}]`
    case "gradient": return `[gradient: ${v.from} → ${v.to} ${v.direction}]`
    case "opacity": return `[opacity: ${v.value}%]`
    case "filter": return v.type === "none" ? "[filter: none]" : `[filter: ${v.type}(${v.value}%)]`
    case "font-size": return `[font-size: ${v.value}${v.unit}]`
    case "font-family": return `[font-family: ${v.family}]`
    case "font-weight": {
      const labels: Record<number, string> = { 100: "Thin", 200: "ExtraLight", 300: "Light", 400: "Regular", 500: "Medium", 600: "SemiBold", 700: "Bold", 800: "ExtraBold", 900: "Black" }
      return `[font-weight: ${labels[v.value] || v.value} (${v.value})]`
    }
    case "text-align": return `[text-align: ${v.value}]`
    case "line-height": return `[line-height: ${v.label} (${v.value})]`
    case "letter-spacing": return `[letter-spacing: ${v.label} (${v.value}em)]`
    case "text-decoration": return `[text-decoration: ${v.value}]`
    case "text-transform": return `[text-transform: ${v.value}]`
    case "text-overflow": return `[text-overflow: ${v.value}]`
    case "spacing": return `[spacing: ${v.value}${v.unit}]`
    case "radius": return `[border-radius: ${v.value}${v.unit}]`
    case "border": return `[border: ${v.width}px ${v.style} ${v.color}]`
    case "shadow": return `[box-shadow: ${v.preset}]`
    case "blur": return `[blur: ${v.value}px]`
    case "animation": {
      const parts = [v.name, `${v.duration}ms`]
      if (v.easing) parts.push(v.easing)
      if (v.config) parts.push(JSON.stringify(v.config))
      return `[animation: ${parts.join(" ")}]`
    }
    case "effect": return `[effect: ${v.name} (${v.intensity})]`
    case "transform": {
      const parts = []
      if (v.rotate !== 0) parts.push(`rotate(${v.rotate}deg)`)
      if (v.scale !== 1) parts.push(`scale(${v.scale})`)
      if (v.skewX !== 0) parts.push(`skewX(${v.skewX}deg)`)
      if (v.skewY !== 0) parts.push(`skewY(${v.skewY}deg)`)
      return `[transform: ${parts.join(" ") || "none"}]`
    }
    case "grid-columns": return `[grid-columns: ${v.value}]`
    case "flex-direction": return `[flex-direction: ${v.value}]`
    case "justify-content": return `[justify-content: ${v.value}]`
    case "align-items": return `[align-items: ${v.value}]`
    case "position": return `[position: ${v.value}]`
    case "display": return `[display: ${v.value}]`
    case "overflow": return `[overflow: ${v.value}]`
    case "aspect-ratio": return `[aspect-ratio: ${v.value}]`
    case "object-fit": return `[object-fit: ${v.value}]`
    case "breakpoint": return `[breakpoint: ${v.name} (${v.width}px)]`
    case "toggle": return `[toggle: ${v.key} ${v.enabled ? "ON" : "OFF"}]`
    case "select": return `[select: ${v.key}: ${v.selected}]`
    case "slider": return `[value: ${v}]`
    case "cursor": return `[cursor: ${v.value}]`
    case "button-variant": return `[button: variant=${v.variant} size=${v.size}]`
    case "pattern": return `[background-pattern: ${v.name} ${v.opacity}%]`
    case "text-effect": return `[text-effect: ${v.name} (${v.source})]`
    case "button-style": return `[button-style: ${v.name} (${v.source})]`
    case "background": return `[background: ${v.name} (${v.source})]`
    case "card-style": return `[card-style: ${v.name} (${v.source})]`
    case "decoration": return `[decoration: ${v.name} (${v.source})]`
    case "scroll-effect": return `[scroll-effect: ${v.name} (${v.source})]`
    case "nav-style": return `[nav: ${v.name} (${v.source})]`
    case "device-frame": return `[device-frame: ${v.name} (${v.source})]`
    case "social-proof": return `[social-proof: ${v.name} (${v.source})]`
    case "3d": return `[3d: ${v.name} (${v.source})]`
    default: {
      const def = registry.get(widget.type)
      return def ? def.humanReadable(widget) : `[${widget.type}: ${JSON.stringify(v)}]`
    }
  }
}

/** Format widget as a specification line with all details */
function formatWidgetSpec(widget: Widget): string {
  const v = widget.value as any
  const type = widget.type
  const cssProperty = getCSSProperty(type)

  let spec = `- ${type}: `

  switch (type) {
    case "color": spec += `CSS color: ${v.hex}`; break
    case "gradient": spec += `CSS background: linear-gradient(${v.direction}, ${v.from}, ${v.to})`; break
    case "opacity": spec += `CSS opacity: ${v.value / 100}`; break
    case "filter": spec += v.type === "none" ? "CSS filter: none" : `CSS filter: ${v.type}(${v.value}%)`; break
    case "font-size": spec += `CSS font-size: ${v.value}${v.unit}`; break
    case "font-family": spec += `CSS font-family: '${v.family}', sans-serif`; break
    case "font-weight": spec += `CSS font-weight: ${v.value}`; break
    case "text-align": spec += `CSS text-align: ${v.value}`; break
    case "line-height": spec += `CSS line-height: ${v.value}`; break
    case "letter-spacing": spec += `CSS letter-spacing: ${v.value}em`; break
    case "text-decoration": spec += `CSS text-decoration: ${v.value}`; break
    case "text-transform": spec += `CSS text-transform: ${v.value}`; break
    case "spacing": spec += `CSS padding/margin/gap: ${v.value}${v.unit}`; break
    case "radius": spec += `CSS border-radius: ${v.value}${v.unit}`; break
    case "border": spec += `CSS border: ${v.width}px ${v.style} ${v.color}`; break
    case "shadow": {
      const tailwind: Record<string, string> = { none: "shadow-none", sm: "shadow-sm", md: "shadow-md", lg: "shadow-lg", xl: "shadow-xl", "2xl": "shadow-2xl" }
      spec += `Tailwind: ${tailwind[v.preset] || "shadow"} | CSS box-shadow preset: ${v.preset}`
      break
    }
    case "blur": spec += `CSS filter: blur(${v.value}px) or Tailwind: blur-[${v.value}px]`; break
    case "animation": spec += `Animation: ${v.name}, duration: ${v.duration}ms${v.config ? `, config: ${JSON.stringify(v.config)}` : ""}`; break
    case "effect": spec += `Decorative effect: ${v.name} (intensity: ${v.intensity}) — use MagicUI/Aceternity component or equivalent CSS`; break
    case "transform": {
      const parts = []
      if (v.rotate !== 0) parts.push(`rotate(${v.rotate}deg)`)
      if (v.scale !== 1) parts.push(`scale(${v.scale})`)
      if (v.skewX !== 0) parts.push(`skewX(${v.skewX}deg)`)
      if (v.skewY !== 0) parts.push(`skewY(${v.skewY}deg)`)
      spec += `CSS transform: ${parts.join(" ") || "none"}`
      break
    }
    case "grid-columns": spec += `CSS grid-template-columns: repeat(${v.value}, 1fr) | Tailwind: grid-cols-${v.value}`; break
    case "flex-direction": spec += `CSS flex-direction: ${v.value} | Tailwind: flex-${v.value}`; break
    case "justify-content": {
      const tw: Record<string, string> = { start: "justify-start", center: "justify-center", end: "justify-end", between: "justify-between", around: "justify-around", evenly: "justify-evenly" }
      spec += `CSS justify-content: ${v.value} | Tailwind: ${tw[v.value] || v.value}`
      break
    }
    case "align-items": {
      const tw: Record<string, string> = { start: "items-start", center: "items-center", end: "items-end", stretch: "items-stretch", baseline: "items-baseline" }
      spec += `CSS align-items: ${v.value} | Tailwind: ${tw[v.value] || v.value}`
      break
    }
    case "position": spec += `CSS position: ${v.value}`; break
    case "display": spec += `CSS display: ${v.value}`; break
    case "overflow": spec += `CSS overflow: ${v.value}`; break
    case "aspect-ratio": spec += `CSS aspect-ratio: ${v.value}`; break
    case "object-fit": spec += `CSS object-fit: ${v.value}`; break
    case "breakpoint": spec += `Responsive breakpoint: @media (min-width: ${v.width}px) | Tailwind: ${v.name}:`; break
    case "toggle": spec += `Boolean: ${v.key} = ${v.enabled}`; break
    case "select": spec += `Enum: ${v.key} = "${v.selected}"`; break
    case "cursor": spec += `CSS cursor: ${v.value}`; break
    case "button-variant": spec += `UI Button: variant="${v.variant}" size="${v.size}" (shadcn/ui convention)`; break
    case "pattern": spec += `Background pattern: ${v.name} at ${v.opacity}% opacity`; break
    case "text-effect": spec += `Text animation: use ${v.source}/${v.name} component (npx shadcn@latest add "https://21st.dev/r/${v.source}/${v.name}")`; break
    case "button-style": spec += `Fancy button: use ${v.source}/${v.name} component (npx shadcn@latest add "https://21st.dev/r/${v.source}/${v.name}")`; break
    case "background": spec += `Decorative bg: use ${v.source}/${v.name} component (npx shadcn@latest add "https://21st.dev/r/${v.source}/${v.name}")`; break
    case "card-style": spec += `Card component: use ${v.source}/${v.name} component (npx shadcn@latest add "https://21st.dev/r/${v.source}/${v.name}")`; break
    case "decoration": spec += `Decoration: use ${v.source}/${v.name} component (npx shadcn@latest add "https://21st.dev/r/${v.source}/${v.name}")`; break
    case "scroll-effect": spec += `Scroll effect: use ${v.source}/${v.name} component (npx shadcn@latest add "https://21st.dev/r/${v.source}/${v.name}")`; break
    case "nav-style": spec += `Navigation: use ${v.source}/${v.name} component (npx shadcn@latest add "https://21st.dev/r/${v.source}/${v.name}")`; break
    case "device-frame": spec += `Device mockup: use ${v.source}/${v.name} component (npx shadcn@latest add "https://21st.dev/r/${v.source}/${v.name}")`; break
    case "social-proof": spec += `Social proof: use ${v.source}/${v.name} component (npx shadcn@latest add "https://21st.dev/r/${v.source}/${v.name}")`; break
    case "3d": spec += `3D component: use ${v.source}/${v.name} component (npx shadcn@latest add "https://21st.dev/r/${v.source}/${v.name}")`; break
    default: spec += JSON.stringify(v)
  }

  return spec
}

/** Map widget types to CSS property names for clarity */
function getCSSProperty(type: string): string {
  const map: Record<string, string> = {
    color: "color/background-color",
    gradient: "background",
    opacity: "opacity",
    "font-size": "font-size",
    "font-family": "font-family",
    "font-weight": "font-weight",
    spacing: "padding/margin/gap",
    radius: "border-radius",
    shadow: "box-shadow",
    blur: "filter:blur/backdrop-filter:blur",
  }
  return map[type] || type
}
