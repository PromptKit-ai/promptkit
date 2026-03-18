import React from "react"
import { Text, Box } from "ink"
import type { Widget } from "@promptkit/protocol"
import { widgetColors } from "../colors.js"

interface WidgetChipProps {
  widget: Widget
  selected: boolean
}

/** Get display text for a widget value */
function getLabel(widget: Widget): string {
  const v = widget.value as any
  switch (widget.type) {
    case "color": return v.hex
    case "slider": return `${v}`
    case "toggle": return `${v.key}: ${v.enabled ? "ON" : "OFF"}`
    case "select": return v.selected || v.key
    case "spacing": return `${v.value}${v.unit}`
    case "radius": return `${v.value}${v.unit}`
    case "font-size": return `${v.value}${v.unit}`
    case "font-family": return v.family
    case "shadow": return `shadow-${v.preset}`
    case "animation": return v.name
    case "breakpoint": return `${v.name} (${v.width}px)`
    case "opacity": return `${v.value}%`
    case "gradient": return `${v.from} → ${v.to}`
    case "font-weight": {
      const labels: Record<number, string> = { 100: "Thin", 200: "XLight", 300: "Light", 400: "Regular", 500: "Medium", 600: "SemiBold", 700: "Bold", 800: "XBold", 900: "Black" }
      return labels[v.value] || `${v.value}`
    }
    case "text-align": return v.value
    case "grid-columns": return `${v.value} cols`
    case "blur": return `${v.value}px`
    case "border": return `${v.width}px ${v.style}`
    case "line-height": return v.label
    case "letter-spacing": return v.label
    default: return widget.type
  }
}

function getIcon(widget: Widget): string {
  const v = widget.value as any
  switch (widget.type) {
    case "color": return "●"
    case "slider": return "━"
    case "toggle": return v.enabled ? "◉" : "○"
    case "select": return "▾"
    case "spacing": return "↔"
    case "radius": return "◐"
    case "font-size": return "Aa"
    case "font-family": return "𝔉"
    case "shadow": return "◕"
    case "animation": return "▸"
    case "breakpoint": return "📱"
    case "opacity": return "◑"
    case "gradient": return "◆"
    case "font-weight": return "B"
    case "text-align": {
      const icons: Record<string, string> = { left: "◧", center: "◫", right: "◨", justify: "☰" }
      return icons[v.value] || "≡"
    }
    case "grid-columns": return "▥"
    case "blur": return "◉"
    case "border": return "▢"
    case "line-height": return "¶"
    case "letter-spacing": return "AV"
    default: return "◆"
  }
}

export function WidgetChip({ widget, selected }: WidgetChipProps) {
  const color = widgetColors[widget.type] || "#A1A1AA"
  const icon = getIcon(widget)
  const label = getLabel(widget)

  return (
    <Box>
      <Text color={selected ? "#09090B" : undefined} backgroundColor={selected ? color : undefined}>
        {selected ? " " : ""}
      </Text>
      <Text
        color={selected ? "#09090B" : color}
        backgroundColor={selected ? color : undefined}
        bold={selected}
      >
        {icon} {label}
      </Text>
      <Text color={selected ? "#09090B" : undefined} backgroundColor={selected ? color : undefined}>
        {selected ? " " : ""}
      </Text>
      {!selected && (
        <Text color={color} dimColor> </Text>
      )}
    </Box>
  )
}
