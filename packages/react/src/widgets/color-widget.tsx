import { useState, useRef, useEffect } from "react"
import type { Widget, ColorWidgetValue } from "@promptkit/protocol"

interface ColorWidgetProps {
  widget: Widget<ColorWidgetValue>
  onChange: (value: ColorWidgetValue) => void
  disabled?: boolean
}

const presetColors = [
  "#EF4444", "#F97316", "#F59E0B", "#22C55E", "#14B8A6",
  "#3B82F6", "#6366F1", "#8B5CF6", "#A855F7", "#EC4899",
  "#F43F5E", "#64748B", "#FFFFFF", "#000000",
]

export function ColorWidget({ widget, onChange, disabled }: ColorWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLSpanElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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

  return (
    <span
      ref={containerRef}
      className="pk-widget pk-color-widget"
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
          border: `1px solid ${isOpen ? "rgba(59,130,246,0.5)" : "rgba(255,255,255,0.15)"}`,
          background: isOpen ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.08)",
          cursor: disabled ? "default" : "pointer",
          fontSize: "13px",
          lineHeight: "1.4",
          color: "inherit",
          transition: "all 0.15s",
        }}
      >
        <span
          style={{
            width: "14px",
            height: "14px",
            borderRadius: "50%",
            backgroundColor: widget.value.hex,
            border: "1px solid rgba(255,255,255,0.2)",
            flexShrink: 0,
          }}
        />
        <span style={{ fontFamily: "monospace", fontSize: "12px", fontWeight: 500 }}>
          {widget.value.hex}
        </span>
      </button>

      {/* Color popover */}
      {isOpen && !disabled && (
        <span
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#1C1C1E",
            border: "1px solid rgba(59,130,246,0.25)",
            borderRadius: "14px",
            padding: "14px 16px",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            minWidth: "210px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(59,130,246,0.1)",
          }}
        >
          {/* Header */}
          <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "rgba(59,130,246,0.8)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Color
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                fontWeight: 600,
                fontFamily: "monospace",
                color: "#FAFAFA",
              }}
            >
              <span
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "4px",
                  backgroundColor: widget.value.hex,
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              />
              {widget.value.hex}
            </span>
          </span>

          {/* Native color picker */}
          <span style={{ position: "relative", height: "32px" }}>
            <input
              ref={inputRef}
              type="color"
              value={widget.value.hex}
              onChange={(e) => onChange({ ...widget.value, hex: e.target.value })}
              style={{
                width: "100%",
                height: "32px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                padding: 0,
                background: "transparent",
              }}
            />
          </span>

          {/* Preset colors grid */}
          <span style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
            {presetColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => onChange({ ...widget.value, hex: color })}
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "6px",
                  backgroundColor: color,
                  border: widget.value.hex.toLowerCase() === color.toLowerCase()
                    ? "2px solid #3B82F6"
                    : "1px solid rgba(255,255,255,0.15)",
                  cursor: "pointer",
                  padding: 0,
                  transition: "transform 0.1s",
                }}
              />
            ))}
          </span>

          {/* Hex input */}
          <input
            type="text"
            value={widget.value.hex}
            onChange={(e) => {
              const v = e.target.value
              if (/^#[0-9A-Fa-f]{6}$/.test(v)) {
                onChange({ ...widget.value, hex: v })
              }
            }}
            placeholder="#000000"
            style={{
              padding: "6px 10px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)",
              color: "inherit",
              fontSize: "12px",
              fontFamily: "monospace",
              outline: "none",
              width: "100%",
            }}
          />
        </span>
      )}
    </span>
  )
}
