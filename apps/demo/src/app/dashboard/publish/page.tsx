"use client"

import { useState } from "react"

const CATEGORIES = [
  { value: "color", label: "Color" },
  { value: "typography", label: "Typography" },
  { value: "spacing", label: "Spacing" },
  { value: "layout", label: "Layout" },
  { value: "effects", label: "Effects" },
  { value: "components", label: "UI Components" },
  { value: "logic", label: "Logic" },
]

export default function PublishPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    category: "components",
    tags: "",
    npmPackage: "",
    version: "1.0.0",
    priceCents: 0,
    readme: "",
  })

  const updateField = (key: string, value: string | number) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "name" ? { slug: String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") } : {}),
    }))
  }

  const handlePublish = async () => {
    // MVP: just show success
    setStep(4)
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">Publish a Widget Pack</h1>
      <p className="text-text-muted text-sm mb-8">Share your widgets with the community</p>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
              style={{
                background: step >= s ? "#3B82F6" : "rgba(255,255,255,0.05)",
                color: step >= s ? "white" : "#71717A",
              }}
            >
              {step > s ? "✓" : s}
            </div>
            {s < 3 && <div className="w-12 h-0.5 rounded-full" style={{ background: step > s ? "#3B82F6" : "rgba(255,255,255,0.08)" }} />}
          </div>
        ))}
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5">Pack Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="My Awesome Pack"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-bg-subtle text-sm text-text placeholder:text-text-faint outline-none focus:border-accent/40"
            />
            {form.slug && <div className="text-[11px] text-text-dim mt-1">slug: {form.slug}</div>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="What does this pack do?"
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-bg-subtle text-sm text-text placeholder:text-text-faint outline-none focus:border-accent/40 resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5">Category</label>
            <select
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-bg-subtle text-sm text-text outline-none cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5">Tags (comma separated)</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => updateField("tags", e.target.value)}
              placeholder="tailwind, animation, buttons"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-bg-subtle text-sm text-text placeholder:text-text-faint outline-none focus:border-accent/40"
            />
          </div>
          <button
            onClick={() => setStep(2)}
            disabled={!form.name || !form.description}
            className="px-6 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold cursor-pointer disabled:opacity-30 border-0 hover:bg-accent-hover transition-colors"
          >
            Next →
          </button>
        </div>
      )}

      {/* Step 2: Package & Pricing */}
      {step === 2 && (
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5">npm Package Name</label>
            <input
              type="text"
              value={form.npmPackage}
              onChange={(e) => updateField("npmPackage", e.target.value)}
              placeholder="@myorg/promptkit-pack-name"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-bg-subtle text-sm text-text placeholder:text-text-faint outline-none focus:border-accent/40 font-mono"
            />
            <div className="text-[11px] text-text-dim mt-1">Users will install with: npm install {form.npmPackage || "..."}</div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5">Version</label>
            <input
              type="text"
              value={form.version}
              onChange={(e) => updateField("version", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-bg-subtle text-sm text-text outline-none focus:border-accent/40 font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5">Pricing</label>
            <div className="flex gap-3">
              <button
                onClick={() => updateField("priceCents", 0)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-all border-0"
                style={{
                  background: form.priceCents === 0 ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.04)",
                  color: form.priceCents === 0 ? "#22C55E" : "#71717A",
                  border: form.priceCents === 0 ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(255,255,255,0.06)",
                }}
              >
                Free
              </button>
              <button
                onClick={() => updateField("priceCents", 500)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-all border-0"
                style={{
                  background: form.priceCents > 0 ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.04)",
                  color: form.priceCents > 0 ? "#F59E0B" : "#71717A",
                  border: form.priceCents > 0 ? "1px solid rgba(245,158,11,0.3)" : "1px solid rgba(255,255,255,0.06)",
                }}
              >
                Paid (coming soon)
              </button>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="px-6 py-2.5 rounded-xl border border-border text-sm font-semibold cursor-pointer bg-transparent text-text-muted hover:bg-white/5 transition-colors">
              ← Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!form.npmPackage}
              className="px-6 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold cursor-pointer disabled:opacity-30 border-0 hover:bg-accent-hover transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl border border-border bg-bg-subtle/50">
            <h3 className="text-lg font-bold mb-4">Review your pack</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-text-dim">Name</span><span className="font-semibold">{form.name}</span></div>
              <div className="flex justify-between"><span className="text-text-dim">Slug</span><span className="font-mono text-text-muted">{form.slug}</span></div>
              <div className="flex justify-between"><span className="text-text-dim">Category</span><span>{form.category}</span></div>
              <div className="flex justify-between"><span className="text-text-dim">npm Package</span><span className="font-mono text-text-muted">{form.npmPackage}</span></div>
              <div className="flex justify-between"><span className="text-text-dim">Version</span><span className="font-mono">{form.version}</span></div>
              <div className="flex justify-between"><span className="text-text-dim">Price</span><span className="text-green font-semibold">Free</span></div>
              <div className="border-t border-border pt-3"><span className="text-text-dim">Description</span><p className="mt-1 text-text-muted">{form.description}</p></div>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="px-6 py-2.5 rounded-xl border border-border text-sm font-semibold cursor-pointer bg-transparent text-text-muted hover:bg-white/5 transition-colors">
              ← Back
            </button>
            <button
              onClick={handlePublish}
              className="px-6 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold cursor-pointer border-0 hover:bg-accent-hover transition-colors"
            >
              Publish Pack
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Success */}
      {step === 4 && (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2">Pack Published!</h2>
          <p className="text-text-muted mb-6">Your widget pack is now live on the marketplace.</p>
          <code className="block p-4 rounded-xl bg-bg-elevated text-sm font-mono text-text-muted border border-border mb-6">
            npm install {form.npmPackage}
          </code>
          <div className="flex gap-3 justify-center">
            <a href={`/marketplace/${form.slug}`} className="px-6 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold no-underline hover:bg-accent-hover transition-colors">
              View Pack
            </a>
            <a href="/dashboard" className="px-6 py-2.5 rounded-xl border border-border text-sm font-semibold no-underline text-text-muted hover:bg-white/5 transition-colors">
              Dashboard
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
