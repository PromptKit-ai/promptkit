import { NextRequest, NextResponse } from "next/server"
import { SEED_PACKS, SEED_USER } from "@/lib/db/seed"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const pack = SEED_PACKS.find((p) => p.slug === slug)
  if (!pack) {
    return NextResponse.json({ error: "Pack not found" }, { status: 404 })
  }

  return NextResponse.json({
    ...pack,
    author: { id: SEED_USER.id, name: SEED_USER.name, image: SEED_USER.image },
    avgRating: 4.5,
    reviewCount: 12,
  })
}
