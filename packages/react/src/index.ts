// Context
export { PromptKitProvider, usePromptKit } from "./context/promptkit-provider"
export type { PromptKitProviderProps } from "./context/promptkit-provider"

// Editor
export { RichPromptEditor } from "./editor/rich-prompt-editor"
export type { RichPromptEditorProps } from "./editor/rich-prompt-editor"
export { InlineWidget } from "./editor/inline-widget"
export { WidgetPalette } from "./editor/widget-palette"

// Individual widgets
export { ColorWidget } from "./widgets/color-widget"
export { SliderWidget } from "./widgets/slider-widget"
export { ToggleWidget } from "./widgets/toggle-widget"
export { SelectWidget } from "./widgets/select-widget"
export { PresetWidget } from "./widgets/preset-widget"
export { NumericWidget } from "./widgets/numeric-widget"
export { PresetSelectWidget } from "./widgets/preset-select-widget"

// Hooks
export { useRichPrompt } from "./hooks/use-rich-prompt"

// Drop-in integration
export { PromptKitInput } from "./integrations/promptkit-input"
export type { PromptKitInputProps, PromptKitResult } from "./integrations/promptkit-input"

// Re-export core for convenience
export { parse, serialize, serializeForAI, PromptBuilder, defaultRegistry, PROMPTKIT_SYSTEM_PROMPT, formatForAI } from "@promptkit/core"
export type * from "@promptkit/protocol"
