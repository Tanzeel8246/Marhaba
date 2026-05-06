import { Link, useLocation } from "wouter";
import { ShoppingCart, Moon, Sun, Menu, X, Shield, MapPin, MessageCircle, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { useCartStore } from "@/stores/cart";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Logo } from "@/components/Logo";

export function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const cartItems = useCartStore((s) => s.items);
  const cartCount = cartItems.reduce((a, i) => a + i.quantity, 0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  const { t, toggleLang, isUrdu } = useLanguage();

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/shop", label: t.nav.shop },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5">
              <Logo size={38} className="text-primary shrink-0" />
              <span className={`font-bold text-primary tracking-tight text-base leading-tight ${isUrdu ? "font-serif" : "font-sans"}`}>
                {isUrdu ? "مرحبا سویٹس اینڈ بیکرز" : "Marhaba Sweets & Bakers"}
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location === link.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/admin" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" /> {t.nav.admin}
              </Link>
            </nav>

            <div className="flex items-center gap-1.5">
              {/* Language switcher */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLang}
                className="gap-1.5 rounded-full text-xs font-semibold px-3 border border-border hover:border-primary/40"
                aria-label="Switch language"
                title={isUrdu ? "Switch to English" : "اردو میں بدلیں"}
              >
                <Languages className="h-3.5 w-3.5 shrink-0" />
                {t.nav.langLabel}
              </Button>

              <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme" className="rounded-full">
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              <Link href="/cart">
                <Button variant="outline" size="sm" className="relative gap-2 rounded-full border-primary/30 hover:border-primary">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm font-medium">{t.nav.cart}</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>

              <Button variant="ghost" size="icon" className="md:hidden rounded-full" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-border bg-background/98 px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                className={`text-sm font-medium py-1 ${location === link.href ? "text-primary" : "text-muted-foreground"}`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/admin" onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-muted-foreground py-1 inline-flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" /> {t.nav.admin}
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-card mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <Logo size={34} className="text-primary shrink-0" />
                <span className="font-bold text-foreground text-sm">{t.footer.brand}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.footer.tagline}</p>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-foreground mb-1">{t.footer.location}</p>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{t.footer.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MessageCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-foreground mb-1">{t.footer.orderTitle}</p>
                <p className="text-sm text-muted-foreground">{t.footer.orderDesc}</p>
                <p className="text-sm text-muted-foreground">{t.footer.deliveryCharges}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6 text-center">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} {t.footer.copyright}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
