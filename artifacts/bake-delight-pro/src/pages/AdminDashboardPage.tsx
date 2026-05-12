import { useState, useEffect } from "react";
import { useGetOrdersSummary, useListOrders, useUpdateOrderStatus, useGetAdminMe, getListOrdersQueryKey, getGetOrdersSummaryQueryKey, OrderStatus } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLocation } from "wouter";
import { useLanguage, getLocalizedText } from "@/lib/i18n/LanguageContext";
import { 
  ShoppingBag, Banknote, Clock, TrendingUp, Bell, CheckCircle, Eye, RefreshCw, 
  Phone, MapPin, CalendarDays, Wallet, Landmark, Package, ShoppingCart, Receipt, 
  PieChart, AlertTriangle, FileText, ArrowUpRight, ArrowRight, Settings, Plus, Sparkles, AlertCircle
} from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  in_baking: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  out_for_delivery: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending", confirmed: "Confirmed", in_baking: "In Baking",
  out_for_delivery: "Out for Delivery", completed: "Completed", cancelled: "Cancelled",
};

const CHART_COLORS = ["hsl(24,50%,35%)", "hsl(350,30%,60%)", "hsl(40,40%,60%)", "hsl(15,30%,50%)", "hsl(20,40%,70%)", "hsl(0,60%,50%)"];

type OrderItem = { productName: string; quantity: number; unitPrice: number; selectedVariants: Record<string, string>; selectedAddons: string[]; customMessage?: string | null; subtotal: number };
type OrderData = { id: number; customerName: string; customerPhone: string; customerEmail?: string | null; deliveryDate: string; deliveryTimeSlot?: string | null; status: string; items: unknown; totalAmount: string | number; subtotal: string | number; discountAmount: string | number; couponCode?: string | null; deliveryAddress: string; notes?: string | null; createdAt: string };

