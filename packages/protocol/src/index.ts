// ============================================================
// @promptkit/protocol — Interactive Prompt Widget Protocol v1.0
// ============================================================

// --- Widget Categories ---

export type WidgetCategory =
  | "color"       // colors, gradients, filters
  | "typography"  // font size, family, weight, spacing, decoration
  | "spacing"     // padding, margin, gap, border-radius
  | "layout"      // flex, grid, display, position, overflow, aspect-ratio
  | "effects"     // shadows, blur, animations, effects, transitions, transforms
  | "components"  // buttons, cards, patterns, backgrounds, UI patterns
  | "logic"       // toggle, select, breakpoint, cursor, overflow
  | "asset"       // image, icon, emoji, figma-ref
  | "project-ref" // component, page, hook, api-route (Pro)
  // Legacy alias — keep "design" and "animation" working for backward compat
  | "design"
  | "animation"

// --- Built-in Widget Types ---

export type BuiltInWidgetType =
  | "color"
  | "slider"
  | "toggle"
  | "select"
  | "spacing"
  | "radius"
  | "font-size"
  | "font-family"
  | "shadow"
  | "animation"
  | "breakpoint"
  | "opacity"
  | "component"
  | "page"
  | "preset"

// --- Widget Display ---

export interface WidgetDisplay {
  /** Visible label on the chip */
  label?: string
  /** Emoji, icon name, or mini-preview identifier */
  preview?: string
  /** true = renders inline in text, false = renders as block */
  inline: boolean
}

// --- Core Widget ---

export interface Widget<T = unknown> {
  /** Unique ID within the message */
  id: string
  /** Widget type identifier */
  type: string
  /** Semantic category */
  category: WidgetCategory
  /** Current value */
  value: T
  /** Type-specific configuration */
  meta: Record<string, unknown>
  /** Display configuration */
  display: WidgetDisplay
}

// --- Typed Widget Variants ---

export interface ColorWidgetValue {
  hex: string
  opacity?: number
}

export interface SliderWidgetMeta {
  min: number
  max: number
  step: number
  unit: string
  subtype: string // "opacity" | "border-radius" | "spacing" | "font-size" | "custom"
}

export interface ToggleWidgetValue {
  key: string
  enabled: boolean
}

export interface SelectWidgetValue {
  key: string
  selected: string
}

export interface SelectWidgetMeta {
  options: Array<{ value: string; label: string }>
  multiple: boolean
}

export interface SpacingWidgetValue {
  value: number
  unit: "px" | "rem" | "em"
}

export interface RadiusWidgetValue {
  value: number
  unit: "px" | "rem" | "%"
}

export interface FontSizeWidgetValue {
  value: number
  unit: "px" | "rem" | "em"
}

export interface FontFamilyWidgetValue {
  family: string
  weight?: number
  style?: "normal" | "italic"
}

export interface ShadowWidgetValue {
  preset: "none" | "sm" | "md" | "lg" | "xl" | "2xl"
}

export interface AnimationWidgetValue {
  name: string
  duration: number
  easing?: string
  config?: Record<string, number> // spring stiffness, damping, etc.
}

export interface BreakpointWidgetValue {
  name: "sm" | "md" | "lg" | "xl" | "2xl"
  width: number
}

export interface OpacityWidgetValue {
  value: number // 0-100
}

// --- New Widget Values ---

export interface GradientWidgetValue {
  from: string
  to: string
  direction: "to-r" | "to-l" | "to-t" | "to-b" | "to-tr" | "to-br" | "to-tl" | "to-bl"
}

export interface FontWeightWidgetValue {
  value: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
}

export interface TextAlignWidgetValue {
  value: "left" | "center" | "right" | "justify"
}

export interface GridColumnsWidgetValue {
  value: number // 1-12
}

export interface BlurWidgetValue {
  value: number // 0-20 px
}

export interface BorderWidgetValue {
  width: number
  style: "solid" | "dashed" | "dotted" | "none"
  color: string
}

export interface LineHeightWidgetValue {
  value: number // e.g. 1, 1.25, 1.5, 1.75, 2
  label: string // "tight" | "snug" | "normal" | "relaxed" | "loose"
}

export interface LetterSpacingWidgetValue {
  value: number // em
  label: string // "tighter" | "tight" | "normal" | "wide" | "wider" | "widest"
}

// --- Visual Effects (inspired by MagicUI / Aceternity) ---

export interface EffectWidgetValue {
  name: string
  intensity: "subtle" | "normal" | "strong"
}

export interface CursorWidgetValue {
  value: "default" | "pointer" | "grab" | "crosshair" | "text" | "move" | "not-allowed" | "wait" | "zoom-in" | "none"
}

export interface TransformWidgetValue {
  rotate: number
  scale: number
  skewX: number
  skewY: number
}

export interface FilterWidgetValue {
  type: "none" | "grayscale" | "sepia" | "saturate" | "hue-rotate" | "invert" | "brightness" | "contrast"
  value: number
}

