"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import "./globals.css"
import { Nav } from "@/components/nav"
import { PackCard } from "@/components/pack-card"
import { SEED_PACKS, SEED_USER } from "@/lib/db/seed"

// =============================================================================
// 3D INTERACTIVE FLOATING WIDGETS — Spielwerk-style hero decorations
// =============================================================================

/** 3D Clay text badge — interactive: click to cycle styles */
function Clay3DText() {
  const styles = [
    { text: "CLAY", className: "text-3d-clay-blue", color: "#4A90D9" },
    { text: "NEON", className: "text-3d-clay-green", color: "#5EBD73" },
    { text: "GLOW", className: "text-3d-clay-pink", color: "#E88FAC" },
    { text: "BOLD", className: "text-3d-clay-orange", color: "#F5A623" },
  ]
  const [idx, setIdx] = useState(0)
  const s = styles[idx]

  return (
    <motion.button
      onClick={() => setIdx((idx + 1) % styles.length)}
      className="widget-sticker px-5 py-3 cursor-pointer border-0 select-none"
      whileHover={{ scale: 1.1, rotate: -2 }}
      whileTap={{ scale: 0.92 }}
      style={{ background: "#FFFFFF" }}
    >
      <motion.span
        key={s.text}
        initial={{ scale: 0.7, opacity: 0, rotateY: -90 }}
        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`text-3d-clay ${s.className} text-2xl sm:text-3xl font-black tracking-tight`}
        style={{ display: "block" }}
      >
        {s.text}
      </motion.span>
    </motion.button>
  )
}

/** Interactive counter widget — Spielwerk - N + stepper */
function CounterWidget3D() {
  const [count, setCount] = useState(4)
  return (
    <div className="widget-pill flex items-center gap-1 px-1 py-1 select-none" style={{ background: "#F0F0F2" }}>
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.8 }}
        onClick={() => setCount(Math.max(0, count - 1))}
        className="stepper-btn"
      >
        −
      </motion.button>
      <motion.span
        key={count}
        initial={{ scale: 1.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-lg font-black text-[#1A1A1A] min-w-[32px] text-center font-mono"
      >
        {count}
      </motion.span>
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.8 }}
        onClick={() => setCount(Math.min(99, count + 1))}
        className="stepper-btn"
      >
        +
      </motion.button>
    </div>
  )
}

/** Interactive color swatch — click to cycle colors */
function ColorSwatch3D() {
  const colors = ["#3B82F6", "#EF4444", "#22C55E", "#8B5CF6", "#F59E0B", "#EC4899"]
  const [idx, setIdx] = useState(0)
  const hex = colors[idx]

  return (
    <motion.button
      onClick={() => setIdx((idx + 1) % colors.length)}
      className="widget-sticker flex items-center gap-2.5 px-4 py-2.5 cursor-pointer border-0 select-none"
      whileHover={{ scale: 1.08, y: -3 }}
      whileTap={{ scale: 0.94 }}
    >
      <motion.span
        key={hex}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 20 }}
        className="w-6 h-6 rounded-full"
        style={{
          background: hex,
          boxShadow: `0 2px 8px ${hex}55, 0 4px 12px ${hex}33`,
        }}
      />
      <span className="text-sm font-mono font-bold text-[#3A3A3C]">{hex}</span>
    </motion.button>
  )
}

/** Interactive toggle switch */
function Toggle3D() {
  const [on, setOn] = useState(true)
  return (
    <motion.button
      onClick={() => setOn(!on)}
      className="widget-sticker flex items-center gap-3 px-4 py-2.5 cursor-pointer border-0 select-none"
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative w-11 h-6 rounded-full transition-colors" style={{
        background: on ? "#22C55E" : "#D1D5DB",
        boxShadow: on ? "inset 0 1px 2px rgba(0,0,0,0.1), 0 0 8px rgba(34,197,94,0.3)" : "inset 0 1px 3px rgba(0,0,0,0.15)",
      }}>
        <motion.div
          animate={{ x: on ? 22 : 3 }}
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
          className="absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.2), 0 0 0 0.5px rgba(0,0,0,0.04)" }}
        />
      </div>
      <span className="text-xs font-bold" style={{ color: on ? "#22C55E" : "#9CA3AF" }}>
        {on ? "ON" : "OFF"}
      </span>
    </motion.button>
  )
}

