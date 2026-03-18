import type { Widget, ToggleWidgetValue } from "@promptkit/protocol"

interface ToggleWidgetProps {
  widget: Widget<ToggleWidgetValue>
  onChange: (value: ToggleWidgetValue) => void
  disabled?: boolean
}

export function ToggleWidget({ widget, onChange, disabled }: ToggleWidgetProps) {
  return (
    <span className="pk-widget pk-toggle-widget" style={{ display: "inline-flex", alignItems: "center" }}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange({ ...widget.value, enabled: !widget.value.enabled })}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "2px 8px",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.15)",
          background: widget.value.enabled
            ? "rgba(59,130,246,0.2)"
            : "rgba(255,255,255,0.08)",
          cursor: disabled ? "default" : "pointer",
          fontSize: "14px",
          lineHeight: "1.4",
          color: "inherit",
          transition: "background 0.15s",
        }}
      >
        <span
          style={{
            width: "28px",
            height: "16px",
            borderRadius: "8px",
            backgroundColor: widget.value.enabled ? "#3B82F6" : "#4B5563",
            position: "relative",
            transition: "background-color 0.15s",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              position: "absolute",
              top: "2px",
              left: widget.value.enabled ? "14px" : "2px",
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "white",
              transition: "left 0.15s",
            }}
          />
        </span>
        <span style={{ fontSize: "12px" }}>{widget.value.key}</span>
      </button>
    </span>
  )
}
