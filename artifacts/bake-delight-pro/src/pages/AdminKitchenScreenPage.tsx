import { useState, useMemo, useEffect, useRef } from "react";
import { useListOrders } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChefHat, CheckCircle2, Clock, Timer, MessageCircle } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { format, formatDistanceToNow } from "date-fns";
import { useLanguage, getLocalizedText } from "@/lib/i18n/LanguageContext";

export default function AdminKitchenScreenPage() {
  const { isUrdu } = useLanguage();
  const { data: orders, isLoading } = useListOrders();
  
  // Kitchen screen focuses on pending and processing orders for today/tomorrow
  const kitchenOrders = useMemo(() => {
    if (!orders) return [];
    return orders
      .filter((o) => o.status === "pending" || o.status === "processing")
      .sort((a, b) => new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime());
  }, [orders]);

  // Sound Alert Logic
  const prevCountRef = useRef(kitchenOrders.length);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
    }

    const currentPending = kitchenOrders.filter(o => o.status === "pending").length;
    if (currentPending > prevCountRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play blocked by browser", e));
    }
    prevCountRef.current = currentPending;
  }, [kitchenOrders]);

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold tracking-tight">{getLocalizedText("Kitchen Screen | کچن اسکرین", isUrdu)}</h1>
            <p className="text-muted-foreground mt-1 text-sm">{getLocalizedText("Live order ticketing system for production. | پیداوار کے لیے لائیو آرڈر ٹکٹنگ سسٹم۔", isUrdu)}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Live Updates Active | لائیو اپڈیٹس فعال
            </div>
            <div className="bg-background border rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm">
              <span className="text-muted-foreground">{getLocalizedText("Pending Tickets | زیر التوا ٹکٹ", isUrdu)}: </span>
              <span className="text-foreground">{kitchenOrders.length}</span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="h-16 bg-muted/50 rounded-t-xl" />
                <CardContent className="h-48" />
              </Card>
            ))}
          </div>
        ) : kitchenOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-card rounded-[2rem] border border-border shadow-sm text-center">
            <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
              <ChefHat className="h-10 w-10 text-muted-foreground/30" />
            </div>
            <h2 className="text-2xl font-serif font-bold mb-2">{getLocalizedText("Kitchen is Clear | کچن صاف ہے", isUrdu)}</h2>
            <p className="text-muted-foreground">{getLocalizedText("No active orders need preparation right now. | فی الحال کسی آرڈر کو تیاری کی ضرورت نہیں ہے۔", isUrdu)}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
            {kitchenOrders.map((order) => (
              <Card key={order.id} className={`overflow-hidden border-2 transition-all ${order.status === 'processing' ? 'border-primary shadow-md' : 'border-border'}`}>
                <CardHeader className={`p-4 border-b ${order.status === 'processing' ? 'bg-primary/5' : 'bg-muted/30'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="font-mono text-xs font-bold border-foreground/20">
                      #{order.id.toString().padStart(4, "0")}
                    </Badge>
                    <Badge variant={order.status === "processing" ? "default" : "secondary"} className="uppercase tracking-widest text-[9px] font-bold">
                      {order.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold truncate">{order.customerName}</span>
                    <span className="text-muted-foreground flex items-center gap-1 text-xs shrink-0">
                      <Clock className="w-3 h-3" />
                      {format(new Date(order.createdAt), "h:mm a")}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-0 divide-y divide-border">
                  <div className="p-4 bg-yellow-50/50 dark:bg-yellow-950/10 flex items-center gap-2 text-xs">
                    <Timer className="w-4 h-4 text-yellow-600 shrink-0" />
                    <span className="font-medium text-yellow-800 dark:text-yellow-200">
                      Delivery: {order.deliveryDate} {order.deliveryTimeSlot && `(${order.deliveryTimeSlot})`}
                    </span>
                  </div>
                  <div className="p-4 space-y-4">
                    {order.items && Array.isArray(order.items) && order.items.map((item: any, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-6 h-6 rounded bg-muted flex items-center justify-center text-xs font-bold shrink-0">
                          {item.quantity}x
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm leading-tight">{item.productName}</p>
                          {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                            <p className="text-[10px] text-muted-foreground mt-1">
                              {Object.entries(item.selectedVariants).map(([k,v]) => `${k}: ${v}`).join(", ")}
                            </p>
                          )}
                          {item.selectedAddons && item.selectedAddons.length > 0 && (
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              Addons: {item.selectedAddons.join(", ")}
                            </p>
                          )}
                          {item.customMessage && (
                            <div className="flex items-start gap-1.5 mt-2 bg-blue-50 dark:bg-blue-950/30 p-2 rounded-md border border-blue-100 dark:border-blue-900">
                              <MessageCircle className="w-3 h-3 text-blue-500 mt-0.5 shrink-0" />
                              <p className="text-xs text-blue-700 dark:text-blue-300 italic font-medium">"{item.customMessage}"</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {order.notes && (
                    <div className="p-4 bg-muted/20">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Customer Notes</p>
                      <p className="text-sm font-medium">{order.notes}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="p-4 bg-muted/10 border-t">
                  <Button className="w-full gap-2 text-xs font-bold uppercase tracking-widest" variant={order.status === "processing" ? "default" : "outline"}>
                    <CheckCircle2 className="w-4 h-4" />
                    {order.status === "pending" ? getLocalizedText("Start Preparing | تیاری شروع کریں", isUrdu) : getLocalizedText("Mark as Ready | تیار قرار دیں", isUrdu)}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
