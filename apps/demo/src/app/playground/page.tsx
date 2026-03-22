"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  PromptKitProvider,
  useRichPrompt,
  usePromptKit,
} from "@promptkit/react"
import { essentialsPack } from "@promptkit/widget-pack-essentials"
import type { SerializedPrompt, Widget, WidgetCategory } from "@promptkit/protocol"

// =============================================================================
// INTERACTIVE WIDGET COMPONENTS (Spielwerk-style)
// =============================================================================

function ColorChip({ widget, onChange }: { widget: Widget; onChange: (v: unknown) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const val = widget.value as { hex: string; opacity?: number }

  const presets = [
    "#EF4444", "#F97316", "#F59E0B", "#22C55E", "#14B8A6",
    "#3B82F6", "#6366F1", "#8B5CF6", "#EC4899", "#F43F5E",
    "#FFFFFF", "#000000",
  ]

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  return (
    <div ref={ref} className="relative inline-flex align-middle">
      <motion.button
        whileHover={{ scale: 1.08, y: -1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="chip-inline"
        style={{ background: `${val.hex}20`, borderColor: `${val.hex}40` }}
      >
        <span
          className="w-5 h-5 rounded-full border-2 border-white/40"
          style={{
            background: val.hex,
            boxShadow: `0 0 12px ${val.hex}55, 0 2px 4px rgba(0,0,0,0.2)`,
          }}
        />
        <span className="text-xs font-mono font-bold tracking-tight" style={{ color: val.hex, textShadow: `0 0 12px ${val.hex}44` }}>{val.hex}</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 6 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute top-full mt-2 left-0 z-50 bg-bg-elevated border border-white/12 rounded-2xl p-3 sm:p-4 w-[200px] sm:w-[220px]"
            style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.4), 0 24px 48px rgba(0,0,0,0.3)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Color</span>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg" style={{ background: val.hex, boxShadow: `0 2px 8px ${val.hex}44` }} />
                <span className="text-xs font-mono font-bold">{val.hex}</span>
              </div>
            </div>
            <input
              type="color"
              value={val.hex}
              onChange={(e) => onChange({ ...val, hex: e.target.value })}
              className="w-full h-10 rounded-xl cursor-pointer border-0 mb-3"
            />
            <div className="grid grid-cols-6 gap-2">
              {presets.map((c) => (
                <motion.button
                  key={c}
                  whileHover={{ scale: 1.25, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onChange({ ...val, hex: c })}
                  className="w-7 h-7 rounded-lg cursor-pointer transition-all"
                  style={{
                    background: c,
                    border: val.hex.toLowerCase() === c.toLowerCase() ? "2.5px solid white" : "1px solid rgba(255,255,255,0.1)",
                    boxShadow: val.hex.toLowerCase() === c.toLowerCase()
                      ? `0 0 16px ${c}66, 0 4px 8px rgba(0,0,0,0.2)`
                      : "0 2px 4px rgba(0,0,0,0.15)",
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Visual preview box that reacts to the widget type */
function NumericPreview({ type, value }: { type: string; value: number }) {
  switch (type) {
    case "font-size":
      return (
        <motion.span
          key={value}
          animate={{ scale: [0.8, 1] }}
          transition={{ duration: 0.15 }}
          className="font-bold leading-none"
          style={{ fontSize: `${Math.min(Math.max(value * 0.65, 9), 28)}px` }}
        >
          Aa
        </motion.span>
      )
    case "radius":
      return (
        <span
          className="w-5 h-5 border-2 border-current transition-all"
          style={{ borderRadius: `${Math.min(value, 12)}px` }}
        />
      )
    case "opacity":
      return (
        <span className="relative w-5 h-5">
          <span className="absolute inset-0 rounded bg-white" style={{ opacity: value / 100 }} />
          <span className="absolute inset-0 rounded border border-white/20" />
        </span>
      )
    case "spacing":
      return (
        <span className="flex items-center gap-0.5 h-4">
          <span className="w-1 h-full bg-current rounded-full opacity-60" />
          <span className="transition-all" style={{ width: `${Math.min(Math.max(value * 0.3, 2), 20)}px` }} />
          <span className="w-1 h-full bg-current rounded-full opacity-60" />
        </span>
      )
    case "blur":
      return (
        <span className="text-[10px] font-bold transition-all" style={{ filter: `blur(${Math.min(value * 0.3, 4)}px)` }}>
          ◉
        </span>
      )
    case "grid-columns":
      return (
        <span className="flex gap-[1px] h-3.5">
          {Array.from({ length: Math.min(value, 6) }).map((_, i) => (
            <span key={i} className="w-[3px] h-full bg-current rounded-[1px] opacity-70" />
          ))}
        </span>
      )
    case "slider":
      return (
        <span className="flex items-center gap-[1px] h-3">
          <span className="w-[10px] h-[3px] rounded-full bg-current opacity-70" style={{ width: `${Math.max(value * 0.16, 2)}px` }} />
          <span className="w-[2px] h-full bg-current rounded-full" />
        </span>
      )
    default:
      return null
  }
}

/** Spielwerk-style stepper counter: - N + */
function StepperChip({ widget, onChange, config }: {
  widget: Widget
  onChange: (v: unknown) => void
  config: { min: number; max: number; step: number; unit: string; getValue: (w: Widget) => number; buildValue: (n: number, w: Widget) => unknown }
}) {
  const current = config.getValue(widget)
  const decrement = () => {
    const next = Math.max(config.min, current - config.step)
    onChange(config.buildValue(next, widget))
  }
  const increment = () => {
    const next = Math.min(config.max, current + config.step)
    onChange(config.buildValue(next, widget))
  }
  return (
    <span className="chip-inline" style={{ gap: "2px", padding: "2px 4px" }}>
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.85 }}
        onClick={decrement}
        className="stepper-btn"
        style={{ width: 26, height: 26, fontSize: 16, background: "rgba(255,255,255,0.1)", color: "#A1A1AA", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "none" }}
      >
        −
      </motion.button>
      <motion.span
        key={current}
        initial={{ scale: 1.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-sm font-bold font-mono px-2 min-w-[28px] text-center text-white"
      >
        {current}
      </motion.span>
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.85 }}
        onClick={increment}
        className="stepper-btn"
        style={{ width: 26, height: 26, fontSize: 16, background: "rgba(255,255,255,0.1)", color: "#A1A1AA", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "none" }}
      >
        +
      </motion.button>
    </span>
  )
}

function NumericChip({ widget, onChange, config }: {
  widget: Widget
  onChange: (v: unknown) => void
  config: { icon: string; label: string; color: string; min: number; max: number; step: number; unit: string; presets: number[]; getValue: (w: Widget) => number; buildValue: (n: number, w: Widget) => unknown }
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = config.getValue(widget)

  // Use stepper for small-range integers (like grid-columns, small spacing)
  const range = config.max - config.min
  const isSmallRange = range <= 20 && config.step >= 1
  if (isSmallRange) {
    return <StepperChip widget={widget} onChange={onChange} config={config} />
  }

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  const accent = config.color

  return (
    <div ref={ref} className="relative inline-flex align-middle">
      <motion.button
        whileHover={{ scale: 1.08, y: -1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="chip-inline"
        style={{
          borderColor: `${accent}40`,
          background: `${accent}18`,
        }}
      >
        {/* WYSIWYG preview icon that reacts to value */}
        <span className="flex items-center justify-center" style={{ color: accent }}>
          <NumericPreview type={widget.type} value={current} />
        </span>
        <motion.span
          key={current}
          initial={{ y: -4, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-xs font-mono font-bold"
          style={{ color: accent }}
        >
          {current}{config.unit}
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 6 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute top-full mt-2 left-0 z-50 bg-bg-elevated border border-white/12 rounded-2xl p-3 sm:p-4 w-[220px] sm:w-[260px]"
            style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.4), 0 24px 48px rgba(0,0,0,0.3)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: accent }}>{config.label}</span>
              <motion.span
                key={current}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-sm font-mono font-bold px-2.5 py-1 rounded-lg"
                style={{ background: `${accent}22`, color: accent }}
              >
                {current}{config.unit}
              </motion.span>
            </div>

            {/* WYSIWYG live preview area */}
            <div className="flex items-center justify-center p-4 mb-3 rounded-xl border border-white/5 bg-white/[0.02]">
              <NumericPopoverPreview type={widget.type} value={current} accent={accent} />
            </div>

            <input
              type="range"
              min={config.min}
              max={config.max}
              step={config.step}
              value={current}
              onChange={(e) => onChange(config.buildValue(Number(e.target.value), widget))}
              className="w-full mb-3"
              style={{ accentColor: accent }}
            />

            <div className="flex gap-1.5 flex-wrap">
              {config.presets.map((p) => (
                <motion.button
                  key={p}
                  whileHover={{ scale: 1.1, y: -1 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => onChange(config.buildValue(p, widget))}
                  className="px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-bold cursor-pointer transition-all"
                  style={{
                    background: p === current ? `${accent}30` : "rgba(255,255,255,0.04)",
                    border: p === current ? `1.5px solid ${accent}66` : "1px solid rgba(255,255,255,0.06)",
                    color: p === current ? accent : "inherit",
                    boxShadow: p === current ? `0 2px 8px ${accent}33` : "none",
                  }}
                >
                  {p}{config.unit}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Full-size WYSIWYG preview in the popover */
function NumericPopoverPreview({ type, value, accent }: { type: string; value: number; accent: string }) {
  switch (type) {
    case "font-size":
      return (
        <motion.span
          key={value}
          animate={{ scale: [0.9, 1] }}
          className="font-bold text-white transition-all leading-none"
          style={{ fontSize: `${Math.min(value, 64)}px` }}
        >
          Aa
        </motion.span>
      )
    case "radius":
      return (
        <motion.div
          className="w-16 h-16 border-2 transition-all"
          style={{ borderColor: accent, borderRadius: `${value}px`, background: `${accent}15` }}
          animate={{ borderRadius: `${value}px` }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      )
    case "opacity":
      return (
        <div className="relative">
          {/* Checkerboard background */}
          <div className="w-16 h-16 rounded-lg" style={{ background: "repeating-conic-gradient(#ffffff15 0% 25%, transparent 0% 50%) 50%/12px 12px" }}>
            <motion.div
              className="w-full h-full rounded-lg"
              style={{ background: accent }}
              animate={{ opacity: value / 100 }}
              transition={{ duration: 0.15 }}
            />
          </div>
        </div>
      )
    case "spacing":
      return (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded bg-white/10 border border-white/10" />
          <motion.div
            animate={{ width: Math.min(Math.max(value, 2), 64) }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="h-1 rounded-full"
            style={{ background: accent }}
          />
          <div className="w-8 h-8 rounded bg-white/10 border border-white/10" />
        </div>
      )
    case "blur":
      return (
        <div className="relative">
          <div className="text-3xl font-bold text-white transition-all" style={{ filter: `blur(${value}px)` }}>
            Hello
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[10px] font-mono bg-black/60 px-1.5 py-0.5 rounded" style={{ color: accent }}>{value}px</span>
          </div>
        </div>
      )
    case "grid-columns":
      return (
        <div className="w-full grid gap-1" style={{ gridTemplateColumns: `repeat(${value}, 1fr)` }}>
          {Array.from({ length: value }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className="h-8 rounded"
              style={{ background: `${accent}30`, border: `1px solid ${accent}44` }}
            />
          ))}
        </div>
      )
    default:
      return <span className="text-2xl font-mono font-bold" style={{ color: accent }}>{value}</span>
  }
}

function ToggleChip({ widget, onChange }: { widget: Widget; onChange: (v: unknown) => void }) {
  const val = widget.value as { key: string; enabled: boolean }
  return (
    <motion.button
      whileHover={{ scale: 1.08, y: -1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onChange({ ...val, enabled: !val.enabled })}
      className="chip-inline"
      style={{
        borderColor: val.enabled ? "rgba(34,197,94,0.5)" : "rgba(255,255,255,0.15)",
        background: val.enabled ? "rgba(34,197,94,0.18)" : "rgba(255,255,255,0.08)",
        boxShadow: val.enabled
          ? "0 0 16px rgba(34,197,94,0.25), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)"
          : "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      <div className="relative w-8 h-[18px] rounded-full transition-colors" style={{
        background: val.enabled ? "#22C55E" : "#3F3F46",
        boxShadow: val.enabled ? "inset 0 1px 2px rgba(0,0,0,0.15), 0 0 8px rgba(34,197,94,0.3)" : "inset 0 1px 3px rgba(0,0,0,0.3)",
      }}>
        <motion.div
          animate={{ x: val.enabled ? 14 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
          className="absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.3), 0 0 0 0.5px rgba(0,0,0,0.05)" }}
        />
      </div>
      <span className="text-xs font-bold transition-all" style={{
        color: val.enabled ? "#22C55E" : "#71717A",
        textDecoration: val.enabled ? "none" : "line-through",
        textShadow: val.enabled ? "0 0 8px rgba(34,197,94,0.3)" : "none",
      }}>
        {val.key}
      </span>
    </motion.button>
  )
}

/** Compute WYSIWYG inline styles for the chip label based on widget type */
function getChipWysiwygStyle(widget: Widget): React.CSSProperties {
  const v = widget.value as any
  switch (widget.type) {
    case "font-family":
      return { fontFamily: `'${v.family}', sans-serif`, fontWeight: 700, letterSpacing: "-0.01em" }
    case "font-weight":
      return { fontWeight: v.value }
    case "letter-spacing":
      return { letterSpacing: `${v.value}em` }
    case "shadow": {
      const shadows: Record<string, string> = { none: "none", sm: "0 1px 3px rgba(255,255,255,0.08)", md: "0 4px 8px rgba(255,255,255,0.1)", lg: "0 8px 16px rgba(255,255,255,0.12)", xl: "0 16px 32px rgba(255,255,255,0.14)", "2xl": "0 24px 48px rgba(255,255,255,0.16)" }
      return { textShadow: shadows[v.preset] || "none" }
    }
    // WYSIWYG: text-decoration applies directly to label
    case "text-decoration":
      return { textDecoration: v.value === "none" ? "none" : v.value, textDecorationColor: "currentColor", textUnderlineOffset: "3px" }
    // WYSIWYG: text-transform applies directly
    case "text-transform":
      return { textTransform: v.value === "none" ? "none" : v.value }
    // WYSIWYG: text-overflow shows truncation
    case "text-overflow":
      return v.value === "ellipsis" || v.value === "truncate" ? { maxWidth: "80px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as any } : {}
    // WYSIWYG: transform applies to the label
    case "transform":
      return { transform: `rotate(${v.rotate}deg) scale(${v.scale}) skewX(${v.skewX}deg)`, display: "inline-block" }
    // WYSIWYG: filter applies to the label
    case "filter": {
      if (v.type === "none") return {}
      const filters: Record<string, string> = {
        grayscale: `grayscale(${v.value}%)`, sepia: `sepia(${v.value}%)`, saturate: `saturate(${v.value}%)`,
        "hue-rotate": `hue-rotate(${v.value}deg)`, invert: `invert(${v.value}%)`,
        brightness: `brightness(${v.value}%)`, contrast: `contrast(${v.value}%)`,
      }
      return { filter: filters[v.type] || "none" }
    }
    // WYSIWYG: cursor changes on the chip itself
    case "cursor":
      return { cursor: v.value }
    // 21st.dev components — label gets subtle reactive styling
    case "text-effect": {
      // Typing effect: show pipe cursor blinking feel
      const textFxStyles: Record<string, React.CSSProperties> = {
        "typing-animation": { borderRight: "2px solid currentColor" },
        "word-rotate": {},
        "gradual-spacing": { letterSpacing: "0.1em" },
        "sparkles-text": { textShadow: "0 0 4px currentColor" },
        "animated-gradient-text": { background: "linear-gradient(90deg, #EC4899, #8B5CF6, #3B82F6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
      }
      return textFxStyles[v.name] || {}
    }
    case "button-style": {
      const btnStyles: Record<string, React.CSSProperties> = {
        "shimmer-button": { textShadow: "0 0 6px currentColor" },
        "rainbow-button": { background: "linear-gradient(90deg, #EF4444, #F59E0B, #22C55E, #3B82F6, #8B5CF6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
      }
      return btnStyles[v.name] || {}
    }
    case "card-style":
    case "nav-style":
    case "device-frame":
    case "social-proof":
    case "scroll-effect":
    case "background":
    case "decoration":
    case "3d":
      return {} // these use container styles instead
    default:
      return {}
  }
}

/** Get WYSIWYG styles for the chip CONTAINER (border, shadow, background, etc.) */
function getChipContainerStyle(widget: Widget, baseColor: string): React.CSSProperties {
  const v = widget.value as any
  switch (widget.type) {
    case "shadow": {
      const s: Record<string, string> = { none: "none", sm: `0 1px 4px ${baseColor}33`, md: `0 4px 12px ${baseColor}44`, lg: `0 8px 24px ${baseColor}55`, xl: `0 16px 40px ${baseColor}55`, "2xl": `0 24px 56px ${baseColor}66` }
      return { boxShadow: s[v.preset] || "none" }
    }
    case "border":
      return { border: `${v.width}px ${v.style} ${v.color}55` }
    case "line-height":
      return { paddingTop: `${((v.value - 1) * 4 + 1)}px`, paddingBottom: `${((v.value - 1) * 4 + 1)}px` }
    case "effect": {
      const glows: Record<string, string> = {
        shimmer: `0 0 8px ${baseColor}44, inset 0 0 8px ${baseColor}22`,
        glow: `0 0 16px ${baseColor}55, 0 0 32px ${baseColor}33`,
        spotlight: `0 0 20px ${baseColor}66`,
        aurora: `0 0 12px #8B5CF644, 0 0 24px #3B82F633`,
        sparkles: `0 0 6px #FFFFFF44`,
      }
      return { boxShadow: glows[v.name] || "none" }
    }
    case "pattern": {
      const hex = Math.round(v.opacity * 2.55).toString(16).padStart(2, "0")
      const size = v.name === "dots" || v.name === "grid" ? "8px 8px" : "auto"
      const patterns: Record<string, string> = {
        dots: `radial-gradient(circle, ${baseColor}${hex} 1px, transparent 1px) 0 0 / ${size}`,
        grid: `linear-gradient(${baseColor}${hex} 1px, transparent 1px) 0 0 / ${size}, linear-gradient(90deg, ${baseColor}${hex} 1px, transparent 1px) 0 0 / ${size}`,
        diagonal: `repeating-linear-gradient(45deg, transparent, transparent 3px, ${baseColor}${hex} 3px, ${baseColor}${hex} 4px)`,
      }
      return patterns[v.name] ? { background: patterns[v.name] } : {}
    }
    case "button-variant": {
      const variants: Record<string, React.CSSProperties> = {
        default: { background: "#FAFAFA", color: "#09090B" },
        secondary: { background: "#27272A", color: "#FAFAFA" },
        outline: { background: "transparent", border: "1px solid rgba(255,255,255,0.2)" },
        ghost: { background: "transparent" },
        destructive: { background: "#EF4444", color: "white" },
        link: { background: "transparent", textDecoration: "underline", textUnderlineOffset: "3px" },
      }
      return variants[v.variant] || {}
    }
    // 21st.dev components — glow + colored shadows for each category
    case "text-effect":
      return { boxShadow: `0 0 12px ${baseColor}33`, borderColor: `${baseColor}55` }
    case "button-style":
      return { boxShadow: `0 0 16px ${baseColor}44, inset 0 1px 0 rgba(255,255,255,0.1)`, borderColor: `${baseColor}55` }
    case "background": {
      // Show a subtle pattern hint on the chip — use `background` shorthand only, never `backgroundImage`
      const bgPatterns: Record<string, string> = {
        "dot-pattern": `radial-gradient(circle, ${baseColor}22 1px, transparent 1px) 0 0 / 6px 6px`,
        "grid-pattern": `linear-gradient(${baseColor}15 1px, transparent 1px) 0 0 / 6px 6px, linear-gradient(90deg, ${baseColor}15 1px, transparent 1px) 0 0 / 6px 6px`,
        "retro-grid": `linear-gradient(${baseColor}20 1px, transparent 1px) 0 0 / 6px 6px, linear-gradient(90deg, ${baseColor}20 1px, transparent 1px) 0 0 / 6px 6px`,
      }
      return bgPatterns[v.name]
        ? { background: bgPatterns[v.name] }
        : { boxShadow: `0 0 12px ${baseColor}33` }
    }
    case "card-style":
      return { boxShadow: `0 4px 16px ${baseColor}33, 0 0 0 1px ${baseColor}22`, borderColor: `${baseColor}44` }
    case "decoration":
      return { boxShadow: `0 0 10px ${baseColor}44, 0 0 20px ${baseColor}22` }
    case "scroll-effect":
      return { boxShadow: `0 2px 8px ${baseColor}33` }
    case "nav-style":
      return { boxShadow: `0 1px 6px ${baseColor}33`, borderColor: `${baseColor}44` }
    case "device-frame":
      return { boxShadow: `0 4px 12px ${baseColor}33, inset 0 1px 0 rgba(255,255,255,0.08)`, borderColor: `${baseColor}44` }
    case "social-proof":
      return { boxShadow: `0 0 8px ${baseColor}33` }
    case "3d":
      return { boxShadow: `0 0 16px ${baseColor}44, 0 0 32px ${baseColor}22`, borderColor: `${baseColor}55` }
    // Remaining types that need container styling
    case "opacity":
      return { opacity: v.value / 100 }
    case "blur":
      return { backdropFilter: `blur(${Math.min(v.value, 4)}px)` }
    case "gradient": {
      const dirCSS: Record<string, string> = { "to-r": "to right", "to-l": "to left", "to-t": "to top", "to-b": "to bottom", "to-tr": "to top right", "to-br": "to bottom right", "to-tl": "to top left", "to-bl": "to bottom left" }
      return { background: `linear-gradient(${dirCSS[v.direction] || "to right"}, ${v.from}44, ${v.to}44)`, borderColor: `${v.from}55` }
    }
    case "color":
      return { borderColor: `${v.hex}66`, boxShadow: `0 0 8px ${v.hex}22` }
    default:
      return {}
  }
}

/** Get framer-motion animation for the widget icon */
function getIconAnimation(widget: Widget): Record<string, any> {
  const v = widget.value as any
  switch (widget.type) {
    case "animation": {
      switch (v.name) {
        case "bounce": return { y: [0, -4, 0] }
        case "pulse": return { scale: [1, 1.2, 1] }
        case "spin": return { rotate: [0, 360] }
        case "fade-in": return { opacity: [0.3, 1] }
        case "slide-up": return { y: [4, 0] }
        case "scale-in": return { scale: [0.5, 1] }
        case "elastic": return { x: [0, -3, 3, -2, 2, 0] }
        case "spring": return { y: [0, -6, 1, -2, 0] }
        default: return {}
      }
    }
    case "effect": {
      switch (v.name) {
        case "shimmer": return { opacity: [0.5, 1, 0.5], x: [-2, 2, -2] }
        case "glow": return { scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }
        case "spotlight": return { rotate: [0, 5, -5, 0] }
        case "aurora": return { y: [0, -2, 2, 0], opacity: [0.8, 1, 0.8] }
        case "particles": return { y: [0, -3, 0], x: [0, 2, -2, 0] }
        case "ripple": return { scale: [1, 1.1, 1] }
        case "meteor": return { x: [0, 4, 0], y: [0, 2, 0] }
        case "border-beam": return { rotate: [0, 360] }
        case "marquee": return { x: [0, -4, 4, 0] }
        case "blur-fade": return { opacity: [0.4, 1, 0.4] }
        case "sparkles": return { scale: [1, 1.2, 0.9, 1], rotate: [0, 10, -10, 0] }
        case "wave": return { y: [0, -3, 3, 0] }
        default: return {}
      }
    }
    case "flex-direction": {
      const rotations: Record<string, number> = { row: 0, column: 90, "row-reverse": 180, "column-reverse": 270 }
      return { rotate: rotations[v.value] ?? 0 }
    }
    case "justify-content":
    case "align-items":
      return { scale: [1, 1.05, 1] }
    case "cursor":
      return { scale: [1, 1.1, 1] }
    case "transform":
      return { rotate: v.rotate, scale: v.scale }
    default:
      // Fallback to universal animation map
      return universalIconAnims[widget.type] || { scale: [1, 1.05, 1] }
  }
}

/** ALL widget types that get an animated icon — every single one of the 47 */
function needsAnimatedIcon(type: string): boolean {
  // Every type gets an animated icon now
  return true
}

/**
 * Master icon animation map — EVERY widget type has an entry.
 * Widgets not in getIconAnimation's switch fall through to this.
 */
const universalIconAnims: Record<string, Record<string, any>> = {
  // Color group
  color: { scale: [1, 1.15, 1] },
  opacity: { opacity: [0.4, 1, 0.4] },
  gradient: { x: [-2, 2, -2] },
  filter: { rotate: [0, 8, -8, 0] },
  // Typography group
  "font-size": { scale: [0.85, 1.15, 0.85] },
  "font-family": { y: [0, -2, 0] },
  "font-weight": { scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] },
  "text-align": { x: [-2, 0, 2, 0] },
  "line-height": { y: [0, -1.5, 0, 1.5, 0] },
  "letter-spacing": { x: [0, 1, 2, 1, 0] },
  "text-decoration": { y: [0, 1, 0] },
  "text-transform": { scale: [1, 1.05, 1] },
  "text-overflow": { x: [0, -2, 0] },
  // Spacing group
  spacing: { x: [-1, 1, -1] },
  radius: { rotate: [0, 15, 0, -15, 0] },
  border: { scale: [1, 1.06, 1] },
  // Layout group
  "grid-columns": { scale: [1, 1.05, 1] },
  "flex-direction": { rotate: [0, 90, 180, 270, 360] },
  "justify-content": { x: [-2, 0, 2, 0] },
  "align-items": { y: [-2, 0, 2, 0] },
  position: { y: [0, -2, 0] },
  display: { scale: [0.9, 1, 0.9] },
  overflow: { y: [0, 2, 0] },
  "aspect-ratio": { scale: [1, 1.08, 1] },
  "object-fit": { scale: [1, 0.9, 1.1, 1] },
  breakpoint: { x: [0, -1, 1, 0] },
  // Effects group
  shadow: { y: [0, 1, 0], opacity: [0.8, 1, 0.8] },
  blur: { opacity: [0.5, 1, 0.5], scale: [1, 1.05, 1] },
  animation: {}, // handled in getIconAnimation switch
  effect: {},    // handled in getIconAnimation switch
  transform: {}, // handled in getIconAnimation switch
  decoration: { rotate: [0, 10, -10, 0], scale: [1, 1.15, 1] },
  "scroll-effect": { y: [0, -3, 3, 0] },
  // Logic group
  toggle: { x: [0, 3, 0] },
  select: { y: [0, 1, 0] },
  slider: { x: [-2, 2, -2] },
  cursor: { scale: [1, 1.1, 1], y: [0, -1, 0] },
  // Components — 21st.dev
  "text-effect": { opacity: [0.4, 1, 0.4], y: [0, -2, 0] },
  "button-style": { scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] },
  background: { opacity: [0.6, 1, 0.6], scale: [1, 1.03, 1] },
  "card-style": { y: [0, -2, 0], scale: [1, 1.05, 1] },
  "nav-style": { x: [-1, 1, -1] },
  "device-frame": { y: [0, -1.5, 0], scale: [1, 1.03, 1] },
  "social-proof": { scale: [1, 1.06, 1], x: [0, 1, 0] },
  "3d": { rotate: [0, 360] },
  "button-variant": { scale: [1, 1.08, 1] },
  pattern: { opacity: [0.5, 1, 0.5] },
}

function PresetChip({ widget, onChange, config }: {
  widget: Widget
  onChange: (v: unknown) => void
  config: { icon: string; color: string; getLabel: (w: Widget) => string; options: Array<{ label: string; value: unknown; icon?: string }> }
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  const wysiwygStyle = getChipWysiwygStyle(widget)
  const containerStyle = getChipContainerStyle(widget, config.color)
  const iconAnim = getIconAnimation(widget)
  const animated = needsAnimatedIcon(widget.type)

  // Find the icon of the currently selected option
  // Use partial match: check if all keys in the option's value match the widget's value
  const selectedOption = config.options.find((opt: any) => {
    const wv = widget.value as any
    const ov = opt.value as any
    if (typeof ov !== "object" || typeof wv !== "object") return JSON.stringify(ov) === JSON.stringify(wv)
    return Object.keys(ov).every((k) => JSON.stringify(ov[k]) === JSON.stringify(wv[k]))
  })
  const activeIcon = selectedOption?.icon || config.icon

  return (
    <div ref={ref} className="relative inline-flex align-middle">
      <motion.button
        whileHover={{ scale: 1.08, y: -1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="chip-inline"
        style={{
          borderColor: `${config.color}40`,
          background: `${config.color}18`,
          ...containerStyle,
          ...((wysiwygStyle as any).cursor ? { cursor: (wysiwygStyle as any).cursor } : {}),
        }}
      >
        {/* Animated icon — uses the selected option's icon, not the static config icon */}
        {animated && Object.keys(iconAnim).length > 0 ? (
          <motion.span
            key={activeIcon}
            className="text-sm"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ ...iconAnim, opacity: iconAnim.opacity || 1 }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
          >
            {activeIcon}
          </motion.span>
        ) : (
          <motion.span
            key={activeIcon}
            className="text-sm"
            initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            {activeIcon}
          </motion.span>
        )}
        {/* WYSIWYG label with reactive styles */}
        <motion.span
          key={config.getLabel(widget)}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-xs font-bold"
          style={{ color: config.color, ...wysiwygStyle }}
        >
          {config.getLabel(widget)}
        </motion.span>
        <span className="text-[8px] opacity-30">▾</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 4 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute top-full mt-2 left-0 z-50 bg-bg-elevated border border-white/10 rounded-2xl p-2 shadow-[0_16px_48px_rgba(0,0,0,0.6)] w-[180px] sm:w-[200px] max-h-[250px] sm:max-h-[300px] overflow-y-auto"
          >
            {config.options.map((opt, i) => {
              const selected = JSON.stringify(opt.value) === JSON.stringify(widget.value)
              // WYSIWYG: each option renders in its own style
              const optStyle: React.CSSProperties = {}
              if (widget.type === "font-family") {
                optStyle.fontFamily = `'${opt.label}', sans-serif`
                optStyle.fontWeight = 600
              }
              return (
                <motion.button
                  key={i}
                  whileHover={{ x: 2, background: `${config.color}15` }}
                  onClick={() => { onChange(opt.value); setOpen(false) }}
                  className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl cursor-pointer transition-all text-left"
                  style={{
                    background: selected ? `${config.color}20` : "transparent",
                    ...optStyle,
                  }}
                >
                  {opt.icon && <span className="text-sm w-5 text-center">{opt.icon}</span>}
                  <span className="text-xs font-medium flex-1">{opt.label}</span>
                  {selected && <span className="text-xs" style={{ color: config.color }}>✓</span>}
                </motion.button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// =============================================================================
// WIDGET DISPATCHER
// =============================================================================

const numericConfigs: Record<string, any> = {
  spacing: { icon: "↔", label: "Spacing", color: "#3B82F6", min: 0, max: 96, step: 4, unit: "px", presets: [0, 4, 8, 16, 24, 32, 48, 64], getValue: (w: Widget) => (w.value as any).value, buildValue: (n: number, w: Widget) => ({ ...(w.value as any), value: n }) },
  radius: { icon: "◐", label: "Radius", color: "#8B5CF6", min: 0, max: 50, step: 1, unit: "px", presets: [0, 4, 8, 12, 16, 24], getValue: (w: Widget) => (w.value as any).value, buildValue: (n: number, w: Widget) => ({ ...(w.value as any), value: n }) },
  "font-size": { icon: "Aa", label: "Font Size", color: "#EC4899", min: 8, max: 96, step: 1, unit: "px", presets: [12, 14, 16, 18, 24, 32, 48], getValue: (w: Widget) => (w.value as any).value, buildValue: (n: number, w: Widget) => ({ ...(w.value as any), value: n }) },
  opacity: { icon: "◑", label: "Opacity", color: "#22C55E", min: 0, max: 100, step: 5, unit: "%", presets: [0, 25, 50, 75, 100], getValue: (w: Widget) => (w.value as any).value, buildValue: (n: number, w: Widget) => ({ ...(w.value as any), value: n }) },
  slider: { icon: "━", label: "Value", color: "#F59E0B", min: 0, max: 100, step: 1, unit: "", presets: [0, 25, 50, 75, 100], getValue: (w: Widget) => w.value as number, buildValue: (n: number) => n },
  blur: { icon: "◉", label: "Blur", color: "#06B6D4", min: 0, max: 20, step: 1, unit: "px", presets: [0, 2, 4, 8, 12, 16, 20], getValue: (w: Widget) => (w.value as any).value, buildValue: (n: number, w: Widget) => ({ ...(w.value as any), value: n }) },
  "grid-columns": { icon: "▥", label: "Columns", color: "#F59E0B", min: 1, max: 12, step: 1, unit: "", presets: [1, 2, 3, 4, 6, 12], getValue: (w: Widget) => (w.value as any).value, buildValue: (n: number, w: Widget) => ({ ...(w.value as any), value: n }) },
}

const presetConfigs: Record<string, any> = {
  shadow: { icon: "🌑", color: "#64748B", getLabel: (w: Widget) => `shadow-${(w.value as any).preset}`, options: [
    { label: "None", value: { preset: "none" }, icon: "∅" },
    { label: "Shadow sm", value: { preset: "sm" }, icon: "◡" },
    { label: "Shadow md", value: { preset: "md" }, icon: "◑" },
    { label: "Shadow lg", value: { preset: "lg" }, icon: "◕" },
    { label: "Shadow xl", value: { preset: "xl" }, icon: "⬤" },
    { label: "Shadow 2xl", value: { preset: "2xl" }, icon: "🌑" },
  ]},
  animation: { icon: "🎬", color: "#8B5CF6", getLabel: (w: Widget) => (w.value as any).name, options: [
    { label: "Bounce", value: { name: "bounce", duration: 500 }, icon: "⬆" },
    { label: "Fade In", value: { name: "fade-in", duration: 300 }, icon: "✦" },
    { label: "Slide Up", value: { name: "slide-up", duration: 400 }, icon: "↑" },
    { label: "Scale In", value: { name: "scale-in", duration: 300 }, icon: "⊕" },
    { label: "Spring", value: { name: "spring", duration: 600, config: { stiffness: 300, damping: 20 } }, icon: "🎾" },
    { label: "Spin", value: { name: "spin", duration: 1000 }, icon: "↻" },
    { label: "Pulse", value: { name: "pulse", duration: 2000 }, icon: "◉" },
    { label: "Elastic", value: { name: "elastic", duration: 800, config: { stiffness: 200, damping: 10 } }, icon: "〰" },
  ]},
  "font-family": { icon: "𝔉", color: "#EC4899", getLabel: (w: Widget) => (w.value as any).family, options: [
    { label: "Inter", value: { family: "Inter" }, icon: "Aa" },
    { label: "Roboto", value: { family: "Roboto" }, icon: "Rr" },
    { label: "Poppins", value: { family: "Poppins" }, icon: "Pp" },
    { label: "Montserrat", value: { family: "Montserrat" }, icon: "Mm" },
    { label: "Playfair Display", value: { family: "Playfair Display" }, icon: "𝒫" },
    { label: "Fira Code", value: { family: "Fira Code" }, icon: "</>" },
    { label: "JetBrains Mono", value: { family: "JetBrains Mono" }, icon: "JB" },
    { label: "Space Grotesk", value: { family: "Space Grotesk" }, icon: "Sg" },
    { label: "DM Sans", value: { family: "DM Sans" }, icon: "Dm" },
    { label: "Geist", value: { family: "Geist" }, icon: "Gt" },
  ]},
  breakpoint: { icon: "📱", color: "#F59E0B", getLabel: (w: Widget) => `${(w.value as any).name} (${(w.value as any).width}px)`, options: [
    { label: "sm — 640px", value: { name: "sm", width: 640 }, icon: "📱" },
    { label: "md — 768px", value: { name: "md", width: 768 }, icon: "📱" },
    { label: "lg — 1024px", value: { name: "lg", width: 1024 }, icon: "💻" },
    { label: "xl — 1280px", value: { name: "xl", width: 1280 }, icon: "🖥️" },
  ]},
  select: { icon: "📋", color: "#6366F1", getLabel: (w: Widget) => (w.value as any).selected || (w.value as any).key, options: [] },
  "font-weight": { icon: "B", color: "#F97316", getLabel: (w: Widget) => { const labels: Record<number, string> = { 100: "Thin", 200: "ExtraLight", 300: "Light", 400: "Regular", 500: "Medium", 600: "SemiBold", 700: "Bold", 800: "ExtraBold", 900: "Black" }; return labels[(w.value as any).value] || `${(w.value as any).value}` }, options: [
    { label: "Thin", value: { value: 100 }, icon: "Tₕ" },
    { label: "ExtraLight", value: { value: 200 }, icon: "El" },
    { label: "Light", value: { value: 300 }, icon: "Lt" },
    { label: "Regular", value: { value: 400 }, icon: "Rg" },
    { label: "Medium", value: { value: 500 }, icon: "Md" },
    { label: "SemiBold", value: { value: 600 }, icon: "Sb" },
    { label: "Bold", value: { value: 700 }, icon: "B" },
    { label: "ExtraBold", value: { value: 800 }, icon: "Eb" },
    { label: "Black", value: { value: 900 }, icon: "Bk" },
  ]},
  "text-align": { icon: "≡", color: "#14B8A6", getLabel: (w: Widget) => (w.value as any).value, options: [
    { label: "Left", value: { value: "left" }, icon: "◧" },
    { label: "Center", value: { value: "center" }, icon: "◫" },
    { label: "Right", value: { value: "right" }, icon: "◨" },
    { label: "Justify", value: { value: "justify" }, icon: "☰" },
  ]},
  "line-height": { icon: "¶", color: "#A855F7", getLabel: (w: Widget) => (w.value as any).label, options: [
    { label: "Tight (1.25)", value: { value: 1.25, label: "tight" }, icon: "≡" },
    { label: "Snug (1.375)", value: { value: 1.375, label: "snug" }, icon: "≡" },
    { label: "Normal (1.5)", value: { value: 1.5, label: "normal" }, icon: "¶" },
    { label: "Relaxed (1.625)", value: { value: 1.625, label: "relaxed" }, icon: "⏐" },
    { label: "Loose (2)", value: { value: 2, label: "loose" }, icon: "⟘" },
  ]},
  "letter-spacing": { icon: "AV", color: "#F43F5E", getLabel: (w: Widget) => (w.value as any).label, options: [
    { label: "Tighter (-0.05em)", value: { value: -0.05, label: "tighter" }, icon: "»" },
    { label: "Tight (-0.025em)", value: { value: -0.025, label: "tight" }, icon: "›" },
    { label: "Normal (0)", value: { value: 0, label: "normal" }, icon: "AV" },
    { label: "Wide (0.025em)", value: { value: 0.025, label: "wide" }, icon: "A V" },
    { label: "Wider (0.05em)", value: { value: 0.05, label: "wider" }, icon: "A  V" },
    { label: "Widest (0.1em)", value: { value: 0.1, label: "widest" }, icon: "A   V" },
  ]},
  border: { icon: "▢", color: "#64748B", getLabel: (w: Widget) => `${(w.value as any).width}px ${(w.value as any).style}`, options: [
    { label: "None", value: { width: 0, style: "none", color: "#FFFFFF" }, icon: "∅" },
    { label: "1px solid", value: { width: 1, style: "solid", color: "#FFFFFF" }, icon: "▢" },
    { label: "2px solid", value: { width: 2, style: "solid", color: "#FFFFFF" }, icon: "◻" },
    { label: "1px dashed", value: { width: 1, style: "dashed", color: "#FFFFFF" }, icon: "▤" },
    { label: "2px dashed", value: { width: 2, style: "dashed", color: "#FFFFFF" }, icon: "▥" },
    { label: "1px dotted", value: { width: 1, style: "dotted", color: "#FFFFFF" }, icon: "⊡" },
  ]},
  // --- Effects & Interactions ---
  effect: { icon: "✦", color: "#E879F9", getLabel: (w: Widget) => `${(w.value as any).name}`, options: [
    { label: "Shimmer", value: { name: "shimmer", intensity: "normal" }, icon: "✨" },
    { label: "Glow", value: { name: "glow", intensity: "normal" }, icon: "💡" },
    { label: "Spotlight", value: { name: "spotlight", intensity: "normal" }, icon: "🔦" },
    { label: "Aurora", value: { name: "aurora", intensity: "normal" }, icon: "🌌" },
    { label: "Particles", value: { name: "particles", intensity: "normal" }, icon: "🫧" },
    { label: "Ripple", value: { name: "ripple", intensity: "normal" }, icon: "◎" },
    { label: "Meteor", value: { name: "meteor", intensity: "normal" }, icon: "☄" },
    { label: "Border Beam", value: { name: "border-beam", intensity: "normal" }, icon: "⬡" },
    { label: "Marquee", value: { name: "marquee", intensity: "normal" }, icon: "↔" },
    { label: "Blur Fade", value: { name: "blur-fade", intensity: "normal" }, icon: "◐" },
    { label: "Sparkles", value: { name: "sparkles", intensity: "normal" }, icon: "⭐" },
    { label: "Wave", value: { name: "wave", intensity: "normal" }, icon: "〰" },
  ]},
  cursor: { icon: "👆", color: "#F59E0B", getLabel: (w: Widget) => (w.value as any).value, options: [
    { label: "Default", value: { value: "default" }, icon: "↖" },
    { label: "Pointer", value: { value: "pointer" }, icon: "👆" },
    { label: "Grab", value: { value: "grab" }, icon: "✊" },
    { label: "Crosshair", value: { value: "crosshair" }, icon: "+" },
    { label: "Text", value: { value: "text" }, icon: "I" },
    { label: "Move", value: { value: "move" }, icon: "✥" },
    { label: "Not Allowed", value: { value: "not-allowed" }, icon: "🚫" },
    { label: "Wait", value: { value: "wait" }, icon: "⏳" },
    { label: "Zoom In", value: { value: "zoom-in" }, icon: "🔍" },
    { label: "None", value: { value: "none" }, icon: "∅" },
  ]},
  filter: { icon: "◈", color: "#06B6D4", getLabel: (w: Widget) => (w.value as any).type === "none" ? "none" : `${(w.value as any).type} ${(w.value as any).value}%`, options: [
    { label: "None", value: { type: "none", value: 100 }, icon: "∅" },
    { label: "Grayscale", value: { type: "grayscale", value: 100 }, icon: "◐" },
    { label: "Sepia", value: { type: "sepia", value: 100 }, icon: "🟤" },
    { label: "Saturate 150%", value: { type: "saturate", value: 150 }, icon: "🌈" },
    { label: "Hue Rotate 90°", value: { type: "hue-rotate", value: 90 }, icon: "🔄" },
    { label: "Invert", value: { type: "invert", value: 100 }, icon: "◑" },
    { label: "Brightness 120%", value: { type: "brightness", value: 120 }, icon: "☀" },
    { label: "Contrast 150%", value: { type: "contrast", value: 150 }, icon: "◕" },
  ]},
  // --- Layout Advanced ---
  "flex-direction": { icon: "→", color: "#14B8A6", getLabel: (w: Widget) => { const icons: Record<string,string> = { row: "→", column: "↓", "row-reverse": "←", "column-reverse": "↑" }; return `${icons[(w.value as any).value]||""} ${(w.value as any).value}` }, options: [
    { label: "Row →", value: { value: "row" }, icon: "→" },
    { label: "Column ↓", value: { value: "column" }, icon: "↓" },
    { label: "Row Reverse ←", value: { value: "row-reverse" }, icon: "←" },
    { label: "Column Reverse ↑", value: { value: "column-reverse" }, icon: "↑" },
  ]},
  "justify-content": { icon: "⇔", color: "#8B5CF6", getLabel: (w: Widget) => `justify-${(w.value as any).value}`, options: [
    { label: "Start", value: { value: "start" }, icon: "◁" },
    { label: "Center", value: { value: "center" }, icon: "◇" },
    { label: "End", value: { value: "end" }, icon: "▷" },
    { label: "Space Between", value: { value: "between" }, icon: "⟷" },
    { label: "Space Around", value: { value: "around" }, icon: "↔" },
    { label: "Space Evenly", value: { value: "evenly" }, icon: "≡" },
  ]},
  "align-items": { icon: "⇕", color: "#EC4899", getLabel: (w: Widget) => `items-${(w.value as any).value}`, options: [
    { label: "Start", value: { value: "start" }, icon: "△" },
    { label: "Center", value: { value: "center" }, icon: "◇" },
    { label: "End", value: { value: "end" }, icon: "▽" },
    { label: "Stretch", value: { value: "stretch" }, icon: "↕" },
    { label: "Baseline", value: { value: "baseline" }, icon: "—" },
  ]},
  position: { icon: "◎", color: "#F97316", getLabel: (w: Widget) => (w.value as any).value, options: [
    { label: "Static", value: { value: "static" }, icon: "▪" },
    { label: "Relative", value: { value: "relative" }, icon: "↗" },
    { label: "Absolute", value: { value: "absolute" }, icon: "⊹" },
    { label: "Fixed", value: { value: "fixed" }, icon: "📌" },
    { label: "Sticky", value: { value: "sticky" }, icon: "📎" },
  ]},
  display: { icon: "☐", color: "#3B82F6", getLabel: (w: Widget) => (w.value as any).value, options: [
    { label: "Flex", value: { value: "flex" }, icon: "⬛" },
    { label: "Grid", value: { value: "grid" }, icon: "▥" },
    { label: "Block", value: { value: "block" }, icon: "▬" },
    { label: "Inline", value: { value: "inline" }, icon: "▸" },
    { label: "Inline-flex", value: { value: "inline-flex" }, icon: "⬛" },
    { label: "None", value: { value: "none" }, icon: "∅" },
  ]},
  overflow: { icon: "⧉", color: "#64748B", getLabel: (w: Widget) => `overflow-${(w.value as any).value}`, options: [
    { label: "Visible", value: { value: "visible" }, icon: "👁" },
    { label: "Hidden", value: { value: "hidden" }, icon: "🙈" },
    { label: "Scroll", value: { value: "scroll" }, icon: "↕" },
    { label: "Auto", value: { value: "auto" }, icon: "⟳" },
    { label: "Clip", value: { value: "clip" }, icon: "✂" },
  ]},
  "aspect-ratio": { icon: "⬛", color: "#F59E0B", getLabel: (w: Widget) => (w.value as any).label, options: [
    { label: "1:1 Square", value: { value: "1/1", label: "1:1" }, icon: "■" },
    { label: "16:9 Wide", value: { value: "16/9", label: "16:9" }, icon: "▬" },
    { label: "4:3 Classic", value: { value: "4/3", label: "4:3" }, icon: "▭" },
    { label: "3:2 Photo", value: { value: "3/2", label: "3:2" }, icon: "▭" },
    { label: "21:9 Ultra", value: { value: "21/9", label: "21:9" }, icon: "━" },
  ]},
  "object-fit": { icon: "🖼", color: "#22C55E", getLabel: (w: Widget) => `object-${(w.value as any).value}`, options: [
    { label: "Cover", value: { value: "cover" }, icon: "⬛" },
    { label: "Contain", value: { value: "contain" }, icon: "◻" },
    { label: "Fill", value: { value: "fill" }, icon: "▬" },
    { label: "None", value: { value: "none" }, icon: "∅" },
    { label: "Scale Down", value: { value: "scale-down" }, icon: "⊟" },
  ]},
  // --- Typography Advanced ---
  "text-decoration": { icon: "U̲", color: "#A855F7", getLabel: (w: Widget) => (w.value as any).value, options: [
    { label: "None", value: { value: "none" }, icon: "∅" },
    { label: "Underline", value: { value: "underline" }, icon: "U̲" },
    { label: "Line Through", value: { value: "line-through" }, icon: "S̶" },
    { label: "Overline", value: { value: "overline" }, icon: "O̅" },
  ]},
  "text-transform": { icon: "Aa", color: "#EC4899", getLabel: (w: Widget) => { const l: Record<string,string> = { none: "as-is", uppercase: "UPPER", lowercase: "lower", capitalize: "Title" }; return l[(w.value as any).value] || (w.value as any).value }, options: [
    { label: "None", value: { value: "none" }, icon: "Aa" },
    { label: "UPPERCASE", value: { value: "uppercase" }, icon: "AA" },
    { label: "lowercase", value: { value: "lowercase" }, icon: "aa" },
    { label: "Capitalize", value: { value: "capitalize" }, icon: "Ab" },
  ]},
  "text-overflow": { icon: "…", color: "#F43F5E", getLabel: (w: Widget) => (w.value as any).value, options: [
    { label: "Clip", value: { value: "clip" }, icon: "✂" },
    { label: "Ellipsis …", value: { value: "ellipsis" }, icon: "…" },
    { label: "Truncate", value: { value: "truncate" }, icon: "⤏" },
  ]},
  // --- Component-Level ---
  "button-variant": { icon: "☐", color: "#3B82F6", getLabel: (w: Widget) => `${(w.value as any).variant} (${(w.value as any).size})`, options: [
    { label: "Default", value: { variant: "default", size: "default" }, icon: "▪" },
    { label: "Secondary", value: { variant: "secondary", size: "default" }, icon: "▫" },
    { label: "Outline", value: { variant: "outline", size: "default" }, icon: "▢" },
    { label: "Ghost", value: { variant: "ghost", size: "default" }, icon: "👻" },
    { label: "Destructive", value: { variant: "destructive", size: "default" }, icon: "🔴" },
    { label: "Link", value: { variant: "link", size: "default" }, icon: "🔗" },
    { label: "Small", value: { variant: "default", size: "sm" }, icon: "🔹" },
    { label: "Large", value: { variant: "default", size: "lg" }, icon: "🔷" },
    { label: "Icon", value: { variant: "default", size: "icon" }, icon: "⊡" },
  ]},
  pattern: { icon: "░", color: "#64748B", getLabel: (w: Widget) => `${(w.value as any).name} ${(w.value as any).opacity}%`, options: [
    { label: "None", value: { name: "none", opacity: 0 }, icon: "∅" },
    { label: "Dots", value: { name: "dots", opacity: 20 }, icon: "⋯" },
    { label: "Grid", value: { name: "grid", opacity: 15 }, icon: "▦" },
    { label: "Diagonal", value: { name: "diagonal", opacity: 15 }, icon: "╲" },
    { label: "Cross", value: { name: "cross", opacity: 15 }, icon: "+" },
    { label: "Zigzag", value: { name: "zigzag", opacity: 20 }, icon: "⌇" },
    { label: "Waves", value: { name: "waves", opacity: 20 }, icon: "〰" },
  ]},
  // Transform has its own special handling
  transform: { icon: "⟲", color: "#F97316", getLabel: (w: Widget) => { const v = (w.value as any); const p = []; if (v.rotate) p.push(`${v.rotate}°`); if (v.scale !== 1) p.push(`×${v.scale}`); return p.length ? p.join(" ") : "none" }, options: [
    { label: "None", value: { rotate: 0, scale: 1, skewX: 0, skewY: 0 }, icon: "∅" },
    { label: "Rotate 45°", value: { rotate: 45, scale: 1, skewX: 0, skewY: 0 }, icon: "↗" },
    { label: "Rotate 90°", value: { rotate: 90, scale: 1, skewX: 0, skewY: 0 }, icon: "→" },
    { label: "Rotate 180°", value: { rotate: 180, scale: 1, skewX: 0, skewY: 0 }, icon: "↓" },
    { label: "Scale 0.5×", value: { rotate: 0, scale: 0.5, skewX: 0, skewY: 0 }, icon: "⊟" },
    { label: "Scale 1.5×", value: { rotate: 0, scale: 1.5, skewX: 0, skewY: 0 }, icon: "⊞" },
    { label: "Scale 2×", value: { rotate: 0, scale: 2, skewX: 0, skewY: 0 }, icon: "⬛" },
    { label: "Skew 10°", value: { rotate: 0, scale: 1, skewX: 10, skewY: 0 }, icon: "◇" },
  ]},
  // === 21st.dev Components ===
  "text-effect": { icon: "✨", color: "#E879F9", getLabel: (w: Widget) => (w.value as any).name, options: [
    { label: "Typing Animation", value: { name: "typing-animation", source: "magicui" }, icon: "⌨" },
    { label: "Word Rotate", value: { name: "word-rotate", source: "magicui" }, icon: "🔄" },
    { label: "Gradual Spacing", value: { name: "gradual-spacing", source: "magicui" }, icon: "↔" },
    { label: "Fade Text", value: { name: "fade-text", source: "magicui" }, icon: "◐" },
    { label: "Blur In", value: { name: "blur-in", source: "magicui" }, icon: "◉" },
    { label: "Flip Text", value: { name: "flip-text", source: "magicui" }, icon: "🔃" },
    { label: "Sparkles Text", value: { name: "sparkles-text", source: "magicui" }, icon: "⭐" },
    { label: "Hyper Text", value: { name: "hyper-text", source: "magicui" }, icon: "⚡" },
    { label: "Animated Gradient", value: { name: "animated-gradient-text", source: "magicui" }, icon: "🌈" },
    { label: "Number Ticker", value: { name: "number-ticker", source: "magicui" }, icon: "🔢" },
    { label: "Text Generate", value: { name: "text-generate-effect", source: "aceternity" }, icon: "✦" },
    { label: "Text Reveal Card", value: { name: "text-reveal-card", source: "aceternity" }, icon: "📄" },
  ]},
  "button-style": { icon: "◆", color: "#3B82F6", getLabel: (w: Widget) => (w.value as any).name, options: [
    { label: "Shimmer Button", value: { name: "shimmer-button", source: "magicui" }, icon: "✨" },
    { label: "Rainbow Button", value: { name: "rainbow-button", source: "magicui" }, icon: "🌈" },
    { label: "Shiny Button", value: { name: "shiny-button", source: "magicui" }, icon: "💎" },
    { label: "Pulsating Button", value: { name: "pulsating-button", source: "magicui" }, icon: "◉" },
    { label: "Hover Button", value: { name: "interactive-hover-button", source: "magicui" }, icon: "👆" },
    { label: "Subscribe Button", value: { name: "animated-subscribe-button", source: "magicui" }, icon: "📧" },
    { label: "Moving Border", value: { name: "moving-border", source: "aceternity" }, icon: "⬡" },
    { label: "Border Gradient", value: { name: "hover-border-gradient", source: "aceternity" }, icon: "◈" },
  ]},
  background: { icon: "◫", color: "#14B8A6", getLabel: (w: Widget) => (w.value as any).name, options: [
    { label: "Dot Pattern", value: { name: "dot-pattern", source: "magicui" }, icon: "⋯" },
    { label: "Grid Pattern", value: { name: "grid-pattern", source: "magicui" }, icon: "▦" },
    { label: "Retro Grid", value: { name: "retro-grid", source: "magicui" }, icon: "▥" },
    { label: "Flickering Grid", value: { name: "flickering-grid", source: "magicui" }, icon: "▣" },
    { label: "Background Beams", value: { name: "background-beams", source: "aceternity" }, icon: "═" },
    { label: "Wavy Background", value: { name: "wavy-background", source: "aceternity" }, icon: "〰" },
    { label: "Aurora", value: { name: "aurora-background", source: "aceternity" }, icon: "🌌" },
    { label: "Spotlight", value: { name: "spotlight", source: "aceternity" }, icon: "🔦" },
    { label: "Particles", value: { name: "particles", source: "magicui" }, icon: "🫧" },
    { label: "Meteors", value: { name: "meteors", source: "magicui" }, icon: "☄" },
    { label: "Ripple", value: { name: "ripple", source: "magicui" }, icon: "◎" },
  ]},
  "card-style": { icon: "▭", color: "#F59E0B", getLabel: (w: Widget) => (w.value as any).name, options: [
    { label: "Magic Card", value: { name: "magic-card", source: "magicui" }, icon: "✨" },
    { label: "Neon Gradient Card", value: { name: "neon-gradient-card", source: "magicui" }, icon: "💜" },
    { label: "Bento Grid", value: { name: "bento-grid", source: "magicui" }, icon: "▥" },
    { label: "Direction Hover", value: { name: "direction-aware-hover", source: "aceternity" }, icon: "👆" },
    { label: "Hover Effect", value: { name: "card-hover-effect", source: "aceternity" }, icon: "🔲" },
    { label: "Shine Border", value: { name: "shine-border", source: "magicui" }, icon: "💎" },
  ]},
  decoration: { icon: "⟡", color: "#F43F5E", getLabel: (w: Widget) => (w.value as any).name, options: [
    { label: "Sparkles", value: { name: "sparkles", source: "aceternity" }, icon: "⭐" },
    { label: "Confetti", value: { name: "confetti", source: "magicui" }, icon: "🎊" },
    { label: "Border Beam", value: { name: "border-beam", source: "magicui" }, icon: "⬡" },
    { label: "Animated Beam", value: { name: "animated-beam", source: "magicui" }, icon: "═" },
    { label: "Orbiting Circles", value: { name: "orbiting-circles", source: "magicui" }, icon: "◎" },
    { label: "Cool Mode", value: { name: "cool-mode", source: "magicui" }, icon: "😎" },
    { label: "Tracing Beam", value: { name: "tracing-beam", source: "aceternity" }, icon: "╎" },
    { label: "Scratch to Reveal", value: { name: "scratch-to-reveal", source: "magicui" }, icon: "🎫" },
  ]},
  "scroll-effect": { icon: "↕", color: "#8B5CF6", getLabel: (w: Widget) => (w.value as any).name, options: [
    { label: "Parallax Scroll", value: { name: "parallax-scroll", source: "aceternity" }, icon: "↕" },
    { label: "Velocity Scroll", value: { name: "scroll-based-velocity", source: "magicui" }, icon: "⏩" },
    { label: "Blur Fade", value: { name: "blur-fade", source: "magicui" }, icon: "◐" },
    { label: "Box Reveal", value: { name: "box-reveal", source: "magicui" }, icon: "▭" },
  ]},
  "nav-style": { icon: "☰", color: "#06B6D4", getLabel: (w: Widget) => (w.value as any).name, options: [
    { label: "Floating Navbar", value: { name: "floating-navbar", source: "aceternity" }, icon: "▔" },
    { label: "Dock", value: { name: "dock", source: "magicui" }, icon: "≡" },
    { label: "Tabs", value: { name: "tabs", source: "aceternity" }, icon: "⊟" },
  ]},
  "device-frame": { icon: "📱", color: "#22C55E", getLabel: (w: Widget) => (w.value as any).name, options: [
    { label: "iPhone 15 Pro", value: { name: "iphone-15-pro", source: "magicui" }, icon: "📱" },
    { label: "Safari", value: { name: "safari", source: "magicui" }, icon: "🧭" },
    { label: "Terminal", value: { name: "terminal", source: "magicui" }, icon: ">_" },
  ]},
  "social-proof": { icon: "👥", color: "#EC4899", getLabel: (w: Widget) => (w.value as any).name, options: [
    { label: "Avatar Circles", value: { name: "avatar-circles", source: "magicui" }, icon: "👥" },
    { label: "Marquee", value: { name: "marquee", source: "magicui" }, icon: "↔" },
    { label: "Animated List", value: { name: "animated-list", source: "magicui" }, icon: "📋" },
    { label: "Tweet Card", value: { name: "tweet-card", source: "magicui" }, icon: "🐦" },
    { label: "Number Ticker", value: { name: "number-ticker", source: "magicui" }, icon: "🔢" },
    { label: "Progress Bar", value: { name: "animated-circular-progress-bar", source: "magicui" }, icon: "◔" },
    { label: "Gauge", value: { name: "gauge-circle", source: "magicui" }, icon: "⏲" },
    { label: "Icon Cloud", value: { name: "icon-cloud", source: "magicui" }, icon: "☁" },
  ]},
  "3d": { icon: "🌍", color: "#6366F1", getLabel: (w: Widget) => (w.value as any).name, options: [
    { label: "Globe", value: { name: "globe", source: "magicui" }, icon: "🌍" },
    { label: "Orbiting Circles", value: { name: "orbiting-circles", source: "magicui" }, icon: "◎" },
  ]},
}

/** Gradient has its own special chip with dual color pickers */
function GradientChip({ widget, onChange }: { widget: Widget; onChange: (v: unknown) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const val = widget.value as { from: string; to: string; direction: string }
  const dirs = ["to-r", "to-l", "to-t", "to-b", "to-tr", "to-br", "to-tl", "to-bl"]
  const dirCSS: Record<string, string> = { "to-r": "to right", "to-l": "to left", "to-t": "to top", "to-b": "to bottom", "to-tr": "to top right", "to-br": "to bottom right", "to-tl": "to top left", "to-bl": "to bottom left" }

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  return (
    <div ref={ref} className="relative inline-flex align-middle">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/15 cursor-pointer"
        style={{ background: `linear-gradient(${dirCSS[val.direction] || "to right"}, ${val.from}, ${val.to})` }}
      >
        <span className="text-xs font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
          {val.from} → {val.to}
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 4 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute top-full mt-2 left-0 z-50 bg-bg-elevated border border-white/10 rounded-2xl p-3 sm:p-4 shadow-[0_16px_48px_rgba(0,0,0,0.6)] w-[240px]"
          >
            {/* Preview */}
            <div className="w-full h-12 rounded-xl mb-3" style={{ background: `linear-gradient(${dirCSS[val.direction] || "to right"}, ${val.from}, ${val.to})` }} />
            {/* Color pickers */}
            <div className="flex gap-2 mb-3">
              <div className="flex-1">
                <div className="text-[9px] font-bold uppercase text-text-dim mb-1">From</div>
                <div className="flex items-center gap-1.5">
                  <input type="color" value={val.from} onChange={(e) => onChange({ ...val, from: e.target.value })} className="w-7 h-7 rounded cursor-pointer border-0" />
                  <span className="text-[10px] font-mono">{val.from}</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-[9px] font-bold uppercase text-text-dim mb-1">To</div>
                <div className="flex items-center gap-1.5">
                  <input type="color" value={val.to} onChange={(e) => onChange({ ...val, to: e.target.value })} className="w-7 h-7 rounded cursor-pointer border-0" />
                  <span className="text-[10px] font-mono">{val.to}</span>
                </div>
              </div>
            </div>
            {/* Direction */}
            <div className="text-[9px] font-bold uppercase text-text-dim mb-1.5">Direction</div>
            <div className="grid grid-cols-4 gap-1">
              {dirs.map(d => (
                <button key={d} onClick={() => onChange({ ...val, direction: d })}
                  className="px-1.5 py-1 rounded-lg text-[10px] font-mono cursor-pointer transition-all border-0"
                  style={{ background: d === val.direction ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.03)", color: d === val.direction ? "#FFF" : "#71717A" }}>
                  {d}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function InteractiveWidget({ widget, onChange }: { widget: Widget; onChange: (v: unknown) => void }) {
  if (widget.type === "color") return <ColorChip widget={widget} onChange={onChange} />
  if (widget.type === "toggle") return <ToggleChip widget={widget} onChange={onChange} />
  if (widget.type === "gradient") return <GradientChip widget={widget} onChange={onChange} />
  if (numericConfigs[widget.type]) return <NumericChip widget={widget} onChange={onChange} config={numericConfigs[widget.type]} />
  if (presetConfigs[widget.type]) {
    const cfg = { ...presetConfigs[widget.type] }
    if (widget.type === "select") {
      const meta = widget.meta as any
      cfg.options = meta.options?.map((o: any) => ({ label: o.label || o.value, value: { ...(widget.value as any), selected: o.value } })) || []
    }
    return <PresetChip widget={widget} onChange={onChange} config={cfg} />
  }
  return <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono">{widget.type}</span>
}

// =============================================================================
// MAIN PLAYGROUND
// =============================================================================

const categoryConfig: Record<string, { label: string; icon: string }> = {
  color: { label: "Color", icon: "🎨" },
  typography: { label: "Type", icon: "Aa" },
  spacing: { label: "Space", icon: "↔" },
  layout: { label: "Layout", icon: "📐" },
  effects: { label: "Effects", icon: "✦" },
  components: { label: "UI", icon: "🧩" },
  logic: { label: "Logic", icon: "🔀" },
  // Legacy
  design: { label: "Design", icon: "🎨" },
  animation: { label: "Animate", icon: "🎬" },
}

function PlaygroundInner() {
  const [lastOutput, setLastOutput] = useState<SerializedPrompt | null>(null)
  const [activeTab, setActiveTab] = useState<string>("design")
  const [showOutput, setShowOutput] = useState(false)
  const { registry, listWidgets, categories } = usePromptKit()
  const { text, widgets, setText, insertWidget, removeWidget, updateWidget, getSerializedPrompt } = useRichPrompt()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleInsert = useCallback((type: string) => {
    const pos = textareaRef.current?.selectionStart ?? text.length
    insertWidget(type, pos)
    setTimeout(() => textareaRef.current?.focus(), 0)
  }, [insertWidget, text.length])

  const handleSubmit = useCallback(() => {
    if (!text.trim() && widgets.length === 0) return
    setLastOutput(getSerializedPrompt())
  }, [text, widgets, getSerializedPrompt])

  const liveOutput = (() => { try { return getSerializedPrompt() } catch { return null } })()

  const PLACEHOLDER_REGEX = /(\{\{widget:[^}]+\}\})/g
  const PLACEHOLDER_ID_REGEX = /\{\{widget:([^}]+)\}\}/
  const widgetMap = new Map(widgets.map((w) => [w.id, w]))
  const segments = text.split(PLACEHOLDER_REGEX)

  const paletteWidgets = listWidgets(activeTab as WidgetCategory).filter(def => def.type !== "select")

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-3 sm:px-5 py-2.5 sm:py-3 border-b border-border shrink-0">
        <a href="/" className="flex items-center gap-1.5 sm:gap-2 text-sm font-bold text-text no-underline">
          <span className="text-base sm:text-lg">🧩</span>
          <span>PromptKit</span>
          <span className="text-text-dim font-normal hidden sm:inline">Playground</span>
        </a>
        <div className="flex items-center gap-2">
          {/* Mobile toggle for output panel */}
          <button
            onClick={() => setShowOutput(!showOutput)}
            className="lg:hidden flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer transition-all border-0"
            style={{
              background: showOutput ? "rgba(168,85,247,0.15)" : "rgba(255,255,255,0.05)",
              color: showOutput ? "#A855F7" : "#71717A",
            }}
          >
            <span>{showOutput ? "✕" : "{ }"}</span>
            <span className="hidden sm:inline">{showOutput ? "Hide" : "Output"}</span>
          </button>
          <span className="text-[10px] px-2 sm:px-2.5 py-1 rounded-full bg-accent-muted text-accent border border-accent/20 font-semibold">
            v0.1.0
          </span>
        </div>
      </header>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Editor area */}
        <main className="flex-1 flex flex-col p-3 sm:p-4 lg:p-6 overflow-y-auto">
          {/* Rich display with interactive widgets */}
          <div className="mb-3 sm:mb-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-text-dim mb-2 sm:mb-3">Prompt</div>

            {widgets.length > 0 && (
              <motion.div
                layout
                className="p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-border bg-bg-subtle mb-3 text-sm sm:text-[15px] leading-[2.4] sm:leading-[2.6] break-words"
              >
                {segments.map((segment, i) => {
                  const match = segment.match(PLACEHOLDER_ID_REGEX)
                  if (match) {
                    const w = widgetMap.get(match[1])
                    if (!w) return <span key={i} className="text-red/50">[?]</span>
                    return (
                      <motion.span
                        key={w.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-0.5 align-middle"
                      >
                        <InteractiveWidget widget={w} onChange={(val) => updateWidget(w.id, val)} />
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.8 }}
                          onClick={() => removeWidget(w.id)}
                          className="flex items-center justify-center w-4 h-4 rounded-full bg-white/5 hover:bg-red/20 text-text-dim hover:text-red text-[9px] cursor-pointer transition-colors ml-0.5 shrink-0 border-0"
                        >
                          ✕
                        </motion.button>
                      </motion.span>
                    )
                  }
                  return <span key={i}>{segment}</span>
                })}
              </motion.div>
            )}

            {/* Input row — textarea shows clean text without widget placeholders */}
            <div className="flex gap-2 items-end">
              <textarea
                ref={textareaRef}
                value={text.replace(/\{\{widget:[^}]+\}\}/g, "")}
                onChange={(e) => {
                  // Reconstruct the full text: keep widget placeholders, update the typed parts
                  const clean = e.target.value
                  // If user is typing fresh text (no widgets yet), just set directly
                  if (widgets.length === 0) {
                    setText(clean)
                  } else {
                    // Preserve widget placeholders and append/prepend typed text
                    const placeholders = text.match(/\{\{widget:[^}]+\}\}/g) || []
                    setText(clean + placeholders.join(""))
                  }
                }}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit() } }}
                placeholder="Type your prompt, then drop widgets from below..."
                rows={2}
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-border bg-bg-subtle text-sm sm:text-[15px] text-text placeholder:text-text-faint resize-none outline-none focus:border-accent/40 transition-colors font-sans"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={!text.trim() && widgets.length === 0}
                className="px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-accent text-white text-xs sm:text-sm font-bold cursor-pointer disabled:opacity-30 transition-opacity border-0"
              >
                <span className="hidden sm:inline">Send ↵</span>
                <span className="sm:hidden">↵</span>
              </motion.button>
            </div>
          </div>

          {/* Tips — hidden on small screens */}
          <div className="hidden sm:block text-xs text-text-dim leading-relaxed p-3 rounded-xl bg-bg-subtle/50 border border-border">
            <strong className="text-text-muted">Tip:</strong> Click a widget below to insert it. Click on any inline widget to change its value interactively.
          </div>

          {/* Inline output on mobile (when toggled) — below md, replaces aside */}
          <AnimatePresence>
            {showOutput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden mt-3 overflow-hidden"
              >
                <OutputPanel liveOutput={liveOutput} lastOutput={lastOutput} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Right panel — Serialized Output (desktop only) */}
        <aside className="hidden lg:block w-[340px] xl:w-[380px] border-l border-border p-4 overflow-y-auto shrink-0 bg-bg-subtle/30">
          <OutputPanel liveOutput={liveOutput} lastOutput={lastOutput} />
        </aside>
      </div>

      {/* Bottom palette — Spielwerk-style physical widget stickers */}
      <div className="palette-surface shrink-0">
        {/* Category tabs */}
        <div className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-5 pt-2.5 sm:pt-3 overflow-x-auto scrollbar-none">
          {categories.filter(c => categoryConfig[c]).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold cursor-pointer transition-all border-0 shrink-0"
              style={{
                background: activeTab === cat ? "#FFFFFF" : "transparent",
                color: activeTab === cat ? "#1A1A1A" : "#8A8A8E",
                boxShadow: activeTab === cat
                  ? "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06)"
                  : "none",
              }}
            >
              <span className="text-sm sm:text-base">{categoryConfig[cat]?.icon}</span>
              <span className="hidden xs:inline sm:inline">{categoryConfig[cat]?.label}</span>
            </button>
          ))}
        </div>

        {/* Widget grid — physical sticker cards */}
        <div className="flex gap-2.5 sm:gap-3 px-3 sm:px-5 py-3 sm:py-4 overflow-x-auto scrollbar-none">
          {paletteWidgets.map((def, i) => (
            <motion.button
              key={def.type}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02, type: "spring", stiffness: 400, damping: 25 }}
              whileHover={{ y: -4, scale: 1.05 }}
              whileTap={{ scale: 0.95, y: 0 }}
              onClick={() => handleInsert(def.type)}
              className="widget-sticker flex flex-col items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-3 sm:py-4 cursor-pointer shrink-0 min-w-[72px] sm:min-w-[88px]"
            >
              <span className="text-xl sm:text-2xl drop-shadow-sm">{def.defaultDisplay.preview ?? "📦"}</span>
              <span className="text-[10px] sm:text-[11px] font-bold text-[#3A3A3C] whitespace-nowrap tracking-tight">{def.defaultDisplay.label ?? def.type}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Extracted output panel — reused in desktop aside and mobile inline */
function OutputPanel({ liveOutput, lastOutput }: { liveOutput: SerializedPrompt | null; lastOutput: SerializedPrompt | null }) {
  return (
    <>
      <div className="text-[10px] font-bold uppercase tracking-widest text-text-dim mb-3 sm:mb-4">AI receives</div>

      {/* Human readable */}
      <div className="mb-4 sm:mb-5">
        <div className="text-[10px] font-bold text-accent mb-2">Human Readable</div>
        <div className="p-2.5 sm:p-3 rounded-xl bg-accent-muted/50 border border-accent/10 font-mono text-[11px] sm:text-xs leading-relaxed text-text break-words min-h-[40px] sm:min-h-[48px]">
          {liveOutput?.humanReadable || <span className="text-text-faint italic">Type something and add widgets...</span>}
        </div>
      </div>

      {/* JSON */}
      <div>
        <div className="text-[10px] font-bold text-purple mb-2">Structured JSON</div>
        <pre className="p-2.5 sm:p-3 rounded-xl bg-purple-muted/50 border border-purple/10 font-mono text-[9px] sm:text-[10px] leading-relaxed text-text-muted overflow-auto max-h-[250px] sm:max-h-[350px] whitespace-pre-wrap break-words m-0">
          {liveOutput?.structured ? JSON.stringify(liveOutput.structured, null, 2) : "{}"}
        </pre>
      </div>

      {lastOutput && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 sm:mt-5">
          <div className="text-[10px] font-bold text-green mb-2">Last Submitted</div>
          <div className="p-2.5 sm:p-3 rounded-xl bg-green-muted/50 border border-green/10 font-mono text-[11px] sm:text-xs leading-relaxed text-text break-words">
            {lastOutput.humanReadable}
          </div>
        </motion.div>
      )}
    </>
  )
}

export default function PlaygroundPage() {
  return (
    <PromptKitProvider packs={[essentialsPack]}>
      <PlaygroundInner />
    </PromptKitProvider>
  )
}
