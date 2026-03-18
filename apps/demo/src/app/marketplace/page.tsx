"use client"

import { useState, useEffect } from "react"
import { Nav } from "@/components/nav"
import { PackCard } from "@/components/pack-card"

const CATEGORIES = [
  { id: null, label: "All", icon: "◆" },
  { id: "components", label: "UI Components", icon: "🧩" },
  { id: "effects", label: "Effects", icon: "✦" },
  { id: "logic", label: "Logic", icon: "🔀" },
]

export default function MarketplacePage() {
  const [packs, setPacks] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<string | null>(null)
  const [sort, setSort] = useState("popular")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set("q", search)
    if (category) params.set("category", category)
    params.set("sort", sort)

    setLoading(true)
    fetch(`/api/packs?${params}`)
      .then((r) => r.json())
      .then((data) => { setPacks(data.packs || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [search, category, sort])

  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Marketplace</h1>
          <p className="text-text-muted text-sm">Browse widget packs created by the community</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search packs..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-bg-subtle text-sm text-text placeholder:text-text-faint outline-none focus:border-accent/40 transition-colors"
          />

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-border bg-bg-subtle text-sm text-text outline-none cursor-pointer"
          >
            <option value="popular">Most Popular</option>
            <option value="new">Newest</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id ?? "all"}
              onClick={() => setCategory(cat.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all whitespace-nowrap shrink-0 border-0"
              style={{
                background: category === cat.id ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.04)",
                color: category === cat.id ? "#3B82F6" : "#71717A",
                border: category === cat.id ? "1px solid rgba(59,130,246,0.3)" : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[200px] rounded-2xl bg-bg-subtle/50 animate-pulse" />
            ))}
          </div>
        ) : packs.length === 0 ? (
          <div className="text-center py-16 text-text-dim">
            No packs found. Try a different search.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {packs.map((pack: any) => (
              <PackCard
                key={pack.id}
                slug={pack.slug}
                name={pack.name}
                description={pack.description}
                author={pack.author}
                category={pack.category}
                priceCents={pack.priceCents}
                widgetCount={pack.widgetCount}
                downloads={pack.downloads}
                tags={pack.tags}
              />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
