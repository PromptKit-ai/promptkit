import { NextRequest, NextResponse } from "next/server"
import { SEED_PACKS, SEED_USER } from "@/lib/db/seed"

// MVP: use seed data directly (no DB required to demo)
// Replace with real DB queries when Neon is configured

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const q = searchParams.get("q")?.toLowerCase()
  const category = searchParams.get("category")
  const sort = searchParams.get("sort") || "popular"
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "20")

  let results = [...SEED_PACKS]

  // Filter
  if (q) {
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q))
    )
  }
  if (category) {
    results = results.filter((p) => p.category === category)
  }

  // Sort
  if (sort === "popular") results.sort((a, b) => b.downloads - a.downloads)
  else if (sort === "new") results.sort((a, b) => b.id.localeCompare(a.id))
  else if (sort === "name") results.sort((a, b) => a.name.localeCompare(b.name))

  // Paginate
  const total = results.length
  const offset = (page - 1) * limit
  const packs = results.slice(offset, offset + limit).map((p) => ({
    ...p,
    author: { id: SEED_USER.id, name: SEED_USER.name, image: SEED_USER.image },
  }))

  return NextResponse.json({ packs, total, page, limit })
}
