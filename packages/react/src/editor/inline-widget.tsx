import type { Widget } from "@promptkit/protocol"
import { ColorWidget } from "../widgets/color-widget"
import { SliderWidget } from "../widgets/slider-widget"
import { ToggleWidget } from "../widgets/toggle-widget"
import { SelectWidget } from "../widgets/select-widget"
import { NumericWidget } from "../widgets/numeric-widget"
import { PresetSelectWidget } from "../widgets/preset-select-widget"

interface InlineWidgetProps {
  widget: Widget
  onChange: (value: unknown) => void
  onRemove: () => void
  disabled?: boolean
}

export function InlineWidget({ widget, onChange, onRemove, disabled }: InlineWidgetProps) {
  switch (widget.type) {
    case "color":
      return <ColorWidget widget={widget as any} onChange={onChange as any} disabled={disabled} />

    case "slider":
      return <SliderWidget widget={widget as any} onChange={onChange as any} disabled={disabled} />

    case "toggle":
      return <ToggleWidget widget={widget as any} onChange={onChange as any} disabled={disabled} />

    case "select":
      return <SelectWidget widget={widget as any} onChange={onChange as any} disabled={disabled} />

    // Numeric widgets with slider popover
    case "spacing":
    case "radius":
    case "font-size":
    case "opacity":
      return <NumericWidget widget={widget} onChange={onChange} disabled={disabled} />

    // Preset select widgets with dropdown popover
    case "animation":
    case "shadow":
    case "font-family":
    case "breakpoint":
      return <PresetSelectWidget widget={widget} onChange={onChange} disabled={disabled} />

    default:
      return <NumericWidget widget={widget} onChange={onChange} disabled={disabled} />
  }
}
