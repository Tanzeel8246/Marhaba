import { useState } from "react";
import { useGetOrdersSummary, useListOrders, useUpdateOrderStatus, useGetAdminMe, getListOrdersQueryKey, getGetOrdersSummaryQueryKey, OrderStatus } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { ShoppingBag, Banknote, Clock, TrendingUp, Bell, CheckCircle, Eye, RefreshCw, Phone, MapPin, CalendarDays } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

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

  const stats = [
    { label: "Total Orders", value: summary?.totalOrders ?? 0, icon: ShoppingBag, sub: `${summary?.todayOrders ?? 0} آج` },
    { label: "Total Revenue", value: formatCurrency(summary?.totalRevenue ?? 0), icon: Banknote, sub: `${formatCurrency(summary?.todayRevenue ?? 0)} آج` },
    { label: "Pending Orders", value: summary?.pendingOrders ?? 0, icon: Clock, sub: "Action needed", urgent: (summary?.pendingOrders ?? 0) > 0 },
    { label: "Status Types", value: (summary?.statusBreakdown ?? []).length, icon: TrendingUp, sub: "Across all stages" },
  ];

  const lastUpdated = dataUpdatedAt ? format(new Date(dataUpdatedAt), "h:mm:ss a") : "--";

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold">Dashboard</h1>
            <p className="text-muted-foreground text-sm">بیکری آپریشنز کا جائزہ · آخری اپڈیٹ: {lastUpdated}</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => { refetch(); queryClient.invalidateQueries(); }}>
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
        </div>

        {/* ===== INCOMING ORDERS SECTION ===== */}
        <div className={`rounded-xl border-2 p-1 ${(pendingOrders?.length ?? 0) > 0 ? "border-yellow-400 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-950/20" : "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/20"}`}>
          <div className="flex items-center justify-between px-4 pt-3 pb-2">
            <div className="flex items-center gap-2">
              <Bell className={`h-5 w-5 ${(pendingOrders?.length ?? 0) > 0 ? "text-yellow-600 dark:text-yellow-400 animate-pulse" : "text-green-600 dark:text-green-400"}`} />
              <h2 className="font-bold text-base">
                {(pendingOrders?.length ?? 0) > 0
                  ? `نئے آرڈرز — ${pendingOrders!.length} آرڈر pending`
                  : "کوئی نیا آرڈر نہیں — سب صاف ✅"}
              </h2>
              {(pendingOrders?.length ?? 0) > 0 && (
                <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                  {pendingOrders!.length} NEW
                </span>
              )}
            </div>
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate("/admin/orders")}>
              تمام آرڈرز دیکھیں →
            </Button>
          </div>

          {loadingPending ? (
            <div className="p-4 space-y-2">{[1, 2].map((i) => <Skeleton key={i} className="h-16" />)}</div>
          ) : !pendingOrders?.length ? (
            <div className="px-4 pb-4 text-sm text-muted-foreground">
              تمام آرڈرز process ہو چکے ہیں۔ Auto-refresh ہر 30 سیکنڈ میں ہوتا ہے۔
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {pendingOrders.map((order) => (
                <div key={order.id} className="bg-background rounded-lg border border-border p-3 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-muted-foreground">#{order.id}</span>
                      <p className="font-semibold text-sm">{order.customerName}</p>
                      <Badge className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Pending</Badge>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {order.customerPhone}</span>
                      <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {order.deliveryDate}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {(order.deliveryAddress as string).slice(0, 40)}{(order.deliveryAddress as string).length > 40 ? "…" : ""}</span>
                    </div>
                    <p className="text-xs mt-1">
                      <span className="font-semibold text-primary">{formatCurrency(Number(order.totalAmount))}</span>
                      <span className="text-muted-foreground ml-2">· {format(new Date(order.createdAt), "MMM d, h:mm a")}</span>
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      className="gap-1.5 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => updateStatus.mutate({ id: order.id, data: { status: "confirmed" } })}
                      disabled={updateStatus.isPending}
                    >
                      <CheckCircle className="h-3.5 w-3.5" /> Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => setSelectedOrder(order as OrderData)}
                    >
                      <Eye className="h-3.5 w-3.5" /> View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <Card key={i} className={s.urgent ? "border-yellow-400 dark:border-yellow-600" : ""}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{s.label}</p>
                    {isLoading ? <Skeleton className="h-8 w-24" /> : (
                      <p className={`text-2xl font-bold ${s.urgent ? "text-yellow-600 dark:text-yellow-400" : "text-foreground"}`}>{s.value}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
                  </div>
                  <div className={`rounded-lg p-2 ${s.urgent ? "bg-yellow-100 dark:bg-yellow-900/30" : "bg-primary/10"}`}>
                    <s.icon className={`h-5 w-5 ${s.urgent ? "text-yellow-600 dark:text-yellow-400" : "text-primary"}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Orders by Status</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-48" /> : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={summary?.statusBreakdown ?? []}>
                    <XAxis dataKey="status" tick={{ fontSize: 11 }} tickFormatter={(v) => STATUS_LABELS[v]?.split(" ")[0] ?? v} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => [v, "Orders"]} labelFormatter={(l) => STATUS_LABELS[l] ?? l} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {(summary?.statusBreakdown ?? []).map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Recent orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">حالیہ آرڈرز</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate("/admin/orders")}>
                تمام دیکھیں
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                [1, 2, 3].map((i) => <Skeleton key={i} className="h-12" />)
              ) : !summary?.recentOrders?.length ? (
                <p className="text-sm text-muted-foreground text-center py-8">ابھی کوئی آرڈر نہیں۔</p>
              ) : (
                summary.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0 cursor-pointer hover:bg-muted/30 rounded px-1 -mx-1 transition-colors"
                    onClick={() => setSelectedOrder(order as OrderData)}
                  >
                    <div>
                      <p className="text-sm font-medium">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(order.createdAt), "MMM d, h:mm a")} · {formatCurrency(Number(order.totalAmount))}
                      </p>
                    </div>
                    <Badge className={`text-xs ${STATUS_COLORS[order.status] ?? ""}`}>
                      {STATUS_LABELS[order.status] ?? order.status}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Order detail dialog */}
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
