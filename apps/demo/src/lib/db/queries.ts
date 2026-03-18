import { db, schema } from "./index"
import { eq, desc, asc, ilike, or, sql, and, count, avg } from "drizzle-orm"

const { packs, users, reviews, downloads, packVersions } = schema

// ─── Packs ────────────────────────────────────────────────────

export type PackWithAuthor = schema.Pack & { author: Pick<schema.User, "id" | "name" | "image"> }

export async function listPacks(opts: {
  q?: string
  category?: string
  sort?: "popular" | "new" | "name"
  page?: number
  limit?: number
} = {}): Promise<{ packs: PackWithAuthor[]; total: number }> {
  const { q, category, sort = "popular", page = 1, limit = 20 } = opts
  const offset = (page - 1) * limit

  const conditions = [eq(packs.status, "published")]
  if (category) conditions.push(eq(packs.category, category))
  if (q) {
    conditions.push(
      or(
        ilike(packs.name, `%${q}%`),
        ilike(packs.description, `%${q}%`)
      )!
    )
  }

  const where = and(...conditions)

  const orderBy =
    sort === "popular" ? desc(packs.downloads) :
    sort === "new" ? desc(packs.createdAt) :
    asc(packs.name)

  const [results, [countResult]] = await Promise.all([
    db
      .select({
        pack: packs,
        author: { id: users.id, name: users.name, image: users.image },
      })
      .from(packs)
      .innerJoin(users, eq(packs.authorId, users.id))
      .where(where)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset),
    db.select({ count: count() }).from(packs).where(where),
  ])

  return {
    packs: results.map((r) => ({ ...r.pack, author: r.author })),
    total: countResult?.count ?? 0,
  }
}

export async function getPackBySlug(slug: string): Promise<(PackWithAuthor & { avgRating: number; reviewCount: number }) | null> {
  const [result] = await db
    .select({
      pack: packs,
      author: { id: users.id, name: users.name, image: users.image },
    })
    .from(packs)
    .innerJoin(users, eq(packs.authorId, users.id))
    .where(eq(packs.slug, slug))
    .limit(1)

  if (!result) return null

  const [stats] = await db
    .select({
      avgRating: avg(reviews.rating),
      reviewCount: count(),
    })
    .from(reviews)
    .where(eq(reviews.packId, result.pack.id))

  return {
    ...result.pack,
    author: result.author,
    avgRating: stats?.avgRating ? Number(stats.avgRating) : 0,
    reviewCount: stats?.reviewCount ?? 0,
  }
}

export async function getPacksByAuthor(authorId: string): Promise<schema.Pack[]> {
  return db
    .select()
    .from(packs)
    .where(and(eq(packs.authorId, authorId), eq(packs.status, "published")))
    .orderBy(desc(packs.downloads))
}

export async function incrementDownloads(packId: string, userId?: string, ipHash?: string) {
  const { nanoid } = await import("nanoid")
  await Promise.all([
    db.update(packs).set({ downloads: sql`${packs.downloads} + 1` }).where(eq(packs.id, packId)),
    db.insert(downloads).values({ id: nanoid(), packId, userId, ipHash }),
  ])
}

// ─── Reviews ──────────────────────────────────────────────────

export type ReviewWithUser = schema.Review & { user: Pick<schema.User, "id" | "name" | "image"> }

export async function getReviews(packId: string, page = 1, limit = 10): Promise<ReviewWithUser[]> {
  const offset = (page - 1) * limit
  const results = await db
    .select({
      review: reviews,
      user: { id: users.id, name: users.name, image: users.image },
    })
    .from(reviews)
    .innerJoin(users, eq(reviews.userId, users.id))
    .where(eq(reviews.packId, packId))
    .orderBy(desc(reviews.createdAt))
    .limit(limit)
    .offset(offset)

  return results.map((r) => ({ ...r.review, user: r.user }))
}

// ─── Categories ───────────────────────────────────────────────

export async function getCategoryCounts(): Promise<Array<{ category: string; count: number }>> {
  return db
    .select({ category: packs.category, count: count() })
    .from(packs)
    .where(eq(packs.status, "published"))
    .groupBy(packs.category)
    .orderBy(desc(count()))
}

// ─── Users ────────────────────────────────────────────────────

export async function getUserById(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1)
  return user ?? null
}
