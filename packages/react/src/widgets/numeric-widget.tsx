import { useState, useRef, useEffect, useCallback } from "react"
import type { Widget } from "@promptkit/protocol"

interface NumericWidgetConfig {
  icon: string
  label: string
  color: string
  min: number
  max: number
  step: number
  unit: string
  getValue: (widget: Widget) => number
  buildValue: (num: number, widget: Widget) => unknown
  formatDisplay: (num: number, unit: string) => string
}

const configs: Record<string, NumericWidgetConfig> = {
  spacing: {
    icon: "↔",
    label: "Spacing",
    color: "59,130,246",
    min: 0,
    max: 96,
    step: 4,
    unit: "px",
    getValue: (w) => (w.value as any).value,
    buildValue: (n, w) => ({ ...(w.value as any), value: n }),
    formatDisplay: (n, u) => `${n}${u}`,
  },
  radius: {
    icon: "◐",
    label: "Radius",
    color: "168,85,247",
    min: 0,
    max: 50,
    step: 1,
    unit: "px",
    getValue: (w) => (w.value as any).value,
    buildValue: (n, w) => ({ ...(w.value as any), value: n }),
    formatDisplay: (n, u) => n >= 9999 ? "full" : `${n}${u}`,
  },
  "font-size": {
    icon: "Aa",
    label: "Font Size",
    color: "236,72,153",
    min: 8,
    max: 96,
    step: 1,
    unit: "px",
    getValue: (w) => (w.value as any).value,
    buildValue: (n, w) => ({ ...(w.value as any), value: n }),
    formatDisplay: (n, u) => `${n}${u}`,
  },
  opacity: {
    icon: "◑",
    label: "Opacity",
    color: "34,197,94",
    min: 0,
    max: 100,
    step: 5,
    unit: "%",
    getValue: (w) => (w.value as any).value,
    buildValue: (n, w) => ({ ...(w.value as any), value: n }),
    formatDisplay: (n) => `${n}%`,
  },
}

interface NumericWidgetProps {
  widget: Widget
  onChange: (value: unknown) => void
  disabled?: boolean
}

export function NumericWidget({ widget, onChange, disabled }: NumericWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLSpanElement>(null)
  const config = configs[widget.type]

  // Close popover on outside click
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

  const currentValue = config.getValue(widget)
  const rgb = config.color

  return (
    <span
      ref={containerRef}
      className="pk-widget pk-numeric-widget"
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
        }}
      >
        <span style={{ fontSize: "12px", opacity: 0.8 }}>{config.icon}</span>
        <span style={{ fontFamily: "monospace", fontSize: "12px", fontWeight: 500 }}>
          {config.formatDisplay(currentValue, config.unit)}
        </span>
      </button>

      {/* Slider popover */}
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
            padding: "14px 16px",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            minWidth: "200px",
            boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(${rgb},0.1)`,
          }}
        >
          {/* Header */}
          <span
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "11px", fontWeight: 600, color: `rgba(${rgb},0.8)`, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {config.label}
            </span>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 600,
                fontFamily: "monospace",
                color: "#FAFAFA",
                background: `rgba(${rgb},0.15)`,
                padding: "2px 8px",
                borderRadius: "6px",
              }}
            >
              {config.formatDisplay(currentValue, config.unit)}
            </span>
          </span>

          {/* Slider track */}
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "10px", color: "#71717A", fontFamily: "monospace" }}>
              {config.min}
            </span>
            <input
              type="range"
              min={config.min}
              max={config.max}
              step={config.step}
              value={currentValue}
              onChange={(e) => {
                const num = Number(e.target.value)
                onChange(config.buildValue(num, widget))
              }}
              style={{
                flex: 1,
                height: "6px",
                cursor: "pointer",
                accentColor: `rgb(${rgb})`,
                borderRadius: "3px",
              }}
            />
            <span style={{ fontSize: "10px", color: "#71717A", fontFamily: "monospace" }}>
              {config.max}
            </span>
          </span>

          {/* Preset buttons */}
          <span style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {getPresets(widget.type).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => onChange(config.buildValue(preset, widget))}
                style={{
                  padding: "4px 8px",
                  borderRadius: "6px",
                  border: `1px solid ${
                    preset === currentValue
                      ? `rgba(${rgb},0.5)`
                      : "rgba(255,255,255,0.08)"
                  }`,
                  background:
                    preset === currentValue
                      ? `rgba(${rgb},0.2)`
                      : "rgba(255,255,255,0.04)",
                  color: "inherit",
                  cursor: "pointer",
                  fontSize: "11px",
                  fontFamily: "monospace",
                  fontWeight: preset === currentValue ? 600 : 400,
                  transition: "all 0.1s",
                }}
              >
                {config.formatDisplay(preset, config.unit)}
              </button>
            ))}
          </span>
        </span>
      )}
    </span>
  )
}

function getPresets(type: string): number[] {
  switch (type) {
    case "spacing":
      return [0, 4, 8, 12, 16, 24, 32, 48, 64]
    case "radius":
      return [0, 4, 8, 12, 16, 24]
    case "font-size":
      return [12, 14, 16, 18, 20, 24, 32, 48]
    case "opacity":
      return [0, 25, 50, 75, 100]
    default:
      return []
  }
}
