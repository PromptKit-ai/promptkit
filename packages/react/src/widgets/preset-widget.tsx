import type { Widget, AnimationWidgetValue, ShadowWidgetValue, FontFamilyWidgetValue } from "@promptkit/protocol"

interface PresetWidgetProps {
  widget: Widget
  onClick?: () => void
  disabled?: boolean
}

/** Map widget types to preview styles */
function getPresetStyle(widget: Widget): React.CSSProperties {
  switch (widget.type) {
    case "animation": {
      const val = widget.value as AnimationWidgetValue
      return {
        background: "rgba(139,92,246,0.2)",
        borderColor: "rgba(139,92,246,0.3)",
      }
    }
    case "shadow": {
      const val = widget.value as ShadowWidgetValue
      return {
        background: "rgba(100,116,139,0.2)",
        borderColor: "rgba(100,116,139,0.3)",
      }
    }
    case "font-family": {
      const val = widget.value as FontFamilyWidgetValue
      return {
        background: "rgba(236,72,153,0.2)",
        borderColor: "rgba(236,72,153,0.3)",
        fontFamily: val.family,
      }
    }
    default:
      return {
        background: "rgba(255,255,255,0.08)",
        borderColor: "rgba(255,255,255,0.15)",
      }
  }
}

function getPresetLabel(widget: Widget): string {
  switch (widget.type) {
    case "animation":
      return (widget.value as AnimationWidgetValue).name
    case "shadow":
      return `shadow-${(widget.value as ShadowWidgetValue).preset}`
    case "font-family":
      return (widget.value as FontFamilyWidgetValue).family
    case "spacing":
      return `${(widget.value as { value: number; unit: string }).value}${(widget.value as { value: number; unit: string }).unit}`
    case "radius":
      return `${(widget.value as { value: number; unit: string }).value}${(widget.value as { value: number; unit: string }).unit}`
    case "font-size":
      return `${(widget.value as { value: number; unit: string }).value}${(widget.value as { value: number; unit: string }).unit}`
    case "opacity":
      return `${(widget.value as { value: number }).value}%`
    case "breakpoint":
      return (widget.value as { name: string }).name
    default:
      return widget.display.label || widget.type
  }
}

export function PresetWidget({ widget, onClick, disabled }: PresetWidgetProps) {
  const style = getPresetStyle(widget)

  return (
    <span className="pk-widget pk-preset-widget" style={{ display: "inline-flex" }}>
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          padding: "2px 10px",
          borderRadius: "12px",
          border: `1px solid ${style.borderColor}`,
          background: style.background,
          cursor: disabled ? "default" : "pointer",
          fontSize: "13px",
          lineHeight: "1.4",
          color: "inherit",
          fontFamily: style.fontFamily,
          transition: "transform 0.1s",
        }}
      >
        {widget.display.preview && (
          <span style={{ fontSize: "12px" }}>{widget.display.preview}</span>
        )}
        <span>{getPresetLabel(widget)}</span>
      </button>
    </span>
  )
}
