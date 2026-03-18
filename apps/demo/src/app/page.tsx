import Link from "next/link"
import "./globals.css"
import { Nav } from "@/components/nav"
import { PackCard } from "@/components/pack-card"
import { SEED_PACKS, SEED_USER } from "@/lib/db/seed"

export default function Home() {
  const featured = SEED_PACKS.slice(0, 4)
  const popular = [...SEED_PACKS].sort((a, b) => b.downloads - a.downloads).slice(0, 4)

  return (
    <>
      <Nav />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="flex flex-col items-center text-center px-4 pt-16 sm:pt-24 pb-12 sm:pb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/[0.08] text-[12px] text-accent mb-6">
            47 widgets &middot; Open Source &middot; Any LLM
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-4 tracking-[-0.03em] bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent max-w-3xl">
            Stop describing.
            <br />Start dropping.
          </h1>
          <p className="text-base sm:text-lg leading-relaxed text-text-muted mb-8 max-w-xl">
            Interactive widgets for AI prompts. Drop colors, fonts, animations, and entire UI components into your messages.
            Works with any LLM.
          </p>
          <div className="flex gap-3 flex-wrap justify-center">
            <Link href="/playground" className="px-6 py-3 rounded-xl bg-accent text-white text-sm font-semibold no-underline hover:bg-accent-hover transition-colors">
              Try Playground
            </Link>
            <Link href="/marketplace" className="px-6 py-3 rounded-xl border border-white/15 bg-white/5 text-text text-sm font-semibold no-underline hover:bg-white/10 transition-colors">
              Browse Packs
            </Link>
          </div>
        </section>

        {/* How it works — Before/After */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-red/20 bg-red/[0.04]">
              <div className="text-[11px] font-semibold text-red uppercase tracking-wider mb-3">Before — Plain text</div>
              <div className="font-mono text-[12px] leading-relaxed text-text-muted">
                &ldquo;Make the button kinda blue, like a nice blue, with rounded corners and a bouncy animation...&rdquo;
              </div>
            </div>
            <div className="p-5 rounded-2xl border border-accent/20 bg-accent/[0.04]">
              <div className="text-[11px] font-semibold text-accent uppercase tracking-wider mb-3">After — PromptKit</div>
              <div className="text-[13px] leading-[2] text-text">
                &ldquo;Make the button{" "}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border border-accent/30 bg-accent/15 text-[11px]">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent" />#3B82F6
                </span>{" "}with{" "}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border border-white/15 bg-white/8 text-[11px]">
                  ◐ 12px
                </span>{" "}radius and{" "}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border border-purple/30 bg-purple/15 text-[11px]">
                  🎬 bounce
                </span>{" "}on click&rdquo;
              </div>
            </div>
          </div>
        </section>

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
