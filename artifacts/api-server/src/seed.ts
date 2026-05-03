import { db } from "@workspace/db";
import { categoriesTable as categories, productsTable as products, bannersTable as banners } from "@workspace/db";

async function seed() {
  console.log("Seeding bakery data...");

  const existingCats = await db.select().from(categories);
  if (existingCats.length > 0) {
    console.log("Database already seeded, skipping.");
    return;
  }

  const [cakes, cookies, pastries, breads] = await db
    .insert(categories)
    .values([
      { name: "Celebration Cakes", slug: "cakes", description: "Custom cakes for every occasion", sortOrder: 1 },
      { name: "Cookies & Biscuits", slug: "cookies", description: "Hand-decorated artisan cookies", sortOrder: 2 },
      { name: "Pastries & Croissants", slug: "pastries", description: "Freshly baked pastries", sortOrder: 3 },
      { name: "Artisan Breads", slug: "breads", description: "Sourdough and specialty breads", sortOrder: 4 },
    ])
    .returning();

  console.log("Categories created:", cakes.name, cookies.name, pastries.name, breads.name);

  await db.insert(products).values([
    {
      name: "Classic Vanilla Birthday Cake",
      slug: "classic-vanilla-birthday-cake",
      description: "A timeless vanilla sponge layered with silky buttercream frosting. Perfect for any celebration.",
      basePrice: "48.00",
      categoryId: cakes.id,
      imageUrls: JSON.stringify(["https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=600&q=80"]),
      variants: JSON.stringify([
        { name: "Size", type: "size", options: [{ label: "6 inch (serves 8)", priceAdjustment: 0 }, { label: "8 inch (serves 16)", priceAdjustment: 15 }, { label: "10 inch (serves 24)", priceAdjustment: 30 }] },
        { name: "Frosting Color", type: "frosting", options: [{ label: "White", priceAdjustment: 0 }, { label: "Pink", priceAdjustment: 0 }, { label: "Sky Blue", priceAdjustment: 0 }, { label: "Gold", priceAdjustment: 5 }] },
      ]),
      addons: JSON.stringify([{ name: "Gold Drip", price: 8 }, { name: "Edible Flowers", price: 12 }, { name: "Fondant Topper", price: 15 }]),
      allowCustomMessage: true,
      isVisible: true,
      isAvailable: true,
    },
    {
      name: "Chocolate Fudge Indulgence Cake",
      slug: "chocolate-fudge-cake",
      description: "Rich dark chocolate sponge with velvety ganache — a chocoholic's dream.",
      basePrice: "55.00",
      categoryId: cakes.id,
      imageUrls: JSON.stringify(["https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80"]),
      variants: JSON.stringify([
        { name: "Size", type: "size", options: [{ label: "6 inch (serves 8)", priceAdjustment: 0 }, { label: "8 inch (serves 16)", priceAdjustment: 18 }, { label: "10 inch (serves 24)", priceAdjustment: 35 }] },
      ]),
      addons: JSON.stringify([{ name: "Chocolate Shards", price: 6 }, { name: "Raspberry Coulis", price: 5 }]),
      allowCustomMessage: true,
      isVisible: true,
      isAvailable: true,
    },
    {
      name: "Strawberry Shortcake",
      slug: "strawberry-shortcake",
      description: "Light chiffon sponge with fresh strawberries and clouds of whipped cream.",
      basePrice: "42.00",
      categoryId: cakes.id,
      imageUrls: JSON.stringify(["https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80"]),
      variants: JSON.stringify([
        { name: "Size", type: "size", options: [{ label: "6 inch", priceAdjustment: 0 }, { label: "8 inch", priceAdjustment: 12 }] },
      ]),
      allowCustomMessage: true,
      isVisible: true,
      isAvailable: true,
    },
    {
      name: "Classic Butter Cookies (12 pack)",
      slug: "butter-cookies-12",
      description: "Buttery melt-in-your-mouth cookies with hand-piped royal icing designs.",
      basePrice: "24.00",
      categoryId: cookies.id,
      imageUrls: JSON.stringify(["https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&q=80"]),
      variants: JSON.stringify([
        { name: "Design", type: "design", options: [{ label: "Floral", priceAdjustment: 0 }, { label: "Stars & Hearts", priceAdjustment: 0 }, { label: "Custom", priceAdjustment: 8 }] },
      ]),
      allowCustomMessage: false,
      isVisible: true,
      isAvailable: true,
    },
    {
      name: "Macaron Tower (24 pieces)",
      slug: "macaron-tower-24",
      description: "Delicate French macarons in seasonal flavors, beautifully boxed.",
      basePrice: "38.00",
      categoryId: cookies.id,
      imageUrls: JSON.stringify(["https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=600&q=80"]),
      variants: JSON.stringify([
        { name: "Flavors", type: "flavors", options: [{ label: "Classic Mix", priceAdjustment: 0 }, { label: "Seasonal Special", priceAdjustment: 5 }] },
      ]),
      allowCustomMessage: false,
      isVisible: true,
      isAvailable: true,
    },
    {
      name: "Butter Croissant",
      slug: "butter-croissant",
      description: "Flaky, golden, made with pure European butter. Baked fresh every morning.",
      basePrice: "4.50",
      categoryId: pastries.id,
      imageUrls: JSON.stringify(["https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80"]),
      variants: JSON.stringify([
        { name: "Filling", type: "filling", options: [{ label: "Plain", priceAdjustment: 0 }, { label: "Almond", priceAdjustment: 1.5 }, { label: "Chocolate", priceAdjustment: 1 }] },
      ]),
      allowCustomMessage: false,
      isVisible: true,
      isAvailable: true,
    },
    {
      name: "Sourdough Boule",
      slug: "sourdough-boule",
      description: "Long-fermented sourdough with a crisp crust and chewy, open crumb.",
      basePrice: "12.00",
      categoryId: breads.id,
      imageUrls: JSON.stringify(["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80"]),
      addons: JSON.stringify([{ name: "Scoring Design", price: 3 }]),
      allowCustomMessage: false,
      isVisible: true,
      isAvailable: true,
    },
    {
      name: "Red Velvet Dream Cake",
      slug: "red-velvet-dream-cake",
      description: "Velvety red sponge with luscious cream cheese frosting and a hint of cocoa.",
      basePrice: "52.00",
      categoryId: cakes.id,
      imageUrls: JSON.stringify(["https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=600&q=80"]),
      variants: JSON.stringify([
        { name: "Size", type: "size", options: [{ label: "6 inch", priceAdjustment: 0 }, { label: "8 inch", priceAdjustment: 15 }] },
      ]),
      allowCustomMessage: true,
      isVisible: true,
      isAvailable: true,
    },
  ]);

  await db.insert(banners).values([
    {
      title: "Fresh from the Oven",
      subtitle: "Custom cakes, artisan cookies, and seasonal pastries — made to order.",
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

  console.log("✅ Seed complete! 8 products, 4 categories, 2 banners.");
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
