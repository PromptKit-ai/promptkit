import React from "react"
import { Text, Box } from "ink"
import type { Widget } from "@promptkit/protocol"
import { widgetColors } from "../colors.js"

interface WidgetEditorProps {
  widget: Widget
  onChange: (value: unknown) => void
}

/** Numeric-style widgets: show a slider bar in the terminal */
function NumericBar({ value, min, max, color, width = 20 }: { value: number; min: number; max: number; color: string; width?: number }) {
  const ratio = Math.max(0, Math.min(1, (value - min) / (max - min)))
  const filled = Math.round(ratio * width)
  const empty = width - filled
  return (
    <Text>
      <Text color={color}>{"━".repeat(filled)}</Text>
      <Text color={color} bold>●</Text>
      <Text color="#3F3F46">{"━".repeat(empty)}</Text>
    </Text>
  )
}

export function WidgetEditor({ widget, onChange }: WidgetEditorProps) {
  const color = widgetColors[widget.type] || "#A1A1AA"
  const v = widget.value as any

  switch (widget.type) {
    case "color": {
      return (
        <Box flexDirection="column" gap={0}>
          <Text color={color} bold>  Color  </Text>
          <Text>  <Text backgroundColor={v.hex}>{"     "}</Text>  <Text dimColor>{v.hex}</Text></Text>
          <Text dimColor>  ← → change hue  │  ↑ ↓ brightness</Text>
        </Box>
      )
    }

    case "spacing":
    case "radius":
    case "font-size":
    case "blur":
    case "grid-columns": {
      const configs: Record<string, { min: number; max: number; step: number; unit: string }> = {
        spacing: { min: 0, max: 96, step: 4, unit: "px" },
        radius: { min: 0, max: 50, step: 2, unit: "px" },
        "font-size": { min: 8, max: 96, step: 2, unit: "px" },
        blur: { min: 0, max: 20, step: 1, unit: "px" },
        "grid-columns": { min: 1, max: 12, step: 1, unit: "" },
      }
      const c = configs[widget.type]!
      return (
        <Box flexDirection="column" gap={0}>
          <Text color={color} bold>  {widget.display.label}  <Text color="white">{v.value}{c.unit}</Text></Text>
          <Text>  <NumericBar value={v.value} min={c.min} max={c.max} color={color} /></Text>
          <Text dimColor>  ← → adjust value ({c.step > 1 ? `±${c.step}` : "±1"})</Text>
        </Box>
      )
    }

    case "opacity": {
      return (
        <Box flexDirection="column" gap={0}>
          <Text color={color} bold>  Opacity  <Text color="white">{v.value}%</Text></Text>
          <Text>  <NumericBar value={v.value} min={0} max={100} color={color} /></Text>
          <Text dimColor>  ← → adjust (±5%)</Text>
        </Box>
      )
    }

    case "slider": {
      return (
        <Box flexDirection="column" gap={0}>
          <Text color={color} bold>  Value  <Text color="white">{v}</Text></Text>
          <Text>  <NumericBar value={v as number} min={0} max={100} color={color} /></Text>
          <Text dimColor>  ← → adjust (±1)</Text>
        </Box>
      )
    }

    case "toggle": {
      return (
        <Box flexDirection="column" gap={0}>
          <Text color={color} bold>  {v.key}</Text>
          <Text>  {v.enabled
            ? <Text color="#22C55E" bold>◉ ON </Text>
            : <Text color="#71717A">○ OFF</Text>
          }</Text>
          <Text dimColor>  Space to toggle</Text>
        </Box>
      )
    }

    case "font-family": {
      const fonts = ["Inter", "Roboto", "Poppins", "Montserrat", "Playfair Display", "Fira Code", "JetBrains Mono", "Space Grotesk", "DM Sans", "Geist"]
      const idx = fonts.indexOf(v.family)
      return (
        <Box flexDirection="column" gap={0}>
          <Text color={color} bold>  Font  <Text color="white">{v.family}</Text></Text>
          <Text dimColor>  ↑ ↓ cycle ({idx + 1}/{fonts.length})</Text>
        </Box>
      )
    }

    case "font-weight": {
      const weights = [100, 200, 300, 400, 500, 600, 700, 800, 900]
      const labels: Record<number, string> = { 100: "Thin", 200: "XLight", 300: "Light", 400: "Regular", 500: "Medium", 600: "SemiBold", 700: "Bold", 800: "XBold", 900: "Black" }
      const idx = weights.indexOf(v.value)
      return (
        <Box flexDirection="column" gap={0}>
          <Text color={color} bold>  Weight  <Text color="white">{labels[v.value] || v.value}</Text></Text>
          <Text>  <NumericBar value={v.value} min={100} max={900} color={color} /></Text>
          <Text dimColor>  ← → adjust ({idx + 1}/{weights.length})</Text>
        </Box>
      )
    }

    case "animation": {
      const anims = ["bounce", "fade-in", "slide-up", "scale-in", "spring", "spin", "pulse", "elastic"]
      const idx = anims.indexOf(v.name)
      return (
        <Box flexDirection="column" gap={0}>
          <Text color={color} bold>  Animation  <Text color="white">{v.name}</Text></Text>
          <Text dimColor>  ↑ ↓ cycle ({idx + 1}/{anims.length})</Text>
        </Box>
      )
    }

    case "shadow": {
      const presets = ["none", "sm", "md", "lg", "xl", "2xl"]
      const idx = presets.indexOf(v.preset)
      return (
        <Box flexDirection="column" gap={0}>
          <Text color={color} bold>  Shadow  <Text color="white">{v.preset}</Text></Text>
          <Text dimColor>  ↑ ↓ cycle ({idx + 1}/{presets.length})</Text>
        </Box>
      )
    }

    case "text-align": {
      const aligns = ["left", "center", "right", "justify"]
      const icons: Record<string, string> = { left: "◧", center: "◫", right: "◨", justify: "☰" }
      return (
        <Box flexDirection="column" gap={0}>
          <Text color={color} bold>  Align  <Text color="white">{icons[v.value]} {v.value}</Text></Text>
          <Text dimColor>  ← → cycle ({aligns.indexOf(v.value) + 1}/{aligns.length})</Text>
        </Box>
      )
    }

    case "gradient": {
      return (
        <Box flexDirection="column" gap={0}>
          <Text color={color} bold>  Gradient</Text>
          <Text>  <Text backgroundColor={v.from}>{"  "}</Text><Text> → </Text><Text backgroundColor={v.to}>{"  "}</Text>  <Text dimColor>{v.direction}</Text></Text>
          <Text dimColor>  ← → direction  │  ↑ ↓ swap colors</Text>
        </Box>
      )
    }

    case "line-height": {
      const options = ["tight", "snug", "normal", "relaxed", "loose"]
      const idx = options.indexOf(v.label)
      return (
        <Box flexDirection="column" gap={0}>
          <Text color={color} bold>  Line Height  <Text color="white">{v.label} ({v.value})</Text></Text>
          <Text dimColor>  ↑ ↓ cycle ({idx + 1}/{options.length})</Text>
        </Box>
      )
    }

    case "letter-spacing": {
      const options = ["tighter", "tight", "normal", "wide", "wider", "widest"]
      const idx = options.indexOf(v.label)
      return (
        <Box flexDirection="column" gap={0}>
          <Text color={color} bold>  Tracking  <Text color="white">{v.label} ({v.value}em)</Text></Text>
          <Text dimColor>  ↑ ↓ cycle ({idx + 1}/{options.length})</Text>
        </Box>
      )
    }

    case "border": {
      const styles = ["none", "solid", "dashed", "dotted"]
      const idx = styles.indexOf(v.style)
      return (
        <Box flexDirection="column" gap={0}>
          <Text color={color} bold>  Border  <Text color="white">{v.width}px {v.style}</Text></Text>
          <Text dimColor>  ← → width  │  ↑ ↓ style ({idx + 1}/{styles.length})</Text>
        </Box>
      )
    }

    case "breakpoint": {
      const bps = ["sm", "md", "lg", "xl"]
      const idx = bps.indexOf(v.name)
      return (
        <Box flexDirection="column" gap={0}>
          <Text color={color} bold>  Breakpoint  <Text color="white">{v.name} ({v.width}px)</Text></Text>
          <Text dimColor>  ↑ ↓ cycle ({idx + 1}/{bps.length})</Text>
        </Box>
      )
    }

    default:
      return <Text dimColor>  No editor for {widget.type}</Text>
  }
}
