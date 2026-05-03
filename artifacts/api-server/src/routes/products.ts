import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable, categoriesTable, insertProductSchema } from "@workspace/db";
import { eq, ilike, and, desc } from "drizzle-orm";

const router = Router();

router.get("/products", async (req, res) => {
  const { categoryId, search, visible, available } = req.query;

  let query = db
    .select({
      id: productsTable.id,
      categoryId: productsTable.categoryId,
      category: {
        id: categoriesTable.id,
        name: categoriesTable.name,
        slug: categoriesTable.slug,
        description: categoriesTable.description,
        imageUrl: categoriesTable.imageUrl,
        sortOrder: categoriesTable.sortOrder,
        createdAt: categoriesTable.createdAt,
      },
      name: productsTable.name,
      slug: productsTable.slug,
      description: productsTable.description,
      basePrice: productsTable.basePrice,
      imageUrls: productsTable.imageUrls,
      variants: productsTable.variants,
      addons: productsTable.addons,
      allowCustomMessage: productsTable.allowCustomMessage,
      isVisible: productsTable.isVisible,
      isAvailable: productsTable.isAvailable,
      orderCount: productsTable.orderCount,
      createdAt: productsTable.createdAt,
    })
    .from(productsTable)
    .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .$dynamic();

  const conditions = [];
  if (categoryId) conditions.push(eq(productsTable.categoryId, Number(categoryId)));
  if (search) conditions.push(ilike(productsTable.name, `%${search}%`));
  if (visible !== undefined) conditions.push(eq(productsTable.isVisible, visible === "true"));
  if (available !== undefined) conditions.push(eq(productsTable.isAvailable, available === "true"));

  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  const products = await query.orderBy(productsTable.createdAt);
  res.json(products);
});

router.post("/products", async (req, res) => {
  const parsed = insertProductSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const [product] = await db
    .insert(productsTable)
    .values(parsed.data)
    .returning();
  res.status(201).json(product);
});

router.get("/products/popular", async (req, res) => {
  const products = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.isVisible, true))
    .orderBy(desc(productsTable.orderCount))
    .limit(8);
  res.json(products);
});

router.get("/products/:id", async (req, res) => {
  const id = Number(req.params.id);
  const [product] = await db
    .select({
      id: productsTable.id,
      categoryId: productsTable.categoryId,
      category: {
        id: categoriesTable.id,
        name: categoriesTable.name,
        slug: categoriesTable.slug,
        description: categoriesTable.description,
        imageUrl: categoriesTable.imageUrl,
        sortOrder: categoriesTable.sortOrder,
        createdAt: categoriesTable.createdAt,
      },
      name: productsTable.name,
      slug: productsTable.slug,
      description: productsTable.description,
      basePrice: productsTable.basePrice,
      imageUrls: productsTable.imageUrls,
      variants: productsTable.variants,
      addons: productsTable.addons,
      allowCustomMessage: productsTable.allowCustomMessage,
      isVisible: productsTable.isVisible,
      isAvailable: productsTable.isAvailable,
      orderCount: productsTable.orderCount,
      createdAt: productsTable.createdAt,
    })
    .from(productsTable)
    .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(eq(productsTable.id, id));

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(product);
});

router.put("/products/:id", async (req, res) => {
  const id = Number(req.params.id);
  const parsed = insertProductSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const [product] = await db
    .update(productsTable)
    .set(parsed.data)
    .where(eq(productsTable.id, id))
    .returning();
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(product);
});

router.delete("/products/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(productsTable).where(eq(productsTable.id, id));
  res.status(204).send();
});

router.patch("/products/:id/toggle-visibility", async (req, res) => {
  const id = Number(req.params.id);
  const [current] = await db.select().from(productsTable).where(eq(productsTable.id, id));
  if (!current) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  const [product] = await db
    .update(productsTable)
    .set({ isVisible: !current.isVisible })
    .where(eq(productsTable.id, id))
    .returning();
  res.json(product);
});

router.patch("/products/:id/toggle-availability", async (req, res) => {
  const id = Number(req.params.id);
  const [current] = await db.select().from(productsTable).where(eq(productsTable.id, id));
  if (!current) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  const [product] = await db
    .update(productsTable)
    .set({ isAvailable: !current.isAvailable })
    .where(eq(productsTable.id, id))
    .returning();
  res.json(product);
});

router.get("/products/:id/related", async (req, res) => {
  const id = Number(req.params.id);
  const [current] = await db.select().from(productsTable).where(eq(productsTable.id, id));
  if (!current || !current.categoryId) {
    res.json([]);
    return;
  }
  const related = await db
    .select()
    .from(productsTable)
    .where(
      and(
        eq(productsTable.categoryId, current.categoryId),
        eq(productsTable.isVisible, true),
      ),
    )
    .limit(5);
  res.json(related.filter((p) => p.id !== id));
});

export default router;
