import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, Package, Tag, ClipboardList, Calendar, Image, Ban, Ticket, 
  Moon, Sun, LogOut, Menu, Settings, Monitor, Users, ShoppingCart, 
  Truck, Receipt, TrendingUp, PieChart, FileText, AlertCircle, ChefHat, Wallet, FileBarChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { useLanguage, getLocalizedText } from "@/lib/i18n/LanguageContext";
import { useAdminLogout } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

const navGroups = [
  {
    label: "OVERVIEW | جائزہ",
    items: [
      { href: "/admin", label: "Dashboard | ڈیش بورڈ", icon: LayoutDashboard },
      { href: "/", label: "View Website | ویب سائٹ دیکھیں", icon: Monitor },
    ]
  },
  {
    label: "SALES | سیلز",
    items: [
      { href: "/admin/orders", label: "Orders | آرڈرز", icon: ClipboardList },
      { href: "/admin/calendar", label: "Delivery Calendar | کلینڈر", icon: Calendar },
      { href: "/admin/kitchen", label: "Kitchen Screen | کچن اسکرین", icon: ChefHat },
      { href: "/admin/customers", label: "Customers | کسٹمرز", icon: Users },
      { href: "/admin/products", label: "Products | پروڈکٹس", icon: Package },
      { href: "/admin/categories", label: "Categories | کیٹیگریز", icon: Tag },
      { href: "/admin/coupons", label: "Promotions | پروموشنز", icon: Ticket },
    ]
  },
  {
    label: "PROCUREMENT | خریداری",
    items: [
      { href: "/admin/inventory", label: "Inventory | انونٹری", icon: ShoppingCart },
      { href: "/admin/suppliers", label: "Suppliers | سپلائرز", icon: Truck },
      { href: "/admin/purchases", label: "Purchases | خریداریاں", icon: Receipt },
      { href: "/admin/expenses", label: "Expenses | اخراجات", icon: TrendingUp },
    ]
  },
  {
    label: "ANALYTICS | تجزیات",
    items: [
      { href: "/admin/reporting", label: "Reporting Hub | رپورٹس", icon: PieChart },
    ]
  },
  {
    label: "SYSTEM | سسٹم",
    items: [
      { href: "/admin/cash-book", label: "Cash Book | کیش بک", icon: Wallet },
      { href: "/admin/banners", label: "Appearance | ظاہری شکل", icon: Image },
      { href: "/admin/blackout-dates", label: "Blackout Dates | بندش کی تاریخیں", icon: Ban },
      { href: "/admin/settings", label: "Settings | سیٹنگز", icon: Settings },
      { href: "/admin/reviews", label: "Reviews | ریویوز", icon: FileText },
      { href: "/admin/wastage", label: "Wastage | ضیاع", icon: AlertCircle },
      { href: "/admin/special-moments", label: "Special Moments | خاص لمحات", icon: FileBarChart },
    ]
  }
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const { isUrdu, toggleLang } = useLanguage();
  const [location, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Scroll main content to top on location change
    const main = document.querySelector('main');
    if (main) main.scrollTo({ top: 0, behavior: 'smooth' });
    setSidebarOpen(false); // Close sidebar on mobile navigation
  }, [location]);

  const logout = useAdminLogout({
    mutation: {
      onSuccess: () => {
        queryClient.clear();
        navigate("/admin/login");
      },
    },
  });

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#f8fafc] dark:bg-[#0f172a]">
      <div className="p-5 border-b border-border/50 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-serif font-bold text-xl shadow-lg shadow-primary/20">
          M
        </div>
        <div>
          <h2 className="font-serif text-lg font-bold text-foreground leading-tight">{getLocalizedText("Marhaba | مرحبا", isUrdu)}</h2>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">{getLocalizedText("Admin Panel | ایڈمن پینل", isUrdu)}</p>
        </div>
      </div>

      <div className="px-4 py-4 border-b border-border/50 space-y-4">
        <div>
          <p className="text-[10px] font-bold text-primary/60 dark:text-primary/40 uppercase tracking-widest mb-2">{getLocalizedText("Theme | تھیم", isUrdu)}</p>
          <div className="flex bg-muted/50 p-1 rounded-lg">
            <button 
              className={`flex-1 flex justify-center py-1.5 rounded-md text-xs transition-all ${theme === 'light' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
              onClick={() => theme !== 'light' && toggleTheme()}
            >
              <Sun className="h-3.5 w-3.5" />
            </button>
            <button 
              className={`flex-1 flex justify-center py-1.5 rounded-md text-xs transition-all ${theme === 'dark' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
              onClick={() => theme !== 'dark' && toggleTheme()}
            >
              <Moon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold text-primary/60 dark:text-primary/40 uppercase tracking-widest mb-2">{getLocalizedText("Language | زبان", isUrdu)}</p>
          <div className="flex bg-muted/50 p-1 rounded-lg">
            <button 
              className={`flex-1 flex justify-center py-1.5 rounded-md text-xs font-bold transition-all ${!isUrdu ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
              onClick={() => isUrdu && toggleLang()}
            >
              EN
            </button>
            <button 
              className={`flex-1 flex justify-center py-1.5 rounded-md text-xs font-bold transition-all ${isUrdu ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
              onClick={() => !isUrdu && toggleLang()}
            >
              اردو
            </button>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-6 overflow-y-auto custom-scrollbar">
        {navGroups.map((group, idx) => (
          <div key={idx}>
            <p className="px-3 text-[10px] font-bold text-primary/60 dark:text-primary/40 uppercase tracking-widest mb-2">
              {getLocalizedText(group.label, isUrdu)}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = location === item.href || (item.href !== "/admin" && item.href !== "#" && location.startsWith(item.href));
                const ItemWrapper = Link;
                
                return (
                  <ItemWrapper key={item.label} href={item.href} onClick={() => setSidebarOpen(false)}>
                    <div
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer relative overflow-hidden group ${
                        active
                          ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground"
                          : "text-slate-600 dark:text-slate-400 hover:bg-muted/60 hover:text-foreground"
                      } ${item.upcoming ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                      {active && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                      )}
                      <div className="flex items-center gap-3">
                        <item.icon className={`h-4 w-4 shrink-0 transition-colors ${active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                        {getLocalizedText(item.label, isUrdu)}
                      </div>
                    </div>
                  </ItemWrapper>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-border/50">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
          onClick={() => logout.mutate()}
        >
          <LogOut className="h-4 w-4" /> {getLocalizedText("Sign out | لاگ آؤٹ", isUrdu)}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-50/50 dark:bg-slate-950 text-foreground">
      <aside className="hidden lg:flex flex-col w-[260px] shrink-0 border-r border-border/40 bg-white dark:bg-card z-10 shadow-sm">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-[260px] bg-white dark:bg-card border-r border-border shadow-2xl flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border/40 bg-white/80 dark:bg-card/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="rounded-full">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-serif font-bold text-sm shadow-sm">
                M
              </div>
              <h1 className="font-serif font-bold text-foreground">Marhaba Admin</h1>
            </div>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 text-xs font-bold text-primary">
              <Monitor className="h-4 w-4" /> {isUrdu ? "ویب سائٹ" : "Website"}
            </Button>
          </Link>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto custom-scrollbar relative">
          <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 bg-[size:20px_20px] pointer-events-none" />
          <div className="relative max-w-7xl mx-auto z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
