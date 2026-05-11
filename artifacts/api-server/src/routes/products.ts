import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable, categoriesTable, insertProductSchema } from "@workspace/db";
import { eq, ilike, and, desc } from "drizzle-orm";
import fs from "fs";
import path from "path";

const router = Router();

router.post("/products/upload", async (req, res) => {
  try {
    const { base64, fileName } = req.body;
    if (!base64) return res.status(400).json({ error: "No image data" });

    const buffer = Buffer.from(base64.split(",")[1], "base64");
    const name = fileName || `prod_${Date.now()}.png`;
    const uploadDir = path.join(process.cwd(), "public", "images");
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, name);
    fs.writeFileSync(filePath, buffer);

    return res.json({ url: `/images/${name}` });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

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
      leadTimeHours: productsTable.leadTimeHours,
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
    const errorDetails = JSON.stringify(parsed.error.flatten().fieldErrors);
    res.status(400).json({ error: `Validation failed: ${errorDetails}` });
    return;
  }
  try {
    const [product] = await db
      .insert(productsTable)
      .values(parsed.data)
      .returning();
    res.status(201).json(product);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
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
      leadTimeHours: productsTable.leadTimeHours,
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

  try {
    const body = req.body;

    // Explicitly build the update payload with correct Drizzle camelCase keys
    // and proper types — avoids passing unknown fields or wrong types to the DB
    const updateData: Record<string, unknown> = {};

    if (body.name !== undefined)               updateData.name = String(body.name);
    if (body.slug !== undefined)               updateData.slug = String(body.slug);
    if (body.description !== undefined)        updateData.description = body.description ?? null;
    if (body.basePrice !== undefined)          updateData.basePrice = String(Number(body.basePrice));
    if (body.categoryId !== undefined)         updateData.categoryId = body.categoryId ? Number(body.categoryId) : null;
    if (body.allowCustomMessage !== undefined) updateData.allowCustomMessage = Boolean(body.allowCustomMessage);
    if (body.isVisible !== undefined)          updateData.isVisible = Boolean(body.isVisible);
    if (body.isAvailable !== undefined)        updateData.isAvailable = Boolean(body.isAvailable);
    if (body.leadTimeHours !== undefined)      updateData.leadTimeHours = Number(body.leadTimeHours);

    // imageUrls, variants, addons must be JSON arrays
    if (body.imageUrls !== undefined) {
      updateData.imageUrls = Array.isArray(body.imageUrls)
        ? body.imageUrls
        : (typeof body.imageUrls === "string"
            ? body.imageUrls.split("\n").map((s: string) => s.trim()).filter(Boolean)
            : []);
    }
    if (body.variants !== undefined) {
      updateData.variants = Array.isArray(body.variants) ? body.variants : [];
    }
    if (body.addons !== undefined) {
      updateData.addons = Array.isArray(body.addons) ? body.addons : [];
    }

    const [product] = await db
      .update(productsTable)
      .set(updateData)
      .where(eq(productsTable.id, id))
      .returning();

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(product);
  } catch (err: any) {
    console.error("Product update DB error:", err);
    res.status(500).json({ error: `DB Error: ${err.message}` });
  }
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
