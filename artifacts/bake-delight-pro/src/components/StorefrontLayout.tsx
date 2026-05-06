import { Link, useLocation } from "wouter";
import { ShoppingCart, Moon, Sun, Menu, X, Shield, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { useCartStore } from "@/stores/cart";
import { useState } from "react";

export function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const cartItems = useCartStore((s) => s.items);
  const cartCount = cartItems.reduce((a, i) => a + i.quantity, 0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  const navLinks = [
    { href: "/", label: "ہوم" },
    { href: "/shop", label: "شاپ" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                <span className="text-primary-foreground text-xs font-bold">م</span>
              </div>
              <span className="font-serif font-bold text-primary tracking-tight text-lg leading-tight" dir="rtl">
                مرحبا سویٹس اینڈ بیکرز
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
                  dir="rtl"
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/admin" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" /> ایڈمن
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme" className="rounded-full">
                {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
              </Button>
              <Link href="/cart">
                <Button variant="outline" size="sm" className="relative gap-2 rounded-full border-primary/30 hover:border-primary">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm font-medium">کارٹ</span>
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
                dir="rtl"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/admin" onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-muted-foreground py-1 inline-flex items-center gap-1.5" dir="rtl">
              <Shield className="h-3.5 w-3.5" /> ایڈمن
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
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                  <span className="text-primary-foreground text-xs font-bold">م</span>
                </div>
                <span className="font-serif font-bold text-foreground" dir="rtl">مرحبا سویٹس اینڈ بیکرز</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed" dir="rtl">
                روایتی ذائقہ، محبت سے تیار — ہر موقع کے لیے تازہ مٹھائی اور بیکری آئٹمز۔
              </p>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-foreground mb-1" dir="rtl">ہماری لوکیشن</p>
                <p className="text-sm text-muted-foreground leading-relaxed" dir="rtl">
                  مین روڈ فروکہ<br />تحصیل ساہیوال، ضلع سرگودھا
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MessageCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-foreground mb-1" dir="rtl">آرڈر کریں</p>
                <p className="text-sm text-muted-foreground" dir="rtl">WhatsApp پر آرڈر کریں</p>
                <p className="text-sm text-muted-foreground" dir="rtl">ڈیلیوری چارجز: 300 روپے</p>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6 text-center">
            <p className="text-xs text-muted-foreground" dir="rtl">
              © {new Date().getFullYear()} مرحبا سویٹس اینڈ بیکرز — تمام حقوق محفوظ ہیں
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
