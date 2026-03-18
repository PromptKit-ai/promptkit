import type { Widget, RichPrompt } from "@promptkit/protocol"
import type { WidgetRegistry } from "./registry"
import { defaultRegistry } from "./registry"
import { createWidget } from "./factory"

/**
 * Fluent builder for constructing rich prompts programmatically.
 *
 * Usage:
 *   const prompt = new PromptBuilder(registry)
 *     .text("Make the button ")
 *     .widget("color", { value: { hex: "#3B82F6" } })
 *     .text(" with ")
 *     .widget("radius", { value: { value: 12, unit: "px" } })
 *     .text(" border radius")
 *     .build()
 */
export class PromptBuilder {
  private parts: Array<{ type: "text"; content: string } | { type: "widget"; widget: Widget }> = []
  private registry: WidgetRegistry

  constructor(registry: WidgetRegistry = defaultRegistry) {
    this.registry = registry
  }

  /** Append plain text */
  text(content: string): this {
    this.parts.push({ type: "text", content })
    return this
  }

  /** Append a widget by type with optional overrides */
  widget<T = unknown>(
    type: string,
    overrides?: Partial<{ value: T; meta: Record<string, unknown> }>
  ): this {
    const w = createWidget(type, overrides, this.registry)
    this.parts.push({ type: "widget", widget: w })
    return this
  }

  /** Append a pre-built widget instance */
  widgetInstance(widget: Widget): this {
    this.parts.push({ type: "widget", widget })
    return this
  }

  /** Build the RichPrompt */
  build(): RichPrompt {
    const widgets: Widget[] = []
    let text = ""

    for (const part of this.parts) {
      if (part.type === "text") {
        text += part.content
      } else {
        widgets.push(part.widget)
        text += `{{widget:${part.widget.id}}}`
      }
    }

    return {
      version: "1.0",
      text,
      widgets,
    }
  }

  /** Reset the builder */
  clear(): this {
    this.parts = []
    return this
  }
}
