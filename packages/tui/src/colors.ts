/** ANSI color helpers for terminal widget rendering */

export function hexToAnsi(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `\x1b[38;2;${r};${g};${b}m`
}

export function bgHexToAnsi(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `\x1b[48;2;${r};${g};${b}m`
}

export const reset = "\x1b[0m"
export const bold = "\x1b[1m"
export const dim = "\x1b[2m"
export const underline = "\x1b[4m"

/** Widget type to accent color mapping */
export const widgetColors: Record<string, string> = {
  color: "#3B82F6",
  slider: "#F59E0B",
  toggle: "#22C55E",
  select: "#6366F1",
  spacing: "#3B82F6",
  radius: "#8B5CF6",
  "font-size": "#EC4899",
  "font-family": "#EC4899",
  shadow: "#64748B",
  animation: "#8B5CF6",
  breakpoint: "#F59E0B",
  opacity: "#22C55E",
  gradient: "#E879F9",
  "font-weight": "#F97316",
  "text-align": "#14B8A6",
  "grid-columns": "#F59E0B",
  blur: "#06B6D4",
  border: "#64748B",
  "line-height": "#A855F7",
  "letter-spacing": "#F43F5E",
}