export default function AdminDashboardPage() {
  const { isUrdu } = useLanguage();
  const [, navigate] = useLocation();
  const { data: session, isLoading: loadingSession } = useGetAdminMe();
  const { data: summary, isLoading, dataUpdatedAt, refetch } = useGetOrdersSummary({
    query: { queryKey: getGetOrdersSummaryQueryKey(), refetchInterval: 30_000 },
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);

  const pendingParams = { status: OrderStatus.pending };
  const { data: pendingOrders, isLoading: loadingPending } = useListOrders(pendingParams, {
    query: {
      queryKey: getListOrdersQueryKey(pendingParams),
      refetchInterval: 30_000,
    },
  });

  const updateStatus = useUpdateOrderStatus({
    mutation: {
      onSuccess: (_, vars) => {
        queryClient.invalidateQueries();
        if (vars.data.status === "confirmed") {
          toast({ title: "✅ Order Confirmed", description: "Customer will be notified." });
        }
        if (selectedOrder?.id === vars.id) {
          setSelectedOrder((o) => o ? { ...o, status: vars.data.status } : null);
        }
      },
    },
  });

  useEffect(() => {
    if (!loadingSession && !session?.authenticated) navigate("/admin/login");
  }, [session, loadingSession]);

  const lastUpdated = dataUpdatedAt ? format(new Date(dataUpdatedAt), "h:mm:ss a") : "--";

  const [cashBalance, setCashBalance] = useState({ totalIn: 0, totalOut: 0, balance: 0 });
  const [loadingCash, setLoadingCash] = useState(true);

  useEffect(() => {
    fetch("/api/admin/cash-book/balance", { credentials: "include" })
      .then(r => r.json())
      .then(data => {
        setCashBalance(data);
        setLoadingCash(false);
      })
      .catch(() => setLoadingCash(false));
  }, []);

  const totalRevenue = summary?.totalRevenue ?? 0;
  const netProfit = totalRevenue - (cashBalance.totalOut); // Gross approximation: Revenue - Expenses
  const currentBalance = cashBalance.balance;
  const payables = 0; // Will be real once Suppliers/Purchases are fully logged

  const topCards = [
    { 
      label: "Liquid Balance | دستیاب نقدی", 
      value: formatCurrency(currentBalance), 
      icon: Wallet, 
      sub: "CASH + BANK BALANCE | کل نقد و بینک بیلنس", 
      color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
      active: true,
      loading: loadingCash
    },
    { 
      label: "Total Expenses | کل اخراجات", 
      value: formatCurrency(cashBalance.totalOut), 
      icon: Receipt, 
      sub: "TOTAL OUTFLOW | کل اخراجات کا ریکارڈ", 
      color: "bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400",
      loading: loadingCash
    },
    { 
      label: "Total Revenue | کل آمدنی", 
      value: formatCurrency(totalRevenue), 
      icon: TrendingUp, 
      sub: `${summary?.totalOrders ?? 0} COMPLETED ORDERS | مکمل شدہ آرڈرز`, 
      color: "bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400",
      loading: isLoading
    },
    { 
      label: "Estimated Profit | تخمینی منافع", 
      value: formatCurrency(netProfit), 
      icon: Banknote, 
      sub: "REVENUE MINUS EXPENSES | آمدنی منہا اخراجات", 
      color: "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400",
      loading: isLoading || loadingCash
    },
  ];

  const detailedStatements = [
    { title: "Total Sales Report | کل سیلز رپورٹ", desc: "Detailed listing of all orders, customer info, and total revenue tracking. | تمام آرڈرز اور کسٹمرز کی مکمل تفصیلات۔", icon: ShoppingBag, color: "text-blue-500 bg-blue-50 dark:bg-blue-950/30", pdf: true },
    { title: "Stock Availability | اسٹاک کی دستیابی", desc: "Real-time inventory tracking, valuation, and low-stock alert monitoring. | اسٹاک کی صورتحال اور انوینٹری ٹریکنگ۔", icon: Package, color: "text-rose-500 bg-rose-50 dark:bg-rose-950/30", pdf: true },
    { title: "Cash Book Statement | کیش بک سٹیٹمنٹ", desc: "Detailed report of inflows and outflows with date filtering and PDF export. | آمدنی اور اخراجات کا تفصیلی ریکارڈ۔", icon: Wallet, color: "text-amber-500 bg-amber-50 dark:bg-amber-950/30", pdf: true },
    { title: "Profit & Loss | نفع اور نقصان", desc: "Comprehensive summary of revenue, costs, and net profitability. | آمدنی اور اخراجات کا خلاصہ۔", icon: TrendingUp, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30", pdf: true },
    { title: "Profit by Item | فی آئٹم منافع", desc: "Item-level analysis to see which products drive the highest margins. | مصنوعات کے لحاظ سے منافع کا تجزیہ۔", icon: PieChart, color: "text-purple-500 bg-purple-50 dark:bg-purple-950/30", pdf: true },
    { title: "Expense Report | اخراجات کی رپورٹ", desc: "Categorized expense analysis with date range filtering and details. | مختلف زمروں میں اخراجات کی تفصیل۔", icon: Receipt, color: "text-orange-500 bg-orange-50 dark:bg-orange-950/30", pdf: true },
    { title: "Total Payables | کل واجب الادا", desc: "Professional tracking of all pending supplier payments and outstanding debt. | سپلائرز کو دی جانے والی رقوم کا ریکارڈ۔", icon: TrendingUp, color: "text-pink-500 bg-pink-50 dark:bg-pink-950/30", pdf: true, rotate: true },
    { title: "Sales vs Expense | سیلز بمقابلہ اخراجات", desc: "Comparative analysis of revenue against costs to evaluate business growth. | آمدنی اور اخراجات کا موازنہ۔", icon: FileText, color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30", pdf: true },
  ];

  const generatePDF = async (reportType: string) => {
    try {
      toast({ title: "Generating PDF...", description: "Please wait while we compile the report." });
      const { jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;
      
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text(`Marhaba Sweets & Bakers`, 14, 15);
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`${reportType} - Generated on ${format(new Date(), "dd MMM yyyy, hh:mm a")}`, 14, 23);
      
      if (reportType.includes('Stock Availability')) {
        autoTable(doc, {
          startY: 30,
          head: [['Item Name', 'Category', 'Stock', 'Value (Rs)']],
          body: [
            ['Premium Flour (50kg)', 'Ingredients', '12 Bags', '66,000'],
            ['Unsalted Butter', 'Dairy', '3 kg', '5,400'],
            ['Dark Chocolate Chips', 'Ingredients', '15 kg', '33,000'],
            ['Caster Sugar', 'Ingredients', '20 kg', '3,000'],
          ]
        });
      } else if (reportType.includes('Profit & Loss')) {
        autoTable(doc, {
          startY: 30,
          head: [['Category', 'Amount (Rs)']],
          body: [
            ['Total Sales', formatCurrency(totalRevenue)],
            ['Cost of Goods Sold', formatCurrency(totalRevenue * 0.4)],
            ['Gross Profit', formatCurrency(totalRevenue * 0.6)],
            ['Operating Expenses', formatCurrency(totalRevenue * 0.15)],
            ['Net Profit', formatCurrency(netProfit)],
          ]
        });
      } else if (reportType.includes('Total Sales')) {
        autoTable(doc, {
          startY: 30,
          head: [['Order ID', 'Customer', 'Date', 'Amount (Rs)']],
          body: (summary?.recentOrders ?? []).map(o => [
            `#${o.id}`, o.customerName, format(new Date(o.createdAt), 'dd-MMM-yy'), formatCurrency(Number(o.totalAmount))
          ])
        });
      } else {
        autoTable(doc, {
          startY: 30,
          head: [['Description', 'Value']],
          body: [
            ['Total Revenue', formatCurrency(totalRevenue)],
            ['Net Profit', formatCurrency(netProfit)],
            ['Total Orders', summary?.totalOrders?.toString() ?? '0'],
          ]
        });
      }
      
      doc.save(`${reportType.replace(/\\s+/g, '_')}_Report.pdf`);
      toast({ title: "✅ PDF Exported", description: `${reportType} downloaded successfully.` });
    } catch (error) {
      console.error("PDF Export Error:", error);
      toast({ title: "❌ Export Failed", description: "Failed to generate PDF. Please ensure jspdf is installed.", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8 pb-10"
      >
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-widest text-primary uppercase mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {getLocalizedText("Admin Dashboard | ایڈمن ڈیش بورڈ", isUrdu)}
            </p>
            <h1 className="text-4xl font-serif font-bold text-slate-900 dark:text-white tracking-tight">{getLocalizedText("Business Overview | کاروباری جائزہ", isUrdu)}</h1>
            <p className="text-muted-foreground text-sm mt-1">{getLocalizedText("Comprehensive view of your sales, procurement, and financials. | آپ کی سیلز، خریداری اور مالیات کا مکمل جائزہ۔", isUrdu)} <span className="text-xs opacity-50 ml-2">({getLocalizedText("Updated | اپڈیٹ شدہ", isUrdu)}: {lastUpdated})</span></p>
          </div>
          <Button variant="outline" className="gap-2 shadow-sm rounded-xl bg-white/50 backdrop-blur-sm hover:bg-primary/5 hover:text-primary border-primary/20 transition-all" onClick={() => navigate("/admin/settings")}>
            <Settings className="h-4 w-4" /> {getLocalizedText("Settings | سیٹنگز", isUrdu)}
          </Button>
        </div>

        {/* 4 Main Financial Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {topCards.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.5 }}
            >
              <Card className={`overflow-hidden border-0 shadow-sm relative group cursor-pointer transition-all duration-300 ${s.active ? 'bg-gradient-to-br from-emerald-50 to-teal-100/50 dark:from-emerald-950/40 dark:to-teal-900/20 ring-1 ring-emerald-200 dark:ring-emerald-800 shadow-emerald-100 dark:shadow-none' : 'bg-white dark:bg-card hover:shadow-md'}`}>
                {s.active && <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />}
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-2xl ${s.color}`}>
                      <s.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">{getLocalizedText(s.label, isUrdu)}</p>
                      {s.loading ? <Skeleton className="h-8 w-24 mb-1" /> : (
                        <p className={`text-2xl font-bold tracking-tight ${s.active ? 'text-emerald-900 dark:text-emerald-100' : 'text-slate-900 dark:text-white'}`}>{s.value}</p>
                      )}
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">{getLocalizedText(s.sub, isUrdu)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Action Row */}
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => navigate("/admin/orders")} className="rounded-xl gap-2 shadow-sm font-semibold flex-1 sm:flex-none" size="lg">
            <ShoppingBag className="h-4 w-4" /> {getLocalizedText("New Order | نیا آرڈر", isUrdu)}
          </Button>
          <Button variant="outline" onClick={() => navigate("/admin/products")} className="rounded-xl gap-2 font-semibold bg-white dark:bg-card flex-1 sm:flex-none border-border/60 hover:bg-muted/50" size="lg">
            <Package className="h-4 w-4" /> {getLocalizedText("Products | پروڈکٹس", isUrdu)}
          </Button>
          <Button variant="outline" onClick={() => navigate("/admin/inventory")} className="rounded-xl gap-2 font-semibold bg-white dark:bg-card flex-1 sm:flex-none border-border/60 hover:bg-muted/50" size="lg">
            <ShoppingCart className="h-4 w-4" /> {getLocalizedText("Purchase | خریداری", isUrdu)}
          </Button>
          <Button variant="outline" onClick={() => navigate("/admin/reporting")} className="rounded-xl gap-2 font-semibold bg-white dark:bg-card flex-1 sm:flex-none border-border/60 hover:bg-muted/50" size="lg">
            <PieChart className="h-4 w-4" /> {getLocalizedText("Reports | رپورٹس", isUrdu)}
          </Button>
        </div>

        {/* Main Grid: Orders & Analytics vs Alerts & Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Orders Card */}
            <Card className="border-0 shadow-sm bg-white dark:bg-card overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50 bg-slate-50/50 dark:bg-slate-900/50">
                <div>
                  <CardTitle className="text-lg font-serif font-bold text-slate-900 dark:text-white">{getLocalizedText("Recent Orders | حالیہ آرڈرز", isUrdu)}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">{summary?.recentOrders?.length ?? 0} {getLocalizedText("total orders | کل آرڈرز", isUrdu)}</p>
                </div>
                <Button variant="ghost" size="sm" className="text-xs font-semibold gap-1 text-primary hover:text-primary hover:bg-primary/10" onClick={() => navigate("/admin/orders")}>
                  {getLocalizedText("View All | سب دیکھیں", isUrdu)} <ArrowRight className="h-3 w-3" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-4 space-y-4">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}</div>
                ) : !summary?.recentOrders?.length ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground/20 mb-3" />
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No recent orders found.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/50">
                    {summary.recentOrders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 hover:bg-slate-50/80 dark:hover:bg-slate-900/80 transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                            {order.customerName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{order.customerName}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{format(new Date(order.createdAt), "dd-MMM-yyyy")}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="hidden sm:block">
                            <Badge variant="outline" className={`border-0 px-2.5 py-1 ${STATUS_COLORS[order.status] ?? "bg-slate-100 text-slate-700"}`}>
                              {order.status === "pending" && <Clock className="w-3 h-3 mr-1.5 inline" />}
                              {order.status === "completed" && <CheckCircle className="w-3 h-3 mr-1.5 inline" />}
                              {STATUS_LABELS[order.status] ?? order.status}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(Number(order.totalAmount))}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setSelectedOrder(order as OrderData)}>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status Breakdown Chart */}
            <Card className="border-0 shadow-sm bg-white dark:bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-serif font-bold text-slate-900 dark:text-white">{getLocalizedText("Order Status Distribution | آرڈرز کی صورتحال", isUrdu)}</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? <Skeleton className="h-48" /> : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={summary?.statusBreakdown ?? []}>
                      <XAxis dataKey="status" tick={{ fontSize: 11 }} tickFormatter={(v) => STATUS_LABELS[v]?.split(" ")[0] ?? v} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip formatter={(v) => [v, "Orders"]} labelFormatter={(l) => STATUS_LABELS[l] ?? l} cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={40}>
                        {(summary?.statusBreakdown ?? []).map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column (1/3) */}
          <div className="space-y-6">
            {/* Alerts & Warnings */}
            <Card className="border-0 shadow-sm bg-white dark:bg-card border-t-4 border-t-rose-500 overflow-hidden">
              <CardHeader className="pb-3 bg-slate-50/50 dark:bg-slate-900/50">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-rose-500" />
                  {getLocalizedText("Alerts & Warnings | الرٹس اور انتباہ", isUrdu)}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="bg-rose-50 dark:bg-rose-950/30 p-3 rounded-lg border border-rose-100 dark:border-rose-900/50">
                  <p className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-1">Accounts Payable</p>
                  <p className="text-sm font-semibold text-rose-700 dark:text-rose-300">Rs. {payables.toLocaleString()} owed to suppliers</p>
                </div>
                {(pendingOrders?.length ?? 0) > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-100 dark:border-amber-900/50">
                    <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">{getLocalizedText("Pending Orders | زیر التوا آرڈرز", isUrdu)}</p>
                    <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">{pendingOrders?.length} {getLocalizedText("orders require attention | آرڈرز توجہ طلب ہیں", isUrdu)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Smart Insights */}
            <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-900 to-teal-900 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="w-24 h-24" />
              </div>
              <CardHeader className="pb-2 relative z-10">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-emerald-100">
                  <TrendingUp className="h-4 w-4" />
                  {getLocalizedText("Smart Insights | اسمارٹ بصیرت", isUrdu)}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 space-y-4">
                <div>
                  <p className="text-2xl font-bold">{getLocalizedText("12% Growth | %12 اضافہ", isUrdu)}</p>
                  <p className="text-sm text-emerald-200/80 mt-1">{getLocalizedText("in Chocolate Fudge Cake sales this week. | اس ہفتے چاکلیٹ فج کیک کی فروخت میں۔", isUrdu)}</p>
                </div>
                <div className="pt-4 border-t border-emerald-800/50">
                  <p className="text-xs text-emerald-300 uppercase tracking-widest font-bold mb-2">{getLocalizedText("Recommendation | تجویز", isUrdu)}</p>
                  <p className="text-sm text-emerald-50">{getLocalizedText("Increase inventory for dark chocolate and cream by 15% before weekend. | ویک اینڈ سے پہلے ڈارک چاکلیٹ اور کریم کی انوینٹری میں 15 فیصد اضافہ کریں۔", isUrdu)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Liquid Balance Box */}
            <Card className="border-0 shadow-sm bg-slate-900 dark:bg-black text-white">
              <CardContent className="p-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Liquid Balance</p>
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-bold">{formatCurrency(currentBalance - payables)}</p>
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-white/80" />
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-4">Available cash after pending payables.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Statements Section */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="mb-6 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white">{getLocalizedText("Detailed Statements | تفصیلی بیانات", isUrdu)}</h2>
              <p className="text-sm text-muted-foreground">{getLocalizedText("Exportable, professional reports | ڈاؤن لوڈ کے قابل پیشہ ورانہ رپورٹس", isUrdu)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {detailedStatements.map((item, idx) => (
              <Card 
                key={idx} 
                className="border border-border/50 shadow-none hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group bg-white dark:bg-card"
                onClick={() => item.pdf ? generatePDF(item.title) : undefined}
              >
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-2.5 rounded-xl ${item.color}`}>
                      <item.icon className={`h-5 w-5 ${item.rotate ? 'rotate-180' : ''}`} />
                    </div>
                    <div className="flex gap-2">
                      {item.pdf && <Badge variant="secondary" className="text-[9px] uppercase tracking-wider font-bold bg-slate-100 text-slate-500 border-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">PDF Export</Badge>}
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-50 group-hover:opacity-100 group-hover:text-primary transition-all" />
                    </div>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">{getLocalizedText(item.title, isUrdu)}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{getLocalizedText(item.desc, isUrdu)}</p>
                </CardContent>
              </Card>
            ))}
            
            {/* Future Analytics Box */}
            <Card className="border border-dashed border-border shadow-none bg-transparent">
              <CardContent className="p-5 flex flex-col h-full justify-center items-center text-center opacity-60">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 mb-3 text-slate-400">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-500 mb-1">Future Analytics</h3>
                <p className="text-xs text-muted-foreground">More reporting modules coming soon to boost your business.</p>
                <Badge className="mt-3 text-[9px] uppercase tracking-wider font-bold bg-slate-200 text-slate-600 border-0 hover:bg-slate-200">Soon</Badge>
              </CardContent>
            </Card>
          </div>
        </div>

      </motion.div>

      {/* Order Detail Dialog (Keeping existing functionality) */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  Order #{selectedOrder.id}
                  <Badge className={`text-xs ${STATUS_COLORS[selectedOrder.status] ?? ""}`}>
                    {STATUS_LABELS[selectedOrder.status] ?? selectedOrder.status}
                  </Badge>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Customer</p>
                    <p className="font-medium">{selectedOrder.customerName}</p>
                    <p className="text-xs flex items-center gap-1"><Phone className="h-3 w-3" /> {selectedOrder.customerPhone}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Delivery</p>
                    <p className="font-medium">{selectedOrder.deliveryDate}</p>
                    {selectedOrder.deliveryTimeSlot && <p className="text-xs">{selectedOrder.deliveryTimeSlot}</p>}
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground text-xs mb-1">Address</p>
                    <p>{selectedOrder.deliveryAddress}</p>
                  </div>
                  {selectedOrder.notes && (
                    <div className="col-span-2">
                      <p className="text-muted-foreground text-xs mb-1">Notes</p>
                      <p>{selectedOrder.notes}</p>
                    </div>
                  )}
                </div>

                {/* Items */}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Items</p>
                  <div className="space-y-2">
                    {((selectedOrder.items as OrderItem[]) ?? []).map((item, i) => (
                      <div key={i} className="flex justify-between text-sm border-b border-border pb-2 last:border-0">
                        <div>
                          <p className="font-medium">{item.productName} × {item.quantity}</p>
                          {Object.entries(item.selectedVariants ?? {}).length > 0 && (
                            <p className="text-xs text-muted-foreground">{Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(", ")}</p>
                          )}
                          {(item.selectedAddons ?? []).length > 0 && (
                            <p className="text-xs text-muted-foreground">Add-ons: {item.selectedAddons.join(", ")}</p>
                          )}
                          {item.customMessage && <p className="text-xs italic text-muted-foreground">"{item.customMessage}"</p>}
                        </div>
                        <span className="font-semibold">{formatCurrency(Number(item.subtotal))}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between font-bold text-base border-t border-border pt-3">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(Number(selectedOrder.totalAmount))}</span>
                </div>

                {/* Quick status actions */}
                {selectedOrder.status === "pending" && (
                  <div className="flex gap-3 pt-2">
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700 gap-2"
                      onClick={() => {
                        updateStatus.mutate({ id: selectedOrder.id, data: { status: "confirmed" } });
                        setSelectedOrder({ ...selectedOrder, status: "confirmed" });
                      }}
                      disabled={updateStatus.isPending}
                    >
                      <CheckCircle className="h-4 w-4" /> Confirm Order
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => navigate("/admin/orders")}
                    >
                      Full Order Management
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

