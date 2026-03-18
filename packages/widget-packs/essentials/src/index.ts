import type { WidgetPack } from "@promptkit/protocol"
import { allWidgets } from "./widgets"

export {
  // Color (4)
  colorWidget, opacityWidget, gradientWidget, filterWidget,
  // Typography (9)
  fontSizeWidget, fontFamilyWidget, fontWeightWidget, textAlignWidget,
  lineHeightWidget, letterSpacingWidget, textDecorationWidget, textTransformWidget, textOverflowWidget,
  // Spacing (3)
  spacingWidget, radiusWidget, borderWidget,
  // Layout (10)
  gridColumnsWidget, flexDirectionWidget, justifyContentWidget, alignItemsWidget,
  positionWidget, displayWidget, overflowWidget, aspectRatioWidget, objectFitWidget, breakpointWidget,
  // Effects (7)
  shadowWidget, blurWidget, animationWidget, effectWidget, transformWidget, decorationWidget, scrollEffectWidget,
  // Components — 21st.dev-inspired (12)
  buttonVariantWidget, patternWidget, textEffectWidget, buttonStyleWidget,
  backgroundWidget, cardStyleWidget, navStyleWidget, deviceFrameWidget,
  socialProofWidget, threeDWidget,
  // Logic (4)
  toggleWidget, selectWidget, sliderWidget, cursorWidget,
} from "./widgets"

/** The essentials widget pack — 47 widgets for vibe coding */
export const essentialsPack: WidgetPack = {
  name: "essentials",
  version: "0.3.0",
  description: "47 widgets: colors, typography, spacing, layout, effects, components (21st.dev/MagicUI/Aceternity), and logic",
  widgets: allWidgets,
}
