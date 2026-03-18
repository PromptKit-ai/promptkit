import type { Widget, SliderWidgetMeta } from "@promptkit/protocol"

interface SliderWidgetProps {
  widget: Widget<number>
  onChange: (value: number) => void
  disabled?: boolean
}

export function SliderWidget({ widget, onChange, disabled }: SliderWidgetProps) {
  const meta = widget.meta as unknown as SliderWidgetMeta

  return (
    <span className="pk-widget pk-slider-widget" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "2px 8px",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.15)",
          background: "rgba(255,255,255,0.08)",
          fontSize: "14px",
          lineHeight: "1.4",
        }}
      >
        <input
          type="range"
          min={meta.min}
          max={meta.max}
          step={meta.step}
          value={widget.value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            width: "60px",
            height: "4px",
            cursor: disabled ? "default" : "pointer",
            accentColor: "#3B82F6",
          }}
        />
        <span style={{ fontFamily: "monospace", fontSize: "12px", minWidth: "36px" }}>
          {widget.value}{meta.unit}
        </span>
      </span>
    </span>
  )
}
