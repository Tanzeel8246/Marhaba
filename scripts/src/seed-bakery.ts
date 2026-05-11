import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { categoriesTable as categories, productsTable as products, bannersTable as banners } from "../../lib/db/src/schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

async function seed() {
  console.log("Seeding bakery data...");

  // Categories
  const [cakes, cookies, pastries, breads, sweets] = await db
    .insert(categories)
    .values([
      { name: "Celebration Cakes | کیک", slug: "cakes", description: "Custom cakes for every occasion", sortOrder: 1 },
      { name: "Cookies & Biscuits | بسکٹ", slug: "cookies", description: "Hand-decorated artisan cookies", sortOrder: 2 },
      { name: "Pastries & Croissants | پیسٹری", slug: "pastries", description: "Freshly baked pastries", sortOrder: 3 },
      { name: "Artisan Breads | روٹی", slug: "breads", description: "Sourdough and specialty breads", sortOrder: 4 },
      { name: "Traditional Sweets | مٹھائیاں", slug: "sweets", description: "Premium traditional mithai", sortOrder: 5 },
    ])
    .returning();

  console.log("Created categories:", [cakes, cookies, pastries, breads, sweets].map(c => c.name));

  // Products (24 Total)
  await db.insert(products).values([
    // Existing 8
    { name: "Classic Vanilla Birthday Cake | ونیلا کیک", slug: "classic-vanilla-birthday-cake", description: "A timeless vanilla sponge layered with silky buttercream frosting.", basePrice: "1500.00", categoryId: cakes.id, imageUrls: ["https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=600&q=80"], variants: [], addons: [], isVisible: true, isAvailable: true },
    { name: "Chocolate Fudge Indulgence Cake | چاکلیٹ فج کیک", slug: "chocolate-fudge-cake", description: "Rich dark chocolate sponge with velvety ganache.", basePrice: "1800.00", categoryId: cakes.id, imageUrls: ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80"], variants: [], addons: [], isVisible: true, isAvailable: true },
    { name: "Strawberry Shortcake | اسٹرابیری کیک", slug: "strawberry-shortcake", description: "Light chiffon sponge with fresh strawberries.", basePrice: "1400.00", categoryId: cakes.id, imageUrls: ["https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80"], variants: [], addons: [], isVisible: true, isAvailable: true },
    { name: "Classic Butter Cookies (12 pack) | بٹر بسکٹ", slug: "butter-cookies-12", description: "Buttery melt-in-your-mouth cookies.", basePrice: "450.00", categoryId: cookies.id, imageUrls: ["https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&q=80"], variants: [], addons: [], isVisible: true, isAvailable: true },
    { name: "Macaron Tower (24 pieces) | میکرون ٹاور", slug: "macaron-tower-24", description: "Delicate French macarons in seasonal flavors.", basePrice: "2200.00", categoryId: cookies.id, imageUrls: ["https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=600&q=80"], variants: [], addons: [], isVisible: true, isAvailable: true },
    { name: "Butter Croissant | مکھن پیسٹری", slug: "butter-croissant", description: "Flaky, golden, made with pure European butter.", basePrice: "150.00", categoryId: pastries.id, imageUrls: ["https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80"], variants: [], addons: [], isVisible: true, isAvailable: true },
    { name: "Sourdough Boule | سورڈو روٹی", slug: "sourdough-boule", description: "Long-fermented sourdough with a crisp crust.", basePrice: "400.00", categoryId: breads.id, imageUrls: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80"], variants: [], addons: [], isVisible: true, isAvailable: true },
    { name: "Red Velvet Dream Cake | ریڈ ویلویٹ کیک", slug: "red-velvet-dream-cake", description: "Velvety red sponge with luscious cream cheese frosting.", basePrice: "1600.00", categoryId: cakes.id, imageUrls: ["https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=600&q=80"], variants: [], addons: [], isVisible: true, isAvailable: true },

    // User Requested (8)
    { name: "Coconut Halwa | کوکو نٹ حلوا", slug: "coconut-halwa", description: "Freshly made coconut halwa with premium nuts.", basePrice: "800.00", categoryId: sweets.id, imageUrls: ["https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=600&q=80"], variants: [], addons: [], isVisible: true, isAvailable: true },
    { name: "Badam Barfi | بادام برفی", slug: "badam-barfi", description: "Pure milk and almond barfi.", basePrice: "1200.00", categoryId: sweets.id, imageUrls: ["https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=600&q=80"], variants: [], addons: [], isVisible: true, isAvailable: true },
    { name: "Khajoor Halwa | کھجور حلوہ", slug: "khajoor-halwa", description: "Nutritious date halwa made with desi ghee.", basePrice: "900.00", categoryId: sweets.id, imageUrls: ["https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=600&q=80"], variants: [], addons: [], isVisible: true, isAvailable: true },
    { name: "Khoya Barfi | کھویا برفی", slug: "khoya-barfi", description: "Traditional khoya barfi, rich and creamy.", basePrice: "1000.00", categoryId: sweets.id, imageUrls: ["https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=600&q=80"], variants: [], addons: [], isVisible: true, isAvailable: true },
    { name: "Cake Rusk | کیک رسک", slug: "cake-rusk", description: "Crispy and sweet cake rusks for tea time.", basePrice: "400.00", categoryId: cookies.id, imageUrls: ["https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80"], variants: [], addons: [], isVisible: true, isAvailable: true },
    { name: "Special Khatai Biscuit | اسپیشل خطائی بسکٹ", slug: "special-khatai", description: "Traditional Nan Khatai with pistachios.", basePrice: "350.00", categoryId: cookies.id, imageUrls: ["https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&q=80"], variants: [], addons: [], isVisible: true, isAvailable: true },
    { name: "Baqar Khani | باقر خانی", slug: "baqar-khani", description: "Flaky and crispy traditional puff pastry.", basePrice: "100.00", categoryId: pastries.id, imageUrls: ["https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80"], variants: [], addons: [], isVisible: true, isAvailable: true },
    { name: "Coconut Biscuit | کوکو نٹ بسکٹ", slug: "coconut-biscuit", description: "Sweet biscuits with real coconut flakes.", basePrice: "300.00", categoryId: cookies.id, imageUrls: ["https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&q=80"], variants: [], addons: [], isVisible: true, isAvailable: true },

    // More (8) to reach 24
    { name: "Gulab Jamun | گلاب جامن", slug: "gulab-jamun", description: "Soft, syrup-soaked traditional sweets.", basePrice: "1000.00", categoryId: sweets.id, imageUrls: ["https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=600&q=80"], variants: [], addons: [], isVisible: true, isAvailable: true },
    { name: "Cham Cham | چم چم", slug: "cham-cham", description: "Colorful and sweet traditional cham cham.", basePrice: "1100.00", categoryId: sweets.id, imageUrls: ["https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=600&q=80"], variants: [], addons: [], isVisible: true, isAvailable: true },
    { name: "Milk Cake | ملک کیک", slug: "milk-cake", description: "Rich and grainy milk-based sweet.", basePrice: "1300.00", categoryId: sweets.id, imageUrls: ["https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=600&q=80"], variants: [], addons: [], isVisible: true, isAvailable: true },
    { name: "Pistachio Barfi | پستہ برفی", slug: "pistachio-barfi", description: "Premium barfi with real pistachio flavor.", basePrice: "1400.00", categoryId: sweets.id, imageUrls: ["https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=600&q=80"], variants: [], addons: [], isVisible: true, isAvailable: true },
    { name: "Habshi Halwa | حبشی حلوہ", slug: "habshi-halwa", description: "Dark, rich and nutty traditional halwa.", basePrice: "1500.00", categoryId: sweets.id, imageUrls: ["https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=600&q=80"], variants: [], addons: [], isVisible: true, isAvailable: true },
    { name: "Mix Mithai | مکس مٹھائی", slug: "mix-mithai", description: "A box of all our premium traditional sweets.", basePrice: "1200.00", categoryId: sweets.id, imageUrls: ["https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=600&q=80"], variants: [], addons: [], isVisible: true, isAvailable: true },
    { name: "Fruit Cake | فروٹ کیک", slug: "fruit-cake", description: "Moist cake with candied fruits and nuts.", basePrice: "600.00", categoryId: cakes.id, imageUrls: ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80"], variants: [], addons: [], isVisible: true, isAvailable: true },
    { name: "Garlic Bread | لہسن روٹی", slug: "garlic-bread", description: "Savory bread with garlic butter and herbs.", basePrice: "250.00", categoryId: breads.id, imageUrls: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80"], variants: [], addons: [], isVisible: true, isAvailable: true },
  ]);

  // Banners
  await db.insert(banners).values([
    {
      title: "Fresh from the Oven | تازی روٹیاں",
      subtitle: "Custom cakes, artisan cookies, and seasonal pastries — made to order.",
      imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1200&q=80",
      linkUrl: "/shop",
      isActive: true,
      sortOrder: 1,
    },
    {
      title: "Order Your Dream Cake | ڈریم کیک",
      subtitle: "Birthdays, weddings, or just because — we craft personalized cakes.",
      imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&q=80",
      linkUrl: "/shop?categoryId=cakes",
      isActive: true,
      sortOrder: 2,
    },
  ]);

  console.log("✅ Seed complete! Created 24 products and banners.");
  await pool.end();
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
