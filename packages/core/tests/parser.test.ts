import { describe, it, expect, beforeEach } from "vitest"
import { parse, extractTokens, parseWidgetParams } from "../src/parser"
import { WidgetRegistry } from "../src/registry"
import { essentialsPack } from "@promptkit/widget-pack-essentials"

describe("parseWidgetParams", () => {
  it("parses simple key=value pairs", () => {
    expect(parseWidgetParams("value=#3B82F6,label=Blue")).toEqual({
      value: "#3B82F6",
      label: "Blue",
    })
  })

  it("handles bare value", () => {
    expect(parseWidgetParams("hello")).toEqual({ value: "hello" })
  })

  it("handles empty string", () => {
    expect(parseWidgetParams("")).toEqual({})
  })
})

describe("extractTokens", () => {
  it("extracts tokens from text", () => {
    const text = "Make {{color:value=#EF4444}} button with {{radius:value=12,unit=px}} corners"
    const tokens = extractTokens(text)

    expect(tokens).toHaveLength(2)
    expect(tokens[0].type).toBe("color")
    expect(tokens[0].params.value).toBe("#EF4444")
    expect(tokens[1].type).toBe("radius")
    expect(tokens[1].params.value).toBe("12")
    expect(tokens[1].params.unit).toBe("px")
  })

  it("handles text with no tokens", () => {
    expect(extractTokens("just plain text")).toEqual([])
  })

  it("handles type-only tokens", () => {
    const tokens = extractTokens("add {{toggle}}")
    expect(tokens).toHaveLength(1)
    expect(tokens[0].type).toBe("toggle")
    expect(tokens[0].params).toEqual({})
  })
})

describe("parse", () => {
  let registry: WidgetRegistry

  beforeEach(() => {
    registry = new WidgetRegistry()
    registry.loadPack(essentialsPack)
  })

  it("parses text with registered widgets", () => {
    const result = parse(
      "Make {{color:value=#EF4444}} button",
      registry
    )

    expect(result.version).toBe("1.0")
    expect(result.widgets).toHaveLength(1)
    expect(result.widgets[0].type).toBe("color")
    expect(result.widgets[0].value).toEqual({ hex: "#EF4444" })
    expect(result.text).toContain("{{widget:")
    expect(result.text).not.toContain("{{color:")
  })

  it("parses multiple widgets", () => {
    const result = parse(
      "{{color:value=#3B82F6}} button with {{radius:value=12,unit=px}} and {{opacity:value=80}}",
      registry
    )

    expect(result.widgets).toHaveLength(3)
    expect(result.widgets[0].type).toBe("color")
    expect(result.widgets[1].type).toBe("radius")
    expect(result.widgets[2].type).toBe("opacity")
  })

  it("handles unknown widget types gracefully", () => {
    const result = parse("use {{unknown:foo=bar}} here", registry)

    expect(result.widgets).toHaveLength(1)
    expect(result.widgets[0].type).toBe("unknown")
    expect(result.widgets[0].meta).toEqual({ foo: "bar" })
  })

  it("preserves plain text around widgets", () => {
    const result = parse("before {{color:value=#000}} after", registry)
    const parts = result.text.split("{{widget:")
    expect(parts[0]).toBe("before ")
    expect(parts[1]).toContain("}} after")
  })
})
