import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useListBanners, useListPopularProducts, useListCategories } from "@workspace/api-client-react";
import { StorefrontLayout } from "@/components/StorefrontLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowRight, ArrowLeft, ShoppingBag, Truck, Heart, Star, Camera, Mail, ShieldCheck, Zap } from "lucide-react";
import { useLanguage, getLocalizedText } from "@/lib/i18n/LanguageContext";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/currency";
import { NextGenImage } from "@/components/NextGenImage";

const CATEGORY_IMAGES: Record<string, string> = {
  "Celebration Cakes": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80",
  "Cookies & Biscuits": "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&q=80",
  "Pastries & Desserts": "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80",
  "Artisan Breads": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",
  "Traditional Sweets": "https://images.unsplash.com/photo-1505935428862-770b6f24f629?w=400&q=80",
  "Local Delights": "https://images.unsplash.com/photo-1530648672449-81f6c723e2f1?w=400&q=80",
};

export default function HomePage() {
  const { data: popular, isLoading: loadingPopular } = useListPopularProducts();
  const { data: banners, isLoading: loadingBanners } = useListBanners();
  const { data: categories, isLoading: loadingCategories } = useListCategories();
  const { t, isUrdu } = useLanguage();

  const activeBanners = Array.isArray(banners) ? banners.filter((b) => b.isActive) : [];
  const heroImage = activeBanners.length > 0 ? activeBanners[0].imageUrl : "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  return (
    <StorefrontLayout>
      <div className="flex flex-col gap-12 sm:gap-20 pb-20">
        
        {/* 1. HERO SECTION (Fixed RTL/LTR) */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-8 md:pt-12 w-full">
          <div className="flex flex-col xl:flex-row gap-8 items-center xl:items-stretch text-start">
            <motion.div 
              initial={{ opacity: 0, x: isUrdu ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full xl:w-1/2 flex flex-col justify-center py-4"
            >
              <Badge className="w-fit mb-4 neu-flat bg-primary/10 text-primary border-none px-4 py-1 uppercase tracking-widest text-[10px] font-bold">
                {t.home.heroBadge}
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif font-bold text-foreground leading-[1.05] mb-6 tracking-tight uppercase whitespace-pre-line">
                {t.home.heroTitleAura}
              </h1>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed max-w-md">
                {t.home.heroSubtitle}
              </p>
              <div className="flex flex-wrap gap-4 items-center justify-start">
                <Link href="/shop">
                  <button className="neu-flat rounded-full px-10 py-5 text-sm font-bold uppercase tracking-widest text-foreground hover:text-primary active:neu-pressed transition-all flex items-center gap-2 group">
                    {t.home.exploreBtn}
                    {isUrdu ? <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                  </button>
                </Link>
                <Link href="/shop">
                  <button className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors border-b-2 border-transparent hover:border-foreground pb-1">
                    {t.home.viewBtn}
                  </button>
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full xl:w-1/2 flex-shrink-0"
            >
              <div className="neu-pressed rounded-[2.5rem] p-3 h-full min-h-[350px] sm:min-h-[500px] overflow-hidden relative">
                {loadingBanners ? (
                  <Skeleton className="w-full h-full rounded-[2rem]" />
                ) : (
                  <NextGenImage 
                    src={heroImage} 
                    alt="Artisanal Bakes" 
                    className="w-full h-full rounded-[2rem]"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none rounded-[2rem]"></div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2. FEATURED CATEGORIES */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold uppercase tracking-wider mb-2">{t.home.categoriesTitle}</h2>
            <p className="text-muted-foreground text-sm uppercase tracking-widest">{t.home.categoriesSubtitle}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
            {loadingCategories ? (
              [1,2,3,4,5,6].map(i => <Skeleton key={i} className="aspect-square rounded-full" />)
            ) : (
              categories?.slice(0,6).map((cat, idx) => (
                <Link key={cat.id} href={`/shop?categoryId=${cat.id}`}>
                  <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                      hidden: { opacity: 0, scale: 0.8 },
                      visible: { opacity: 1, scale: 1, transition: { delay: idx * 0.1 } }
                    }}
                    className="flex flex-col items-center group cursor-pointer"
                  >
                    <div className="w-full aspect-square neu-flat rounded-full p-2 mb-4 group-hover:neu-pressed transition-all relative overflow-hidden">
                      <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                      <div className="w-full h-full rounded-full overflow-hidden bg-muted relative z-10">
                        <NextGenImage 
                          src={CATEGORY_IMAGES[cat.name.trim()] || cat.imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${cat.name}&backgroundColor=1a5e20&textColor=ffffff`} 
                          alt={cat.name} 
                          className="w-full h-full group-hover:scale-110 transition-transform duration-500" 
                        />
                      </div>
                    </div>
                    <h3 className="font-serif font-bold text-sm uppercase tracking-wide group-hover:text-primary transition-colors">{getLocalizedText(cat.name, isUrdu)}</h3>
                  </motion.div>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* 3. BESTSELLERS (PRODUCT GRID) */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="neu-flat rounded-[3rem] p-8 sm:p-12">
            <div className={`flex flex-col sm:flex-row items-end justify-between mb-12 gap-4 ${isUrdu ? 'sm:flex-row-reverse text-right' : 'text-left'}`}>
              <div>
                <h2 className="text-4xl font-serif font-bold uppercase tracking-wide mb-2">{t.home.popularTitle}</h2>
                <p className="text-muted-foreground text-sm uppercase tracking-widest">{t.home.popularSubtitle}</p>
              </div>
              <Link href="/shop" className="text-xs font-bold text-muted-foreground hover:text-foreground uppercase tracking-widest transition-colors pb-1 border-b border-transparent hover:border-foreground">
                {t.home.viewAll}
              </Link>
            </div>

            {loadingPopular ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-square rounded-[2rem]" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 sm:gap-10">
                {popular?.slice(0, 8).map((p, idx) => {
                  const images = (p.imageUrls as string[]) ?? [];
                  return (
                    <motion.div 
                      key={p.id} 
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={itemVariants}
                    >
                      <div className="flex flex-col h-full group">
                        <Link href={`/products/${p.id}`} className="mb-4 block">
                          <div className="aspect-[4/5] neu-pressed rounded-[2rem] p-3 overflow-hidden mb-6 relative">
                            {images[0] ? (
                              <NextGenImage src={images[0]} alt={getLocalizedText(p.name, isUrdu)} className="w-full h-full object-cover rounded-[1.5rem] transition-transform duration-700 group-hover:scale-110" />
                            ) : (
                              <div className="w-full h-full bg-muted rounded-[1.5rem] flex items-center justify-center">
                                <ShoppingBag className="h-10 w-10 text-muted-foreground/30" />
                              </div>
                            )}
                            <div className="absolute top-6 right-6">
                              <Badge className="bg-background/80 backdrop-blur-sm text-foreground border-none font-bold text-[10px] uppercase px-3 py-1 neu-flat">
                                {formatCurrency(Number(p.basePrice))}
                              </Badge>
                            </div>
                          </div>
                          <h3 className="font-serif font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1 uppercase mb-1">
                            {getLocalizedText(p.name, isUrdu)}
                          </h3>
                          <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">{p.category?.name || 'Treat'}</p>
                        </Link>
                        <Link href={`/products/${p.id}`} className="mt-auto">
                          <button className="w-full neu-flat rounded-full py-4 text-[10px] font-bold uppercase tracking-widest hover:text-primary active:neu-pressed transition-all">
                            {t.home.addToBag}
                          </button>
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* 4. THE ARTISAN PROCESS (WHY US) */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={itemVariants} className="neu-flat rounded-[2.5rem] p-8 text-center group hover:neu-pressed transition-all">
              <div className="w-20 h-20 neu-pressed rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif font-bold text-xl mb-3 uppercase tracking-wider">{getLocalizedText("Pure Passion | سچی لگن", isUrdu)}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{getLocalizedText("Crafted with family recipes handed down through generations. | نسلوں سے چلے آنے والے خاندانی نسخوں کے ساتھ تیار کیا گیا ہے۔", isUrdu)}</p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={itemVariants} className="neu-flat rounded-[2.5rem] p-8 text-center group hover:neu-pressed transition-all">
              <div className="w-20 h-20 neu-pressed rounded-3xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-10 h-10 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif font-bold text-xl mb-3 uppercase tracking-wider">{getLocalizedText("Clean & Pure | صاف اور خالص", isUrdu)}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{getLocalizedText("We use only premium, locally-sourced ingredients with zero additives. | ہم صفر اضافی اشیاء کے ساتھ صرف پریمیم اجزاء استعمال کرتے ہیں۔", isUrdu)}</p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={itemVariants} className="neu-flat rounded-[2.5rem] p-8 text-center group hover:neu-pressed transition-all">
              <div className="w-20 h-20 neu-pressed rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif font-bold text-xl mb-3 uppercase tracking-wider">{getLocalizedText("Always Fresh | ہمیشہ تازہ", isUrdu)}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{getLocalizedText("Baked daily and delivered within hours to ensure maximum flavor. | زیادہ سے زیادہ ذائقہ کو یقینی بنانے کے لئے روزانہ تیار اور ڈیلیور کیا جاتا ہے۔", isUrdu)}</p>
            </motion.div>
          </div>
        </section>

        {/* 5. CUSTOMER REVIEWS (TESTIMONIALS) */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold uppercase tracking-wider mb-2">{getLocalizedText("Customer Stories | کسٹمرز کی کہانیاں", isUrdu)}</h2>
            <div className="flex justify-center gap-1 text-primary">
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="neu-flat rounded-[2rem] p-8 relative">
              <Star className="absolute top-8 right-8 w-12 h-12 text-primary/10" />
              <p className="text-lg font-serif italic mb-6 leading-relaxed">
                "{getLocalizedText("The Badam Barfi was absolutely melt-in-the-mouth. Reminded me of my childhood visits to the bakery! | بادام برفی بہت ہی لذیذ تھی۔ مجھے اپنے بچپن کی یاد دلا دی!", isUrdu)}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">HR</div>
                <div>
                  <p className="font-bold uppercase tracking-widest text-sm">Hamza Rashid</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Verified Customer</p>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="neu-flat rounded-[2rem] p-8 relative">
              <Star className="absolute top-8 right-8 w-12 h-12 text-primary/10" />
              <p className="text-lg font-serif italic mb-6 leading-relaxed">
                "{getLocalizedText("The best sourdough in town. Always fresh and the crust is perfect every single time. | شہر کا بہترین سورڈو۔ ہمیشہ تازہ اور ذائقہ لاجواب ہوتا ہے۔", isUrdu)}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">ZS</div>
                <div>
                  <p className="font-bold uppercase tracking-widest text-sm">Zainab Sheikh</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Local Guide</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 6. SPECIAL MOMENTS GALLERY */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className={`flex flex-col sm:flex-row items-center justify-between mb-12 gap-4 ${isUrdu ? 'sm:flex-row-reverse text-right' : 'text-left'}`}>
            <div className={isUrdu ? 'text-right' : 'text-left'}>
              <h2 className="text-4xl font-serif font-bold uppercase tracking-wide mb-2 flex items-center gap-4 justify-center sm:justify-start">
                <Camera className="w-8 h-8 text-primary" />
                {getLocalizedText("Special Moments | خاص لمحات", isUrdu)}
              </h2>
              <p className="text-muted-foreground text-sm uppercase tracking-widest">{getLocalizedText("Captured with love by our community | ہماری کمیونٹی کی جانب سے محبت سے لی گئی تصاویر", isUrdu)}</p>
            </div>
            <button className="neu-flat rounded-full px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-all">
              @MarhabaBakers
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[400px] md:h-[600px]">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="col-span-2 row-span-2 neu-pressed rounded-[2.5rem] overflow-hidden p-2">
              <NextGenImage src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80" className="w-full h-full object-cover rounded-[2rem]" alt="Bakery" />
            </motion.div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="neu-pressed rounded-[2rem] overflow-hidden p-2">
              <NextGenImage src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80" className="w-full h-full object-cover rounded-[1.5rem]" alt="Breads" />
            </motion.div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="neu-pressed rounded-[2rem] overflow-hidden p-2">
              <NextGenImage src="https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?w=400&q=80" className="w-full h-full object-cover rounded-[1.5rem]" alt="Cakes" />
            </motion.div>
            <motion.div variants={itemVariants} className="col-span-2 aspect-video xl:aspect-square neu-flat p-4 rounded-[2rem]">
              <NextGenImage src="https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80" className="w-full h-full rounded-[1.5rem]" alt="Sweets" />
            </motion.div>
          </div>
        </section>

        {/* 7. NEWSLETTER SECTION */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
          <div className="neu-flat rounded-[4rem] p-12 sm:p-20 text-center relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 neu-pressed rounded-full flex items-center justify-center mx-auto mb-8">
                <Mail className="w-10 h-10 text-primary" strokeWidth={1.5} />
              </div>
              <h2 className="text-4xl font-serif font-bold uppercase tracking-wider mb-4">
                {getLocalizedText("Stay in the Loop | باخبر رہیں", isUrdu)}
              </h2>
              <p className="text-muted-foreground text-lg mb-10 max-w-md mx-auto">
                {getLocalizedText("Join our list for fresh news, limited drops, and secret recipes. | تازہ ترین خبروں اور خصوصی ڈسکاؤنٹس کے لیے ہمارے ساتھ شامل ہوں۔", isUrdu)}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <div className="flex-1 relative">
                  <Input 
                    placeholder={getLocalizedText("Email address... | ای میل پتہ...", isUrdu)}
                    className="neu-pressed border-none rounded-full px-8 h-16 text-lg focus-visible:ring-primary/20"
                  />
                </div>
                <button className="neu-flat rounded-full px-12 h-16 font-bold uppercase tracking-widest hover:text-primary active:neu-pressed transition-all shrink-0">
                  {getLocalizedText("Join Us | شامل ہوں", isUrdu)}
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-6 uppercase tracking-widest font-bold">
                {getLocalizedText("We respect your privacy. Zero spam. | ہم آپ کی پرائیویسی کا احترام کرتے ہیں۔", isUrdu)}
              </p>
            </div>
          </div>
        </section>

      </div>
    </StorefrontLayout>
  );
}
