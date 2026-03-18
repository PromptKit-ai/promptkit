/**
 * PromptKitInput — Drop-in replacement for any chat textarea.
 *
 * Usage (3 lines to integrate into ANY chat app):
 *
 *   import { PromptKitInput } from "@promptkit/react"
 *   import { essentialsPack } from "@promptkit/widget-pack-essentials"
 *
 *   <PromptKitInput
 *     packs={[essentialsPack]}
 *     onSubmit={(result) => {
 *       // result.forAI      → send this to your LLM
 *       // result.systemPrompt → inject in system messages
 *       // result.structured  → full JSON if needed
 *       sendToLLM(result.forAI, result.systemPrompt)
 *     }}
 *   />
 */

import { useState, useCallback, useRef, useMemo } from "react"
import type { Widget, WidgetPack, WidgetCategory, WidgetDefinition, SerializedPrompt } from "@promptkit/protocol"
import {
  WidgetRegistry,
  serialize,
  createWidget,
  updateWidgetValue,
  type RichPrompt,
} from "@promptkit/core"
import { PROMPTKIT_SYSTEM_PROMPT, formatForAI } from "@promptkit/core"

// ─── Types ────────────────────────────────────────────────────

export interface PromptKitResult {
  /** Formatted prompt for the AI — includes widget descriptions + specs */
  forAI: string
  /** System prompt to inject — teaches the LLM to understand widget notation */
  systemPrompt: string
  /** Human-readable version */
  humanReadable: string
  /** Full structured data */
  structured: RichPrompt
  /** Raw serialized prompt */
  serialized: SerializedPrompt
}

export interface PromptKitInputProps {
  /** Widget packs to load */
  packs: WidgetPack[]
  /** Called when the user submits */
  onSubmit: (result: PromptKitResult) => void
  /** Placeholder text */
  placeholder?: string
  /** Disable the input */
  disabled?: boolean
  /** Custom class on the outer container */
  className?: string
  /** Custom class on the textarea */
  inputClassName?: string
  /** Custom class on the submit button */
  buttonClassName?: string
  /** Submit button label */
  submitLabel?: string
  /** Show/hide the widget palette */
  showPalette?: boolean
  /** Palette position */
  palettePosition?: "bottom" | "top"
  /** Theme */
  theme?: "dark" | "light"
  /** Max height of the widget display area */
  maxDisplayHeight?: string
}

// ─── Component ────────────────────────────────────────────────

