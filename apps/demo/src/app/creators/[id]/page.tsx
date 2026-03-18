import { Nav } from "@/components/nav"
import { PackCard } from "@/components/pack-card"
import { SEED_PACKS, SEED_USER } from "@/lib/db/seed"
import { notFound } from "next/navigation"

export default async function CreatorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // MVP: only seed user exists
  if (id !== SEED_USER.id && id !== "seed-user-1") notFound()

  const userPacks = SEED_PACKS
  const totalDownloads = userPacks.reduce((sum, p) => sum + p.downloads, 0)

  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-2xl font-bold text-accent">
            {SEED_USER.name[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{SEED_USER.name}</h1>
            <p className="text-sm text-text-muted">{SEED_USER.bio}</p>
            <div className="flex gap-4 mt-2 text-xs text-text-dim">
              <span>{userPacks.length} packs</span>
              <span>·</span>
              <span>{totalDownloads.toLocaleString()} total installs</span>
            </div>
          </div>
        </div>

        {/* Packs grid */}
        <h2 className="text-lg font-bold mb-4">Published Packs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {userPacks.map((pack) => (
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
      </main>
    </>
  )
}
