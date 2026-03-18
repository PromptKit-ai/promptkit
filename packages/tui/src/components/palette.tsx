import React from "react"
import { Text, Box } from "ink"
import type { WidgetDefinition, WidgetCategory } from "@promptkit/protocol"
import { widgetColors } from "../colors.js"

interface PaletteProps {
  widgets: WidgetDefinition[]
  selectedIndex: number
  category: WidgetCategory | null
  categories: WidgetCategory[]
  onCategoryChange: (cat: WidgetCategory) => void
}

const catLabels: Record<string, { icon: string; label: string }> = {
  design: { icon: "🎨", label: "Design" },
  animation: { icon: "🎬", label: "Animate" },
  logic: { icon: "🔀", label: "Logic" },
  layout: { icon: "📐", label: "Layout" },
}

export function Palette({ widgets, selectedIndex, category, categories }: PaletteProps) {
  return (
    <Box flexDirection="column" borderStyle="round" borderColor="#3F3F46" paddingX={1}>
      {/* Category tabs */}
      <Box gap={1} marginBottom={1}>
        {categories.filter(c => catLabels[c]).map((cat) => (
          <Text
            key={cat}
            color={category === cat ? "white" : "#71717A"}
            bold={category === cat}
            underline={category === cat}
          >
            {catLabels[cat]?.icon} {catLabels[cat]?.label}
          </Text>
        ))}
        <Text dimColor>  (1-4 to switch)</Text>
      </Box>

      {/* Widget list */}
      <Box gap={1} flexWrap="wrap">
        {widgets.map((def, i) => {
          const color = widgetColors[def.type] || "#A1A1AA"
          const isSelected = i === selectedIndex
          return (
            <Text
              key={def.type}
              color={isSelected ? "#09090B" : color}
              backgroundColor={isSelected ? color : undefined}
              bold={isSelected}
            >
              {isSelected ? " " : ""}
              {def.defaultDisplay.preview ?? "◆"} {def.defaultDisplay.label ?? def.type}
              {isSelected ? " " : ""}
            </Text>
          )
        })}
      </Box>

      <Text dimColor>← → select  │  Enter to insert  │  Esc to close</Text>
    </Box>
  )
}
