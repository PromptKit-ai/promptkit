import type {
  WidgetDefinition,
  ColorWidgetValue,
  SliderWidgetMeta,
  ToggleWidgetValue,
  SelectWidgetValue,
  SelectWidgetMeta,
  SpacingWidgetValue,
  RadiusWidgetValue,
  FontSizeWidgetValue,
  FontFamilyWidgetValue,
  ShadowWidgetValue,
  AnimationWidgetValue,
  BreakpointWidgetValue,
  OpacityWidgetValue,
  GradientWidgetValue,
  FontWeightWidgetValue,
  TextAlignWidgetValue,
  GridColumnsWidgetValue,
  BlurWidgetValue,
  BorderWidgetValue,
  LineHeightWidgetValue,
  LetterSpacingWidgetValue,
  EffectWidgetValue,
  CursorWidgetValue,
  TransformWidgetValue,
  FilterWidgetValue,
  FlexDirectionWidgetValue,
  JustifyContentWidgetValue,
  AlignItemsWidgetValue,
  PositionWidgetValue,
  DisplayWidgetValue,
  OverflowWidgetValue,
  AspectRatioWidgetValue,
  ObjectFitWidgetValue,
  TextDecorationWidgetValue,
  TextTransformWidgetValue,
  TextOverflowWidgetValue,
  ButtonVariantWidgetValue,
  PatternWidgetValue,
  Widget,
} from "@promptkit/protocol"

// ============================================================
// 1. COLOR
// ============================================================

export const colorWidget: WidgetDefinition<ColorWidgetValue> = {
  type: "color",
  category: "color",
  defaultDisplay: { label: "Color", preview: "🎨", inline: true },
  defaultValue: { hex: "#3B82F6" },
  defaultMeta: {},
  serialize: (w) => {
    const parts = [`value=${w.value.hex}`]
    if (w.value.opacity !== undefined) parts.push(`opacity=${w.value.opacity}`)
    if (w.display.label && w.display.label !== "Color") parts.push(`label=${w.display.label}`)
    return parts.join(",")
  },
  deserialize: (params) => ({
    value: {
      hex: params.value || "#3B82F6",
      opacity: params.opacity ? Number(params.opacity) : undefined,
    },
    display: params.label ? { label: params.label, inline: true } : undefined,
  }),
  humanReadable: (w) => `[🎨 ${w.value.hex}${w.value.opacity !== undefined ? ` ${w.value.opacity}%` : ""}]`,
  validate: (v) => /^#[0-9A-Fa-f]{6}$/.test(v.hex),
}

// ============================================================
// 2. SLIDER (generic)
// ============================================================

export const sliderWidget: WidgetDefinition<number> = {
  type: "slider",
  category: "logic",
  defaultDisplay: { label: "Slider", preview: "━", inline: true },
  defaultValue: 50,
  defaultMeta: { min: 0, max: 100, step: 1, unit: "px", subtype: "custom" } satisfies SliderWidgetMeta,
  serialize: (w) => {
    const m = w.meta as unknown as SliderWidgetMeta
    return `type=${m.subtype},value=${w.value},unit=${m.unit},min=${m.min},max=${m.max}`
  },
  deserialize: (params) => ({
    value: params.value ? Number(params.value) : 50,
    meta: {
      subtype: params.type || "custom",
      unit: params.unit || "px",
      min: params.min ? Number(params.min) : 0,
      max: params.max ? Number(params.max) : 100,
      step: params.step ? Number(params.step) : 1,
    },
  }),
  humanReadable: (w) => {
    const m = w.meta as unknown as SliderWidgetMeta
    return `[━━● ${w.value}${m.unit}]`
  },
  validate: (v) => typeof v === "number" && !isNaN(v),
}

// ============================================================
// 3. TOGGLE
// ============================================================

export const toggleWidget: WidgetDefinition<ToggleWidgetValue> = {
  type: "toggle",
  category: "logic",
  defaultDisplay: { label: "Toggle", preview: "🔀", inline: true },
  defaultValue: { key: "option", enabled: false },
  defaultMeta: {},
  serialize: (w) => `key=${w.value.key},value=${w.value.enabled}`,
  deserialize: (params) => ({
    value: {
      key: params.key || "option",
      enabled: params.value === "true",
    },
  }),
  humanReadable: (w) => `[${w.value.enabled ? "✅" : "⬜"} ${w.value.key}]`,
}

// ============================================================
// 4. SELECT
// ============================================================

export const selectWidget: WidgetDefinition<SelectWidgetValue> = {
  type: "select",
  category: "logic",
  defaultDisplay: { label: "Select", preview: "📋", inline: true },
  defaultValue: { key: "option", selected: "" },
  defaultMeta: { options: [], multiple: false } satisfies SelectWidgetMeta,
  serialize: (w) => {
    const m = w.meta as unknown as SelectWidgetMeta
    const optStr = m.options.map((o) => o.value).join("|")
    return `key=${w.value.key},value=${w.value.selected},options=${optStr}`
  },
  deserialize: (params) => ({
    value: {
      key: params.key || "option",
      selected: params.value || "",
    },
    meta: {
      options: params.options
        ? params.options.split("|").map((v) => ({ value: v, label: v }))
        : [],
      multiple: params.multiple === "true",
    },
  }),
  humanReadable: (w) => `[📋 ${w.value.key}: ${w.value.selected}]`,
}

