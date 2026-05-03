import { useState } from "react";
import { useListOrders, useUpdateOrderStatus, useGetAdminMe, getListOrdersQueryKey } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/currency";

const STATUS_STEPS = ["pending","confirmed","in_baking","out_for_delivery","completed"] as const;
const STATUS_LABELS: Record<string, string> = {
  pending: "Pending", confirmed: "Confirmed", in_baking: "In Baking",
  out_for_delivery: "Out for Delivery", completed: "Completed", cancelled: "Cancelled",
};
const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  in_baking: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  out_for_delivery: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

interface OrderItem { productName: string; quantity: number; unitPrice: number; selectedVariants: Record<string, string>; selectedAddons: string[]; customMessage?: string | null; subtotal: number }
type OrderData = { id: number; customerName: string; customerPhone: string; customerEmail?: string | null; deliveryDate: string; deliveryTimeSlot?: string | null; status: string; items: unknown; totalAmount: string | number; subtotal: string | number; discountAmount: string | number; couponCode?: string | null; deliveryAddress: string; notes?: string | null; createdAt: string }

export default function AdminOrdersPage() {
  const [, navigate] = useLocation();
  const { data: session, isLoading: loadingSession } = useGetAdminMe();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (!loadingSession && !session?.authenticated) navigate("/admin/login");
  }, [session, loadingSession]);

  const params = statusFilter !== "all" ? { status: statusFilter } : {};
  const { data: orders, isLoading } = useListOrders(params, {
    query: { queryKey: getListOrdersQueryKey(params) },
  });

  const updateStatus = useUpdateOrderStatus({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries();
        toast({ title: "Status updated" });
      },
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold">Orders</h1>
            <p className="text-sm text-muted-foreground">Manage and track all customer orders.</p>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              {Object.entries(STATUS_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 space-y-3">{[1,2,3].map(i=><Skeleton key={i} className="h-16"/>)}</div>
            ) : !orders?.length ? (
              <div className="py-12 text-center text-muted-foreground text-sm">No orders found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border">
                    <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider">
                      <th className="px-4 py-3">Order</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Delivery Date</th>
                      <th className="px-4 py-3">Total</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-muted/40 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">#{order.id}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p>{order.deliveryDate}</p>
                          {order.deliveryTimeSlot && <p className="text-xs text-muted-foreground">{order.deliveryTimeSlot}</p>}
                        </td>
                        <td className="px-4 py-3 font-semibold">{formatCurrency(Number(order.totalAmount))}</td>
                        <td className="px-4 py-3">
                          <Badge className={`text-xs ${STATUS_COLORS[order.status] ?? ""}`}>
                            {STATUS_LABELS[order.status] ?? order.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order as OrderData)}>View</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order detail dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Order #{selectedOrder.id}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-muted-foreground text-xs">Customer</p><p className="font-medium">{selectedOrder.customerName}</p><p className="text-xs">{selectedOrder.customerPhone}</p></div>
                  <div><p className="text-muted-foreground text-xs">Delivery</p><p className="font-medium">{selectedOrder.deliveryDate}</p>{selectedOrder.deliveryTimeSlot && <p className="text-xs">{selectedOrder.deliveryTimeSlot}</p>}</div>
                  <div className="col-span-2"><p className="text-muted-foreground text-xs">Address</p><p>{selectedOrder.deliveryAddress}</p></div>
                  {selectedOrder.notes && <div className="col-span-2"><p className="text-muted-foreground text-xs">Notes</p><p>{selectedOrder.notes}</p></div>}
                </div>

                {/* Status timeline */}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Status Workflow</p>
                  <div className="flex items-center gap-1 flex-wrap">
                    {STATUS_STEPS.map((step, i) => {
                      const currentIdx = STATUS_STEPS.indexOf(selectedOrder.status as typeof STATUS_STEPS[number]);
                      const isPast = i <= currentIdx;
                      return (
                        <div key={step} className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              updateStatus.mutate({ id: selectedOrder.id, data: { status: step } });
                              setSelectedOrder({ ...selectedOrder, status: step });
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                              isPast ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                          >
                            {STATUS_LABELS[step]}
                          </button>
                          {i < STATUS_STEPS.length - 1 && <div className={`w-4 h-0.5 ${i < currentIdx ? "bg-primary" : "bg-border"}`} />}
                        </div>
                      );
                    })}
                    <button
                      onClick={() => { updateStatus.mutate({ id: selectedOrder.id, data: { status: "cancelled" } }); setSelectedOrder({ ...selectedOrder, status: "cancelled" }); }}
                      className={`ml-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        selectedOrder.status === "cancelled" ? "bg-destructive text-destructive-foreground" : "bg-muted text-muted-foreground hover:bg-destructive/10"
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
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
                            <p className="text-xs text-muted-foreground">{Object.entries(item.selectedVariants).map(([k,v])=>`${k}: ${v}`).join(", ")}</p>
                          )}
                          {(item.selectedAddons ?? []).length > 0 && <p className="text-xs text-muted-foreground">Add-ons: {item.selectedAddons.join(", ")}</p>}
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
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