/** Interactive progress bar */
function ProgressBar3D() {
  const [progress, setProgress] = useState(72)
  return (
    <motion.button
      onClick={() => setProgress(progress >= 100 ? 10 : progress + 14)}
      className="widget-sticker px-4 py-3 cursor-pointer border-0 select-none min-w-[140px]"
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="progress-physical h-7 w-full">
        <motion.div
          className="progress-physical-fill"
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      </div>
      <motion.span
        key={progress}
        initial={{ scale: 1.3 }}
        animate={{ scale: 1 }}
        className="text-xs font-black text-[#3A3A3C] mt-1.5 block text-center"
      >
        {progress}%
      </motion.span>
    </motion.button>
  )
}

/** Interactive slider with physical feel */
function Slider3D() {
  const [val, setVal] = useState(-10)
  return (
    <motion.div
      className="widget-sticker flex items-center gap-2 pl-2 pr-4 py-2 cursor-pointer select-none"
      whileHover={{ scale: 1.06, y: -2 }}
      style={{ background: "#E85D4A", borderColor: "#D14B39" }}
    >
      <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
        <span className="text-white text-xs">◻</span>
      </div>
      <div className="flex flex-col">
        <motion.span
          key={val}
          initial={{ y: -4, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-lg font-black text-white leading-none"
        >
          {val}°
        </motion.span>
        <div className="flex gap-[2px] mt-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="w-[2px] h-2 rounded-full" style={{ background: `rgba(255,255,255,${i < Math.abs(val) / 3 ? 0.8 : 0.25})` }} />
          ))}
        </div>
      </div>
      <input
        type="range"
        min={-30}
        max={30}
        value={val}
        onChange={(e) => setVal(Number(e.target.value))}
        className="w-0 h-0 opacity-0 absolute"
        onClick={(e) => e.stopPropagation()}
      />
    </motion.div>
  )
}

/** Interactive CRT TV widget */
function CRTWidget() {
  const texts = ["CRT", "VHS", "RGB", "LCD"]
  const [idx, setIdx] = useState(0)
  return (
    <motion.button
      onClick={() => setIdx((idx + 1) % texts.length)}
      className="cursor-pointer border-0 select-none"
      whileHover={{ scale: 1.1, rotate: 2 }}
      whileTap={{ scale: 0.9 }}
    >
      <div className="crt-frame w-16 h-14 flex items-center justify-center">
        <motion.span
          key={texts[idx]}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          className="text-xs font-black"
          style={{
            background: "linear-gradient(180deg, #FF0000, #FFFF00, #00FF00, #00FFFF, #0000FF, #FF00FF)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 0 6px rgba(255,255,255,0.3)",
          }}
        >
          {texts[idx]}
        </motion.span>
      </div>
    </motion.button>
  )
}

/** Interactive Game Boy widget */
function GameBoyWidget() {
  const [color, setColor] = useState("#7B68AE")
  const colors = ["#7B68AE", "#D94040", "#3A8FD6", "#4AA84F", "#D99340"]

  return (
    <motion.button
      onClick={() => {
        const i = colors.indexOf(color)
        setColor(colors[(i + 1) % colors.length])
      }}
      className="cursor-pointer border-0 select-none"
      whileHover={{ scale: 1.08, y: -4 }}
      whileTap={{ scale: 0.92 }}
    >
      <motion.div
        animate={{ background: `linear-gradient(145deg, ${color}, ${color}CC)` }}
        className="rounded-xl p-2 flex flex-col items-center gap-1"
        style={{
          boxShadow: `0 2px 4px rgba(0,0,0,0.15), 0 8px 24px ${color}40, inset 0 1px 0 rgba(255,255,255,0.15)`,
        }}
      >
        <div className="w-14 h-9 rounded bg-[#8BAC0F] border-2 border-[#1A1A1A] flex items-center justify-center overflow-hidden">
          <span className="text-[6px] font-bold text-[#1A1A1A]">🎮 PLAY</span>
        </div>
        <div className="flex gap-2 items-center">
          <div className="w-3 h-3 rounded-full bg-white/20" />
          <div className="flex gap-[2px]">
            <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
          </div>
        </div>
      </motion.div>
    </motion.button>
  )
}

