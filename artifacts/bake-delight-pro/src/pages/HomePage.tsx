import { Link } from "wouter";
import { useListBanners, useListPopularProducts, useListCategories } from "@workspace/api-client-react";
import { StorefrontLayout } from "@/components/StorefrontLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";

function BannerCarousel() {
  const { data: banners, isLoading } = useListBanners();
  const [current, setCurrent] = useState(0);
  const activeBanners = banners?.filter((b) => b.isActive) ?? [];

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % activeBanners.length), 4000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  if (isLoading) {
    return <Skeleton className="w-full h-[420px] rounded-2xl" />;
  }

  if (!activeBanners.length) {
    return (
      <div className="relative w-full h-[420px] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/30 to-accent/40 flex items-center justify-center">
        <div className="text-center px-8">
          <p className="text-xs uppercase tracking-widest text-primary/70 font-medium mb-3">Handcrafted with love</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight mb-4">
            Fresh from the Oven
          </h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
            Custom cakes, artisan cookies, and seasonal pastries — made to order, delivered to your door.
          </p>
          <Link href="/shop">
            <Button size="lg" className="gap-2 text-base px-8">
              Shop Now <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const banner = activeBanners[current];
  return (
    <div className="relative w-full h-[420px] rounded-2xl overflow-hidden group">
      <img
        src={banner.imageUrl}
        alt={banner.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center p-10">
        <div className="text-white max-w-md">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-2">{banner.title}</h2>
          {banner.subtitle && <p className="text-white/80 text-lg mb-6">{banner.subtitle}</p>}
          <Link href={banner.linkUrl ?? "/shop"}>
            <Button size="lg" variant="secondary" className="gap-2">Shop Now <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </div>
      </div>
      {activeBanners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {activeBanners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-white w-6" : "bg-white/50"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: { id: number; name: string; basePrice: string | number; imageUrls: unknown; description?: string | null; isAvailable: boolean } }) {
  const images = (product.imageUrls as string[]) ?? [];
  return (
    <Link href={`/products/${product.id}`}>
      <Card className="overflow-hidden group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
        <div className="aspect-square overflow-hidden bg-muted relative">
          {images[0] ? (
            <img
              src={images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-secondary/30 to-accent/30">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/40" />
            </div>
          )}
          {!product.isAvailable && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Badge variant="secondary">Sold Out</Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm sm:text-base leading-tight mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
          {product.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{product.description}</p>
          )}
          <p className="font-bold text-primary">from ${Number(product.basePrice).toFixed(2)}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function HomePage() {
  const { data: popular, isLoading: loadingPopular } = useListPopularProducts();
  const { data: categories, isLoading: loadingCats } = useListCategories();

  return (
    <StorefrontLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
        <BannerCarousel />

        {/* Categories */}
        <section>
          <h2 className="text-2xl font-serif font-bold mb-6">Shop by Category</h2>
          {loadingCats ? (
            <div className="flex gap-4 flex-wrap">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-12 w-32 rounded-full" />)}
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              <Link href="/shop">
                <Button variant="outline" className="rounded-full">All Items</Button>
              </Link>
              {categories?.map((cat) => (
                <Link key={cat.id} href={`/shop?categoryId=${cat.id}`}>
                  <Button variant="outline" className="rounded-full">{cat.name}</Button>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Popular products */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-bold">Most Loved Treats</h2>
            <Link href="/shop">
              <Button variant="ghost" className="gap-1 text-primary">View All <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
          {loadingPopular ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-square rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : !popular?.length ? (
            <div className="text-center py-16 text-muted-foreground">
              <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No products yet — check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {popular.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-primary/10 to-secondary/20 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-3">Custom Orders Welcome</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Birthdays, weddings, or just because — we craft personalized cakes and sweets for every occasion.
          </p>
          <Link href="/shop">
            <Button size="lg" className="gap-2">Start Your Order <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </section>
      </div>
    </StorefrontLayout>
  );
}
