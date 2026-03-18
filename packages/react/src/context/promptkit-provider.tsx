import { createContext, useContext, useMemo, useCallback, type ReactNode } from "react"
import {
  WidgetRegistry,
  type WidgetPack,
  type WidgetDefinition,
  type WidgetCategory,
} from "@promptkit/core"

interface PromptKitContextValue {
  registry: WidgetRegistry
  getWidget: (type: string) => WidgetDefinition | null
  listWidgets: (category?: WidgetCategory) => WidgetDefinition[]
  categories: WidgetCategory[]
}

const PromptKitContext = createContext<PromptKitContextValue | null>(null)

export interface PromptKitProviderProps {
  children: ReactNode
  /** Widget packs to load */
  packs?: WidgetPack[]
  /** Individual widget definitions to register */
  widgets?: WidgetDefinition[]
}

export function PromptKitProvider({
  children,
  packs = [],
  widgets = [],
}: PromptKitProviderProps) {
  const registry = useMemo(() => {
    const reg = new WidgetRegistry()
    for (const pack of packs) {
      reg.loadPack(pack)
    }
    for (const widget of widgets) {
      reg.register(widget)
    }
    return reg
  }, [packs, widgets])

  const getWidget = useCallback(
    (type: string) => registry.get(type),
    [registry]
  )

  const listWidgets = useCallback(
    (category?: WidgetCategory) => registry.list(category),
    [registry]
  )

  const categories = useMemo(() => {
    const cats = new Set(registry.list().map((w) => w.category))
    return Array.from(cats)
  }, [registry])

  const value = useMemo(
    () => ({ registry, getWidget, listWidgets, categories }),
    [registry, getWidget, listWidgets, categories]
  )

  return (
    <PromptKitContext.Provider value={value}>
      {children}
    </PromptKitContext.Provider>
  )
}

export function usePromptKit(): PromptKitContextValue {
  const ctx = useContext(PromptKitContext)
  if (!ctx) {
    throw new Error("usePromptKit must be used within a <PromptKitProvider>")
  }
  return ctx
}
