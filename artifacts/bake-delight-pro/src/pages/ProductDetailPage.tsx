import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useGetProduct, useGetRelatedProducts, getGetProductQueryKey, getGetRelatedProductsQueryKey } from "@workspace/api-client-react";
import { StorefrontLayout } from "@/components/StorefrontLayout";
import { useCartStore } from "@/stores/cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Minus, Plus, ShoppingCart, ArrowLeft, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import { formatCurrency } from "@/lib/currency";

interface Variant { name: string; type: string; options: Array<{ label: string; priceAdjustment: number }> }
interface Addon { name: string; price: number }

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const id = Number(params.id);
  const { toast } = useToast();
  const addItem = useCartStore((s) => s.addItem);

  const { data: product, isLoading } = useGetProduct(id, {
    query: { queryKey: getGetProductQueryKey(id), enabled: !!id },
  });
  const { data: related } = useGetRelatedProducts(id, {
    query: { queryKey: getGetRelatedProductsQueryKey(id), enabled: !!id },
  });

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [customMessage, setCustomMessage] = useState("");

  if (isLoading) {
    return (
      <StorefrontLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </StorefrontLayout>
    );
  }

  if (!product) {
    return (
      <StorefrontLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-muted-foreground">Product not found.</p>
          <Link href="/shop"><Button className="mt-4">Back to Shop</Button></Link>
        </div>
      </StorefrontLayout>
    );
  }

  const images = (product.imageUrls as string[]) ?? [];
  const variants = (product.variants as Variant[]) ?? [];
  const addons = (product.addons as Addon[]) ?? [];

  let price = Number(product.basePrice);
  for (const [type, label] of Object.entries(selectedVariants)) {
    const variant = variants.find((v) => v.type === type || v.name === type);
    const opt = variant?.options.find((o) => o.label === label);
    if (opt) price += opt.priceAdjustment;
  }
  for (const addonName of selectedAddons) {
    const addon = addons.find((a) => a.name === addonName);
    if (addon) price += addon.price;
  }

  const handleAddToCart = () => {
    const allVariantsSelected = variants.every((v) => selectedVariants[v.type] || selectedVariants[v.name]);
    if (!allVariantsSelected && variants.length > 0) {
      toast({ title: "Please select all options", variant: "destructive" });
      return;
    }
    addItem({
      productId: product.id,
      productName: product.name,
      productImageUrl: images[0] ?? null,
      quantity,
      unitPrice: price,
      selectedVariants,
      selectedAddons,
      customMessage: customMessage || null,
      subtotal: price * quantity,
    });
    toast({ title: "Added to cart!", description: `${product.name} × ${quantity}` });
    navigate("/cart");
  };

  return (
    <StorefrontLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => history.back()} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-3">
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
              {images[selectedImage] ? (
                <img src={images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary/30 to-accent/30">
                  <ShoppingBag className="h-24 w-24 text-muted-foreground/30" />
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === selectedImage ? "border-primary" : "border-transparent"}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            {product.category && <Badge variant="secondary">{product.category.name}</Badge>}
            <h1 className="text-3xl font-serif font-bold">{product.name}</h1>
            <div className="text-3xl font-bold text-primary">{formatCurrency(price)}</div>
            {product.description && <p className="text-muted-foreground leading-relaxed">{product.description}</p>}

            {!product.isAvailable && (
              <Badge variant="destructive" className="text-sm">Currently Unavailable</Badge>
            )}

            {/* Variants */}
            {variants.map((variant) => (
              <div key={variant.type} className="space-y-2">
                <Label className="font-semibold capitalize">{variant.name || variant.type}</Label>
                <div className="flex flex-wrap gap-2">
                  {variant.options.map((opt) => {
                    const key = variant.type || variant.name;
                    const selected = selectedVariants[key] === opt.label;
                    return (
                      <button
                        key={opt.label}
                        onClick={() => setSelectedVariants((prev) => ({ ...prev, [key]: opt.label }))}
                        className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                          selected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {opt.label}
                        {opt.priceAdjustment !== 0 && (
                          <span className="ml-1 text-xs opacity-75">
                            {opt.priceAdjustment > 0 ? "+" : ""}{formatCurrency(opt.priceAdjustment)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Add-ons */}
            {addons.length > 0 && (
              <div className="space-y-2">
                <Label className="font-semibold">Add-ons</Label>
                <div className="space-y-2">
                  {addons.map((addon) => (
                    <div key={addon.name} className="flex items-center gap-3">
                      <Checkbox
                        id={`addon-${addon.name}`}
                        checked={selectedAddons.includes(addon.name)}
                        onCheckedChange={(checked) => {
                          setSelectedAddons((prev) =>
                            checked ? [...prev, addon.name] : prev.filter((a) => a !== addon.name)
                          );
                        }}
                      />
                      <label htmlFor={`addon-${addon.name}`} className="text-sm cursor-pointer">
                        {addon.name} <span className="text-muted-foreground">+{formatCurrency(addon.price)}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Custom message */}
            {product.allowCustomMessage && (
              <div className="space-y-2">
                <Label className="font-semibold">Cake Message (optional)</Label>
                <Textarea
                  placeholder="e.g. Happy Birthday Sarah!"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  maxLength={100}
                  className="resize-none"
                  rows={2}
                />
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <Label className="font-semibold">Quantity</Label>
              <div className="flex items-center gap-2 border border-border rounded-lg p-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQuantity((q) => q + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="pt-2">
              <div className="text-lg font-semibold mb-3">
                Total: <span className="text-primary">{formatCurrency(price * quantity)}</span>
              </div>
              <Button
                size="lg"
                className="w-full gap-2 text-base"
                onClick={handleAddToCart}
                disabled={!product.isAvailable}
                data-testid="button-add-to-cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {product.isAvailable ? "Add to Cart" : "Unavailable"}
              </Button>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related && related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-serif font-bold mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map((p) => (
                <Link key={p.id} href={`/products/${p.id}`}>
                  <Card className="overflow-hidden group cursor-pointer hover:shadow-md transition-all hover:-translate-y-1">
                    <div className="aspect-square overflow-hidden bg-muted">
                      {((p.imageUrls as string[]) ?? [])[0] ? (
                        <img src={((p.imageUrls as string[]) ?? [])[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-secondary/30 to-accent/30 flex items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <p className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">{p.name}</p>
                      <p className="text-sm font-bold text-primary mt-1">{formatCurrency(Number(p.basePrice))}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </StorefrontLayout>
  );
}
