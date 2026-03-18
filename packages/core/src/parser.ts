import type { Widget, RichPrompt } from "@promptkit/protocol"
import type { WidgetRegistry } from "./registry"
import { defaultRegistry } from "./registry"

/**
 * Widget token regex: matches {{type:key=value,key2=value2}}
 * Captures: type, params string
 */
const WIDGET_TOKEN_REGEX = /\{\{(\w[\w-]*?)(?::([^}]*))?\}\}/g

/**
 * Parse a key=value,key2=value2 params string into a Record
 */
function parseParams(raw: string): Record<string, string> {
  const params: Record<string, string> = {}
  if (!raw) return params

  // Handle values that might contain commas within nested configs
  let current = ""
  let depth = 0
  const pairs: string[] = []

  for (const char of raw) {
    if (char === "{") depth++
    if (char === "}") depth--
    if (char === "," && depth === 0) {
      pairs.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }
  if (current.trim()) pairs.push(current.trim())

  for (const pair of pairs) {
    const eqIndex = pair.indexOf("=")
    if (eqIndex === -1) {
      // Bare value — treat as "value" key
      params.value = pair
    } else {
      const key = pair.slice(0, eqIndex).trim()
      const val = pair.slice(eqIndex + 1).trim()
      params[key] = val
    }
  }

  return params
}

let idCounter = 0

/** Generate a unique widget ID */
function generateId(): string {
  return `w_${Date.now().toString(36)}_${(idCounter++).toString(36)}`
}

/**
 * Parse a text string containing widget tokens into a RichPrompt.
 *
 * Input:  "Make {{color:value=#3B82F6}} button with {{slider:type=border-radius,value=12,unit=px}}"
 * Output: RichPrompt with text containing {{widget:id}} placeholders and corresponding Widget objects
 */
export function parse(
  input: string,
  registry: WidgetRegistry = defaultRegistry
): RichPrompt {
  const widgets: Widget[] = []
  let text = input

  // Find all widget tokens and replace with ID placeholders
  text = input.replace(WIDGET_TOKEN_REGEX, (match, type: string, paramsStr: string) => {
    const def = registry.get(type)
    const params = parseParams(paramsStr || "")
    const id = generateId()

    if (def) {
      // Use the definition's deserializer to build the widget
      const partial = def.deserialize(params)
      const widget: Widget = {
        id,
        type,
        category: partial.category ?? def.category,
        value: partial.value ?? def.defaultValue,
        meta: { ...def.defaultMeta, ...(partial.meta ?? {}) },
        display: { ...def.defaultDisplay, ...(partial.display ?? {}) },
      }
      widgets.push(widget)
    } else {
      // Unknown widget type — create a generic widget from params
      const widget: Widget = {
        id,
        type,
        category: "design",
        value: params.value ?? null,
        meta: params,
        display: { label: type, inline: true },
      }
      widgets.push(widget)
    }

    return `{{widget:${id}}}`
  })

  return {
    version: "1.0",
    text,
    widgets,
  }
}

/**
 * Parse params string from a widget token without full parsing.
 * Useful for quick extraction.
 */
export function parseWidgetParams(paramsStr: string): Record<string, string> {
  return parseParams(paramsStr)
}

/**
 * Extract raw widget tokens from text without parsing into RichPrompt.
 * Returns array of { type, params, raw } for each token found.
 */
export function extractTokens(
  input: string
): Array<{ type: string; params: Record<string, string>; raw: string }> {
  const tokens: Array<{ type: string; params: Record<string, string>; raw: string }> = []
  let match: RegExpExecArray | null

  const regex = new RegExp(WIDGET_TOKEN_REGEX.source, "g")
  while ((match = regex.exec(input)) !== null) {
    tokens.push({
      type: match[1],
      params: parseParams(match[2] || ""),
      raw: match[0],
    })
  }

  return tokens
}
