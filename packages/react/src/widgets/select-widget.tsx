import { useState } from "react"
import type { Widget, SelectWidgetValue, SelectWidgetMeta } from "@promptkit/protocol"

interface SelectWidgetProps {
  widget: Widget<SelectWidgetValue>
  onChange: (value: SelectWidgetValue) => void
  disabled?: boolean
}

export function SelectWidget({ widget, onChange, disabled }: SelectWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const meta = widget.meta as unknown as SelectWidgetMeta

  return (
    <span className="pk-widget pk-select-widget" style={{ display: "inline-flex", position: "relative" }}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          padding: "2px 8px",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.15)",
          background: "rgba(255,255,255,0.08)",
          cursor: disabled ? "default" : "pointer",
          fontSize: "14px",
          lineHeight: "1.4",
          color: "inherit",
        }}
      >
        <span style={{ fontSize: "12px" }}>
          {widget.value.selected || widget.value.key}
        </span>
        <span style={{ fontSize: "10px", opacity: 0.6 }}>▼</span>
      </button>

      {isOpen && (
        <span
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            marginTop: "4px",
            background: "#1F2937",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "8px",
            padding: "4px",
            zIndex: 50,
            minWidth: "120px",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          {meta.options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange({ ...widget.value, selected: opt.value })
                setIsOpen(false)
              }}
              style={{
                padding: "4px 8px",
                borderRadius: "4px",
                border: "none",
                background:
                  opt.value === widget.value.selected
                    ? "rgba(59,130,246,0.2)"
                    : "transparent",
                color: "inherit",
                cursor: "pointer",
                fontSize: "12px",
                textAlign: "left",
              }}
            >
              {opt.label}
            </button>
          ))}
        </span>
      )}
    </span>
  )
}
