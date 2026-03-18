import type { Widget, RichPrompt, SerializedPrompt } from "@promptkit/protocol"
import type { WidgetRegistry } from "./registry"
import { defaultRegistry } from "./registry"

/**
 * Placeholder regex: matches {{widget:id}} in RichPrompt.text
 */
const PLACEHOLDER_REGEX = /\{\{widget:([^}]+)\}\}/g

/**
 * Serialize a RichPrompt into a SerializedPrompt with both
 * human-readable text and structured data.
 */
export function serialize(
  prompt: RichPrompt,
  registry: WidgetRegistry = defaultRegistry
): SerializedPrompt {
  const widgetMap = new Map(prompt.widgets.map((w) => [w.id, w]))

  // Build human-readable version
  const humanReadable = prompt.text.replace(
    PLACEHOLDER_REGEX,
    (_match, id: string) => {
      const widget = widgetMap.get(id)
      if (!widget) return `[unknown widget: ${id}]`

      const def = registry.get(widget.type)
      if (def) {
        return def.humanReadable(widget)
      }

      // Fallback for unregistered widgets
      return `[${widget.type}: ${JSON.stringify(widget.value)}]`
    }
  )

  return {
    humanReadable,
    structured: prompt,
  }
}

/**
 * Serialize a RichPrompt back to the raw text token format.
 * This is the inverse of parse() — goes from RichPrompt back to
 * "Make {{color:value=#3B82F6}} button" format.
 */
export function serializeToTokens(
  prompt: RichPrompt,
  registry: WidgetRegistry = defaultRegistry
): string {
  const widgetMap = new Map(prompt.widgets.map((w) => [w.id, w]))

  return prompt.text.replace(
    PLACEHOLDER_REGEX,
    (_match, id: string) => {
      const widget = widgetMap.get(id)
      if (!widget) return `{{unknown:id=${id}}}`

      const def = registry.get(widget.type)
      if (def) {
        const serialized = def.serialize(widget)
        return `{{${widget.type}:${serialized}}}`
      }

      // Fallback: serialize meta as key=value pairs
      const params = Object.entries(widget.meta)
        .map(([k, v]) => `${k}=${v}`)
        .join(",")
      return `{{${widget.type}:${params}}}`
    }
  )
}

/**
 * Serialize a single widget to its token string representation.
 */
export function serializeWidget(
  widget: Widget,
  registry: WidgetRegistry = defaultRegistry
): string {
  const def = registry.get(widget.type)
  if (def) {
    const serialized = def.serialize(widget)
    return `{{${widget.type}:${serialized}}}`
  }

  const params = Object.entries(widget.meta)
    .map(([k, v]) => `${k}=${v}`)
    .join(",")
  return `{{${widget.type}:${params}}}`
}

/**
 * Convert a RichPrompt to a plain string that an AI can understand.
 * Uses human-readable representations with structured hints.
 */
export function serializeForAI(
  prompt: RichPrompt,
  registry: WidgetRegistry = defaultRegistry
): string {
  const serialized = serialize(prompt, registry)

  // Build a context block with widget details
  const widgetDetails = prompt.widgets
    .map((w) => {
      const def = registry.get(w.type)
      const readable = def ? def.humanReadable(w) : JSON.stringify(w.value)
      return `  - ${w.type} (${w.id}): ${readable}`
    })
    .join("\n")

  return [
    serialized.humanReadable,
    "",
    "--- Widget Details ---",
    widgetDetails,
  ].join("\n")
}
