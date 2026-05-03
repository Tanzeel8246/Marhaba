import { db } from "@workspace/db";
import { categoriesTable as categories, productsTable as products, bannersTable as banners } from "@workspace/db";

async function reseed() {
  console.log("Clearing existing data...");

  await db.delete(products);
  await db.delete(banners);
  await db.delete(categories);

  console.log("Seeding fresh Pakistani bakery data...");

  const [cakes, cookies, pastries, breads] = await db
    .insert(categories)
    .values([
      { name: "Celebration Cakes", slug: "cakes", description: "Custom cakes for every occasion", sortOrder: 1 },
      { name: "Cookies & Biscuits", slug: "cookies", description: "Hand-decorated artisan cookies", sortOrder: 2 },
      { name: "Pastries & Desserts", slug: "pastries", description: "Freshly baked pastries and desserts", sortOrder: 3 },
      { name: "Artisan Breads", slug: "breads", description: "Sourdough and specialty breads", sortOrder: 4 },
    ])
    .returning();

  console.log("Categories created.");

  await db.insert(products).values([
    // ── Celebration Cakes ──
    {
      name: "Classic Vanilla Birthday Cake",
      slug: "classic-vanilla-birthday-cake",
      description: "A timeless vanilla sponge layered with silky buttercream frosting. Perfect for any celebration.",
      basePrice: "2500.00",
      categoryId: cakes.id,
      imageUrls: JSON.stringify(["https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=600&q=80"]),
      variants: JSON.stringify([
        { name: "Size", type: "size", options: [{ label: "6 inch (serves 8)", priceAdjustment: 0 }, { label: "8 inch (serves 16)", priceAdjustment: 800 }, { label: "10 inch (serves 24)", priceAdjustment: 1500 }] },
        { name: "Frosting Color", type: "frosting", options: [{ label: "White", priceAdjustment: 0 }, { label: "Pink", priceAdjustment: 0 }, { label: "Sky Blue", priceAdjustment: 0 }, { label: "Gold", priceAdjustment: 300 }] },
      ]),
      addons: JSON.stringify([{ name: "Gold Drip", price: 500 }, { name: "Edible Flowers", price: 700 }, { name: "Fondant Topper", price: 800 }]),
      allowCustomMessage: true,
      isVisible: true,
      isAvailable: true,
    },
    {
      name: "Chocolate Fudge Indulgence Cake",
      slug: "chocolate-fudge-cake",
      description: "Rich dark chocolate sponge with velvety ganache — a chocoholic's dream.",
      basePrice: "3200.00",
      categoryId: cakes.id,
      imageUrls: JSON.stringify(["https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80"]),
      variants: JSON.stringify([
        { name: "Size", type: "size", options: [{ label: "6 inch (serves 8)", priceAdjustment: 0 }, { label: "8 inch (serves 16)", priceAdjustment: 1000 }, { label: "10 inch (serves 24)", priceAdjustment: 2000 }] },
      ]),
      addons: JSON.stringify([{ name: "Chocolate Shards", price: 400 }, { name: "Raspberry Coulis", price: 350 }]),
      allowCustomMessage: true,
      isVisible: true,
      isAvailable: true,
    },
    {
      name: "Red Velvet Dream Cake",
      slug: "red-velvet-dream-cake",
      description: "Velvety red sponge with luscious cream cheese frosting and a hint of cocoa.",
      basePrice: "3000.00",
      categoryId: cakes.id,
      imageUrls: JSON.stringify(["https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=600&q=80"]),
      variants: JSON.stringify([
        { name: "Size", type: "size", options: [{ label: "6 inch", priceAdjustment: 0 }, { label: "8 inch", priceAdjustment: 900 }] },
      ]),
      allowCustomMessage: true,
      isVisible: true,
      isAvailable: true,
    },
    {
      name: "Pineapple Gateau",
      slug: "pineapple-gateau",
      description: "A Pakistani bakery classic — light sponge layers filled with pineapple cream and fresh pineapple chunks. Always a crowd favourite.",
      basePrice: "2800.00",
      categoryId: cakes.id,
      imageUrls: JSON.stringify(["https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80"]),
      variants: JSON.stringify([
        { name: "Size", type: "size", options: [{ label: "6 inch (serves 8)", priceAdjustment: 0 }, { label: "8 inch (serves 16)", priceAdjustment: 800 }, { label: "10 inch (serves 24)", priceAdjustment: 1500 }] },
      ]),
      allowCustomMessage: true,
      isVisible: true,
      isAvailable: true,
    },
    {
      name: "Black Forest Cake",
      slug: "black-forest-cake",
      description: "Layers of dark chocolate sponge, cherries, and whipped cream — a timeless European classic loved across Pakistan.",
      basePrice: "3200.00",
      categoryId: cakes.id,
      imageUrls: JSON.stringify(["https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600&q=80"]),
      variants: JSON.stringify([
        { name: "Size", type: "size", options: [{ label: "6 inch (serves 8)", priceAdjustment: 0 }, { label: "8 inch (serves 16)", priceAdjustment: 1000 }] },
      ]),
      addons: JSON.stringify([{ name: "Extra Cherries", price: 300 }]),
      allowCustomMessage: true,
      isVisible: true,
      isAvailable: true,
    },
    {
      name: "Tres Leches Cake",
      slug: "tres-leches-cake",
      description: "Ultra-moist sponge soaked in three kinds of milk, topped with fresh whipped cream. Incredibly soft and indulgent.",
      basePrice: "3500.00",
      categoryId: cakes.id,
      imageUrls: JSON.stringify(["https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80"]),
      variants: JSON.stringify([
        { name: "Size", type: "size", options: [{ label: "6 inch", priceAdjustment: 0 }, { label: "8 inch", priceAdjustment: 900 }] },
      ]),
      allowCustomMessage: true,
      isVisible: true,
      isAvailable: true,
    },
    {
      name: "Rose & Pistachio Cake",
      slug: "rose-pistachio-cake",
      description: "Fragrant rose-water infused sponge with pistachio buttercream — inspired by the finest Lahori mithai.",
      basePrice: "3800.00",
      categoryId: cakes.id,
      imageUrls: JSON.stringify(["https://images.unsplash.com/photo-1562440499-64c9a111f713?w=600&q=80"]),
      variants: JSON.stringify([
        { name: "Size", type: "size", options: [{ label: "6 inch", priceAdjustment: 0 }, { label: "8 inch", priceAdjustment: 1000 }] },
      ]),
      addons: JSON.stringify([{ name: "Edible Rose Petals", price: 500 }, { name: "Gold Leaf Decoration", price: 800 }]),
      allowCustomMessage: true,
      isVisible: true,
      isAvailable: true,
    },
    {
      name: "New York Cheesecake",
      slug: "new-york-cheesecake",
      description: "Dense, creamy, and smooth — baked to perfection on a buttery biscuit base. Served plain or with berry compote.",
      basePrice: "3200.00",
      categoryId: cakes.id,
      imageUrls: JSON.stringify(["https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&q=80"]),
      variants: JSON.stringify([
        { name: "Topping", type: "topping", options: [{ label: "Plain", priceAdjustment: 0 }, { label: "Strawberry Compote", priceAdjustment: 300 }, { label: "Blueberry Compote", priceAdjustment: 300 }, { label: "Lotus Biscoff", priceAdjustment: 500 }] },
      ]),
      allowCustomMessage: false,
      isVisible: true,
      isAvailable: true,
    },

    // ── Cookies & Biscuits ──
    {
      name: "Classic Butter Cookies (12 pack)",
      slug: "butter-cookies-12",
      description: "Buttery melt-in-your-mouth cookies with hand-piped royal icing designs.",
      basePrice: "1200.00",
      categoryId: cookies.id,
      imageUrls: JSON.stringify(["https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&q=80"]),
      variants: JSON.stringify([
        { name: "Design", type: "design", options: [{ label: "Floral", priceAdjustment: 0 }, { label: "Stars & Hearts", priceAdjustment: 0 }, { label: "Custom", priceAdjustment: 400 }] },
      ]),
      allowCustomMessage: false,
      isVisible: true,
      isAvailable: true,
    },
    {
      name: "Macaron Box (12 pieces)",
      slug: "macaron-box-12",
      description: "Delicate French macarons in seasonal flavours, beautifully boxed — perfect as a gift.",
      basePrice: "1800.00",
      categoryId: cookies.id,
      imageUrls: JSON.stringify(["https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=600&q=80"]),
      variants: JSON.stringify([
        { name: "Flavours", type: "flavors", options: [{ label: "Classic Mix (vanilla, chocolate, rose)", priceAdjustment: 0 }, { label: "Seasonal Special", priceAdjustment: 300 }] },
      ]),
      allowCustomMessage: false,
      isVisible: true,
      isAvailable: true,
    },
    {
      name: "Brownie Box (9 pieces)",
      slug: "brownie-box-9",
      description: "Fudgy, rich chocolate brownies baked with Belgian chocolate. Crispy top, gooey inside — as it should be.",
      basePrice: "1500.00",
      categoryId: cookies.id,
      imageUrls: JSON.stringify(["https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80"]),
      variants: JSON.stringify([
        { name: "Type", type: "type", options: [{ label: "Classic Fudge", priceAdjustment: 0 }, { label: "Walnut Brownie", priceAdjustment: 200 }, { label: "Nutella Swirl", priceAdjustment: 300 }] },
      ]),
      allowCustomMessage: false,
      isVisible: true,
      isAvailable: true,
    },

    // ── Pastries & Desserts ──
    {
      name: "Butter Croissant",
      slug: "butter-croissant",
      description: "Flaky, golden, made with pure European butter. Baked fresh every morning.",
      basePrice: "350.00",
      categoryId: pastries.id,
      imageUrls: JSON.stringify(["https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80"]),
      variants: JSON.stringify([
        { name: "Filling", type: "filling", options: [{ label: "Plain", priceAdjustment: 0 }, { label: "Almond", priceAdjustment: 100 }, { label: "Chocolate", priceAdjustment: 80 }] },
      ]),
      allowCustomMessage: false,
      isVisible: true,
      isAvailable: true,
    },
    {
      name: "Mini Cupcakes (6 pack)",
      slug: "mini-cupcakes-6",
      description: "Perfectly portioned mini cupcakes with pillowy frosting swirls. Great for parties and gifts.",
      basePrice: "900.00",
      categoryId: pastries.id,
      imageUrls: JSON.stringify(["https://images.unsplash.com/photo-1519869325930-281384150729?w=600&q=80"]),
      variants: JSON.stringify([
        { name: "Flavour", type: "flavor", options: [{ label: "Vanilla", priceAdjustment: 0 }, { label: "Chocolate", priceAdjustment: 0 }, { label: "Red Velvet", priceAdjustment: 100 }, { label: "Lemon Blueberry", priceAdjustment: 100 }] },
      ]),
      allowCustomMessage: false,
      isVisible: true,
      isAvailable: true,
    },
    {
      name: "Swiss Roll",
      slug: "swiss-roll",
      description: "Soft sponge rolled with fresh cream and jam — a nostalgic treat from the classic Pakistani bakery.",
      basePrice: "1200.00",
      categoryId: pastries.id,
      imageUrls: JSON.stringify(["https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=600&q=80"]),
      variants: JSON.stringify([
        { name: "Flavour", type: "flavor", options: [{ label: "Vanilla & Jam", priceAdjustment: 0 }, { label: "Chocolate & Cream", priceAdjustment: 0 }, { label: "Matcha & Cream", priceAdjustment: 200 }] },
      ]),
      allowCustomMessage: false,
      isVisible: true,
      isAvailable: true,
    },

    // ── Artisan Breads ──
    {
      name: "Sourdough Boule",
      slug: "sourdough-boule",
      description: "Long-fermented sourdough with a crisp crust and chewy, open crumb. Baked in small batches.",
      basePrice: "900.00",
      categoryId: breads.id,
      imageUrls: JSON.stringify(["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80"]),
      addons: JSON.stringify([{ name: "Custom Scoring Design", price: 200 }]),
      allowCustomMessage: false,
      isVisible: true,
      isAvailable: true,
    },
  ]);

  await db.insert(banners).values([
    {
      title: "Fresh from the Oven",
      subtitle: "Custom cakes, artisan cookies, and seasonal pastries — made to order, delivered to your door.",
      imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1200&q=80",
      linkUrl: "/shop",
      isActive: true,
      sortOrder: 1,
    },
    {
      title: "Order Your Dream Cake",
      subtitle: "Birthdays, weddings, or just because — we craft personalized cakes for every occasion.",
      imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&q=80",
      linkUrl: "/shop",
      isActive: true,
      sortOrder: 2,
    },
  ]);

  console.log("✅ Reseed complete! 16 products, 4 categories, 2 banners — all in PKR.");
}

reseed().catch((err) => {
  console.error("Reseed error:", err);
  process.exit(1);
});
