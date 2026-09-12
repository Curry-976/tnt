import { pgTable, serial, text, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  // Nullable: older accounts created before this field existed have no name.
  name: varchar("name", { length: 120 }),
  // Nullable: accounts created via Google sign-in have no password.
  passwordHash: text("password_hash"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  email: varchar("email", { length: 255 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending | paid | cancelled
  stripeSessionId: varchar("stripe_session_id", { length: 255 }),
  totalCents: integer("total_cents").notNull(),
  shippingAddress: text("shipping_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id),
  // Product catalog now lives in Sanity, not Neon, so order lines snapshot the
  // product identity/price at purchase time instead of holding a foreign key
  // to a local products table (which no longer exists).
  productSlug: varchar("product_slug", { length: 80 }).notNull(),
  productName: varchar("product_name", { length: 120 }).notNull(),
  size: varchar("size", { length: 4 }).notNull(),
  floque: boolean("floque").notNull().default(false),
  nom: varchar("nom", { length: 20 }),
  numero: varchar("numero", { length: 3 }),
  qty: integer("qty").notNull(),
  unitPriceCents: integer("unit_price_cents").notNull(),
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  // SHA-256 hash of the token sent by email — the raw token is never stored,
  // same reasoning as a password hash: a DB leak shouldn't hand out usable
  // reset links.
  tokenHash: varchar("token_hash", { length: 64 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
