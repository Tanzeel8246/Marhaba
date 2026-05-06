import { Link } from "wouter";
import { useListBanners, useListPopularProducts, useListCategories } from "@workspace/api-client-react";
import { StorefrontLayout } from "@/components/StorefrontLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, ShoppingBag, MapPin, Phone, Clock, Award, Heart, Truck, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/currency";
import { useLanguage } from "@/lib/i18n/LanguageContext";

function BannerCarousel() {
  const { data: banners, isLoading } = useListBanners();
  const [current, setCurrent] = useState(0);
  const { t, isUrdu } = useLanguage();
  const activeBanners = banners?.filter((b) => b.isActive) ?? [];

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % activeBanners.length), 5000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  if (isLoading) return <Skeleton className="w-full h-[480px] rounded-3xl" />;

  if (!activeBanners.length) {
    return (
      <div className="relative w-full h-[480px] rounded-3xl overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-rose-950/30 flex items-center justify-center">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 25% 25%, #f59e0b 0%, transparent 50%), radial-gradient(circle at 75% 75%, #ec4899 0%, transparent 50%)" }} />
        <div className="text-center px-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Heart className="h-4 w-4 fill-primary" /> {t.home.heroBadge}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight mb-4">
            {t.home.heroTitle}
          </h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
            {t.home.heroSubtitle}
          </p>
          <Link href="/shop">
            <Button size="lg" className="gap-2 text-base px-8 rounded-full shadow-lg">
              {t.home.heroBtn}
              {isUrdu ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const banner = activeBanners[current];
  return (
    <div className="relative w-full h-[480px] rounded-3xl overflow-hidden group shadow-2xl">
      <img
        src={banner.imageUrl}
        alt={banner.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
      <div className={`absolute inset-0 flex items-center p-10 sm:p-16 ${isUrdu ? "justify-end" : "justify-start"}`}>
        <div className="text-white max-w-lg">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-5">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" /> {t.home.heroBadge}
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold mb-3 leading-tight">{banner.title}</h2>
          {banner.subtitle && <p className="text-white/85 text-base sm:text-lg mb-7 leading-relaxed">{banner.subtitle}</p>}
          <Link href={banner.linkUrl ?? "/shop"}>
            <Button size="lg" className="gap-2 rounded-full bg-white text-foreground hover:bg-white/90 shadow-lg font-semibold">
              {t.home.viewBtn}
              {isUrdu ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            </Button>
          </Link>
        </div>
      </div>
      {activeBanners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {activeBanners.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === current ? "bg-white w-8" : "bg-white/50 w-2"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const FEATURE_ICONS = [Award, Heart, Truck, Clock];

function ProductCard({ product }: { product: { id: number; name: string; basePrice: string | number; imageUrls: unknown; description?: string | null; isAvailable: boolean } }) {
  const images = (product.imageUrls as string[]) ?? [];
  const { t } = useLanguage();
  return (
    <Link href={`/products/${product.id}`}>
      <Card className="overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 border-0 shadow-md">
        <div className="aspect-square overflow-hidden bg-muted relative">
          {images[0] ? (
            <img src={images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950/30 dark:to-orange-950/20">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
            </div>
          )}
          {!product.isAvailable && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="secondary" className="text-sm">{t.shop.soldOut}</Badge>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <CardContent className="p-4">
          <h3 className="font-bold text-sm sm:text-base leading-tight mb-1.5 group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
          {product.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2.5 leading-relaxed">{product.description}</p>
          )}
          <div className="flex items-center justify-between">
            <p className="font-bold text-primary text-sm">{formatCurrency(Number(product.basePrice))} {t.home.from}</p>
            <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">{t.home.orderNow}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function HomePage() {
  const { data: popular, isLoading: loadingPopular } = useListPopularProducts();
  const { data: categories, isLoading: loadingCats } = useListCategories();
  const { t, isUrdu } = useLanguage();

  return (
    <StorefrontLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-20">

        {/* Hero Banner */}
        <BannerCarousel />

        {/* Features / Why Us */}
        <section>
          <div className="text-center mb-10">
            <p className="text-primary font-medium text-sm uppercase tracking-widest mb-2">{t.home.whySubtitle}</p>
            <h2 className="text-3xl font-serif font-bold">{t.home.whyTitle}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.home.features.map(({ title, desc }, idx) => {
              const Icon = FEATURE_ICONS[idx];
              return (
                <div key={title} className="text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-base mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Categories */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-primary font-medium text-sm uppercase tracking-widest mb-1">{t.home.categoriesSubtitle}</p>
              <h2 className="text-3xl font-serif font-bold">{t.home.categoriesTitle}</h2>
            </div>
          </div>
          {loadingCats ? (
            <div className="flex gap-3 flex-wrap">
              {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-11 w-36 rounded-full" />)}
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              <Link href="/shop">
                <Button variant="default" className="rounded-full px-6 shadow-sm">🛍️ {t.home.allItems}</Button>
              </Link>
              {categories?.map((cat) => (
                <Link key={cat.id} href={`/shop?categoryId=${cat.id}`}>
                  <Button variant="outline" className="rounded-full px-6 hover:border-primary hover:text-primary transition-colors">
                    {cat.name}
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Popular Products */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-primary font-medium text-sm uppercase tracking-widest mb-1">{t.home.popularSubtitle}</p>
              <h2 className="text-3xl font-serif font-bold">{t.home.popularTitle}</h2>
            </div>
            <Link href="/shop">
              <Button variant="ghost" className="gap-2 text-primary font-semibold hidden sm:flex">
                {t.home.viewAll}
                {isUrdu ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              </Button>
            </Link>
          </div>
          {loadingPopular ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square rounded-2xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : !popular?.length ? (
            <div className="text-center py-20 text-muted-foreground">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg">{t.home.noProducts}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {popular.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
          <div className="text-center mt-8 sm:hidden">
            <Link href="/shop">
              <Button variant="outline" className="gap-2 rounded-full px-8">
                {t.home.viewAll}
                {isUrdu ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              </Button>
            </Link>
          </div>
        </section>

        {/* Location + Contact */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-8 border border-primary/10">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1.5">{t.home.locationTitle}</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{t.footer.address}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-3xl p-8 border border-green-200 dark:border-green-900">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 rounded-2xl bg-green-500/15 flex items-center justify-center">
                <Phone className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1.5">{t.home.orderTitle}</h3>
                <p className="text-muted-foreground leading-relaxed mb-4 whitespace-pre-line">{t.home.orderDesc}</p>
                <Link href="/shop">
                  <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700 text-white rounded-full px-5">
                    {t.home.orderBtn}
                    {isUrdu ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-10 sm:p-16 text-center text-white shadow-2xl">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 20%, white 0%, transparent 40%)" }} />
          <div className="relative z-10">
            <p className="text-white/70 text-sm uppercase tracking-widest mb-3 font-medium">{t.home.ctaBadge}</p>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold mb-4 leading-tight">{t.home.ctaTitle}</h2>
            <p className="text-white/80 mb-8 max-w-lg mx-auto text-base leading-relaxed">{t.home.ctaDesc}</p>
            <Link href="/shop">
              <Button size="lg" variant="secondary" className="gap-2 rounded-full px-10 font-bold text-base shadow-lg hover:shadow-xl transition-all">
                {t.home.ctaBtn}
                {isUrdu ? <ArrowLeft className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
              </Button>
            </Link>
          </div>
        </section>

      </div>
    </StorefrontLayout>
  );
}