// ============================================================
// 5. SPACING
// ============================================================

export const spacingWidget: WidgetDefinition<SpacingWidgetValue> = {
  type: "spacing",
  category: "spacing",
  defaultDisplay: { label: "Spacing", preview: "↔", inline: true },
  defaultValue: { value: 16, unit: "px" },
  defaultMeta: { presets: [4, 8, 12, 16, 20, 24, 32, 48, 64] },
  serialize: (w) => `value=${w.value.value},unit=${w.value.unit}`,
  deserialize: (params) => ({
    value: {
      value: params.value ? Number(params.value) : 16,
      unit: (params.unit as SpacingWidgetValue["unit"]) || "px",
    },
  }),
  humanReadable: (w) => `[↔ ${w.value.value}${w.value.unit}]`,
  validate: (v) => v.value >= 0,
}

// ============================================================
// 6. BORDER RADIUS
// ============================================================

export const radiusWidget: WidgetDefinition<RadiusWidgetValue> = {
  type: "radius",
  category: "spacing",
  defaultDisplay: { label: "Radius", preview: "◐", inline: true },
  defaultValue: { value: 8, unit: "px" },
  defaultMeta: { min: 0, max: 50, presets: [0, 4, 8, 12, 16, 24, 9999] },
  serialize: (w) => `value=${w.value.value},unit=${w.value.unit}`,
  deserialize: (params) => ({
    value: {
      value: params.value ? Number(params.value) : 8,
      unit: (params.unit as RadiusWidgetValue["unit"]) || "px",
    },
  }),
  humanReadable: (w) => {
    if (w.value.value >= 9999) return `[◐ full]`
    return `[◐ ${w.value.value}${w.value.unit}]`
  },
  validate: (v) => v.value >= 0,
}

// ============================================================
// 7. FONT SIZE
// ============================================================

export const fontSizeWidget: WidgetDefinition<FontSizeWidgetValue> = {
  type: "font-size",
  category: "typography",
  defaultDisplay: { label: "Font Size", preview: "Aa", inline: true },
  defaultValue: { value: 16, unit: "px" },
  defaultMeta: { min: 8, max: 96, presets: [12, 14, 16, 18, 20, 24, 30, 36, 48, 64] },
  serialize: (w) => `value=${w.value.value},unit=${w.value.unit}`,
  deserialize: (params) => ({
    value: {
      value: params.value ? Number(params.value) : 16,
      unit: (params.unit as FontSizeWidgetValue["unit"]) || "px",
    },
  }),
  humanReadable: (w) => `[Aa ${w.value.value}${w.value.unit}]`,
  validate: (v) => v.value > 0,
}

// ============================================================
// 8. FONT FAMILY
// ============================================================

const defaultFonts = [
  "Inter", "Roboto", "Open Sans", "Lato", "Montserrat", "Poppins",
  "Playfair Display", "Merriweather", "Fira Code", "JetBrains Mono",
  "Space Grotesk", "DM Sans", "Plus Jakarta Sans", "Geist",
]

export const fontFamilyWidget: WidgetDefinition<FontFamilyWidgetValue> = {
  type: "font-family",
  category: "typography",
  defaultDisplay: { label: "Font", preview: "𝔉", inline: true },
  defaultValue: { family: "Inter" },
  defaultMeta: { availableFonts: defaultFonts },
  serialize: (w) => {
    const parts = [`value=${w.value.family}`]
    if (w.value.weight) parts.push(`weight=${w.value.weight}`)
    if (w.value.style && w.value.style !== "normal") parts.push(`style=${w.value.style}`)
    return parts.join(",")
  },
  deserialize: (params) => ({
    value: {
      family: params.value || "Inter",
      weight: params.weight ? Number(params.weight) : undefined,
      style: params.style as FontFamilyWidgetValue["style"],
    },
  }),
  humanReadable: (w) => `[𝔉 ${w.value.family}${w.value.weight ? ` ${w.value.weight}` : ""}]`,
}

// ============================================================
// 9. SHADOW
// ============================================================

export const shadowWidget: WidgetDefinition<ShadowWidgetValue> = {
  type: "shadow",
  category: "effects",
  defaultDisplay: { label: "Shadow", preview: "🌑", inline: true },
  defaultValue: { preset: "md" },
  defaultMeta: { presets: ["none", "sm", "md", "lg", "xl", "2xl"] },
  serialize: (w) => `value=${w.value.preset}`,
  deserialize: (params) => ({
    value: { preset: (params.value || "md") as ShadowWidgetValue["preset"] },
  }),
  humanReadable: (w) => `[🌑 shadow-${w.value.preset}]`,
}

// ============================================================
// 10. ANIMATION
// ============================================================

const defaultAnimations = [
  { name: "bounce", duration: 500, easing: "ease-out" },
  { name: "fade-in", duration: 300, easing: "ease-in" },
  { name: "fade-out", duration: 300, easing: "ease-out" },
  { name: "slide-up", duration: 400, easing: "ease-out" },
  { name: "slide-down", duration: 400, easing: "ease-out" },
  { name: "slide-left", duration: 400, easing: "ease-out" },
  { name: "slide-right", duration: 400, easing: "ease-out" },
  { name: "scale-in", duration: 300, easing: "ease-out" },
  { name: "spin", duration: 1000, easing: "linear" },
  { name: "pulse", duration: 2000, easing: "ease-in-out" },
  { name: "spring", duration: 600, config: { stiffness: 300, damping: 20 } },
  { name: "elastic", duration: 800, config: { stiffness: 200, damping: 10 } },
]

