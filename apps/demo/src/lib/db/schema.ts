import {
  pgTable,
  text,
  integer,
  timestamp,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core"

// ─── Users ────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  image: text("image"),
  bio: text("bio"),
  role: text("role").notNull().default("user"), // user | creator | admin
  stripeAccountId: text("stripe_account_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

// ─── NextAuth tables ──────────────────────────────────────────

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refreshToken: text("refresh_token"),
  accessToken: text("access_token"),
  expiresAt: integer("expires_at"),
  tokenType: text("token_type"),
  scope: text("scope"),
  idToken: text("id_token"),
  sessionState: text("session_state"),
})

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  sessionToken: text("session_token").notNull().unique(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires").notNull(),
})

export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull().unique(),
  expires: timestamp("expires").notNull(),
})

// ─── Packs ────────────────────────────────────────────────────

export const packs = pgTable(
  "packs",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    description: text("description"),
    version: text("version").notNull(),
    authorId: text("author_id").notNull().references(() => users.id),
    category: text("category").notNull(), // color | typography | spacing | layout | effects | components | logic | other
    tags: text("tags").array(),
    priceCents: integer("price_cents").notNull().default(0),
    iconUrl: text("icon_url"),
    bannerUrl: text("banner_url"),
    readme: text("readme"),
    widgetCount: integer("widget_count").notNull(),
    widgetTypes: text("widget_types").array(),
    downloads: integer("downloads").notNull().default(0),
    status: text("status").notNull().default("published"), // draft | published | unlisted | suspended
    sourceUrl: text("source_url"),
    npmPackage: text("npm_package"),
    manifest: jsonb("manifest").notNull(), // WidgetPack metadata (no functions)
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("packs_author_idx").on(table.authorId),
    index("packs_category_idx").on(table.category),
    index("packs_status_idx").on(table.status),
  ]
)

// ─── Pack Versions ────────────────────────────────────────────

export const packVersions = pgTable(
  "pack_versions",
  {
    id: text("id").primaryKey(),
    packId: text("pack_id").notNull().references(() => packs.id, { onDelete: "cascade" }),
    version: text("version").notNull(),
    manifest: jsonb("manifest").notNull(),
    changelog: text("changelog"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("pack_version_unique").on(table.packId, table.version),
  ]
)

// ─── Reviews ──────────────────────────────────────────────────

export const reviews = pgTable(
  "reviews",
  {
    id: text("id").primaryKey(),
    packId: text("pack_id").notNull().references(() => packs.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull().references(() => users.id),
    rating: integer("rating").notNull(), // 1-5
    comment: text("comment"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("review_unique").on(table.packId, table.userId),
  ]
)

// ─── Downloads ────────────────────────────────────────────────

export const downloads = pgTable(
  "downloads",
  {
    id: text("id").primaryKey(),
    packId: text("pack_id").notNull().references(() => packs.id, { onDelete: "cascade" }),
    userId: text("user_id"),
    ipHash: text("ip_hash"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("downloads_pack_idx").on(table.packId),
  ]
)

// ─── API Keys ─────────────────────────────────────────────────

export const apiKeys = pgTable("api_keys", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  keyHash: text("key_hash").notNull().unique(),
  name: text("name"),
  lastUsedAt: timestamp("last_used_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

// ─── Types ────────────────────────────────────────────────────

export type User = typeof users.$inferSelect
export type Pack = typeof packs.$inferSelect
export type PackVersion = typeof packVersions.$inferSelect
export type Review = typeof reviews.$inferSelect
export type Download = typeof downloads.$inferSelect
