import type { WidgetDefinition, WidgetCategory, WidgetPack } from "@promptkit/protocol"

/**
 * Global widget registry.
 * Holds all registered widget definitions, allows lookup by type or category.
 */
export class WidgetRegistry {
  private definitions = new Map<string, WidgetDefinition>()
  private packs = new Map<string, WidgetPack>()

  /** Register a single widget definition */
  register(def: WidgetDefinition): void {
    if (this.definitions.has(def.type)) {
      console.warn(`[PromptKit] Widget type "${def.type}" is already registered. Overwriting.`)
    }
    this.definitions.set(def.type, def)
  }

  /** Unregister a widget type */
  unregister(type: string): boolean {
    return this.definitions.delete(type)
  }

  /** Get a widget definition by type */
  get(type: string): WidgetDefinition | null {
    return this.definitions.get(type) ?? null
  }

  /** Check if a type is registered */
  has(type: string): boolean {
    return this.definitions.has(type)
  }

  /** List all registered definitions, optionally filtered by category */
  list(category?: WidgetCategory): WidgetDefinition[] {
    const all = Array.from(this.definitions.values())
    if (!category) return all
    return all.filter((d) => d.category === category)
  }

  /** Load all widgets from a pack */
  loadPack(pack: WidgetPack): void {
    this.packs.set(pack.name, pack)
    for (const widget of pack.widgets) {
      this.register(widget)
    }
  }

  /** Unload a pack and remove its widgets */
  unloadPack(packName: string): void {
    const pack = this.packs.get(packName)
    if (!pack) return
    for (const widget of pack.widgets) {
      this.unregister(widget.type)
    }
    this.packs.delete(packName)
  }

  /** List loaded packs */
  listPacks(): WidgetPack[] {
    return Array.from(this.packs.values())
  }

  /** Get count of registered widgets */
  get size(): number {
    return this.definitions.size
  }

  /** Clear all registered widgets and packs */
  clear(): void {
    this.definitions.clear()
    this.packs.clear()
  }
}

/** Default singleton registry */
export const defaultRegistry = new WidgetRegistry()
