import { Nav } from "@/components/nav"
import { StarRating } from "@/components/star-rating"
import { SEED_PACKS, SEED_USER } from "@/lib/db/seed"
import Link from "next/link"
import { notFound } from "next/navigation"

const catIcons: Record<string, string> = {
  color: "🎨", typography: "Aa", spacing: "↔", layout: "📐",
  effects: "✦", components: "🧩", logic: "🔀", other: "📦",
}

export default async function PackDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const pack = SEED_PACKS.find((p) => p.slug === slug)
  if (!pack) notFound()

  return (
    <>
      <Nav />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left — Main content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-start gap-4 mb-6">
              <span className="text-4xl">{catIcons[pack.category] || "📦"}</span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-1">{pack.name}</h1>
                <div className="flex items-center gap-3 text-sm text-text-muted">
                  <span>by {SEED_USER.name}</span>
                  <span>·</span>
                  <span>v{pack.version}</span>
                  <span>·</span>
                  <div className="flex items-center gap-1">
                    <StarRating rating={4.5} />
                    <span>(12)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <p className="text-text-muted leading-relaxed">{pack.description}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {pack.tags.map((tag) => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-lg bg-white/5 text-text-dim border border-border">
                  {tag}
                </span>
              ))}
            </div>

            {/* Widgets included */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4">Widgets Included ({pack.widgetCount})</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {pack.widgetTypes.map((type) => (
                  <div
                    key={type}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-bg-subtle/50 text-sm"
                  >
                    <span className="text-accent">◆</span>
                    <span className="text-text-muted font-mono text-xs">{type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* README */}
            {pack.readme && (
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-4">Documentation</h2>
                <div className="p-5 rounded-2xl border border-border bg-bg-subtle/30 prose prose-invert prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-text-muted font-sans leading-relaxed">{pack.readme}</pre>
                </div>
              </div>
            )}

            {/* Reviews */}
            <div>
              <h2 className="text-lg font-bold mb-4">Reviews</h2>
              <div className="space-y-4">
                {[
                  { name: "Sarah Chen", rating: 5, comment: "Exactly what I needed for my vibe coding setup. The widgets are a game changer." },
                  { name: "Marcus Johnson", rating: 4, comment: "Great pack, works well with Cursor. Would love more presets." },
                  { name: "Yuki Tanaka", rating: 5, comment: "The WYSIWYG previews are insane. Can see exactly what I'm building." },
                ].map((review, i) => (
                  <div key={i} className="p-4 rounded-xl border border-border bg-bg-subtle/30">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                        {review.name[0]}
                      </div>
                      <span className="text-sm font-semibold">{review.name}</span>
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                    <p className="text-sm text-text-muted">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Sidebar */}
          <div className="lg:w-[300px] shrink-0">
            <div className="sticky top-20 space-y-4">
              {/* Install card */}
              <div className="p-5 rounded-2xl border border-border bg-bg-subtle">
                {/* Price */}
                <div className="text-center mb-4">
                  {pack.priceCents === 0 ? (
                    <span className="text-2xl font-bold text-green">Free</span>
                  ) : (
                    <>
                      <span className="text-2xl font-bold">${(pack.priceCents / 100).toFixed(0)}</span>
                      <span className="text-text-dim text-sm"> one-time</span>
                    </>
                  )}
                </div>

                {/* Install command */}
                <div className="mb-4">
                  <div className="text-[10px] font-bold uppercase text-text-dim mb-1.5">Install</div>
                  <code className="block p-3 rounded-xl bg-bg-elevated text-xs font-mono text-text-muted border border-border overflow-x-auto">
                    npm install {pack.npmPackage}
                  </code>
                </div>

                {/* Download button */}
                {pack.priceCents === 0 ? (
                  <button className="w-full py-2.5 rounded-xl bg-accent text-white text-sm font-semibold cursor-pointer border-0 hover:bg-accent-hover transition-colors">
                    Install Free
                  </button>
                ) : (
                  <button className="w-full py-2.5 rounded-xl bg-white/10 text-text-dim text-sm font-semibold cursor-not-allowed border border-border" disabled>
                    Coming Soon
                  </button>
                )}

                {/* Try in playground */}
                <Link
                  href="/playground"
                  className="block text-center mt-3 text-xs text-accent no-underline hover:underline"
                >
                  Try in Playground →
                </Link>
              </div>

              {/* Stats */}
              <div className="p-4 rounded-2xl border border-border bg-bg-subtle/50">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <div className="text-lg font-bold">{pack.downloads.toLocaleString()}</div>
                    <div className="text-[10px] text-text-dim uppercase">Installs</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">{pack.widgetCount}</div>
                    <div className="text-[10px] text-text-dim uppercase">Widgets</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold flex items-center justify-center gap-1">
                      4.5 <span className="text-xs text-[#F59E0B]">★</span>
                    </div>
                    <div className="text-[10px] text-text-dim uppercase">Rating</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">v{pack.version}</div>
                    <div className="text-[10px] text-text-dim uppercase">Version</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
