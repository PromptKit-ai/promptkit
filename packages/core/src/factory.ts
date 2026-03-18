import type { Widget, WidgetCategory, WidgetDisplay } from "@promptkit/protocol"
import type { WidgetRegistry } from "./registry"
import { defaultRegistry } from "./registry"

let factoryCounter = 0

function generateId(): string {
  return `w_${Date.now().toString(36)}_${(factoryCounter++).toString(36)}`
}

/**
 * Create a widget instance from a registered type with optional overrides.
 */
export function createWidget<T = unknown>(
  type: string,
  overrides: Partial<{
    value: T
    meta: Record<string, unknown>
    display: Partial<WidgetDisplay>
  }> = {},
  registry: WidgetRegistry = defaultRegistry
): Widget<T> {
  const def = registry.get(type)

  if (def) {
    return {
      id: generateId(),
      type,
      category: def.category,
      value: (overrides.value ?? def.defaultValue) as T,
      meta: { ...def.defaultMeta, ...(overrides.meta ?? {}) },
      display: { ...def.defaultDisplay, ...(overrides.display ?? {}) },
    }
  }

  // Fallback for unregistered types
  return {
    id: generateId(),
    type,
    category: "design" as WidgetCategory,
    value: (overrides.value ?? null) as T,
    meta: overrides.meta ?? {},
    display: {
      label: type,
      inline: true,
      ...(overrides.display ?? {}),
    },
  }
}

/**
 * Clone a widget with a new ID and optional value override.
 */
export function cloneWidget<T = unknown>(
  widget: Widget<T>,
  valueOverride?: T
): Widget<T> {
  return {
    ...widget,
    id: generateId(),
    value: valueOverride ?? widget.value,
    meta: { ...widget.meta },
    display: { ...widget.display },
  }
}

/**
 * Update a widget's value immutably.
 */
export function updateWidgetValue<T>(
  widget: Widget<T>,
  newValue: T
): Widget<T> {
  return { ...widget, value: newValue }
}
