import { Router } from "express";
import { db } from "@workspace/db";
import { 
  suppliersTable, insertSupplierSchema,
  purchasesTable, insertPurchaseSchema,
  expensesTable, insertExpenseSchema,
  cashBookTable, insertCashBookSchema,
  loyaltyTable,
  deliverySlotsTable, insertDeliverySlotSchema,
  wastageTable, insertWastageSchema,
  specialMomentsTable, insertSpecialMomentSchema,
  customersTable, insertCustomerSchema
} from "@workspace/db";
import { eq, desc, sql, and } from "drizzle-orm";
import { requireAdmin } from "../middlewares/requireAdmin";
import { auditLog } from "../middlewares/requireAdmin";

const router = Router();

// ─── Suppliers ────────────────────────────────────────────────────────────────
router.get("/admin/suppliers", requireAdmin, async (req, res) => {
  const suppliers = await db.select().from(suppliersTable).orderBy(desc(suppliersTable.createdAt));
  res.json(suppliers);
});

router.post("/admin/suppliers", requireAdmin, async (req, res) => {
  const parsed = insertSupplierSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const [supplier] = await db.insert(suppliersTable).values(parsed.data).returning();
  res.status(201).json(supplier);
});

// ─── Purchases ────────────────────────────────────────────────────────────────
router.get("/admin/purchases", requireAdmin, async (req, res) => {
  const purchases = await db.select().from(purchasesTable).orderBy(desc(purchasesTable.createdAt));
  res.json(purchases);
});

router.post("/admin/purchases", requireAdmin, async (req, res) => {
  const parsed = insertPurchaseSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  
  const [purchase] = await db.insert(purchasesTable).values(parsed.data).returning();
  
  // If received, update supplier balance
  if (purchase.status === "received" && purchase.supplierId) {
    await db.update(suppliersTable)
      .set({ balance: sql`balance + ${purchase.amount}` })
      .where(eq(suppliersTable.id, purchase.supplierId));
  }
  
  res.status(201).json(purchase);
});

// ─── Expenses ─────────────────────────────────────────────────────────────────
router.get("/admin/expenses", requireAdmin, async (req, res) => {
  const expenses = await db.select().from(expensesTable).orderBy(desc(expensesTable.date));
  res.json(expenses);
});

router.post("/admin/expenses", requireAdmin, async (req, res) => {
  const parsed = insertExpenseSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const [expense] = await db.insert(expensesTable).values(parsed.data).returning();
  
  // Auto cash-book entry
  await db.insert(cashBookTable).values({
    type: "out",
    description: `Expense: ${expense.category} - ${expense.description}`,
    amount: expense.amount,
    reference: `EXPENSE-${expense.id}`,
    date: expense.date,
  });
  
  res.status(201).json(expense);
});

// ─── Cash Book ────────────────────────────────────────────────────────────────
router.get("/admin/cash-book", requireAdmin, async (req, res) => {
  const entries = await db.select().from(cashBookTable).orderBy(desc(cashBookTable.date), desc(cashBookTable.createdAt));
  res.json(entries);
});

router.get("/admin/cash-book/balance", requireAdmin, async (req, res) => {
  const [{ totalIn }] = await db.select({ totalIn: sql<number>`coalesce(sum(amount::numeric), 0)` }).from(cashBookTable).where(eq(cashBookTable.type, "in"));
  const [{ totalOut }] = await db.select({ totalOut: sql<number>`coalesce(sum(amount::numeric), 0)` }).from(cashBookTable).where(eq(cashBookTable.type, "out"));
  res.json({ totalIn: Number(totalIn), totalOut: Number(totalOut), balance: Number(totalIn) - Number(totalOut) });
});

// ─── Loyalty ──────────────────────────────────────────────────────────────────
router.get("/admin/loyalty", requireAdmin, async (req, res) => {
  const loyalty = await db.select().from(loyaltyTable).orderBy(desc(loyaltyTable.points));
  res.json(loyalty);
});

// ─── Delivery Slots ───────────────────────────────────────────────────────────
router.get("/delivery-slots", async (req, res) => {
  const slots = await db.select().from(deliverySlotsTable).where(eq(deliverySlotsTable.isActive, 1)).orderBy(deliverySlotsTable.sortOrder);
  res.json(slots);
});

router.get("/admin/delivery-slots", requireAdmin, async (req, res) => {
  const slots = await db.select().from(deliverySlotsTable).orderBy(deliverySlotsTable.sortOrder);
  res.json(slots);
});

router.post("/admin/delivery-slots", requireAdmin, async (req, res) => {
  const parsed = insertDeliverySlotSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const [slot] = await db.insert(deliverySlotsTable).values(parsed.data).returning();
  res.status(201).json(slot);
});

// ─── Wastage ──────────────────────────────────────────────────────────────────
router.get("/admin/wastage", requireAdmin, async (req, res) => {
  const wastage = await db.select().from(wastageTable).orderBy(desc(wastageTable.date));
  res.json(wastage);
});

router.post("/admin/wastage", requireAdmin, async (req, res) => {
  const parsed = insertWastageSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const [entry] = await db.insert(wastageTable).values(parsed.data).returning();
  res.status(201).json(entry);
});

// ─── Special Moments ──────────────────────────────────────────────────────────
router.get("/admin/special-moments", requireAdmin, async (req, res) => {
  const moments = await db.select().from(specialMomentsTable).orderBy(desc(specialMomentsTable.date));
  res.json(moments);
});

router.post("/admin/special-moments", requireAdmin, async (req, res) => {
  const parsed = insertSpecialMomentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const [moment] = await db.insert(specialMomentsTable).values(parsed.data).returning();
  res.status(201).json(moment);
});

// ─── Customers ────────────────────────────────────────────────────────────────
router.get("/admin/customers", requireAdmin, async (req, res) => {
  const customers = await db.select().from(customersTable).orderBy(desc(customersTable.createdAt));
  res.json(customers);
});

router.post("/admin/customers", requireAdmin, async (req, res) => {
  const parsed = insertCustomerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const [customer] = await db.insert(customersTable).values(parsed.data).returning();
  res.status(201).json(customer);
});

export default router;
