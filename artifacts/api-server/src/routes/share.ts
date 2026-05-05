import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/share/product/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(404).send("Not found");
    return;
  }

  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, id));

  if (!product) {
    res.status(404).send("Product not found");
    return;
  }

  const imageUrls = (product.imageUrls as string[]) ?? [];
  const imageUrl = imageUrls[0] ?? "";

  const domains = process.env.REPLIT_DOMAINS ?? "";
  const primaryDomain = domains.split(",")[0]?.trim() ?? "";
  const baseUrl = primaryDomain ? `https://${primaryDomain}` : "";

  const productPageUrl = `${baseUrl}/products/${product.id}`;
  const shareImageUrl = imageUrl;

  const title = `${product.name} — مرحبا سویٹس اینڈ بیکرز`;
  const description = typeof product.description === "string"
    ? product.description.slice(0, 200)
    : "تازہ بیکری پروڈکٹ";

  const html = `<!DOCTYPE html>
<html lang="ur" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(title)}</title>

  <!-- Open Graph (WhatsApp, Facebook, etc.) -->
  <meta property="og:type" content="product" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${escapeHtml(productPageUrl)}" />
  ${shareImageUrl ? `<meta property="og:image" content="${escapeHtml(shareImageUrl)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />` : ""}

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  ${shareImageUrl ? `<meta name="twitter:image" content="${escapeHtml(shareImageUrl)}" />` : ""}

  <!-- Redirect to product page after crawlers have read OG tags -->
  <meta http-equiv="refresh" content="0;url=${escapeHtml(productPageUrl)}" />
  <script>window.location.replace(${JSON.stringify(productPageUrl)});</script>
</head>
<body style="font-family:sans-serif;text-align:center;padding:2rem;">
  <p>منتقل ہو رہا ہے…</p>
  <a href="${escapeHtml(productPageUrl)}">یہاں کلک کریں</a>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=300");
  res.send(html);
});

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default router;
