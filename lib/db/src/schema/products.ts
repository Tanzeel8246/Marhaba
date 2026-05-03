import { pgTable, serial, text, integer, boolean, numeric, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { categoriesTable } from "./categories";
import { relations } from "drizzle-orm";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => categoriesTable.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  basePrice: numeric("base_price", { precision: 10, scale: 2 }).notNull(),
  imageUrls: jsonb("image_urls").notNull().default([]),
  variants: jsonb("variants").notNull().default([]),
  addons: jsonb("addons").notNull().default([]),
  allowCustomMessage: boolean("allow_custom_message").notNull().default(false),
  isVisible: boolean("is_visible").notNull().default(true),
  isAvailable: boolean("is_available").notNull().default(true),
  orderCount: integer("order_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const productsRelations = relations(productsTable, ({ one }) => ({
  category: one(categoriesTable, {
    fields: [productsTable.categoryId],
    references: [categoriesTable.id],
  }),
}));

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true, createdAt: true, orderCount: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
