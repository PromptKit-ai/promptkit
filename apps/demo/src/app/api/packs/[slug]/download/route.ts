import { NextRequest, NextResponse } from "next/server"
import { SEED_PACKS } from "@/lib/db/seed"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const pack = SEED_PACKS.find((p) => p.slug === slug)
  if (!pack) {
    return NextResponse.json({ error: "Pack not found" }, { status: 404 })
  }

  // For MVP: return install instructions
  return NextResponse.json({
    slug: pack.slug,
    npmPackage: pack.npmPackage,
    installCommand: `npm install ${pack.npmPackage}`,
    version: pack.version,
  })
}
