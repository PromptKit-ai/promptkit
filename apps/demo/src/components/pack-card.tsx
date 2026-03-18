import Link from "next/link"

interface PackCardProps {
  slug: string
  name: string
  description: string
  author: { name: string; image: string | null }
  category: string
  priceCents: number
  widgetCount: number
  downloads: number
  tags: string[]
}

const catIcons: Record<string, string> = {
  color: "🎨", typography: "Aa", spacing: "↔", layout: "📐",
  effects: "✦", components: "🧩", logic: "🔀", other: "📦",
}

export function PackCard({
  slug, name, description, author, category, priceCents, widgetCount, downloads, tags,
}: PackCardProps) {
  return (
    <Link
      href={`/marketplace/${slug}`}
      className="group flex flex-col p-4 sm:p-5 rounded-2xl border border-border bg-bg-subtle/50 hover:border-white/15 hover:bg-bg-subtle transition-all no-underline"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{catIcons[category] || "📦"}</span>
          <div>
            <div className="text-sm font-bold text-text group-hover:text-accent transition-colors">{name}</div>
            <div className="text-[11px] text-text-dim">{author.name}</div>
          </div>
        </div>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{
          background: priceCents === 0 ? "rgba(34,197,94,0.12)" : "rgba(245,158,11,0.12)",
          color: priceCents === 0 ? "#22C55E" : "#F59E0B",
        }}>
          {priceCents === 0 ? "Free" : `$${(priceCents / 100).toFixed(0)}`}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-text-muted leading-relaxed mb-3 line-clamp-2 flex-1">
        {description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {tags.slice(0, 3).map((tag) => (
          <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-text-dim">
            {tag}
          </span>
        ))}
      </div>

      {/* Footer stats */}
      <div className="flex items-center gap-3 text-[11px] text-text-dim pt-3 border-t border-border">
        <span>{widgetCount} widgets</span>
        <span>·</span>
        <span>{downloads.toLocaleString()} installs</span>
      </div>
    </Link>
  )
}