/** Interactive font selector 3D */
function FontWidget3D() {
  const fonts = [
    { name: "Inter", family: "Inter" },
    { name: "Mono", family: "JetBrains Mono" },
    { name: "Serif", family: "Playfair Display" },
  ]
  const [idx, setIdx] = useState(0)
  const f = fonts[idx]
  return (
    <motion.button
      onClick={() => setIdx((idx + 1) % fonts.length)}
      className="widget-sticker px-4 py-3 cursor-pointer border-0 select-none"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
    >
      <motion.span
        key={f.name}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-lg font-bold text-[#3A3A3C]"
        style={{ fontFamily: `'${f.family}', sans-serif` }}
      >
        {f.name}
      </motion.span>
    </motion.button>
  )
}

/** Warning badge — Spielwerk style */
function WarningBadge() {
  const [text, setText] = useState("INTERACTIVE")
  const texts = ["INTERACTIVE", "DRAGGABLE", "CLICKABLE", "PHYSICAL"]
  return (
    <motion.button
      onClick={() => {
        const i = texts.indexOf(text)
        setText(texts[(i + 1) % texts.length])
      }}
      className="badge-warning cursor-pointer border-0 select-none"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
    >
      <motion.span
        key={text}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        className="text-[10px] sm:text-[11px]"
      >
        {text}
      </motion.span>
    </motion.button>
  )
}

/** Spielwerk-style "Before/After" showcase — now with 3D inline widgets */
function BeforeAfterShowcase() {
  const [activeColor, setActiveColor] = useState("#3B82F6")
  const [radius, setRadius] = useState(12)
  const [anim, setAnim] = useState("bounce")
  const anims = ["bounce", "fade-in", "spring", "elastic", "pulse"]

  return (
    <section className="max-w-4xl mx-auto px-4 pb-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Before */}
        <div className="p-6 rounded-2xl border border-red/20 bg-red/[0.04]">
          <div className="text-[11px] font-semibold text-red uppercase tracking-wider mb-3">Before — Plain text</div>
          <div className="font-mono text-[12px] leading-relaxed text-text-muted">
            &ldquo;Make the button kinda blue, like a nice blue, with rounded corners and a bouncy animation...&rdquo;
          </div>
        </div>

        {/* After — with interactive 3D chips inline */}
        <div className="p-6 rounded-2xl border border-accent/20 bg-accent/[0.04]">
          <div className="text-[11px] font-semibold text-accent uppercase tracking-wider mb-3">After — PromptKit</div>
          <div className="text-[14px] leading-[2.4] text-text">
            &ldquo;Make the button{" "}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                const colors = ["#3B82F6", "#EF4444", "#22C55E", "#8B5CF6", "#EC4899"]
                const i = colors.indexOf(activeColor)
                setActiveColor(colors[(i + 1) % colors.length])
              }}
              className="chip-inline cursor-pointer border-0"
              style={{ background: `${activeColor}20`, borderColor: `${activeColor}40` }}
            >
              <motion.span
                key={activeColor}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-4 h-4 rounded-full"
                style={{ background: activeColor, boxShadow: `0 0 10px ${activeColor}55` }}
              />
              <span className="text-[11px] font-mono font-bold" style={{ color: activeColor }}>{activeColor}</span>
            </motion.button>{" "}with{" "}
            <span className="chip-inline" style={{ gap: "2px", padding: "2px 4px" }}>
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={() => setRadius(Math.max(0, radius - 4))}
                className="stepper-btn"
                style={{ width: 22, height: 22, fontSize: 14, background: "rgba(255,255,255,0.1)", color: "#A1A1AA", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "none" }}
              >
                −
              </motion.button>
              <motion.span key={radius} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className="text-[12px] font-bold font-mono text-white px-1.5 min-w-[28px] text-center">
                {radius}
              </motion.span>
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={() => setRadius(Math.min(48, radius + 4))}
                className="stepper-btn"
                style={{ width: 22, height: 22, fontSize: 14, background: "rgba(255,255,255,0.1)", color: "#A1A1AA", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "none" }}
              >
                +
              </motion.button>
            </span>{" "}radius and{" "}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                const i = anims.indexOf(anim)
                setAnim(anims[(i + 1) % anims.length])
              }}
              className="chip-inline cursor-pointer border-0"
              style={{ borderColor: "rgba(139,92,246,0.4)", background: "rgba(139,92,246,0.18)" }}
            >
              <motion.span
                key={anim}
                animate={anim === "bounce" ? { y: [0, -4, 0] } : anim === "pulse" ? { scale: [1, 1.2, 1] } : anim === "spring" ? { y: [0, -6, 1, 0] } : { opacity: [0.4, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="text-sm"
              >
                🎬
              </motion.span>
              <motion.span key={anim + "l"} initial={{ y: -4, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-[11px] font-bold text-purple">
                {anim}
              </motion.span>
            </motion.button>{" "}on click&rdquo;
          </div>
        </div>
      </div>

      {/* Live preview of the configured button */}
      <motion.div
        className="mt-6 flex items-center justify-center p-6 rounded-2xl border border-white/5 bg-white/[0.02]"
        layout
      >
        <div className="text-center">
          <div className="text-[10px] font-bold uppercase tracking-widest text-text-dim mb-3">Live Preview</div>
          <motion.button
            key={`${activeColor}-${radius}-${anim}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={
              anim === "bounce" ? { y: -4 } :
              anim === "pulse" ? { scale: 1.1 } :
              anim === "spring" ? { y: -6 } :
              anim === "elastic" ? { x: [-2, 2, -1, 1, 0] } :
              { opacity: 0.8 }
            }
            className="px-8 py-3 text-white text-sm font-bold cursor-pointer border-0"
            style={{
              background: activeColor,
              borderRadius: `${radius}px`,
              boxShadow: `0 4px 16px ${activeColor}44, 0 8px 32px ${activeColor}22`,
            }}
          >
            Click me
          </motion.button>
        </div>
      </motion.div>
    </section>
  )
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function Home() {
  const featured = SEED_PACKS.slice(0, 4)
  const popular = [...SEED_PACKS].sort((a, b) => b.downloads - a.downloads).slice(0, 4)

  return (
    <>
      <Nav />
      <main className="min-h-screen">
        {/* Hero with floating 3D interactive widgets */}
        <section className="relative flex flex-col items-center text-center px-4 pt-16 sm:pt-24 pb-12 sm:pb-16 overflow-hidden">
          {/* Floating 3D widgets — desktop only, positioned around hero */}
          <div className="hidden lg:block">
            {/* Top-left: Clay text */}
            <div className="absolute top-20 left-[6%] float-gentle" style={{ animationDelay: "0s" }}>
              <Clay3DText />
            </div>
            {/* Top-right: Counter */}
            <div className="absolute top-24 right-[8%] float-slow" style={{ animationDelay: "1s" }}>
              <CounterWidget3D />
            </div>
            {/* Mid-left: Color swatch */}
            <div className="absolute top-48 left-[3%] float-bounce" style={{ animationDelay: "0.5s" }}>
              <ColorSwatch3D />
            </div>
            {/* Mid-right: Toggle */}
            <div className="absolute top-52 right-[4%] float-gentle" style={{ animationDelay: "1.5s" }}>
              <Toggle3D />
            </div>
            {/* Bottom-left: CRT */}
            <div className="absolute top-72 left-[10%] float-slow" style={{ animationDelay: "2s" }}>
              <CRTWidget />
            </div>
            {/* Bottom-right: GameBoy */}
            <div className="absolute top-80 right-[10%] float-bounce" style={{ animationDelay: "0.8s" }}>
              <GameBoyWidget />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/[0.08] text-[12px] text-accent mb-6">
            47 widgets &middot; Open Source &middot; Any LLM
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-4 tracking-[-0.03em] bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent max-w-3xl relative z-10">
            Stop describing.
            <br />Start dropping.
          </h1>
          <p className="text-base sm:text-lg leading-relaxed text-text-muted mb-8 max-w-xl relative z-10">
            Interactive widgets for AI prompts. Drop colors, fonts, animations, and entire UI components into your messages.
            Works with any LLM.
          </p>
          <div className="flex gap-3 flex-wrap justify-center relative z-10">
            <Link href="/playground" className="px-6 py-3 rounded-xl bg-accent text-white text-sm font-semibold no-underline hover:bg-accent-hover transition-colors">
              Try Playground
            </Link>
            <Link href="/marketplace" className="px-6 py-3 rounded-xl border border-white/15 bg-white/5 text-text text-sm font-semibold no-underline hover:bg-white/10 transition-colors">
              Browse Packs
            </Link>
          </div>

          {/* Mobile: Interactive widget row */}
          <div className="flex lg:hidden flex-wrap gap-3 justify-center mt-8 relative z-10">
            <Clay3DText />
            <CounterWidget3D />
            <ColorSwatch3D />
          </div>
        </section>

        {/* Interactive widget showcase grid — Spielwerk style on light bg */}
        <section className="max-w-5xl mx-auto px-4 pb-16">
          <h2 className="text-lg sm:text-xl font-bold mb-2 text-center">Every widget is interactive</h2>
          <p className="text-sm text-text-muted text-center mb-8">Click any widget below to see it in action</p>
          <div className="rounded-3xl p-6 sm:p-8" style={{ background: "linear-gradient(180deg, #F5F5F7 0%, #EEEEF0 100%)" }}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 place-items-center">
              <Clay3DText />
              <CounterWidget3D />
              <ColorSwatch3D />
              <Toggle3D />
              <ProgressBar3D />
              <Slider3D />
              <CRTWidget />
              <GameBoyWidget />
              <FontWidget3D />
              <WarningBadge />
              {/* Extra physical widgets */}
              <motion.div
                className="widget-sticker px-4 py-3 text-center cursor-pointer select-none"
                whileHover={{ scale: 1.08, rotate: -1 }}
                whileTap={{ scale: 0.94 }}
              >
                <span className="text-3d-clay text-3d-clay-pink text-xl font-black">WOOL</span>
              </motion.div>
              <motion.div
                className="widget-sticker px-4 py-2 flex items-center gap-2 cursor-pointer select-none"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
              >
                <span className="text-lg">📱</span>
                <span className="text-[11px] font-bold text-[#3A3A3C]">sm 640px</span>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How it works — Before/After with interactive inline widgets */}
        <BeforeAfterShowcase />

        {/* Featured Packs */}
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-bold">Featured Packs</h2>
            <Link href="/marketplace" className="text-sm text-accent no-underline hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featured.map((pack) => (
              <PackCard
                key={pack.id}
                slug={pack.slug}
                name={pack.name}
                description={pack.description}
                author={{ name: SEED_USER.name, image: SEED_USER.image }}
                category={pack.category}
                priceCents={pack.priceCents}
                widgetCount={pack.widgetCount}
                downloads={pack.downloads}
                tags={pack.tags}
              />
            ))}
          </div>
        </section>

        {/* Popular */}
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-bold">Most Popular</h2>
            <Link href="/marketplace?sort=popular" className="text-sm text-accent no-underline hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popular.map((pack) => (
              <PackCard
                key={pack.id}
                slug={pack.slug}
                name={pack.name}
                description={pack.description}
                author={{ name: SEED_USER.name, image: SEED_USER.image }}
                category={pack.category}
                priceCents={pack.priceCents}
                widgetCount={pack.widgetCount}
                downloads={pack.downloads}
                tags={pack.tags}
              />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-4 pb-24 text-center">
          <div className="p-8 sm:p-12 rounded-3xl border border-accent/20 bg-accent/[0.04]">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Create your own widget pack</h2>
            <p className="text-text-muted mb-6">
              Build widgets for your favorite framework, design system, or use case. Publish to the marketplace and earn from every install.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/dashboard/publish" className="px-6 py-3 rounded-xl bg-accent text-white text-sm font-semibold no-underline hover:bg-accent-hover transition-colors">
                Start Building
              </Link>
              <code className="px-4 py-3 rounded-xl bg-bg-elevated text-text-muted text-sm font-mono border border-border">
                npx promptkit create-pack my-pack
              </code>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-8 text-center text-[12px] text-text-faint">
          PromptKit &middot; Open Source &middot; MIT License
        </footer>
      </main>
    </>
  )
}
