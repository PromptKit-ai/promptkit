import { describe, it, expect, beforeEach } from "vitest"
import { WidgetRegistry } from "../src/registry"
import { essentialsPack, colorWidget, toggleWidget } from "@promptkit/widget-pack-essentials"
import type { WidgetDefinition } from "@promptkit/protocol"

describe("WidgetRegistry", () => {
  let registry: WidgetRegistry

  beforeEach(() => {
    registry = new WidgetRegistry()
  })

  it("registers and retrieves a widget definition", () => {
    registry.register(colorWidget as WidgetDefinition)
    expect(registry.get("color")).toBeTruthy()
    expect(registry.get("color")!.type).toBe("color")
  })

  it("returns null for unregistered types", () => {
    expect(registry.get("nonexistent")).toBeNull()
  })

  it("has() checks registration", () => {
    expect(registry.has("color")).toBe(false)
    registry.register(colorWidget as WidgetDefinition)
    expect(registry.has("color")).toBe(true)
  })

  it("lists all registered widgets", () => {
    registry.register(colorWidget as WidgetDefinition)
    registry.register(toggleWidget as WidgetDefinition)
    expect(registry.list()).toHaveLength(2)
  })

  it("filters by category", () => {
    registry.register(colorWidget as WidgetDefinition)
    registry.register(toggleWidget as WidgetDefinition)
    expect(registry.list("color")).toHaveLength(1)
    expect(registry.list("logic")).toHaveLength(1)
    expect(registry.list("effects")).toHaveLength(0)
  })

  it("loads a full pack", () => {
    registry.loadPack(essentialsPack)
    expect(registry.size).toBe(47)
    expect(registry.has("color")).toBe(true)
    expect(registry.has("animation")).toBe(true)
    expect(registry.has("opacity")).toBe(true)
  })

  it("unloads a pack", () => {
    registry.loadPack(essentialsPack)
    expect(registry.size).toBe(47)
    registry.unloadPack("essentials")
    expect(registry.size).toBe(0)
  })

  it("lists loaded packs", () => {
    registry.loadPack(essentialsPack)
    expect(registry.listPacks()).toHaveLength(1)
    expect(registry.listPacks()[0].name).toBe("essentials")
  })

  it("clears everything", () => {
    registry.loadPack(essentialsPack)
    registry.clear()
    expect(registry.size).toBe(0)
    expect(registry.listPacks()).toHaveLength(0)
  })
})
