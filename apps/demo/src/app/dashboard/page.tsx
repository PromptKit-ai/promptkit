import { SEED_PACKS } from "@/lib/db/seed"
import Link from "next/link"

export default function DashboardPage() {
  const myPacks = SEED_PACKS
  const totalDownloads = myPacks.reduce((sum, p) => sum + p.downloads, 0)
  const totalWidgets = myPacks.reduce((sum, p) => sum + p.widgetCount, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link
          href="/dashboard/publish"
          className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-semibold no-underline hover:bg-accent-hover transition-colors"
        >
          + Publish Pack
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Published Packs", value: myPacks.length, icon: "📦" },
          { label: "Total Installs", value: totalDownloads.toLocaleString(), icon: "📥" },
          { label: "Total Widgets", value: totalWidgets, icon: "🧩" },
          { label: "Avg Rating", value: "4.5 ★", icon: "⭐" },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-2xl border border-border bg-bg-subtle/50">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-xl font-bold">{stat.value}</div>
            <div className="text-[11px] text-text-dim">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* My packs table */}
      <div>
        <h2 className="text-lg font-bold mb-4">My Packs</h2>
        <div className="border border-border rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-bg-subtle/50">
                <th className="text-left text-[11px] font-semibold text-text-dim uppercase tracking-wider px-4 py-3">Pack</th>
                <th className="text-left text-[11px] font-semibold text-text-dim uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Category</th>
                <th className="text-right text-[11px] font-semibold text-text-dim uppercase tracking-wider px-4 py-3">Widgets</th>
                <th className="text-right text-[11px] font-semibold text-text-dim uppercase tracking-wider px-4 py-3">Installs</th>
                <th className="text-right text-[11px] font-semibold text-text-dim uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Price</th>
                <th className="text-right text-[11px] font-semibold text-text-dim uppercase tracking-wider px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {myPacks.map((pack) => (
                <tr key={pack.id} className="border-b border-border last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/marketplace/${pack.slug}`} className="text-sm font-semibold text-text no-underline hover:text-accent transition-colors">
                      {pack.name}
                    </Link>
                    <div className="text-[11px] text-text-dim">v{pack.version}</div>
                  </td>
                  <td className="px-4 py-3 text-xs text-text-muted hidden sm:table-cell">{pack.category}</td>
                  <td className="px-4 py-3 text-sm text-right">{pack.widgetCount}</td>
                  <td className="px-4 py-3 text-sm text-right">{pack.downloads.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-right hidden sm:table-cell">
                    {pack.priceCents === 0 ? (
                      <span className="text-green text-xs">Free</span>
                    ) : (
                      <span className="text-orange text-xs">${(pack.priceCents / 100).toFixed(0)}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green/10 text-green">
                      {pack.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
