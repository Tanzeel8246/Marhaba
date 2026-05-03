import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useListProducts, useListCategories, getListProductsQueryKey } from "@workspace/api-client-react";
import { StorefrontLayout } from "@/components/StorefrontLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingBag, X } from "lucide-react";

function ProductCard({ product }: { product: { id: number; name: string; basePrice: string | number; imageUrls: unknown; description?: string | null; isAvailable: boolean; category?: { name: string } | null } }) {
  const images = (product.imageUrls as string[]) ?? [];
  return (
    <Link href={`/products/${product.id}`}>
      <Card className="overflow-hidden group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 h-full">
        <div className="aspect-square overflow-hidden bg-muted relative">
          {images[0] ? (
            <img src={images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary/30 to-accent/30">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
            </div>
          )}
          {!product.isAvailable && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Badge variant="secondary">Sold Out</Badge>
            </div>
          )}
          {product.category && (
            <Badge className="absolute top-2 left-2 text-xs">{product.category.name}</Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold leading-tight mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
          {product.description && <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{product.description}</p>}
          <p className="font-bold text-primary">from ${Number(product.basePrice).toFixed(2)}</p>
        </CardContent>
      </Card>
    </Link>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold mb-2">Our Bakery</h1>
          <p className="text-muted-foreground">Handcrafted treats made fresh to order.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters */}
          <aside className="lg:w-52 shrink-0 space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-3 uppercase tracking-widest text-muted-foreground">Categories</h3>
              <div className="flex flex-row flex-wrap lg:flex-col gap-2">
                <Button
                  variant={!selectedCategory ? "default" : "ghost"}
                  size="sm"
                  className="justify-start"
                  onClick={() => setSelectedCategory(undefined)}
                >
                  All Items
                </Button>
                {categories?.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.id ? "default" : "ghost"}
                    size="sm"
                    className="justify-start"
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="aspect-square rounded-xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : !products?.length ? (
              <div className="text-center py-20 text-muted-foreground">
                <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium mb-1">No treats found</p>
                <p className="text-sm">Try a different search or category.</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">{products.length} item{products.length !== 1 ? "s" : ""}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
