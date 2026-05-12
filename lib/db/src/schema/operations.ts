import { pgTable, serial, text, integer, numeric, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

// ─── Audit Logs ───────────────────────────────────────────────────────────────
export const auditLogsTable = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  action: text("action").notNull(),           // e.g. "order.status.changed"
  entityType: text("entity_type").notNull(),  // "order", "product", "coupon"
  entityId: integer("entity_id"),
  oldValue: jsonb("old_value"),
  newValue: jsonb("new_value"),
  ip: text("ip"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type AuditLog = typeof auditLogsTable.$inferSelect;

// ─── Suppliers ────────────────────────────────────────────────────────────────
export const suppliersTable = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  company: text("company").notNull(),
  contact: text("contact"),
  phone: text("phone").notNull(),
  material: text("material"),
  balance: numeric("balance", { precision: 10, scale: 2 }).notNull().default("0"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSupplierSchema = createInsertSchema(suppliersTable).omit({ id: true, createdAt: true });
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
export type Supplier = typeof suppliersTable.$inferSelect;

// ─── Purchases ────────────────────────────────────────────────────────────────
export const purchasesTable = pgTable("purchases", {
  id: serial("id").primaryKey(),
  supplierId: integer("supplier_id").references(() => suppliersTable.id, { onDelete: "set null" }),
  supplierName: text("supplier_name"),        // cached for fast display
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending | received | cancelled
  items: jsonb("items").notNull().default([]), // [{ name, qty, unit, unitCost }]
  notes: text("notes"),
  date: text("date").notNull(),               // YYYY-MM-DD
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPurchaseSchema = createInsertSchema(purchasesTable, {
  items: z.any(),
}).omit({ id: true, createdAt: true });
export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;
export type Purchase = typeof purchasesTable.$inferSelect;

// ─── Expenses ─────────────────────────────────────────────────────────────────
export const expensesTable = pgTable("expenses", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(), // utility | salary | maintenance | rent | other
  description: text("description").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull().default("cash"), // cash | bank | jazzcash | easypaisa
  date: text("date").notNull(),             // YYYY-MM-DD
  receipt: text("receipt"),                 // optional image URL
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertExpenseSchema = createInsertSchema(expensesTable).omit({ id: true, createdAt: true });
export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type Expense = typeof expensesTable.$inferSelect;

// ─── Cash Book ────────────────────────────────────────────────────────────────
export const cashBookTable = pgTable("cash_book", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),            // "in" | "out"
  description: text("description").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  reference: text("reference"),            // "ORDER-#123" | "PURCHASE-#45"
  date: text("date").notNull(),            // YYYY-MM-DD
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCashBookSchema = createInsertSchema(cashBookTable).omit({ id: true, createdAt: true });
export type InsertCashBook = z.infer<typeof insertCashBookSchema>;
export type CashBook = typeof cashBookTable.$inferSelect;

// ─── Loyalty Points ───────────────────────────────────────────────────────────
export const loyaltyTable = pgTable("loyalty_points", {
  id: serial("id").primaryKey(),
  customerPhone: text("customer_phone").notNull().unique(),
  customerName: text("customer_name").notNull(),
  points: integer("points").notNull().default(0),
  totalEarned: integer("total_earned").notNull().default(0),
  totalRedeemed: integer("total_redeemed").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Loyalty = typeof loyaltyTable.$inferSelect;

// ─── Delivery Time Slots ──────────────────────────────────────────────────────
export const deliverySlotsTable = pgTable("delivery_slots", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),           // "Morning (10am-12pm)"
  startTime: text("start_time").notNull(),  // "10:00"
  endTime: text("end_time").notNull(),      // "12:00"
  capacity: integer("capacity").notNull().default(5),
  isActive: integer("is_active").notNull().default(1), // 1 | 0
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDeliverySlotSchema = createInsertSchema(deliverySlotsTable).omit({ id: true, createdAt: true });
export type InsertDeliverySlot = z.infer<typeof insertDeliverySlotSchema>;
export type DeliverySlot = typeof deliverySlotsTable.$inferSelect;

// ─── Wastage ──────────────────────────────────────────────────────────────────
export const wastageTable = pgTable("wastage", {
  id: serial("id").primaryKey(),
  itemName: text("item_name").notNull(),
  quantity: text("quantity").notNull(),
  reason: text("reason").notNull(), // expired | damaged | production_error
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  date: text("date").notNull(), // YYYY-MM-DD
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertWastageSchema = createInsertSchema(wastageTable).omit({ id: true, createdAt: true });
export type InsertWastage = z.infer<typeof insertWastageSchema>;
export type Wastage = typeof wastageTable.$inferSelect;

// ─── Special Moments ──────────────────────────────────────────────────────────
export const specialMomentsTable = pgTable("special_moments", {
  id: serial("id").primaryKey(),
  event: text("event").notNull(),
  date: text("date").notNull(),
  status: text("status").notNull().default("planning"), // planning | draft | completed
  budget: numeric("budget", { precision: 10, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSpecialMomentSchema = createInsertSchema(specialMomentsTable).omit({ id: true, createdAt: true });
export type InsertSpecialMoment = z.infer<typeof insertSpecialMomentSchema>;
export type SpecialMoment = typeof specialMomentsTable.$inferSelect;
