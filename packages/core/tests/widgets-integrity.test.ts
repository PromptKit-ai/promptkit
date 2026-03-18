import { describe, it, expect, beforeEach } from "vitest"
import { WidgetRegistry } from "../src/registry"
import { essentialsPack } from "@promptkit/widget-pack-essentials"
import type { WidgetDefinition, Widget } from "@promptkit/protocol"

describe("Widget Pack Integrity", () => {
  let registry: WidgetRegistry

  beforeEach(() => {
    registry = new WidgetRegistry()
    registry.loadPack(essentialsPack)
  })

  it("has 47 widgets", () => {
    expect(registry.size).toBe(47)
  })

  it("every widget has required fields in its definition", () => {
    for (const def of registry.list()) {
      expect(def.type, `${def.type} missing type`).toBeTruthy()
      expect(def.category, `${def.type} missing category`).toBeTruthy()
      expect(def.defaultDisplay, `${def.type} missing defaultDisplay`).toBeTruthy()
      expect(def.defaultDisplay.inline, `${def.type} missing inline`).toBe(true)
      expect(def.serialize, `${def.type} missing serialize`).toBeTypeOf("function")
      expect(def.deserialize, `${def.type} missing deserialize`).toBeTypeOf("function")
      expect(def.humanReadable, `${def.type} missing humanReadable`).toBeTypeOf("function")
    }
  })

  it("every widget can serialize and produce humanReadable with its default value", () => {
    for (const def of registry.list()) {
      const widget: Widget = {
        id: "test",
        type: def.type,
        category: def.category,
        value: def.defaultValue,
        meta: def.defaultMeta,
        display: def.defaultDisplay,
      }

      // serialize should not throw
      const serialized = def.serialize(widget as any)
      expect(serialized, `${def.type} serialize returned falsy`).toBeTruthy()

      // humanReadable should not throw
      const readable = def.humanReadable(widget as any)
      expect(readable, `${def.type} humanReadable returned falsy`).toBeTruthy()
    }
  })

  it("every widget can round-trip serialize → deserialize", () => {
    for (const def of registry.list()) {
      const widget: Widget = {
        id: "test",
        type: def.type,
        category: def.category,
        value: def.defaultValue,
        meta: def.defaultMeta,
        display: def.defaultDisplay,
      }

      const serialized = def.serialize(widget as any)
      // Parse the serialized string back to params
      const params: Record<string, string> = {}
      for (const pair of serialized.split(",")) {
        const eq = pair.indexOf("=")
        if (eq !== -1) {
          params[pair.slice(0, eq).trim()] = pair.slice(eq + 1).trim()
        }
      }

      // deserialize should not throw
      const result = def.deserialize(params)
      expect(result, `${def.type} deserialize returned falsy`).toBeTruthy()
      expect(result.value, `${def.type} deserialize returned no value`).toBeDefined()
    }
  })

  it("categories are all valid", () => {
    const validCategories = new Set([
      "color", "typography", "spacing", "layout", "effects", "components", "logic",
      "design", "animation", "asset", "project-ref",
    ])
    for (const def of registry.list()) {
      expect(
        validCategories.has(def.category),
        `${def.type} has invalid category: "${def.category}"`
      ).toBe(true)
    }
  })

  it("no duplicate types", () => {
    const types = registry.list().map((d) => d.type)
    const unique = new Set(types)
    expect(types.length).toBe(unique.size)
  })

  it("every widget has a display label and preview", () => {
    for (const def of registry.list()) {
      expect(
        def.defaultDisplay.label || def.defaultDisplay.preview,
        `${def.type} has no label or preview`
      ).toBeTruthy()
    }
  })
})