// --- Layout Advanced ---

export interface FlexDirectionWidgetValue {
  value: "row" | "column" | "row-reverse" | "column-reverse"
}

export interface JustifyContentWidgetValue {
  value: "start" | "center" | "end" | "between" | "around" | "evenly"
}

export interface AlignItemsWidgetValue {
  value: "start" | "center" | "end" | "stretch" | "baseline"
}

export interface PositionWidgetValue {
  value: "static" | "relative" | "absolute" | "fixed" | "sticky"
}

export interface DisplayWidgetValue {
  value: "block" | "flex" | "grid" | "inline" | "inline-flex" | "inline-block" | "none" | "hidden"
}

export interface OverflowWidgetValue {
  value: "visible" | "hidden" | "scroll" | "auto" | "clip"
}

export interface AspectRatioWidgetValue {
  value: string // "1/1" | "16/9" | "4/3" | "3/2" | "21/9"
  label: string
}

export interface ObjectFitWidgetValue {
  value: "contain" | "cover" | "fill" | "none" | "scale-down"
}

// --- Typography Advanced ---

export interface TextDecorationWidgetValue {
  value: "none" | "underline" | "line-through" | "overline"
}

export interface TextTransformWidgetValue {
  value: "none" | "uppercase" | "lowercase" | "capitalize"
}

export interface TextOverflowWidgetValue {
  value: "clip" | "ellipsis" | "truncate"
}

// --- Component-Level ---

export interface ButtonVariantWidgetValue {
  variant: "default" | "secondary" | "outline" | "ghost" | "destructive" | "link"
  size: "sm" | "default" | "lg" | "icon"
}

export interface PatternWidgetValue {
  name: "dots" | "grid" | "diagonal" | "cross" | "zigzag" | "waves" | "none"
  opacity: number
}

// --- Project Reference Widgets (Pro) ---

export interface ComponentRefValue {
  path: string
  name: string
  exportType: "default" | "named"
  line?: number
  props?: Record<string, unknown>
}

export interface PageRefValue {
  path: string
  name: string
  route?: string
}

// --- Preset Widget ---

export interface PresetWidgetValue {
  category: string
  name: string
  config: Record<string, unknown>
}

// --- Rich Prompt ---

export interface RichPrompt {
  /** Protocol version */
  version: "1.0"
  /** Raw text with {{widget:id}} placeholders */
  text: string
  /** Widgets referenced in the text */
  widgets: Widget[]
  /** Optional project context (Pro feature) */
  context?: ProjectContext
}

// --- Serialized Output ---

export interface SerializedPrompt {
  /** Human-readable version with inline widget descriptions */
  humanReadable: string
  /** Full structured data for precise AI parsing */
  structured: RichPrompt
}

// --- Project Context (Pro) ---

export interface ProjectContext {
  /** Project root path */
  root: string
  /** Framework detected */
  framework?: string
  /** Available components */
  components?: ComponentRefValue[]
  /** Available pages/routes */
  pages?: PageRefValue[]
}

// --- Widget Definition (for creating custom widgets) ---

export interface WidgetDefinition<T = unknown> {
  /** Unique type identifier */
  type: string
  /** Semantic category */
  category: WidgetCategory
  /** Default display config */
  defaultDisplay: WidgetDisplay
  /** Default value */
  defaultValue: T
  /** Default meta */
  defaultMeta: Record<string, unknown>
  /** Serialize widget value to text token for AI */
  serialize: (widget: Widget<T>) => string
  /** Parse text token back to widget */
  deserialize: (params: Record<string, string>) => Partial<Widget<T>>
  /** Generate human-readable inline text */
  humanReadable: (widget: Widget<T>) => string
  /** Validate the widget value */
  validate?: (value: T) => boolean
}

// --- Widget Pack ---

export interface WidgetPack {
  /** Pack name */
  name: string
  /** Semver version */
  version: string
  /** Pack description */
  description?: string
  /** Widget definitions in this pack */
  widgets: WidgetDefinition[]
}

// --- Widget Palette Config ---

export interface PaletteCategory {
  id: WidgetCategory
  label: string
  icon?: string
  widgets: string[] // widget type identifiers
}

export interface PaletteConfig {
  categories: PaletteCategory[]
}

// --- Events ---

export interface WidgetChangeEvent {
  widgetId: string
  previousValue: unknown
  newValue: unknown
  timestamp: number
}

export interface WidgetInsertEvent {
  widgetId: string
  type: string
  position: number // cursor position in text
  timestamp: number
}

export interface WidgetRemoveEvent {
  widgetId: string
  timestamp: number
}

export type PromptKitEvent =
  | { type: "widget:change"; payload: WidgetChangeEvent }
  | { type: "widget:insert"; payload: WidgetInsertEvent }
  | { type: "widget:remove"; payload: WidgetRemoveEvent }
  | { type: "prompt:submit"; payload: SerializedPrompt }
