import { useState, useRef, useEffect } from "react"
import type {
  Widget,
  AnimationWidgetValue,
  ShadowWidgetValue,
  FontFamilyWidgetValue,
  BreakpointWidgetValue,
} from "@promptkit/protocol"

interface PresetOption {
  label: string
  value: unknown
  preview?: string
  style?: React.CSSProperties
}

interface PresetConfig {
  icon: string
  label: string
  color: string
  getDisplay: (widget: Widget) => string
  getOptions: (widget: Widget) => PresetOption[]
}

const presetConfigs: Record<string, PresetConfig> = {
  shadow: {
    icon: "🌑",
    label: "Shadow",
    color: "100,116,139",
    getDisplay: (w) => `shadow-${(w.value as ShadowWidgetValue).preset}`,
    getOptions: () =>
      (["none", "sm", "md", "lg", "xl", "2xl"] as const).map((s) => ({
        label: s === "none" ? "None" : `Shadow ${s.toUpperCase()}`,
        value: { preset: s },
        preview: s === "none" ? "—" : "■",
        style: {
          boxShadow:
            s === "none"
              ? "none"
              : s === "sm"
                ? "0 1px 2px rgba(0,0,0,0.3)"
                : s === "md"
                  ? "0 4px 6px rgba(0,0,0,0.3)"
                  : s === "lg"
                    ? "0 10px 15px rgba(0,0,0,0.3)"
                    : s === "xl"
                      ? "0 20px 25px rgba(0,0,0,0.3)"
                      : "0 25px 50px rgba(0,0,0,0.3)",
        },
      })),
  },
  animation: {
    icon: "🎬",
    label: "Animation",
    color: "139,92,246",
    getDisplay: (w) => (w.value as AnimationWidgetValue).name,
    getOptions: () =>
      [
        { name: "bounce", duration: 500 },
        { name: "fade-in", duration: 300 },
        { name: "fade-out", duration: 300 },
        { name: "slide-up", duration: 400 },
        { name: "slide-down", duration: 400 },
        { name: "slide-left", duration: 400 },
        { name: "slide-right", duration: 400 },
        { name: "scale-in", duration: 300 },
        { name: "spin", duration: 1000 },
        { name: "pulse", duration: 2000 },
        { name: "spring", duration: 600, config: { stiffness: 300, damping: 20 } },
        { name: "elastic", duration: 800, config: { stiffness: 200, damping: 10 } },
      ].map((a) => ({
        label: a.name,
        value: a,
        preview: "▸",
      })),
  },
  "font-family": {
    icon: "𝔉",
    label: "Font",
    color: "236,72,153",
    getDisplay: (w) => (w.value as FontFamilyWidgetValue).family,
    getOptions: () =>
      [
        "Inter", "Roboto", "Open Sans", "Lato", "Montserrat", "Poppins",
        "Playfair Display", "Merriweather", "Fira Code", "JetBrains Mono",
        "Space Grotesk", "DM Sans", "Plus Jakarta Sans", "Geist",
      ].map((f) => ({
        label: f,
        value: { family: f },
        style: { fontFamily: f },
      })),
  },
  breakpoint: {
    icon: "📱",
    label: "Breakpoint",
    color: "245,158,11",
    getDisplay: (w) => {
      const v = w.value as BreakpointWidgetValue
      return `${v.name} (${v.width}px)`
    },
    getOptions: () =>
      [
        { name: "sm", width: 640, icon: "📱" },
        { name: "md", width: 768, icon: "📱" },
        { name: "lg", width: 1024, icon: "💻" },
        { name: "xl", width: 1280, icon: "🖥️" },
        { name: "2xl", width: 1536, icon: "🖥️" },
      ].map((b) => ({
        label: `${b.name} — ${b.width}px`,
        value: { name: b.name, width: b.width },
        preview: b.icon,
      })),
  },
}

interface PresetSelectWidgetProps {
  widget: Widget
  onChange: (value: unknown) => void
  disabled?: boolean
}

export function PresetSelectWidget({ widget, onChange, disabled }: PresetSelectWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLSpanElement>(null)
  const config = presetConfigs[widget.type]

  useEffect(() => {
    if (!isOpen) return
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [isOpen])

  if (!config) return null

  const rgb = config.color
  const display = config.getDisplay(widget)
  const options = config.getOptions(widget)

  return (
    <span
      ref={containerRef}
      className="pk-widget pk-preset-select-widget"
      style={{ display: "inline-flex", position: "relative", verticalAlign: "middle" }}
    >
      {/* Chip trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: "3px 10px",
          borderRadius: "12px",
          border: `1px solid rgba(${rgb},${isOpen ? 0.5 : 0.3})`,
          background: `rgba(${rgb},${isOpen ? 0.2 : 0.12})`,
          cursor: disabled ? "default" : "pointer",
          fontSize: "13px",
          lineHeight: "1.4",
          color: "inherit",
          transition: "all 0.15s",
          ...(widget.type === "font-family"
            ? { fontFamily: (widget.value as FontFamilyWidgetValue).family }
            : {}),
        }}
      >
        <span style={{ fontSize: "12px" }}>{config.icon}</span>
        <span style={{ fontSize: "12px", fontWeight: 500 }}>{display}</span>
        <span style={{ fontSize: "8px", opacity: 0.5, marginLeft: "2px" }}>▼</span>
      </button>

      {/* Options popover */}
      {isOpen && !disabled && (
        <span
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#1C1C1E",
            border: `1px solid rgba(${rgb},0.25)`,
            borderRadius: "14px",
            padding: "8px",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            gap: "2px",
            minWidth: "180px",
            maxHeight: "280px",
            overflowY: "auto",
            boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(${rgb},0.1)`,
          }}
        >
          {/* Title */}
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: `rgba(${rgb},0.8)`,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              padding: "4px 8px 8px",
            }}
          >
            {config.label}
          </span>

          {options.map((opt, i) => {
            const isSelected = JSON.stringify(opt.value) === JSON.stringify(widget.value)
            return (
              <button
                key={i}
                type="button"
                onClick={() => {
                  onChange(opt.value)
                  setIsOpen(false)
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "7px 10px",
                  borderRadius: "8px",
                  border: "none",
                  background: isSelected ? `rgba(${rgb},0.18)` : "transparent",
                  color: "inherit",
                  cursor: "pointer",
                  fontSize: "13px",
                  textAlign: "left",
                  transition: "background 0.1s",
                  ...(opt.style ?? {}),
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = "rgba(255,255,255,0.06)"
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = "transparent"
                }}
              >
                {opt.preview && (
                  <span style={{ fontSize: "13px", width: "20px", textAlign: "center" }}>
                    {opt.preview}
                  </span>
                )}
                <span style={{ flex: 1 }}>{opt.label}</span>
                {isSelected && (
                  <span style={{ fontSize: "12px", color: `rgb(${rgb})` }}>✓</span>
                )}
              </button>
            )
          })}
        </span>
      )}
    </span>
  )
}
