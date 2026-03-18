import { NextResponse } from "next/server"
import { SEED_PACKS } from "@/lib/db/seed"

export async function GET() {
  const counts: Record<string, number> = {}
  for (const pack of SEED_PACKS) {
    counts[pack.category] = (counts[pack.category] || 0) + 1
  }

  const categories = Object.entries(counts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)

  return NextResponse.json({ categories })
}
