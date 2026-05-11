import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useGetProduct, useGetRelatedProducts, getGetProductQueryKey, getGetRelatedProductsQueryKey } from "@workspace/api-client-react";
import { StorefrontLayout } from "@/components/StorefrontLayout";
import { useCartStore } from "@/stores/cart";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag, ArrowLeft, ArrowRight, Minus, Plus, Star } from "lucide-react";
import { Link } from "wouter";
import { formatCurrency } from "@/lib/currency";
import { useLanguage, getLocalizedText } from "@/lib/i18n/LanguageContext";
import { getUrduName, getUrduDesc, getUrduCategoryName } from "@/lib/i18n/productTranslations";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Variant { name: string; type: string; options: Array<{ label: string; priceAdjustment: number }> }
interface Addon { name: string; price: number }

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const id = Number(params.id);
  const { toast } = useToast();
  const addItem = useCartStore((s) => s.addItem);
  const { t, isUrdu } = useLanguage();

  const { data: product, isLoading } = useGetProduct(id, {
    query: { queryKey: getGetProductQueryKey(id), enabled: !!id },
  });
  const { data: related } = useGetRelatedProducts(id, {
    query: { queryKey: getGetRelatedProductsQueryKey(id), enabled: !!id },
  });

  const queryClient = useQueryClient();
  const { data: reviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: async () => {
      const res = await fetch(`/api/products/${id}/reviews`);
      return res.json();
    },
    enabled: !!id
  });

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [customMessage, setCustomMessage] = useState("");
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  const BackArrow = isUrdu ? ArrowRight : ArrowLeft;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  if (isLoading) {
    return (
      <StorefrontLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square neu-pressed rounded-[2.5rem] bg-muted animate-pulse" />
            <div className="space-y-6 pt-4">
              <div className="h-10 w-3/4 neu-pressed rounded-full bg-muted animate-pulse" />
              <div className="h-8 w-1/3 neu-pressed rounded-full bg-muted animate-pulse" />
              <div className="h-32 w-full neu-pressed rounded-2xl bg-muted animate-pulse" />
              <div className="h-16 w-full neu-flat rounded-full bg-muted animate-pulse mt-8" />
            </div>
          </div>
        </div>
      </StorefrontLayout>
    );
  }

  if (!product) {
    return (
      <StorefrontLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center neu-pressed rounded-[3rem] mt-8">
          <ShoppingBag className="w-16 h-16 mx-auto mb-6 opacity-30" />
          <p className="text-xl font-serif font-bold uppercase tracking-wide mb-6">{t.product.notFound}</p>
          <Link href="/shop">
            <button className="neu-flat px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest text-foreground hover:text-primary active:neu-pressed transition-all">
              {t.product.backToShop}
            </button>
          </Link>
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
      toast({ title: t.product.selectOptions, variant: "destructive" });
      return;
    }
    addItem({
      productId: product.id,
      productName: isUrdu ? getUrduName(product.name) : product.name,
      productImageUrl: images[0] ?? null,
      quantity,
      unitPrice: price,
      selectedVariants,
      selectedAddons,
      customMessage: customMessage || null,
      subtotal: price * quantity,
      leadTimeHours: (product as any).leadTimeHours || 0,
    });
    toast({ title: t.product.addedToCart(isUrdu ? getUrduName(product.name) : product.name, quantity) });
    navigate("/cart");
  };

  return (
    <StorefrontLayout>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <button onClick={() => history.back()} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <BackArrow className="h-4 w-4" /> {t.product.back}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Images */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="lg:col-span-6 space-y-4">
            <div 
              className="aspect-square rounded-[2.5rem] neu-pressed p-2 overflow-hidden relative group cursor-zoom-in"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              {images[selectedImage] ? (
                <img 
                  src={images[selectedImage]} 
                  alt={getLocalizedText(product.name, isUrdu)} 
                  className={`w-full h-full object-cover rounded-[2rem] transition-transform duration-200 ${isZoomed ? "scale-[2]" : "scale-100"}`} 
                  style={isZoomed ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : undefined}
                />
              ) : (
                <div className="w-full h-full rounded-[2rem] flex items-center justify-center bg-muted/50">
                  <ShoppingBag className="h-24 w-24 text-muted-foreground/30" />
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 px-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 shrink-0 rounded-2xl overflow-hidden p-1 transition-all ${
                      i === selectedImage ? "neu-pressed" : "neu-flat hover:neu-pressed"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover rounded-xl" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="lg:col-span-6 flex flex-col justify-center py-4">
            
            <div className="neu-flat rounded-[2.5rem] p-8 sm:p-10">
              {product.category && (
                <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-primary mb-4">
                  {isUrdu ? getUrduCategoryName(product.category.name) : product.category.name}
                </span>
              )}
              <h1 className="text-3xl sm:text-4xl font-serif font-bold uppercase tracking-wide leading-tight mb-4">
                {isUrdu ? getUrduName(product.name) : product.name}
              </h1>
              <div className="text-2xl font-bold text-foreground mb-6">
                {formatCurrency(price)}
              </div>
              
              {product.description && (
                <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                  {isUrdu ? getUrduDesc(product.description) : product.description}
                </p>
              )}

              {!product.isAvailable && (
                <div className="bg-destructive/10 text-destructive text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full inline-block mb-6">
                  {t.product.unavailable}
                </div>
              )}

              <div className="space-y-8">
                {/* Variants */}
                {variants.map((variant) => (
                  <div key={variant.type} className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{variant.name || variant.type}</label>
                    <div className="flex flex-wrap gap-3">
                      {variant.options.map((opt) => {
                        const key = variant.type || variant.name;
                        const selected = selectedVariants[key] === opt.label;
                        return (
                          <button
                            key={opt.label}
                            onClick={() => setSelectedVariants((prev) => ({ ...prev, [key]: opt.label }))}
                            className={`px-5 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                              selected
                                ? "neu-pressed text-primary"
                                : "neu-flat text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {opt.label}
                            {opt.priceAdjustment !== 0 && (
                              <span className="ml-2 text-[9px] opacity-75">
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
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t.product.addons}</label>
                    <div className="space-y-3">
                      {addons.map((addon) => (
                        <label key={addon.name} className="flex items-center gap-4 cursor-pointer group">
                          <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                            selectedAddons.includes(addon.name) ? "neu-pressed text-primary" : "neu-flat text-transparent group-hover:text-muted-foreground/30"
                          }`}>
                            <div className="w-3 h-3 rounded-sm bg-current" />
                          </div>
                          <Checkbox
                            id={`addon-${addon.name}`}
                            className="sr-only"
                            checked={selectedAddons.includes(addon.name)}
                            onCheckedChange={(checked) => {
                              setSelectedAddons((prev) =>
                                checked ? [...prev, addon.name] : prev.filter((a) => a !== addon.name)
                              );
                            }}
                          />
                          <span className="text-sm font-semibold group-hover:text-foreground transition-colors text-muted-foreground">
                            {addon.name} <span className="text-xs ml-2 opacity-75">+{formatCurrency(addon.price)}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                {/* Custom message */}
                {product.allowCustomMessage && (
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t.product.customMessage}</label>
                    <textarea
                      placeholder={t.product.customMessagePlaceholder}
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      maxLength={100}
                      className="w-full neu-pressed rounded-2xl bg-transparent border-0 px-4 py-4 text-sm resize-none outline-none focus:ring-0 placeholder:text-muted-foreground/50"
                      rows={2}
                    />
                  </div>
                )}

                {/* Quantity & Add to Cart */}
                <div className="pt-6 border-t border-muted/50">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <button 
                        className="w-12 h-12 neu-flat rounded-full flex items-center justify-center active:neu-pressed text-foreground hover:text-primary transition-all shrink-0" 
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <div className="w-16 h-12 neu-pressed rounded-full flex items-center justify-center text-sm font-bold">
                        {quantity}
                      </div>
                      <button 
                        className="w-12 h-12 neu-flat rounded-full flex items-center justify-center active:neu-pressed text-foreground hover:text-primary transition-all shrink-0" 
                        onClick={() => setQuantity((q) => q + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      className="w-full neu-flat rounded-full py-4 px-8 text-xs font-bold uppercase tracking-widest hover:text-primary active:neu-pressed transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:pointer-events-none"
                      onClick={handleAddToCart}
                      disabled={!product.isAvailable}
                      data-testid="button-add-to-cart"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      {product.isAvailable ? t.product.addToCart : t.product.unavailableBtn}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </div>

        {/* Related products */}
        {related && related.length > 0 && (
          <section className="mt-24">
            <h2 className="text-2xl font-serif font-bold uppercase tracking-wide mb-10 pl-2">{t.product.relatedTitle}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p, idx) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                  <Link href={`/products/${p.id}`} className="block h-full group">
                    <div className="neu-flat rounded-[2rem] p-4 h-full flex flex-col">
                      <div className="aspect-square neu-pressed rounded-[1.5rem] p-2 overflow-hidden mb-4 relative">
                        {((p.imageUrls as string[]) ?? [])[0] ? (
                          <img src={((p.imageUrls as string[]) ?? [])[0]} alt={p.name} className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-110" />
                        ) : (
                          <div className="w-full h-full bg-muted rounded-xl flex items-center justify-center">
                            <ShoppingBag className="h-8 w-8 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>
                      <h3 className="font-serif font-bold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2 uppercase">
                        {isUrdu ? getUrduName(p.name) : p.name}
                      </h3>
                      <p className="font-bold text-primary text-sm mt-auto pt-3">{formatCurrency(Number(p.basePrice))}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}
        {/* Reviews Section */}
        <section className="mt-24 max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-serif font-bold uppercase tracking-wide mb-10 text-center">{isUrdu ? "کسٹمر ریویوز" : "Customer Reviews"}</h2>
          
          {/* Review Form */}
          <div className="neu-flat rounded-[2rem] p-8 mb-12 max-w-2xl mx-auto">
            <h3 className="font-bold mb-4">{isUrdu ? "اپنا ریویو لکھیں" : "Write Your Review"}</h3>
            <div className="grid gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">{isUrdu ? "نام" : "Name"}</label>
                <input type="text" id="reviewer-name" className="w-full h-12 neu-pressed rounded-full px-6 text-sm focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">{isUrdu ? "ریٹنگ" : "Rating"}</label>
                <select id="reviewer-rating" className="w-full h-12 neu-pressed rounded-full px-6 text-sm focus:outline-none">
                  <option value="5">5 ⭐⭐⭐⭐⭐</option>
                  <option value="4">4 ⭐⭐⭐⭐</option>
                  <option value="3">3 ⭐⭐⭐</option>
                  <option value="2">2 ⭐⭐</option>
                  <option value="1">1 ⭐</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">{isUrdu ? "آپ کی رائے" : "Your Comment"}</label>
                <textarea id="reviewer-comment" className="w-full h-24 neu-pressed rounded-[1.5rem] p-6 text-sm focus:outline-none" />
              </div>
              <button 
                className="neu-flat px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:text-primary active:neu-pressed transition-all"
                onClick={async () => {
                  const name = (document.getElementById('reviewer-name') as HTMLInputElement).value;
                  const rating = Number((document.getElementById('reviewer-rating') as HTMLSelectElement).value);
                  const comment = (document.getElementById('reviewer-comment') as HTMLTextAreaElement).value;
                  
                  if (!name || !comment) {
                    toast({ title: isUrdu ? "نام اور تبصرہ لازمی ہے" : "Name and comment are required", variant: "destructive" });
                    return;
                  }
                  
                  try {
                    const res = await fetch(`/api/products/${id}/reviews`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ customerName: name, rating, comment })
                    });
                    if (res.ok) {
                      toast({ title: isUrdu ? "ریویو جمع ہو گیا!" : "Review submitted successfully!" });
                      // Reset form
                      (document.getElementById('reviewer-name') as HTMLInputElement).value = '';
                      (document.getElementById('reviewer-comment') as HTMLTextAreaElement).value = '';
                      // Refetch reviews
                      queryClient.invalidateQueries({ queryKey: ['reviews', id] });
                    }
                  } catch (e) {
                    console.error("Failed to submit review:", e);
                  }
                }}
              >
                {isUrdu ? "ریویو جمع کریں" : "Submit Review"}
              </button>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6 max-w-2xl mx-auto">
            {reviews?.map((r: any) => (
              <div key={r.id} className="neu-flat rounded-[1.5rem] p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-sm">{r.customerName}</span>
                  <span className="text-primary text-sm">{"⭐".repeat(r.rating)}</span>
                </div>
                <p className="text-sm text-muted-foreground">{r.comment}</p>
                <span className="text-[10px] text-muted-foreground block mt-2">{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
            {reviews?.length === 0 && (
              <p className="text-sm text-muted-foreground text-center">{isUrdu ? "ابھی تک کوئی ریویو نہیں ہے" : "No reviews yet"}</p>
            )}
          </div>
        </section>
      </div>
    </StorefrontLayout>
  );
}