export const animationWidget: WidgetDefinition<AnimationWidgetValue> = {
  type: "animation",
  category: "effects",
  defaultDisplay: { label: "Animation", preview: "🎬", inline: true },
  defaultValue: { name: "fade-in", duration: 300 },
  defaultMeta: { presets: defaultAnimations },
  serialize: (w) => {
    const parts = [`value=${w.value.name}`, `duration=${w.value.duration}ms`]
    if (w.value.easing) parts.push(`easing=${w.value.easing}`)
    if (w.value.config) {
      for (const [k, v] of Object.entries(w.value.config)) {
        parts.push(`${k}=${v}`)
      }
    }
    return parts.join(",")
  },
  deserialize: (params) => {
    const config: Record<string, number> = {}
    if (params.stiffness) config.stiffness = Number(params.stiffness)
    if (params.damping) config.damping = Number(params.damping)
    return {
      value: {
        name: params.value || "fade-in",
        duration: params.duration ? parseInt(params.duration) : 300,
        easing: params.easing,
        config: Object.keys(config).length > 0 ? config : undefined,
      },
    }
  },
  humanReadable: (w) => `[🎬 ${w.value.name} ${w.value.duration}ms]`,
}

// ============================================================
// 11. BREAKPOINT
// ============================================================

const breakpointWidths: Record<string, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
}

export const breakpointWidget: WidgetDefinition<BreakpointWidgetValue> = {
  type: "breakpoint",
  category: "layout",
  defaultDisplay: { label: "Breakpoint", preview: "📱", inline: true },
  defaultValue: { name: "md", width: 768 },
  defaultMeta: { breakpoints: breakpointWidths },
  serialize: (w) => `value=${w.value.name},width=${w.value.width}px`,
  deserialize: (params) => {
    const name = (params.value || "md") as BreakpointWidgetValue["name"]
    return {
      value: {
        name,
        width: params.width ? parseInt(params.width) : breakpointWidths[name] || 768,
      },
    }
  },
  humanReadable: (w) => {
    const icons: Record<string, string> = { sm: "📱", md: "📱", lg: "💻", xl: "🖥️", "2xl": "🖥️" }
    return `[${icons[w.value.name] || "📱"} ${w.value.name} (${w.value.width}px)]`
  },
}

// ============================================================
// 12. OPACITY
// ============================================================

export const opacityWidget: WidgetDefinition<OpacityWidgetValue> = {
  type: "opacity",
  category: "color",
  defaultDisplay: { label: "Opacity", preview: "◑", inline: true },
  defaultValue: { value: 100 },
  defaultMeta: { min: 0, max: 100, step: 5 },
  serialize: (w) => `value=${w.value.value}`,
  deserialize: (params) => ({
    value: { value: params.value ? Number(params.value) : 100 },
  }),
  humanReadable: (w) => `[◑ ${w.value.value}%]`,
  validate: (v) => v.value >= 0 && v.value <= 100,
}

// ============================================================
// 13. GRADIENT
// ============================================================

export const gradientWidget: WidgetDefinition<GradientWidgetValue> = {
  type: "gradient",
  category: "color",
  defaultDisplay: { label: "Gradient", preview: "🌈", inline: true },
  defaultValue: { from: "#3B82F6", to: "#8B5CF6", direction: "to-r" },
  defaultMeta: {},
  serialize: (w) => `from=${w.value.from},to=${w.value.to},dir=${w.value.direction}`,
  deserialize: (params) => ({
    value: {
      from: params.from || "#3B82F6",
      to: params.to || "#8B5CF6",
      direction: (params.dir || "to-r") as GradientWidgetValue["direction"],
    },
  }),
  humanReadable: (w) => `[🌈 ${w.value.from} → ${w.value.to} ${w.value.direction}]`,
}

// ============================================================
// 14. FONT WEIGHT
// ============================================================

