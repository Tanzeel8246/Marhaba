import { Link, useLocation } from "wouter";
import { ShoppingCart, Moon, Sun, Menu, X, Shield, MapPin, MessageCircle, Languages, User } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useCartStore } from "@/stores/cart";
import { useState, useEffect } from "react";
import { useLanguage, getLocalizedText } from "@/lib/i18n/LanguageContext";
import { Logo } from "@/components/Logo";

export function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const cartItems = useCartStore((s) => s.items);
  const cartCount = cartItems.reduce((a, i) => a + i.quantity, 0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  const { t, toggleLang, isUrdu } = useLanguage();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.authenticated) setUser(data.user);
      })
      .catch(() => {/* API not available - guest mode */});
  }, []);

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/shop", label: t.nav.shop },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20">
      {/* Neumorphic Floating Header */}
      <div className="pt-6 pb-2 px-4 sm:px-6 lg:px-8 max-w-[1400px] w-full mx-auto">
        <header className="neu-flat rounded-full px-6 py-4 flex items-center justify-between z-50 relative">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 neu-pressed rounded-full flex items-center justify-center text-primary">
              <Logo size={24} />
            </div>
            <div className="flex flex-col">
              <span className="brand-name font-serif font-bold text-foreground text-lg leading-tight tracking-wide">
                {isUrdu ? "مرحبا سویٹس اینڈ بیکرز" : "MARHABA BAKERS"}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Baking Passion</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs uppercase tracking-widest font-bold px-5 py-2.5 rounded-full transition-all ${
                  location === link.href ? "neu-pressed text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/admin" className="text-xs uppercase tracking-widest font-bold px-5 py-2.5 rounded-full transition-all text-muted-foreground hover:text-foreground inline-flex items-center gap-2">
               {t.nav.admin}
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {/* Language switcher */}
            <button
              onClick={toggleLang}
              className="hidden sm:flex text-xs uppercase tracking-widest font-bold px-4 py-2.5 rounded-full neu-flat transition-transform active:scale-95 text-foreground items-center gap-2"
              aria-label="Switch language"
            >
              <Languages className="h-4 w-4" />
              {t.nav.langLabel}
            </button>

            <button onClick={toggleTheme} aria-label="Toggle theme" className="w-10 h-10 flex items-center justify-center rounded-full neu-flat transition-transform active:scale-95 text-foreground">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <Link href="/cart" className="neu-flat rounded-full px-5 py-2.5 flex items-center gap-3 transition-transform active:scale-95 group">
              <span className="cart-label text-xs uppercase tracking-widest font-bold text-foreground group-hover:text-primary transition-colors">{t.nav.cart}</span>
              <div className="relative">
                <ShoppingCart className="h-4 w-4 text-foreground group-hover:text-primary transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 text-[10px] font-bold text-primary">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>

            <Link href={user ? "/account/orders" : "/auth"} className="neu-flat rounded-full px-5 py-2.5 flex items-center gap-3 transition-transform active:scale-95 group">
              <span className="account-label text-xs uppercase tracking-widest font-bold text-foreground group-hover:text-primary transition-colors">
                {user ? (isUrdu ? "میرا اکاؤنٹ" : "Account") : (isUrdu ? "لاگ ان" : "Login")}
              </span>
              <User className="h-4 w-4 text-foreground group-hover:text-primary transition-colors" />
            </Link>

            <button className="md:hidden w-10 h-10 flex items-center justify-center rounded-full neu-flat transition-transform active:scale-95 text-foreground" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </header>

        {/* Mobile Navigation Dropdown */}
        {menuOpen && (
          <div className="md:hidden mt-4 neu-flat rounded-3xl p-4 flex flex-col gap-2 relative z-40">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                className={`text-sm uppercase tracking-widest font-bold px-5 py-3 rounded-2xl transition-all ${
                  location === link.href ? "neu-pressed text-primary" : "text-muted-foreground active:neu-pressed"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/admin" onClick={() => setMenuOpen(false)}
              className="text-sm uppercase tracking-widest font-bold px-5 py-3 rounded-2xl transition-all text-muted-foreground active:neu-pressed flex items-center gap-2">
              <Shield className="h-4 w-4" /> {t.nav.admin}
            </Link>
            <Link href={user ? "/account/orders" : "/auth"} onClick={() => setMenuOpen(false)}
              className="text-sm uppercase tracking-widest font-bold px-5 py-3 rounded-2xl transition-all text-muted-foreground active:neu-pressed flex items-center gap-2">
              <User className="h-4 w-4" /> {user ? (isUrdu ? "میرا اکاؤنٹ" : "My Account") : (isUrdu ? "لاگ ان" : "Login")}
            </Link>
            <button
              onClick={() => { toggleLang(); setMenuOpen(false); }}
              className="text-sm uppercase tracking-widest font-bold px-5 py-3 rounded-2xl transition-all text-muted-foreground active:neu-pressed flex items-center gap-2 text-start"
            >
              <Languages className="h-4 w-4" /> {t.nav.langLabel}
            </button>
          </div>
        )}
      </div>

      <main className="flex-1 w-full max-w-[1400px] mx-auto">{children}</main>

      <div className="px-4 sm:px-6 lg:px-8 max-w-[1400px] w-full mx-auto pb-6 mt-16">
        <footer className="neu-flat rounded-3xl p-8 lg:p-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 neu-pressed rounded-full flex items-center justify-center text-primary">
                  <Logo size={24} />
                </div>
                <span className={`font-serif font-bold text-foreground text-lg leading-tight tracking-wide`}>
                  {isUrdu ? "مرحبا سویٹس اینڈ بیکرز" : "MARHABA BAKERS"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">{t.footer.tagline}</p>
            </div>

            <div>
              <p className="font-bold text-xs uppercase tracking-widest text-foreground mb-4">{t.footer.location}</p>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{t.footer.address}</p>
              </div>
            </div>

            <div>
              <p className="font-bold text-xs uppercase tracking-widest text-foreground mb-4">{t.footer.orderTitle}</p>
              <div className="flex items-start gap-3">
                <MessageCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{t.footer.orderDesc}</p>
                  <p className="text-xs font-medium text-primary bg-primary/5 px-2 py-1 rounded inline-block neu-pressed">{t.footer.deliveryCharges}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-muted/50 text-center sm:text-start flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                © {new Date().getFullYear()} {t.footer.copyright}
              </p>
              <p className="text-[10px] text-muted-foreground/60 uppercase tracking-[0.2em] font-bold">
                Developed by <a href="https://codehubb.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">CODEHUBB.com</a>
              </p>
            </div>
            <div className="flex gap-4">
               {navLinks.map((link) => (
                 <Link key={link.href} href={link.href} className="text-xs text-muted-foreground hover:text-foreground font-medium uppercase tracking-widest">{link.label}</Link>
               ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
