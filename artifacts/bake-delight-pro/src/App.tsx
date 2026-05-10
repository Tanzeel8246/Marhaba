import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import ShopPage from "@/pages/ShopPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import AdminProductsPage from "@/pages/AdminProductsPage";
import AdminCategoriesPage from "@/pages/AdminCategoriesPage";
import AdminOrdersPage from "@/pages/AdminOrdersPage";
import AdminCalendarPage from "@/pages/AdminCalendarPage";
import AdminBannersPage from "@/pages/AdminBannersPage";
import AdminBlackoutDatesPage from "@/pages/AdminBlackoutDatesPage";
import AdminCouponsPage from "@/pages/AdminCouponsPage";
import AdminSettingsPage from "@/pages/AdminSettingsPage";
import AdminKitchenScreenPage from "@/pages/AdminKitchenScreenPage";
import AdminInventoryPage from "@/pages/AdminInventoryPage";
import AdminWastagePage from "@/pages/AdminWastagePage";
import AdminGenericModulePage from "@/pages/AdminGenericModulePage";
import AuthPage from "@/pages/AuthPage";
import OrderHistoryPage from "@/pages/OrderHistoryPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/shop" component={ShopPage} />
      <Route path="/products/:id" component={ProductDetailPage} />
      <Route path="/cart" component={CartPage} />
      <Route path="/admin/login" component={AdminLoginPage} />
      <Route path="/admin" component={AdminDashboardPage} />
      <Route path="/admin/products" component={AdminProductsPage} />
      <Route path="/admin/categories" component={AdminCategoriesPage} />
      <Route path="/admin/orders" component={AdminOrdersPage} />
      <Route path="/admin/calendar" component={AdminCalendarPage} />
      <Route path="/admin/banners" component={AdminBannersPage} />
      <Route path="/admin/blackout-dates" component={AdminBlackoutDatesPage} />
      <Route path="/admin/coupons" component={AdminCouponsPage} />
      <Route path="/admin/settings" component={AdminSettingsPage} />
      <Route path="/admin/kitchen" component={AdminKitchenScreenPage} />
      <Route path="/admin/inventory" component={AdminInventoryPage} />
      <Route path="/admin/wastage" component={AdminWastagePage} />
      
      {/* Operational modules */}
      <Route path="/admin/customers" component={AdminGenericModulePage} />
      <Route path="/admin/suppliers" component={AdminGenericModulePage} />
      <Route path="/admin/purchases" component={AdminGenericModulePage} />
      <Route path="/admin/expenses" component={AdminGenericModulePage} />
      <Route path="/admin/reporting" component={AdminGenericModulePage} />
      <Route path="/admin/cash-book" component={AdminGenericModulePage} />
      <Route path="/admin/reviews" component={AdminGenericModulePage} />
      <Route path="/admin/special-moments" component={AdminGenericModulePage} />

      {/* Customer Account Routes */}
      <Route path="/auth" component={AuthPage} />
      <Route path="/account/orders" component={OrderHistoryPage} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
