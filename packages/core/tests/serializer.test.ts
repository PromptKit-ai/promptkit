import { describe, it, expect, beforeEach } from "vitest"
import { parse } from "../src/parser"
import { serialize, serializeToTokens, serializeWidget } from "../src/serializer"
import { WidgetRegistry } from "../src/registry"
import { essentialsPack } from "@promptkit/widget-pack-essentials"

describe("serialize", () => {
  let registry: WidgetRegistry

  beforeEach(() => {
    registry = new WidgetRegistry()
    registry.loadPack(essentialsPack)
  })

  it("produces human-readable output", () => {
    const prompt = parse("Make {{color:value=#EF4444}} button", registry)
    const result = serialize(prompt, registry)

    expect(result.humanReadable).toContain("#EF4444")
    expect(result.humanReadable).toContain("🎨")
    expect(result.humanReadable).not.toContain("{{widget:")
    expect(result.structured).toBe(prompt)
  })

  it("serializes multiple widgets", () => {
    const prompt = parse(
      "{{color:value=#3B82F6}} with {{opacity:value=80}}",
      registry
    )
    const result = serialize(prompt, registry)

    expect(result.humanReadable).toContain("#3B82F6")
    expect(result.humanReadable).toContain("80%")
  })
})

describe("serializeToTokens", () => {
  let registry: WidgetRegistry

  beforeEach(() => {
    registry = new WidgetRegistry()
    registry.loadPack(essentialsPack)
  })

  it("round-trips parse → serializeToTokens", () => {
    const input = "Make {{color:value=#EF4444}} button"
    const prompt = parse(input, registry)
    const output = serializeToTokens(prompt, registry)

    // Should contain the widget token format
    expect(output).toContain("{{color:")
    expect(output).toContain("#EF4444")
    expect(output).toContain("Make")
    expect(output).toContain("button")
  })
})

describe("serializeWidget", () => {
  let registry: WidgetRegistry

  beforeEach(() => {
    registry = new WidgetRegistry()
    registry.loadPack(essentialsPack)
  })

  it("serializes a single widget to token", () => {
    const prompt = parse("{{opacity:value=50}}", registry)
    const token = serializeWidget(prompt.widgets[0], registry)

    expect(token).toBe("{{opacity:value=50}}")
  })
})
