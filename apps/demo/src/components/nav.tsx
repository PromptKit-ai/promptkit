"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/playground", label: "Playground" },
]

export function Nav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border bg-bg/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 text-sm font-bold text-text no-underline">
          <span className="text-lg">🧩</span>
          <span>PromptKit</span>
        </Link>
        <div className="hidden sm:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 rounded-lg text-sm font-medium no-underline transition-colors"
              style={{
                color: pathname?.startsWith(link.href) ? "#FAFAFA" : "#71717A",
                background: pathname?.startsWith(link.href) ? "rgba(255,255,255,0.06)" : "transparent",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <a
          href="https://github.com/promptkit/promptkit"
          target="_blank"
          rel="noopener"
          className="text-text-dim hover:text-text text-sm no-underline transition-colors hidden sm:block"
        >
          GitHub
        </a>
        <Link
          href="/dashboard"
          className="px-3 py-1.5 rounded-lg text-sm font-medium bg-accent text-white no-underline hover:bg-accent-hover transition-colors"
        >
          Dashboard
        </Link>
      </div>
    </nav>
  )
}
