import React, { useState, useCallback } from "react"
import { Text, Box, useInput, useApp } from "ink"
import TextInput from "ink-text-input"
import { WidgetRegistry, type WidgetCategory, type SerializedPrompt } from "@promptkit/core"
import { essentialsPack } from "@promptkit/widget-pack-essentials"
import { usePromptState } from "../use-prompt-state.js"
import { WidgetChip } from "./widget-chip.js"
import { WidgetEditor } from "./widget-editor.js"
import { Palette } from "./palette.js"
import { widgetColors } from "../colors.js"

type Mode = "text" | "widget" | "palette"

export function App() {
  const { exit } = useApp()

  // Registry
  const [registry] = useState(() => {
    const r = new WidgetRegistry()
    r.loadPack(essentialsPack)
    return r
  })

  // Prompt state
  const prompt = usePromptState(registry)

  // UI state
  const [mode, setMode] = useState<Mode>("text")
  const [paletteIndex, setPaletteIndex] = useState(0)
  const [paletteCategory, setPaletteCategory] = useState<WidgetCategory>("design")
  const [submitted, setSubmitted] = useState<SerializedPrompt | null>(null)

  const categories = Array.from(new Set(registry.list().map(w => w.category)))
  const paletteWidgets = registry.list(paletteCategory)

  // Handle keyboard input
  useInput((input, key) => {
    // Global: Ctrl+C to exit
    if (input === "c" && key.ctrl) {
      exit()
      return
    }

    // ==== PALETTE MODE ====
    if (mode === "palette") {
      if (key.escape) {
        setMode("text")
        return
      }
      if (key.leftArrow) {
        setPaletteIndex((i) => Math.max(0, i - 1))
        return
      }
      if (key.rightArrow) {
        setPaletteIndex((i) => Math.min(paletteWidgets.length - 1, i + 1))
        return
      }
      if (key.return) {
        const def = paletteWidgets[paletteIndex]
        if (def) {
          prompt.insertWidget(def.type)
          setMode("widget")
        }
        return
      }
      // 1-4 category switch
      const catKeys = categories.filter(c => ["design", "animation", "logic", "layout"].includes(c))
      const num = parseInt(input)
      if (num >= 1 && num <= catKeys.length) {
        setPaletteCategory(catKeys[num - 1])
        setPaletteIndex(0)
        return
      }
      return
    }

    // ==== WIDGET MODE ====
    if (mode === "widget") {
      if (key.escape) {
        prompt.deselect()
        setMode("text")
        return
      }
      if (key.tab) {
        prompt.selectNext()
        return
      }
      if (key.delete || key.backspace) {
        const idx = prompt.selectedWidgetIndex
        prompt.removeWidget(idx)
        if (prompt.widgets.length <= 1) {
          setMode("text")
        }
        return
      }

      // Widget-specific value editing
      const widget = prompt.widgets[prompt.selectedWidgetIndex]
      if (!widget) return
      const v = widget.value as any

      switch (widget.type) {
        case "spacing":
        case "radius":
        case "font-size":
        case "blur": {
          const steps: Record<string, number> = { spacing: 4, radius: 2, "font-size": 2, blur: 1 }
          const ranges: Record<string, [number, number]> = { spacing: [0, 96], radius: [0, 50], "font-size": [8, 96], blur: [0, 20] }
          const step = steps[widget.type]
          const [min, max] = ranges[widget.type]
          if (key.rightArrow || key.upArrow) {
            prompt.updateWidget(prompt.selectedWidgetIndex, { ...v, value: Math.min(max, v.value + step) })
          } else if (key.leftArrow || key.downArrow) {
            prompt.updateWidget(prompt.selectedWidgetIndex, { ...v, value: Math.max(min, v.value - step) })
          }
          return
        }

        case "grid-columns": {
          if (key.rightArrow || key.upArrow) {
            prompt.updateWidget(prompt.selectedWidgetIndex, { ...v, value: Math.min(12, v.value + 1) })
          } else if (key.leftArrow || key.downArrow) {
            prompt.updateWidget(prompt.selectedWidgetIndex, { ...v, value: Math.max(1, v.value - 1) })
          }
          return
        }

        case "opacity": {
          if (key.rightArrow || key.upArrow) {
            prompt.updateWidget(prompt.selectedWidgetIndex, { ...v, value: Math.min(100, v.value + 5) })
          } else if (key.leftArrow || key.downArrow) {
            prompt.updateWidget(prompt.selectedWidgetIndex, { ...v, value: Math.max(0, v.value - 5) })
          }
          return
        }

        case "slider": {
          if (key.rightArrow || key.upArrow) {
            prompt.updateWidget(prompt.selectedWidgetIndex, Math.min(100, (v as number) + 1))
          } else if (key.leftArrow || key.downArrow) {
            prompt.updateWidget(prompt.selectedWidgetIndex, Math.max(0, (v as number) - 1))
          }
          return
        }

        case "toggle": {
          if (input === " " || key.return) {
            prompt.updateWidget(prompt.selectedWidgetIndex, { ...v, enabled: !v.enabled })
          }
          return
        }

        case "font-family": {
          const fonts = ["Inter", "Roboto", "Poppins", "Montserrat", "Playfair Display", "Fira Code", "JetBrains Mono", "Space Grotesk", "DM Sans", "Geist"]
          const idx = fonts.indexOf(v.family)
          if (key.upArrow || key.rightArrow) {
            prompt.updateWidget(prompt.selectedWidgetIndex, { ...v, family: fonts[(idx + 1) % fonts.length] })
          } else if (key.downArrow || key.leftArrow) {
            prompt.updateWidget(prompt.selectedWidgetIndex, { ...v, family: fonts[(idx - 1 + fonts.length) % fonts.length] })
          }
          return
        }

        case "font-weight": {
          const weights = [100, 200, 300, 400, 500, 600, 700, 800, 900]
          const idx = weights.indexOf(v.value)
          if (key.rightArrow || key.upArrow) {
            prompt.updateWidget(prompt.selectedWidgetIndex, { value: weights[Math.min(weights.length - 1, idx + 1)] })
          } else if (key.leftArrow || key.downArrow) {
            prompt.updateWidget(prompt.selectedWidgetIndex, { value: weights[Math.max(0, idx - 1)] })
          }
          return
        }

        case "animation": {
          const anims = [
            { name: "bounce", duration: 500 }, { name: "fade-in", duration: 300 },
            { name: "slide-up", duration: 400 }, { name: "scale-in", duration: 300 },
            { name: "spring", duration: 600, config: { stiffness: 300, damping: 20 } },
            { name: "spin", duration: 1000 }, { name: "pulse", duration: 2000 },
            { name: "elastic", duration: 800, config: { stiffness: 200, damping: 10 } },
          ]
          const idx = anims.findIndex(a => a.name === v.name)
          if (key.upArrow || key.rightArrow) {
            prompt.updateWidget(prompt.selectedWidgetIndex, anims[(idx + 1) % anims.length])
          } else if (key.downArrow || key.leftArrow) {
            prompt.updateWidget(prompt.selectedWidgetIndex, anims[(idx - 1 + anims.length) % anims.length])
          }
          return
        }

        case "shadow": {
          const presets = ["none", "sm", "md", "lg", "xl", "2xl"] as const
          const idx = presets.indexOf(v.preset)
          if (key.upArrow || key.rightArrow) {
            prompt.updateWidget(prompt.selectedWidgetIndex, { preset: presets[Math.min(presets.length - 1, idx + 1)] })
          } else if (key.downArrow || key.leftArrow) {
            prompt.updateWidget(prompt.selectedWidgetIndex, { preset: presets[Math.max(0, idx - 1)] })
          }
          return
        }

        case "text-align": {
          const aligns = ["left", "center", "right", "justify"] as const
          const idx = aligns.indexOf(v.value)
          if (key.rightArrow || key.upArrow) {
            prompt.updateWidget(prompt.selectedWidgetIndex, { value: aligns[(idx + 1) % aligns.length] })
          } else if (key.leftArrow || key.downArrow) {
            prompt.updateWidget(prompt.selectedWidgetIndex, { value: aligns[(idx - 1 + aligns.length) % aligns.length] })
          }
          return
        }

        case "breakpoint": {
          const bps = [
            { name: "sm", width: 640 }, { name: "md", width: 768 },
            { name: "lg", width: 1024 }, { name: "xl", width: 1280 },
          ] as const
          const idx = bps.findIndex(b => b.name === v.name)
          if (key.upArrow || key.rightArrow) {
            const next = bps[Math.min(bps.length - 1, idx + 1)]
            prompt.updateWidget(prompt.selectedWidgetIndex, { name: next.name, width: next.width })
          } else if (key.downArrow || key.leftArrow) {
            const prev = bps[Math.max(0, idx - 1)]
            prompt.updateWidget(prompt.selectedWidgetIndex, { name: prev.name, width: prev.width })
          }
          return
        }

        case "gradient": {
          const dirs = ["to-r", "to-br", "to-b", "to-bl", "to-l", "to-tl", "to-t", "to-tr"] as const
          const idx = dirs.indexOf(v.direction)
          if (key.rightArrow) {
            prompt.updateWidget(prompt.selectedWidgetIndex, { ...v, direction: dirs[(idx + 1) % dirs.length] })
          } else if (key.leftArrow) {
            prompt.updateWidget(prompt.selectedWidgetIndex, { ...v, direction: dirs[(idx - 1 + dirs.length) % dirs.length] })
          } else if (key.upArrow || key.downArrow) {
            prompt.updateWidget(prompt.selectedWidgetIndex, { ...v, from: v.to, to: v.from })
          }
          return
        }

        case "line-height": {
          const opts = [
            { value: 1.25, label: "tight" }, { value: 1.375, label: "snug" },
            { value: 1.5, label: "normal" }, { value: 1.625, label: "relaxed" },
            { value: 2, label: "loose" },
          ]
          const idx = opts.findIndex(o => o.label === v.label)
          if (key.upArrow || key.rightArrow) {
            prompt.updateWidget(prompt.selectedWidgetIndex, opts[Math.min(opts.length - 1, idx + 1)])
          } else if (key.downArrow || key.leftArrow) {
            prompt.updateWidget(prompt.selectedWidgetIndex, opts[Math.max(0, idx - 1)])
          }
          return
        }

        case "letter-spacing": {
          const opts = [
            { value: -0.05, label: "tighter" }, { value: -0.025, label: "tight" },
            { value: 0, label: "normal" }, { value: 0.025, label: "wide" },
            { value: 0.05, label: "wider" }, { value: 0.1, label: "widest" },
          ]
          const idx = opts.findIndex(o => o.label === v.label)
          if (key.upArrow || key.rightArrow) {
            prompt.updateWidget(prompt.selectedWidgetIndex, opts[Math.min(opts.length - 1, idx + 1)])
          } else if (key.downArrow || key.leftArrow) {
            prompt.updateWidget(prompt.selectedWidgetIndex, opts[Math.max(0, idx - 1)])
          }
          return
        }

        case "border": {
          const styles = ["none", "solid", "dashed", "dotted"] as const
          const idx = styles.indexOf(v.style)
          if (key.upArrow) {
            prompt.updateWidget(prompt.selectedWidgetIndex, { ...v, style: styles[(idx + 1) % styles.length] })
          } else if (key.downArrow) {
            prompt.updateWidget(prompt.selectedWidgetIndex, { ...v, style: styles[(idx - 1 + styles.length) % styles.length] })
          } else if (key.rightArrow) {
            prompt.updateWidget(prompt.selectedWidgetIndex, { ...v, width: Math.min(8, v.width + 1) })
          } else if (key.leftArrow) {
            prompt.updateWidget(prompt.selectedWidgetIndex, { ...v, width: Math.max(0, v.width - 1) })
          }
          return
        }

        case "color": {
          // Cycle through preset colors
          const presets = ["#EF4444", "#F97316", "#F59E0B", "#22C55E", "#14B8A6", "#3B82F6", "#6366F1", "#8B5CF6", "#EC4899", "#FFFFFF"]
          const idx = presets.indexOf(v.hex)
          if (key.rightArrow || key.upArrow) {
            const next = idx >= 0 ? presets[(idx + 1) % presets.length] : presets[0]
            prompt.updateWidget(prompt.selectedWidgetIndex, { ...v, hex: next })
          } else if (key.leftArrow || key.downArrow) {
            const prev = idx >= 0 ? presets[(idx - 1 + presets.length) % presets.length] : presets[0]
            prompt.updateWidget(prompt.selectedWidgetIndex, { ...v, hex: prev })
          }
          return
        }
      }
      return
    }

    // ==== TEXT MODE ====
    if (key.tab) {
      if (prompt.widgets.length > 0) {
        prompt.selectWidget(0)
        setMode("widget")
      } else {
        setMode("palette")
      }
      return
    }

    // Ctrl+W = open widget palette
    if (input === "w" && key.ctrl) {
      setMode("palette")
      return
    }

    // Enter = submit
    if (key.return && !key.shift) {
      if (prompt.text.trim() || prompt.widgets.length > 0) {
        const serialized = prompt.getSerializedPrompt()
        setSubmitted(serialized)
        prompt.clear()
      }
      return
    }
  })

  // Render prompt line with inline widgets
  const PLACEHOLDER_REGEX = /(\{\{widget:[^}]+\}\})/g
  const PLACEHOLDER_ID_REGEX = /\{\{widget:([^}]+)\}\}/
  const segments = prompt.text.split(PLACEHOLDER_REGEX)
  const widgetMap = new Map(prompt.widgets.map((w) => [w.id, w]))

  return (
    <Box flexDirection="column" paddingX={1} gap={1}>
      {/* Header */}
      <Box gap={1}>
        <Text bold color="#3B82F6">🧩 PromptKit</Text>
        <Text dimColor>│</Text>
        <Text dimColor>
          {mode === "text" && "Typing"}
          {mode === "widget" && <Text color="#F59E0B">Editing widget</Text>}
          {mode === "palette" && <Text color="#8B5CF6">Widget palette</Text>}
        </Text>
        <Text dimColor>│</Text>
        <Text dimColor>{prompt.widgets.length} widget{prompt.widgets.length !== 1 ? "s" : ""}</Text>
      </Box>

      {/* Prompt display with inline widgets */}
      <Box
        borderStyle="round"
        borderColor={mode === "text" ? "#3B82F6" : "#3F3F46"}
        paddingX={1}
        flexDirection="row"
        flexWrap="wrap"
      >
        {prompt.text === "" && prompt.widgets.length === 0 ? (
          <Text dimColor>Start typing your prompt... (Tab = widgets, Ctrl+W = palette)</Text>
        ) : (
          segments.map((segment, i) => {
            const match = segment.match(PLACEHOLDER_ID_REGEX)
            if (match) {
              const widget = widgetMap.get(match[1])
              if (!widget) return <Text key={i} dimColor>[?]</Text>
              const widgetIdx = prompt.widgets.findIndex(w => w.id === widget.id)
              return (
                <WidgetChip
                  key={widget.id}
                  widget={widget}
                  selected={mode === "widget" && widgetIdx === prompt.selectedWidgetIndex}
                />
              )
            }
            // Plain text — strip widget placeholders for display
            const clean = segment.replace(/\{\{widget:[^}]+\}\}/g, "")
            return clean ? <Text key={i}>{clean}</Text> : null
          })
        )}
      </Box>

      {/* Text input (only in text mode) */}
      {mode === "text" && (
        <Box>
          <Text color="#3B82F6" bold>❯ </Text>
          <TextInput
            value={prompt.text.replace(/\{\{widget:[^}]+\}\}/g, "")}
            onChange={(val) => {
              const placeholders = prompt.text.match(/\{\{widget:[^}]+\}\}/g) || []
              prompt.setText(val + placeholders.join(""))
            }}
            placeholder="Type here..."
          />
        </Box>
      )}

      {/* Widget editor (when a widget is selected) */}
      {mode === "widget" && prompt.widgets[prompt.selectedWidgetIndex] && (
        <Box borderStyle="round" borderColor={widgetColors[prompt.widgets[prompt.selectedWidgetIndex].type] || "#A1A1AA"} flexDirection="column">
          <WidgetEditor
            widget={prompt.widgets[prompt.selectedWidgetIndex]}
            onChange={(val) => prompt.updateWidget(prompt.selectedWidgetIndex, val)}
          />
          <Text dimColor>  Tab = next widget  │  Backspace = delete  │  Esc = done</Text>
        </Box>
      )}

      {/* Widget palette */}
      {mode === "palette" && (
        <Palette
          widgets={paletteWidgets}
          selectedIndex={paletteIndex}
          category={paletteCategory}
          categories={categories}
          onCategoryChange={setPaletteCategory}
        />
      )}

      {/* Last submitted output */}
      {submitted && (
        <Box flexDirection="column" borderStyle="round" borderColor="#22C55E" paddingX={1}>
          <Text color="#22C55E" bold>✓ Submitted</Text>
          <Text color="#A1A1AA">{submitted.humanReadable}</Text>
        </Box>
      )}

      {/* Help bar */}
      <Text dimColor>
        {mode === "text" && "Tab: widgets │ Ctrl+W: palette │ Enter: send │ Ctrl+C: quit"}
        {mode === "widget" && "←→↑↓: edit value │ Tab: next │ Backspace: delete │ Esc: back"}
        {mode === "palette" && "←→: select │ Enter: insert │ 1-4: category │ Esc: back"}
      </Text>
    </Box>
  )
}
