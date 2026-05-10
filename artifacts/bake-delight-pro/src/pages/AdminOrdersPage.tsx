import { useState } from "react";
import { useListOrders, useUpdateOrderStatus, useGetAdminMe, getListOrdersQueryKey, OrderStatus } from "@workspace/api-client-react";
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
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, List, Phone, MapPin, CalendarDays, Clock, ShoppingBag, MessageCircle, FileText } from "lucide-react";
import { useLanguage, getLocalizedText } from "@/lib/i18n/LanguageContext";

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
  const { isUrdu } = useLanguage();
  const [, navigate] = useLocation();
  const { data: session, isLoading: loadingSession } = useGetAdminMe();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "kanban">("kanban");
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (!loadingSession && !session?.authenticated) navigate("/admin/login");
  }, [session, loadingSession]);

  const params = statusFilter !== "all" ? { status: statusFilter as OrderStatus } : {};
  const { data: orders, isLoading } = useListOrders(params, {
    query: { queryKey: getListOrdersQueryKey(params) },
  });

  const updateStatus = useUpdateOrderStatus({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries();
        toast({ title: "Status updated successfully" });
      },
    },
  });

  const handleDragStart = (e: React.DragEvent, orderId: number) => {
    e.dataTransfer.setData("orderId", orderId.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const orderId = e.dataTransfer.getData("orderId");
    if (orderId) {
      updateStatus.mutate({ id: parseInt(orderId), data: { status: newStatus } });
    }
  };

  const kanbanColumns = [...STATUS_STEPS, "cancelled"];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold tracking-tight">{getLocalizedText("Orders | آرڈرز", isUrdu)}</h1>
            <p className="text-sm text-muted-foreground mt-1">{getLocalizedText("Manage and track all customer orders. | تمام کسٹمرز کے آرڈرز کا انتظام اور ٹریک کریں۔", isUrdu)}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-muted p-1 rounded-lg">
              <button
                onClick={() => setViewMode("kanban")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${viewMode === "kanban" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <LayoutGrid className="w-4 h-4" /> {getLocalizedText("Kanban | کنبان", isUrdu)}
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${viewMode === "list" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <List className="w-4 h-4" /> {getLocalizedText("List | فہرست", isUrdu)}
              </button>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44 bg-background">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                {Object.entries(STATUS_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-64 rounded-xl" />)}
          </div>
        ) : !orders?.length ? (
          <Card className="border-dashed shadow-none">
            <CardContent className="py-16 text-center">
              <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-lg font-medium text-muted-foreground">No orders found.</p>
              <p className="text-sm text-muted-foreground mt-1">Wait for new orders to arrive.</p>
            </CardContent>
          </Card>
        ) : viewMode === "kanban" ? (
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
            {kanbanColumns.map(status => {
              const colOrders = orders.filter(o => o.status === status);
              return (
                <div 
                  key={status} 
                  className="min-w-[320px] max-w-[320px] flex-shrink-0 bg-muted/30 dark:bg-muted/10 rounded-xl p-3 border border-border/50 snap-start"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, status)}
                >
                  <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[status]?.split(' ')[0] || 'bg-gray-400'}`} />
                      {STATUS_LABELS[status] || status}
                    </h3>
                    <Badge variant="secondary" className="rounded-full text-xs font-mono">{colOrders.length}</Badge>
                  </div>
                  <div className="space-y-3 min-h-[150px]">
                    <AnimatePresence>
                      {colOrders.map(order => (
                        <motion.div
                          key={order.id}
                          layoutId={`order-${order.id}`}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          draggable
                          onDragStart={(e: any) => handleDragStart(e, order.id)}
                          onClick={() => setSelectedOrder(order as OrderData)}
                          className={`bg-background rounded-lg p-4 border shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md hover:border-primary/30 transition-all ${order.status === 'pending' ? 'border-yellow-200 dark:border-yellow-900/50' : 'border-border'}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-mono text-xs text-muted-foreground">#{order.id}</span>
                            <span className="font-semibold text-sm text-primary">{formatCurrency(Number(order.totalAmount))}</span>
                          </div>
                          <p className="font-medium text-sm mb-1">{order.customerName}</p>
                          <div className="space-y-1 mt-3">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <CalendarDays className="w-3.5 h-3.5" />
                              <span>{order.deliveryDate}</span>
                            </div>
                            {order.deliveryTimeSlot && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{order.deliveryTimeSlot}</span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {colOrders.length === 0 && (
                      <div className="h-full flex items-center justify-center text-xs text-muted-foreground/50 border-2 border-dashed border-border rounded-lg py-8">
                        Drop orders here
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Card className="backdrop-blur-xl bg-background/80 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider">
                      <th className="px-4 py-4 font-medium">Order</th>
                      <th className="px-4 py-4 font-medium">Customer</th>
                      <th className="px-4 py-4 font-medium">Delivery Date</th>
                      <th className="px-4 py-4 font-medium">Total</th>
                      <th className="px-4 py-4 font-medium">Status</th>
                      <th className="px-4 py-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-muted/40 transition-colors group">
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">#{order.id}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3" /> {order.customerPhone}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5 text-muted-foreground" /> {order.deliveryDate}</p>
                          {order.deliveryTimeSlot && <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5"><Clock className="w-3.5 h-3.5" /> {order.deliveryTimeSlot}</p>}
                        </td>
                        <td className="px-4 py-3 font-semibold text-primary">{formatCurrency(Number(order.totalAmount))}</td>
                        <td className="px-4 py-3">
                          <Badge className={`text-xs ${STATUS_COLORS[order.status] ?? ""}`}>
                            {STATUS_LABELS[order.status] ?? order.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order as OrderData)} className="hover:bg-primary/10 hover:text-primary">View Details</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
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

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full gap-2 border-green-500/30 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20"
                    onClick={() => {
                      const msg = encodeURIComponent(`Hi ${selectedOrder.customerName}, your Marhaba Bakers order #${selectedOrder.id} status is now: ${STATUS_LABELS[selectedOrder.status]}.`);
                      window.open(`https://wa.me/${selectedOrder.customerPhone.replace(/[^0-9]/g,'')}?text=${msg}`, '_blank');
                    }}
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp Notify
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full gap-2"
                    onClick={() => window.print()}
                  >
                    <FileText className="w-4 h-4" /> Print Invoice
                  </Button>
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
