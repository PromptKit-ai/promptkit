"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Nav } from "@/components/nav"

const sidebarLinks = [
  { href: "/dashboard", label: "Overview", icon: "📊" },
  { href: "/dashboard/publish", label: "Publish Pack", icon: "📦" },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <>
      <Nav />
      <div className="flex min-h-[calc(100vh-49px)]">
        {/* Sidebar */}
        <aside className="w-[220px] border-r border-border p-4 shrink-0 hidden sm:block">
          <div className="text-[10px] font-bold uppercase tracking-widest text-text-dim mb-4">Creator Dashboard</div>
          <div className="flex flex-col gap-1">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm no-underline transition-colors"
                style={{
                  background: pathname === link.href ? "rgba(59,130,246,0.1)" : "transparent",
                  color: pathname === link.href ? "#3B82F6" : "#A1A1AA",
                }}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-8">{children}</main>
      </div>
    </>
  )
}
