import { useGetOrdersSummary, useGetAdminMe } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { ShoppingBag, DollarSign, Clock, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { format } from "date-fns";

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

export default function AdminDashboardPage() {
  const [, navigate] = useLocation();
  const { data: session, isLoading: loadingSession } = useGetAdminMe();
  const { data: summary, isLoading } = useGetOrdersSummary();

  useEffect(() => {
    if (!loadingSession && !session?.authenticated) navigate("/admin/login");
  }, [session, loadingSession]);

  const stats = [
    { label: "Total Orders", value: summary?.totalOrders ?? 0, icon: ShoppingBag, sub: `${summary?.todayOrders ?? 0} today` },
    { label: "Total Revenue", value: `$${(summary?.totalRevenue ?? 0).toFixed(2)}`, icon: DollarSign, sub: `$${(summary?.todayRevenue ?? 0).toFixed(2)} today` },
    { label: "Pending", value: summary?.pendingOrders ?? 0, icon: Clock, sub: "Needs action" },
    { label: "Status Breakdown", value: (summary?.statusBreakdown ?? []).length, icon: TrendingUp, sub: "Across all stages" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Overview of your bakery operations.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{s.label}</p>
                    {isLoading ? <Skeleton className="h-8 w-24" /> : (
                      <p className="text-2xl font-bold text-foreground">{s.value}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
                  </div>
                  <div className="bg-primary/10 rounded-lg p-2">
                    <s.icon className="h-5 w-5 text-primary" />
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
            <CardHeader>
              <CardTitle className="text-base">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                [1, 2, 3].map((i) => <Skeleton key={i} className="h-12" />)
              ) : !summary?.recentOrders?.length ? (
                <p className="text-sm text-muted-foreground text-center py-8">No orders yet.</p>
              ) : (
                summary.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(order.createdAt), "MMM d, h:mm a")} · ${Number(order.totalAmount).toFixed(2)}
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
    </AdminLayout>
  );
}
