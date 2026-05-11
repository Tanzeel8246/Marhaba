import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useListProducts, useListCategories, getListProductsQueryKey } from "@workspace/api-client-react";
import { StorefrontLayout } from "@/components/StorefrontLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, X, ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getUrduName, getUrduDesc, getUrduCategoryName } from "@/lib/i18n/productTranslations";
import { motion } from "framer-motion";

function ProductCard({ product }: { product: { id: number; name: string; basePrice: string | number; imageUrls: unknown; description?: string | null; isAvailable: boolean; category?: { name: string } | null } }) {
  const images = (product.imageUrls as string[]) ?? [];
  const { t, isUrdu } = useLanguage();

  const displayName = isUrdu ? getUrduName(product.name) : product.name;
  const displayDesc = product.description
    ? (isUrdu ? getUrduDesc(product.description) : product.description)
    : null;
  const displayCat = product.category
    ? (isUrdu ? getUrduCategoryName(product.category.name) : product.category.name)
    : null;

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
      <Link href={`/products/${product.id}`} className="block h-full">
        <div className="neu-flat rounded-[2rem] p-4 h-full flex flex-col group">
          <div className="aspect-square neu-pressed rounded-[1.5rem] p-2 overflow-hidden mb-4 relative">
            {images[0] ? (
              <img src={images[0]} alt={displayName} className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-110" />
            ) : (
              <div className="w-full h-full bg-muted rounded-xl flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-muted-foreground/30" />
              </div>
            )}
            {!product.isAvailable && (
              <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center backdrop-blur-[1px]">
                <Badge variant="secondary" className="uppercase tracking-widest text-[10px] font-bold border-0 bg-white/90 text-black">{t.shop.soldOut}</Badge>
              </div>
            )}
            {displayCat && (
              <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-bold text-foreground">
                {displayCat}
              </div>
            )}
          </div>

          <h3 className="font-serif font-bold text-sm sm:text-base leading-tight mb-1 group-hover:text-primary transition-colors uppercase">{displayName}</h3>
          {displayDesc && <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">{displayDesc}</p>}

          <div className="mt-auto pt-2 flex flex-col gap-3">
            <p className="font-bold text-primary text-sm">{formatCurrency(Number(product.basePrice))} <span className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">{t.shop.from}</span></p>
            <button className="w-full neu-flat rounded-full py-2.5 text-[10px] font-bold uppercase tracking-widest hover:text-primary active:neu-pressed transition-all">
              {t.home.addToBag}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ShopPage() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split("?")[1] ?? "");
  const [search, setSearch] = useState(params.get("search") ?? "");
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    params.get("categoryId") ? Number(params.get("categoryId")) : undefined
  );
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const { t, isUrdu } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  const queryParams = {
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(selectedCategory ? { categoryId: selectedCategory } : {}),
    visible: true,
  };

  const { data: products, isLoading } = useListProducts(queryParams, {
    query: { queryKey: getListProductsQueryKey(queryParams) },
  });
  const { data: categories } = useListCategories();

  return (
    <StorefrontLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-10 text-center sm:text-start pl-2">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3 uppercase tracking-wide">{t.shop.title}</h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">{t.shop.subtitle}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar filters */}
          <aside className="lg:w-64 shrink-0 space-y-8">
            <div className="neu-pressed rounded-full p-1.5 relative flex items-center">
              <Search className="absolute left-4 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t.shop.search}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent border-0 focus:ring-0 pl-11 pr-10 py-2.5 text-sm outline-none placeholder:text-muted-foreground/60"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-4 p-1 hover:text-foreground text-muted-foreground transition-colors">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="neu-flat rounded-[2rem] p-6">
              <h3 className="text-[10px] font-bold mb-4 uppercase tracking-widest text-muted-foreground">{t.shop.categories}</h3>
              <div className="flex flex-row flex-wrap lg:flex-col gap-3">
                <button
                  className={`text-xs font-bold uppercase tracking-widest px-5 py-3 rounded-full transition-all text-start ${
                    !selectedCategory ? "neu-pressed text-primary" : "neu-flat text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setSelectedCategory(undefined)}
                >
                  {t.shop.allItems}
                </button>
                {categories?.map((cat) => (
                  <button
                    key={cat.id}
                    className={`text-xs font-bold uppercase tracking-widest px-5 py-3 rounded-full transition-all text-start ${
                      selectedCategory === cat.id ? "neu-pressed text-primary" : "neu-flat text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {isUrdu ? getUrduCategoryName(cat.name) : cat.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="neu-flat rounded-[2rem] p-4 space-y-4">
                    <Skeleton className="aspect-square rounded-[1.5rem]" />
                    <Skeleton className="h-4 w-3/4 mx-auto" />
                    <Skeleton className="h-10 w-full rounded-full mt-4" />
                  </div>
                ))}
              </div>
            ) : !products?.length ? (
              <div className="text-center py-24 neu-pressed rounded-[2.5rem] px-6">
                <div className="w-20 h-20 mx-auto neu-flat rounded-full flex items-center justify-center mb-6">
                  <ShoppingBag className="h-8 w-8 text-muted-foreground/30" />
                </div>
                <p className="text-xl font-serif font-bold uppercase tracking-wide mb-2">{t.shop.noItems}</p>
                <p className="text-sm text-muted-foreground">{t.shop.noItemsHint}</p>
              </div>
            ) : (
              <>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-6 pl-2">{t.shop.itemCount(products.length)}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