export const fontWeightWidget: WidgetDefinition<FontWeightWidgetValue> = {
  type: "font-weight",
  category: "typography",
  defaultDisplay: { label: "Weight", preview: "B", inline: true },
  defaultValue: { value: 400 },
  defaultMeta: { presets: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
  serialize: (w) => `value=${w.value.value}`,
  deserialize: (params) => ({
    value: { value: (params.value ? Number(params.value) : 400) as FontWeightWidgetValue["value"] },
  }),
  humanReadable: (w) => {
    const labels: Record<number, string> = { 100: "Thin", 200: "ExtraLight", 300: "Light", 400: "Regular", 500: "Medium", 600: "SemiBold", 700: "Bold", 800: "ExtraBold", 900: "Black" }
    return `[B ${labels[w.value.value] || w.value.value}]`
  },
}

// ============================================================
// 15. TEXT ALIGN
// ============================================================

export const textAlignWidget: WidgetDefinition<TextAlignWidgetValue> = {
  type: "text-align",
  category: "typography",
  defaultDisplay: { label: "Align", preview: "≡", inline: true },
  defaultValue: { value: "left" },
  defaultMeta: {},
  serialize: (w) => `value=${w.value.value}`,
  deserialize: (params) => ({
    value: { value: (params.value || "left") as TextAlignWidgetValue["value"] },
  }),
  humanReadable: (w) => {
    const icons: Record<string, string> = { left: "◧", center: "◫", right: "◨", justify: "☰" }
    return `[${icons[w.value.value] || "≡"} ${w.value.value}]`
  },
}

// ============================================================
// 16. GRID COLUMNS
// ============================================================

export const gridColumnsWidget: WidgetDefinition<GridColumnsWidgetValue> = {
  type: "grid-columns",
  category: "layout",
  defaultDisplay: { label: "Columns", preview: "▥", inline: true },
  defaultValue: { value: 3 },
  defaultMeta: { min: 1, max: 12 },
  serialize: (w) => `value=${w.value.value}`,
  deserialize: (params) => ({
    value: { value: params.value ? Number(params.value) : 3 },
  }),
  humanReadable: (w) => `[▥ ${w.value.value} cols]`,
}

// ============================================================
// 17. BLUR
// ============================================================

export const blurWidget: WidgetDefinition<BlurWidgetValue> = {
  type: "blur",
  category: "effects",
  defaultDisplay: { label: "Blur", preview: "◉", inline: true },
  defaultValue: { value: 4 },
  defaultMeta: { min: 0, max: 20, step: 1 },
  serialize: (w) => `value=${w.value.value}`,
  deserialize: (params) => ({
    value: { value: params.value ? Number(params.value) : 4 },
  }),
  humanReadable: (w) => `[◉ blur ${w.value.value}px]`,
}

// ============================================================
// 18. BORDER
// ============================================================

export const borderWidget: WidgetDefinition<BorderWidgetValue> = {
  type: "border",
  category: "spacing",
  defaultDisplay: { label: "Border", preview: "▢", inline: true },
  defaultValue: { width: 1, style: "solid", color: "#FFFFFF" },
  defaultMeta: {},
  serialize: (w) => `width=${w.value.width},style=${w.value.style},color=${w.value.color}`,
  deserialize: (params) => ({
    value: {
      width: params.width ? Number(params.width) : 1,
      style: (params.style || "solid") as BorderWidgetValue["style"],
      color: params.color || "#FFFFFF",
    },
  }),
  humanReadable: (w) => `[▢ ${w.value.width}px ${w.value.style} ${w.value.color}]`,
}

// ============================================================
// 19. LINE HEIGHT
// ============================================================

export const lineHeightWidget: WidgetDefinition<LineHeightWidgetValue> = {
  type: "line-height",
  category: "typography",
  defaultDisplay: { label: "Leading", preview: "¶", inline: true },
  defaultValue: { value: 1.5, label: "normal" },
  defaultMeta: {},
  serialize: (w) => `value=${w.value.value},label=${w.value.label}`,
  deserialize: (params) => ({
    value: {
      value: params.value ? Number(params.value) : 1.5,
      label: params.label || "normal",
    },
  }),
  humanReadable: (w) => `[¶ ${w.value.label} (${w.value.value})]`,
}

// ============================================================
// 20. LETTER SPACING
// ============================================================

export const letterSpacingWidget: WidgetDefinition<LetterSpacingWidgetValue> = {
  type: "letter-spacing",
  category: "typography",
  defaultDisplay: { label: "Tracking", preview: "AV", inline: true },
  defaultValue: { value: 0, label: "normal" },
  defaultMeta: {},
  serialize: (w) => `value=${w.value.value},label=${w.value.label}`,
  deserialize: (params) => ({
    value: {
      value: params.value ? Number(params.value) : 0,
      label: params.label || "normal",
    },
  }),
  humanReadable: (w) => `[AV ${w.value.label} (${w.value.value}em)]`,
}

// ============================================================
// 21. EFFECT (MagicUI / Aceternity-inspired)
// ============================================================

export const effectWidget: WidgetDefinition<EffectWidgetValue> = {
  type: "effect",
  category: "effects",
  defaultDisplay: { label: "Effect", preview: "✦", inline: true },
  defaultValue: { name: "shimmer", intensity: "normal" },
  defaultMeta: { presets: ["shimmer", "glow", "spotlight", "aurora", "particles", "ripple", "meteor", "border-beam", "marquee", "blur-fade", "sparkles", "wave"] },
  serialize: (w) => `value=${w.value.name},intensity=${w.value.intensity}`,
  deserialize: (params) => ({
    value: { name: params.value || "shimmer", intensity: (params.intensity || "normal") as EffectWidgetValue["intensity"] },
  }),
  humanReadable: (w) => `[✦ ${w.value.name} (${w.value.intensity})]`,
}

// ============================================================
// 22. CURSOR
// ============================================================

export const cursorWidget: WidgetDefinition<CursorWidgetValue> = {
  type: "cursor",
  category: "logic",
  defaultDisplay: { label: "Cursor", preview: "👆", inline: true },
  defaultValue: { value: "pointer" },
  defaultMeta: {},
  serialize: (w) => `value=${w.value.value}`,
  deserialize: (params) => ({
    value: { value: (params.value || "pointer") as CursorWidgetValue["value"] },
  }),
  humanReadable: (w) => `[👆 cursor-${w.value.value}]`,
}

// ============================================================
// 23. TRANSFORM
// ============================================================

export const transformWidget: WidgetDefinition<TransformWidgetValue> = {
  type: "transform",
  category: "effects",
  defaultDisplay: { label: "Transform", preview: "⟲", inline: true },
  defaultValue: { rotate: 0, scale: 1, skewX: 0, skewY: 0 },
  defaultMeta: {},
  serialize: (w) => `rotate=${w.value.rotate},scale=${w.value.scale},skewX=${w.value.skewX},skewY=${w.value.skewY}`,
  deserialize: (params) => ({
    value: {
      rotate: params.rotate ? Number(params.rotate) : 0,
      scale: params.scale ? Number(params.scale) : 1,
      skewX: params.skewX ? Number(params.skewX) : 0,
      skewY: params.skewY ? Number(params.skewY) : 0,
    },
  }),
  humanReadable: (w) => {
    const parts = []
    if (w.value.rotate !== 0) parts.push(`rotate(${w.value.rotate}deg)`)
    if (w.value.scale !== 1) parts.push(`scale(${w.value.scale})`)
    if (w.value.skewX !== 0) parts.push(`skewX(${w.value.skewX}deg)`)
    if (w.value.skewY !== 0) parts.push(`skewY(${w.value.skewY}deg)`)
    return `[⟲ ${parts.join(" ") || "none"}]`
  },
}

// ============================================================
// 24. FILTER
// ============================================================

export const filterWidget: WidgetDefinition<FilterWidgetValue> = {
  type: "filter",
  category: "color",
  defaultDisplay: { label: "Filter", preview: "◈", inline: true },
  defaultValue: { type: "none", value: 100 },
  defaultMeta: {},
  serialize: (w) => `type=${w.value.type},value=${w.value.value}`,
  deserialize: (params) => ({
    value: { type: (params.type || "none") as FilterWidgetValue["type"], value: params.value ? Number(params.value) : 100 },
  }),
  humanReadable: (w) => w.value.type === "none" ? "[◈ no filter]" : `[◈ ${w.value.type}(${w.value.value}%)]`,
}

// ============================================================
// 25. FLEX DIRECTION
// ============================================================

export const flexDirectionWidget: WidgetDefinition<FlexDirectionWidgetValue> = {
  type: "flex-direction",
  category: "layout",
  defaultDisplay: { label: "Direction", preview: "→", inline: true },
  defaultValue: { value: "row" },
  defaultMeta: {},
  serialize: (w) => `value=${w.value.value}`,
  deserialize: (params) => ({
    value: { value: (params.value || "row") as FlexDirectionWidgetValue["value"] },
  }),
  humanReadable: (w) => {
    const icons: Record<string, string> = { row: "→", column: "↓", "row-reverse": "←", "column-reverse": "↑" }
    return `[${icons[w.value.value] || "→"} flex-${w.value.value}]`
  },
}

// ============================================================
// 26. JUSTIFY CONTENT
// ============================================================

export const justifyContentWidget: WidgetDefinition<JustifyContentWidgetValue> = {
  type: "justify-content",
  category: "layout",
  defaultDisplay: { label: "Justify", preview: "⇔", inline: true },
  defaultValue: { value: "start" },
  defaultMeta: {},
  serialize: (w) => `value=${w.value.value}`,
  deserialize: (params) => ({
    value: { value: (params.value || "start") as JustifyContentWidgetValue["value"] },
  }),
  humanReadable: (w) => `[⇔ justify-${w.value.value}]`,
}

// ============================================================
// 27. ALIGN ITEMS
// ============================================================

export const alignItemsWidget: WidgetDefinition<AlignItemsWidgetValue> = {
  type: "align-items",
  category: "layout",
  defaultDisplay: { label: "Align Items", preview: "⇕", inline: true },
  defaultValue: { value: "center" },
  defaultMeta: {},
  serialize: (w) => `value=${w.value.value}`,
  deserialize: (params) => ({
    value: { value: (params.value || "center") as AlignItemsWidgetValue["value"] },
  }),
  humanReadable: (w) => `[⇕ items-${w.value.value}]`,
}

// ============================================================
// 28. POSITION
// ============================================================

export const positionWidget: WidgetDefinition<PositionWidgetValue> = {
  type: "position",
  category: "layout",
  defaultDisplay: { label: "Position", preview: "◎", inline: true },
  defaultValue: { value: "relative" },
  defaultMeta: {},
  serialize: (w) => `value=${w.value.value}`,
  deserialize: (params) => ({
    value: { value: (params.value || "relative") as PositionWidgetValue["value"] },
  }),
  humanReadable: (w) => `[◎ ${w.value.value}]`,
}

// ============================================================
// 29. DISPLAY
// ============================================================

export const displayWidget: WidgetDefinition<DisplayWidgetValue> = {
  type: "display",
  category: "layout",
  defaultDisplay: { label: "Display", preview: "☐", inline: true },
  defaultValue: { value: "flex" },
  defaultMeta: {},
  serialize: (w) => `value=${w.value.value}`,
  deserialize: (params) => ({
    value: { value: (params.value || "flex") as DisplayWidgetValue["value"] },
  }),
  humanReadable: (w) => `[☐ ${w.value.value}]`,
}

// ============================================================
// 30. OVERFLOW
// ============================================================

export const overflowWidget: WidgetDefinition<OverflowWidgetValue> = {
  type: "overflow",
  category: "layout",
  defaultDisplay: { label: "Overflow", preview: "⧉", inline: true },
  defaultValue: { value: "hidden" },
  defaultMeta: {},
  serialize: (w) => `value=${w.value.value}`,
  deserialize: (params) => ({
    value: { value: (params.value || "hidden") as OverflowWidgetValue["value"] },
  }),
  humanReadable: (w) => `[⧉ overflow-${w.value.value}]`,
}

// ============================================================
// 31. ASPECT RATIO
// ============================================================

export const aspectRatioWidget: WidgetDefinition<AspectRatioWidgetValue> = {
  type: "aspect-ratio",
  category: "layout",
  defaultDisplay: { label: "Ratio", preview: "⬛", inline: true },
  defaultValue: { value: "16/9", label: "16:9" },
  defaultMeta: {},
  serialize: (w) => `value=${w.value.value}`,
  deserialize: (params) => {
    const labels: Record<string, string> = { "1/1": "1:1", "16/9": "16:9", "4/3": "4:3", "3/2": "3:2", "21/9": "21:9" }
    const v = params.value || "16/9"
    return { value: { value: v, label: labels[v] || v } }
  },
  humanReadable: (w) => `[⬛ ${w.value.label}]`,
}

// ============================================================
// 32. OBJECT FIT
// ============================================================

export const objectFitWidget: WidgetDefinition<ObjectFitWidgetValue> = {
  type: "object-fit",
  category: "layout",
  defaultDisplay: { label: "Fit", preview: "🖼", inline: true },
  defaultValue: { value: "cover" },
  defaultMeta: {},
  serialize: (w) => `value=${w.value.value}`,
  deserialize: (params) => ({
    value: { value: (params.value || "cover") as ObjectFitWidgetValue["value"] },
  }),
  humanReadable: (w) => `[🖼 object-${w.value.value}]`,
}

// ============================================================
// 33. TEXT DECORATION
// ============================================================

export const textDecorationWidget: WidgetDefinition<TextDecorationWidgetValue> = {
  type: "text-decoration",
  category: "typography",
  defaultDisplay: { label: "Decoration", preview: "U̲", inline: true },
  defaultValue: { value: "none" },
  defaultMeta: {},
  serialize: (w) => `value=${w.value.value}`,
  deserialize: (params) => ({
    value: { value: (params.value || "none") as TextDecorationWidgetValue["value"] },
  }),
  humanReadable: (w) => `[U̲ ${w.value.value}]`,
}

// ============================================================
// 34. TEXT TRANSFORM
// ============================================================

export const textTransformWidget: WidgetDefinition<TextTransformWidgetValue> = {
  type: "text-transform",
  category: "typography",
  defaultDisplay: { label: "Case", preview: "Aa", inline: true },
  defaultValue: { value: "none" },
  defaultMeta: {},
  serialize: (w) => `value=${w.value.value}`,
  deserialize: (params) => ({
    value: { value: (params.value || "none") as TextTransformWidgetValue["value"] },
  }),
  humanReadable: (w) => {
    const labels: Record<string, string> = { none: "as-is", uppercase: "UPPER", lowercase: "lower", capitalize: "Title" }
    return `[Aa ${labels[w.value.value] || w.value.value}]`
  },
}

// ============================================================
// 35. TEXT OVERFLOW
// ============================================================

export const textOverflowWidget: WidgetDefinition<TextOverflowWidgetValue> = {
  type: "text-overflow",
  category: "typography",
  defaultDisplay: { label: "Overflow", preview: "…", inline: true },
  defaultValue: { value: "ellipsis" },
  defaultMeta: {},
  serialize: (w) => `value=${w.value.value}`,
  deserialize: (params) => ({
    value: { value: (params.value || "ellipsis") as TextOverflowWidgetValue["value"] },
  }),
  humanReadable: (w) => `[… text-${w.value.value}]`,
}

// ============================================================
// 36. BUTTON VARIANT
// ============================================================

export const buttonVariantWidget: WidgetDefinition<ButtonVariantWidgetValue> = {
  type: "button-variant",
  category: "components",
  defaultDisplay: { label: "Button", preview: "☐", inline: true },
  defaultValue: { variant: "default", size: "default" },
  defaultMeta: {},
  serialize: (w) => `variant=${w.value.variant},size=${w.value.size}`,
  deserialize: (params) => ({
    value: {
      variant: (params.variant || "default") as ButtonVariantWidgetValue["variant"],
      size: (params.size || "default") as ButtonVariantWidgetValue["size"],
    },
  }),
  humanReadable: (w) => `[☐ btn-${w.value.variant} (${w.value.size})]`,
}

// ============================================================
// 37. PATTERN (backgrounds)
// ============================================================

export const patternWidget: WidgetDefinition<PatternWidgetValue> = {
  type: "pattern",
  category: "components",
  defaultDisplay: { label: "Pattern", preview: "░", inline: true },
  defaultValue: { name: "dots", opacity: 20 },
  defaultMeta: {},
  serialize: (w) => `value=${w.value.name},opacity=${w.value.opacity}`,
  deserialize: (params) => ({
    value: { name: (params.value || "dots") as PatternWidgetValue["name"], opacity: params.opacity ? Number(params.opacity) : 20 },
  }),
  humanReadable: (w) => `[░ ${w.value.name} ${w.value.opacity}%]`,
}

// ============================================================
// 38. TEXT EFFECT (21st.dev - MagicUI text animations)
// ============================================================

export const textEffectWidget: WidgetDefinition<{ name: string; source: string }> = {
  type: "text-effect",
  category: "components",
  defaultDisplay: { label: "Text FX", preview: "✨", inline: true },
  defaultValue: { name: "typing-animation", source: "magicui" },
  defaultMeta: { presets: [
    "typing-animation", "word-rotate", "gradual-spacing", "fade-text", "blur-in",
    "word-pull-up", "flip-text", "sparkles-text", "hyper-text", "text-reveal",
    "animated-gradient-text", "number-ticker", "spinning-text", "text-generate-effect",
  ]},
  serialize: (w) => `value=${w.value.name},source=${w.value.source}`,
  deserialize: (params) => ({
    value: { name: params.value || "typing-animation", source: params.source || "magicui" },
  }),
  humanReadable: (w) => `[✨ ${w.value.name} (${w.value.source})]`,
}

// ============================================================
// 39. BUTTON STYLE (21st.dev - fancy buttons)
// ============================================================

export const buttonStyleWidget: WidgetDefinition<{ name: string; source: string }> = {
  type: "button-style",
  category: "components",
  defaultDisplay: { label: "Btn Style", preview: "◆", inline: true },
  defaultValue: { name: "shimmer-button", source: "magicui" },
  defaultMeta: { presets: [
    "shimmer-button", "rainbow-button", "shiny-button", "pulsating-button",
    "interactive-hover-button", "animated-subscribe-button", "moving-border",
    "hover-border-gradient",
  ]},
  serialize: (w) => `value=${w.value.name},source=${w.value.source}`,
  deserialize: (params) => ({
    value: { name: params.value || "shimmer-button", source: params.source || "magicui" },
  }),
  humanReadable: (w) => `[◆ ${w.value.name} (${w.value.source})]`,
}

// ============================================================
// 40. BACKGROUND (21st.dev - decorative backgrounds)
// ============================================================

export const backgroundWidget: WidgetDefinition<{ name: string; source: string }> = {
  type: "background",
  category: "components",
  defaultDisplay: { label: "Background", preview: "◫", inline: true },
  defaultValue: { name: "dot-pattern", source: "magicui" },
  defaultMeta: { presets: [
    "dot-pattern", "grid-pattern", "retro-grid", "flickering-grid",
    "background-beams", "wavy-background", "aurora-background", "spotlight",
    "particles", "meteors", "ripple",
  ]},
  serialize: (w) => `value=${w.value.name},source=${w.value.source}`,
  deserialize: (params) => ({
    value: { name: params.value || "dot-pattern", source: params.source || "magicui" },
  }),
  humanReadable: (w) => `[◫ ${w.value.name} (${w.value.source})]`,
}

// ============================================================
// 41. CARD STYLE (21st.dev - card components)
// ============================================================

export const cardStyleWidget: WidgetDefinition<{ name: string; source: string }> = {
  type: "card-style",
  category: "components",
  defaultDisplay: { label: "Card", preview: "▭", inline: true },
  defaultValue: { name: "magic-card", source: "magicui" },
  defaultMeta: { presets: [
    "magic-card", "neon-gradient-card", "bento-grid", "direction-aware-hover",
    "card-hover-effect", "shine-border", "3d-card",
  ]},
  serialize: (w) => `value=${w.value.name},source=${w.value.source}`,
  deserialize: (params) => ({
    value: { name: params.value || "magic-card", source: params.source || "magicui" },
  }),
  humanReadable: (w) => `[▭ ${w.value.name} (${w.value.source})]`,
}

// ============================================================
// 42. DECORATION (21st.dev - decorative elements)
// ============================================================

export const decorationWidget: WidgetDefinition<{ name: string; source: string }> = {
  type: "decoration",
  category: "effects",
  defaultDisplay: { label: "Deco", preview: "⟡", inline: true },
  defaultValue: { name: "sparkles", source: "aceternity" },
  defaultMeta: { presets: [
    "sparkles", "confetti", "border-beam", "animated-beam", "orbiting-circles",
    "cool-mode", "tracing-beam", "scratch-to-reveal",
  ]},
  serialize: (w) => `value=${w.value.name},source=${w.value.source}`,
  deserialize: (params) => ({
    value: { name: params.value || "sparkles", source: params.source || "aceternity" },
  }),
  humanReadable: (w) => `[⟡ ${w.value.name} (${w.value.source})]`,
}

// ============================================================
// 43. SCROLL EFFECT (21st.dev - scroll-based)
// ============================================================

export const scrollEffectWidget: WidgetDefinition<{ name: string; source: string }> = {
  type: "scroll-effect",
  category: "effects",
  defaultDisplay: { label: "Scroll FX", preview: "↕", inline: true },
  defaultValue: { name: "parallax-scroll", source: "aceternity" },
  defaultMeta: { presets: [
    "parallax-scroll", "scroll-based-velocity", "blur-fade", "box-reveal",
    "text-reveal-card",
  ]},
  serialize: (w) => `value=${w.value.name},source=${w.value.source}`,
  deserialize: (params) => ({
    value: { name: params.value || "parallax-scroll", source: params.source || "aceternity" },
  }),
  humanReadable: (w) => `[↕ ${w.value.name} (${w.value.source})]`,
}

// ============================================================
// 44. NAV STYLE (21st.dev - navigation components)
// ============================================================

export const navStyleWidget: WidgetDefinition<{ name: string; source: string }> = {
  type: "nav-style",
  category: "components",
  defaultDisplay: { label: "Nav", preview: "☰", inline: true },
  defaultValue: { name: "floating-navbar", source: "aceternity" },
  defaultMeta: { presets: [
    "floating-navbar", "dock", "tabs",
  ]},
  serialize: (w) => `value=${w.value.name},source=${w.value.source}`,
  deserialize: (params) => ({
    value: { name: params.value || "floating-navbar", source: params.source || "aceternity" },
  }),
  humanReadable: (w) => `[☰ ${w.value.name} (${w.value.source})]`,
}

// ============================================================
// 45. DEVICE FRAME (21st.dev - mockups)
// ============================================================

export const deviceFrameWidget: WidgetDefinition<{ name: string; source: string }> = {
  type: "device-frame",
  category: "components",
  defaultDisplay: { label: "Device", preview: "📱", inline: true },
  defaultValue: { name: "iphone-15-pro", source: "magicui" },
  defaultMeta: { presets: [
    "iphone-15-pro", "safari", "terminal",
  ]},
  serialize: (w) => `value=${w.value.name},source=${w.value.source}`,
  deserialize: (params) => ({
    value: { name: params.value || "iphone-15-pro", source: params.source || "magicui" },
  }),
  humanReadable: (w) => `[📱 ${w.value.name} (${w.value.source})]`,
}

// ============================================================
// 46. SOCIAL PROOF (21st.dev - social components)
// ============================================================

export const socialProofWidget: WidgetDefinition<{ name: string; source: string }> = {
  type: "social-proof",
  category: "components",
  defaultDisplay: { label: "Social", preview: "👥", inline: true },
  defaultValue: { name: "avatar-circles", source: "magicui" },
  defaultMeta: { presets: [
    "avatar-circles", "marquee", "animated-list", "tweet-card", "number-ticker",
    "animated-circular-progress-bar", "gauge-circle", "icon-cloud",
  ]},
  serialize: (w) => `value=${w.value.name},source=${w.value.source}`,
  deserialize: (params) => ({
    value: { name: params.value || "avatar-circles", source: params.source || "magicui" },
  }),
  humanReadable: (w) => `[👥 ${w.value.name} (${w.value.source})]`,
}

// ============================================================
// 47. 3D/GLOBE (21st.dev - 3D components)
// ============================================================

export const threeDWidget: WidgetDefinition<{ name: string; source: string }> = {
  type: "3d",
  category: "components",
  defaultDisplay: { label: "3D", preview: "🌍", inline: true },
  defaultValue: { name: "globe", source: "magicui" },
  defaultMeta: { presets: [
    "globe", "orbiting-circles", "3d-card",
  ]},
  serialize: (w) => `value=${w.value.name},source=${w.value.source}`,
  deserialize: (params) => ({
    value: { name: params.value || "globe", source: params.source || "magicui" },
  }),
  humanReadable: (w) => `[🌍 ${w.value.name} (${w.value.source})]`,
}

// ============================================================
// ALL WIDGETS
// ============================================================

export const allWidgets: WidgetDefinition[] = [
  // Core (1-12)
  colorWidget as WidgetDefinition,
  sliderWidget as WidgetDefinition,
  toggleWidget as WidgetDefinition,
  selectWidget as WidgetDefinition,
  spacingWidget as WidgetDefinition,
  radiusWidget as WidgetDefinition,
  fontSizeWidget as WidgetDefinition,
  fontFamilyWidget as WidgetDefinition,
  shadowWidget as WidgetDefinition,
  animationWidget as WidgetDefinition,
  breakpointWidget as WidgetDefinition,
  opacityWidget as WidgetDefinition,
  // Extended design (13-20)
  gradientWidget as WidgetDefinition,
  fontWeightWidget as WidgetDefinition,
  textAlignWidget as WidgetDefinition,
  gridColumnsWidget as WidgetDefinition,
  blurWidget as WidgetDefinition,
  borderWidget as WidgetDefinition,
  lineHeightWidget as WidgetDefinition,
  letterSpacingWidget as WidgetDefinition,
  // Effects & interactions (21-24)
  effectWidget as WidgetDefinition,
  cursorWidget as WidgetDefinition,
  transformWidget as WidgetDefinition,
  filterWidget as WidgetDefinition,
  // Layout advanced (25-32)
  flexDirectionWidget as WidgetDefinition,
  justifyContentWidget as WidgetDefinition,
  alignItemsWidget as WidgetDefinition,
  positionWidget as WidgetDefinition,
  displayWidget as WidgetDefinition,
  overflowWidget as WidgetDefinition,
  aspectRatioWidget as WidgetDefinition,
  objectFitWidget as WidgetDefinition,
  // Typography advanced (33-35)
  textDecorationWidget as WidgetDefinition,
  textTransformWidget as WidgetDefinition,
  textOverflowWidget as WidgetDefinition,
  // Component-level (36-37)
  buttonVariantWidget as WidgetDefinition,
  patternWidget as WidgetDefinition,
  // 21st.dev components (38-47)
  textEffectWidget as WidgetDefinition,
  buttonStyleWidget as WidgetDefinition,
  backgroundWidget as WidgetDefinition,
  cardStyleWidget as WidgetDefinition,
  decorationWidget as WidgetDefinition,
  scrollEffectWidget as WidgetDefinition,
  navStyleWidget as WidgetDefinition,
  deviceFrameWidget as WidgetDefinition,
  socialProofWidget as WidgetDefinition,
  threeDWidget as WidgetDefinition,
]