export function PromptKitInput({
  packs,
  onSubmit,
  placeholder = "Type your prompt, drop widgets to be precise...",
  disabled = false,
  className = "",
  inputClassName = "",
  buttonClassName = "",
  submitLabel = "Send",
  showPalette = true,
  palettePosition = "bottom",
  theme = "dark",
  maxDisplayHeight = "200px",
}: PromptKitInputProps) {
  // Registry
  const registry = useMemo(() => {
    const r = new WidgetRegistry()
    for (const pack of packs) r.loadPack(pack)
    return r
  }, [packs])

  // State
  const [text, setText] = useState("")
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Categories
  const categories = useMemo(() => {
    const cats = new Set(registry.list().map((w) => w.category))
    return Array.from(cats)
  }, [registry])

  const paletteWidgets = useMemo(() => {
    return activeCategory ? registry.list(activeCategory as WidgetCategory) : registry.list()
  }, [registry, activeCategory])

  // Actions
  const insertWidget = useCallback(
    (type: string) => {
      const widget = createWidget(type, {}, registry)
      const placeholder = `{{widget:${widget.id}}}`
      setText((prev) => prev + placeholder)
      setWidgets((prev) => [...prev, widget])
      setTimeout(() => textareaRef.current?.focus(), 0)
    },
    [registry]
  )

  const removeWidget = useCallback((id: string) => {
    setText((prev) => prev.replace(`{{widget:${id}}}`, ""))
    setWidgets((prev) => prev.filter((w) => w.id !== id))
  }, [])

  const updateWidget = useCallback(<T,>(id: string, value: T) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? updateWidgetValue(w, value) : w))
    )
  }, [])

  const handleSubmit = useCallback(() => {
    if (!text.trim() && widgets.length === 0) return

    const richPrompt: RichPrompt = { version: "1.0", text, widgets }
    const serialized = serialize(richPrompt, registry)
    const forAI = formatForAI(richPrompt, registry)

    onSubmit({
      forAI,
      systemPrompt: PROMPTKIT_SYSTEM_PROMPT,
      humanReadable: serialized.humanReadable,
      structured: richPrompt,
      serialized,
    })

    // Reset
    setText("")
    setWidgets([])
  }, [text, widgets, registry, onSubmit])

  // Theme
  const isDark = theme === "dark"
  const bg = isDark ? "#09090B" : "#FFFFFF"
  const bgSubtle = isDark ? "#111113" : "#F9FAFB"
  const borderColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"
  const textColor = isDark ? "#FAFAFA" : "#09090B"
  const textMuted = isDark ? "#71717A" : "#A1A1AA"
  const accent = "#3B82F6"

  // Widget display
  const PLACEHOLDER_REGEX = /(\{\{widget:[^}]+\}\})/g
  const PLACEHOLDER_ID_REGEX = /\{\{widget:([^}]+)\}\}/
  const widgetMap = new Map(widgets.map((w) => [w.id, w]))
  const segments = text.split(PLACEHOLDER_REGEX)
  const cleanText = text.replace(/\{\{widget:[^}]+\}\}/g, "")

  // Category labels
  const catLabels: Record<string, { icon: string; label: string }> = {
    color: { icon: "🎨", label: "Color" },
    typography: { icon: "Aa", label: "Type" },
    spacing: { icon: "↔", label: "Space" },
    layout: { icon: "📐", label: "Layout" },
    effects: { icon: "✦", label: "Effects" },
    components: { icon: "🧩", label: "UI" },
    logic: { icon: "🔀", label: "Logic" },
  }

  const Palette = () => (
    <div style={{ borderTop: `1px solid ${borderColor}`, background: bgSubtle }}>
      {/* Category tabs */}
      <div style={{ display: "flex", gap: "2px", padding: "6px 8px 0", overflowX: "auto" }}>
        <button
          onClick={() => setActiveCategory(null)}
          style={{
            padding: "4px 8px", borderRadius: "6px", border: "none", fontSize: "11px", fontWeight: 600,
            background: !activeCategory ? "rgba(59,130,246,0.15)" : "transparent",
            color: !activeCategory ? accent : textMuted, cursor: "pointer",
          }}
        >All</button>
        {categories.filter((c) => catLabels[c]).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            style={{
              padding: "4px 8px", borderRadius: "6px", border: "none", fontSize: "11px", fontWeight: 600,
              background: activeCategory === cat ? "rgba(59,130,246,0.15)" : "transparent",
              color: activeCategory === cat ? accent : textMuted, cursor: "pointer", whiteSpace: "nowrap",
            }}
          >
            {catLabels[cat]?.icon} {catLabels[cat]?.label}
          </button>
        ))}
      </div>
      {/* Widget buttons */}
      <div style={{ display: "flex", gap: "4px", padding: "6px 8px 8px", overflowX: "auto", flexWrap: "nowrap" }}>
        {paletteWidgets.slice(0, 20).map((def) => (
          <button
            key={def.type}
            onClick={() => insertWidget(def.type)}
            disabled={disabled}
            style={{
              display: "flex", alignItems: "center", gap: "4px",
              padding: "4px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: 500,
              border: `1px solid ${borderColor}`, background: bgSubtle,
              color: textColor, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
            }}
          >
            <span>{def.defaultDisplay.preview ?? "◆"}</span>
            <span>{def.defaultDisplay.label ?? def.type}</span>
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div
      className={className}
      style={{
        display: "flex", flexDirection: "column",
        border: `1px solid ${borderColor}`, borderRadius: "12px",
        background: bg, overflow: "hidden", fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      {/* Palette top */}
      {showPalette && palettePosition === "top" && <Palette />}

      {/* Widget display */}
      {widgets.length > 0 && (
        <div style={{
          padding: "10px 12px", fontSize: "14px", lineHeight: 2.2, color: textColor,
          borderBottom: `1px solid ${borderColor}`, maxHeight: maxDisplayHeight, overflowY: "auto",
          wordWrap: "break-word",
        }}>
          {segments.map((segment, i) => {
            const match = segment.match(PLACEHOLDER_ID_REGEX)
            if (match) {
              const w = widgetMap.get(match[1])
              if (!w) return null
              const def = registry.get(w.type)
              const label = def ? def.humanReadable(w) : w.type
              return (
                <span key={w.id} style={{
                  display: "inline-flex", alignItems: "center", gap: "3px",
                  padding: "1px 8px", borderRadius: "8px", fontSize: "12px",
                  border: `1px solid ${accent}33`, background: `${accent}15`,
                  verticalAlign: "middle",
                }}>
                  {label}
                  <button
                    onClick={() => removeWidget(w.id)}
                    style={{
                      border: "none", background: "none", color: textMuted,
                      cursor: "pointer", fontSize: "10px", padding: "0 2px",
                    }}
                  >✕</button>
                </span>
              )
            }
            const clean = segment.replace(/\{\{widget:[^}]+\}\}/g, "")
            return clean ? <span key={i}>{clean}</span> : null
          })}
        </div>
      )}

      {/* Input row */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", padding: "8px" }}>
        <textarea
          ref={textareaRef}
          value={cleanText}
          onChange={(e) => {
            const val = e.target.value
            const placeholders = text.match(/\{\{widget:[^}]+\}\}/g) || []
            setText(val + placeholders.join(""))
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit() }
          }}
          placeholder={placeholder}
          disabled={disabled}
          rows={2}
          className={inputClassName}
          style={{
            flex: 1, padding: "8px 12px", borderRadius: "8px", fontSize: "14px",
            border: `1px solid ${borderColor}`, background: bgSubtle, color: textColor,
            resize: "none", outline: "none", fontFamily: "inherit", lineHeight: 1.5,
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || (!text.trim() && widgets.length === 0)}
          className={buttonClassName}
          style={{
            padding: "8px 16px", borderRadius: "8px", border: "none",
            background: accent, color: "white", fontSize: "13px", fontWeight: 600,
            cursor: disabled ? "default" : "pointer",
            opacity: disabled || (!text.trim() && widgets.length === 0) ? 0.4 : 1,
          }}
        >{submitLabel}</button>
      </div>

      {/* Palette bottom */}
      {showPalette && palettePosition === "bottom" && <Palette />}
    </div>
  )
}
