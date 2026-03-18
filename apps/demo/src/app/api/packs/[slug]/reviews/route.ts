import { NextRequest, NextResponse } from "next/server"

// MVP: static seed reviews
const SEED_REVIEWS = [
  { id: "r1", rating: 5, comment: "Exactly what I needed for my vibe coding setup. The Tailwind widgets are a game changer.", user: { id: "u1", name: "Sarah Chen", image: null }, createdAt: "2026-03-15" },
  { id: "r2", rating: 4, comment: "Great pack, works well with Cursor. Would love more animation presets.", user: { id: "u2", name: "Marcus Johnson", image: null }, createdAt: "2026-03-14" },
  { id: "r3", rating: 5, comment: "The WYSIWYG previews are insane. Can see exactly what I'm building before the AI generates it.", user: { id: "u3", name: "Yuki Tanaka", image: null }, createdAt: "2026-03-12" },
]

export async function GET() {
  return NextResponse.json({ reviews: SEED_REVIEWS, total: SEED_REVIEWS.length })
}
