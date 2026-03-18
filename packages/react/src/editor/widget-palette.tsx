import { useState, useCallback } from "react"
import { usePromptKit } from "../context/promptkit-provider"
import type { WidgetCategory, WidgetDefinition } from "@promptkit/protocol"

interface WidgetPaletteProps {
  /** Called when a widget type is selected from the palette */
  onSelect: (widgetType: string) => void
  /** Palette layout */
  position?: "left" | "bottom"
  /** Additional className */
  className?: string
}

const categoryLabels: Partial<Record<WidgetCategory, { label: string; icon: string }>> = {
  color: { label: "Color", icon: "🎨" },
  typography: { label: "Type", icon: "Aa" },
  spacing: { label: "Space", icon: "↔" },
  layout: { label: "Layout", icon: "📐" },
  effects: { label: "Effects", icon: "✦" },
  components: { label: "UI", icon: "🧩" },
  logic: { label: "Logic", icon: "🔀" },
  design: { label: "Design", icon: "🎨" },
  animation: { label: "Animate", icon: "🎬" },
  asset: { label: "Assets", icon: "🖼️" },
  "project-ref": { label: "Project", icon: "📁" },
}

export function WidgetPalette({
  onSelect,
  position = "left",
  className = "",
}: WidgetPaletteProps) {
  const { listWidgets, categories } = usePromptKit()
  const [activeCategory, setActiveCategory] = useState<WidgetCategory | null>(
    categories[0] ?? null
  )
  const [search, setSearch] = useState("")

  const allWidgets = listWidgets()
  const filteredWidgets = allWidgets.filter((w) => {
    const matchesCategory = !activeCategory || w.category === activeCategory
    const matchesSearch =
      !search ||
      w.type.toLowerCase().includes(search.toLowerCase()) ||
      (w.defaultDisplay.label?.toLowerCase().includes(search.toLowerCase()) ?? false)
    return matchesCategory && matchesSearch
  })

  const isVertical = position === "left"

  return (
    <div
      className={`pk-palette ${className}`}
      style={{
        display: "flex",
        flexDirection: isVertical ? "column" : "row",
        gap: "8px",
        padding: "12px",
        borderRadius: "12px",
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.03)",
        width: isVertical ? "200px" : "100%",
        maxHeight: isVertical ? "400px" : "auto",
        overflow: "auto",
      }}
    >
      {/* Header */}
      <div style={{ fontSize: "12px", fontWeight: 600, opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        Widgets
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        style={{
          padding: "6px 10px",
          borderRadius: "8px",
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.05)",
          color: "inherit",
          fontSize: "12px",
          outline: "none",
          width: "100%",
        }}
      />

      {/* Category tabs */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "4px",
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            style={{
              padding: "4px 8px",
              borderRadius: "6px",
              border: "none",
              background:
                activeCategory === cat
                  ? "rgba(59,130,246,0.2)"
                  : "rgba(255,255,255,0.05)",
              color: "inherit",
              fontSize: "11px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "3px",
              transition: "background 0.1s",
            }}
          >
            <span>{categoryLabels[cat]?.icon ?? "📦"}</span>
            <span>{categoryLabels[cat]?.label ?? cat}</span>
          </button>
        ))}
      </div>

      {/* Widget list */}
      <div
        style={{
          display: "flex",
          flexDirection: isVertical ? "column" : "row",
          flexWrap: isVertical ? "nowrap" : "wrap",
          gap: "4px",
          overflow: "auto",
        }}
      >
        {filteredWidgets.map((def) => (
          <button
            key={def.type}
            type="button"
            onClick={() => onSelect(def.type)}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("promptkit/widget-type", def.type)
              e.dataTransfer.effectAllowed = "copy"
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 10px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
              color: "inherit",
              cursor: "grab",
              fontSize: "13px",
              textAlign: "left",
              width: isVertical ? "100%" : "auto",
              transition: "background 0.1s, border-color 0.1s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.08)"
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.03)"
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"
            }}
          >
            <span style={{ fontSize: "14px" }}>{def.defaultDisplay.preview ?? "📦"}</span>
            <span style={{ fontSize: "12px" }}>{def.defaultDisplay.label ?? def.type}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
