import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useGetOrdersCalendar, useGetAdminMe, getGetOrdersCalendarQueryKey } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, getDay } from "date-fns";
import { formatCurrency } from "@/lib/currency";

const STATUS_LABELS: Record<string, string> = { pending: "Pending", confirmed: "Confirmed", in_baking: "In Baking", out_for_delivery: "Out for Delivery", completed: "Completed", cancelled: "Cancelled" };

type Order = { id: number; customerName: string; status: string; totalAmount: string | number; deliveryTimeSlot?: string | null }

export default function AdminCalendarPage() {
  const [, navigate] = useLocation();
  const { data: session, isLoading: loadingSession } = useGetAdminMe();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<{ date: string; orders: Order[] } | null>(null);

  useEffect(() => {
    if (!loadingSession && !session?.authenticated) navigate("/admin/login");
  }, [session, loadingSession]);

  const month = format(currentDate, "yyyy-MM");
  const { data: calendar } = useGetOrdersCalendar({ month }, { query: { queryKey: getGetOrdersCalendarQueryKey({ month }) } });

  const ordersByDate = Object.fromEntries((calendar ?? []).map(e => [e.date, e]));

  const monthStart = startOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: endOfMonth(currentDate) });
  const firstDayOfWeek = getDay(monthStart);

  const prev = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const next = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-serif font-bold">Delivery Calendar</h1><p className="text-sm text-muted-foreground">View orders by delivery date.</p></div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prev}><ChevronLeft className="h-4 w-4"/></Button>
            <span className="font-semibold w-32 text-center">{format(currentDate, "MMMM yyyy")}</span>
            <Button variant="outline" size="icon" onClick={next}><ChevronRight className="h-4 w-4"/></Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-7 gap-1 mb-1">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
                <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`empty-${i}`} />)}
              {days.map(day => {
                const dateStr = format(day, "yyyy-MM-dd");
                const entry = ordersByDate[dateStr];
                const today = isToday(day);
                const inMonth = isSameMonth(day, currentDate);
                return (
                  <button
                    key={dateStr}
                    onClick={() => entry && setSelectedDay({ date: dateStr, orders: entry.orders as Order[] })}
                    className={`min-h-[70px] p-2 rounded-lg border text-left transition-all ${
                      today ? "border-primary bg-primary/5" :
                      entry ? "border-border hover:border-primary/50 cursor-pointer bg-card" :
                      "border-transparent bg-transparent cursor-default"
                    } ${!inMonth ? "opacity-30" : ""}`}
                  >
                    <span className={`text-sm font-medium ${today ? "text-primary" : ""}`}>{format(day, "d")}</span>
                    {entry && (
                      <div className="mt-1">
                        <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
                          {entry.orderCount} order{entry.orderCount !== 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedDay} onOpenChange={() => setSelectedDay(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Orders for {selectedDay?.date}</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            {selectedDay?.orders.map(order => (
              <div key={order.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <p className="font-medium text-sm">{order.customerName}</p>
                  <p className="text-xs text-muted-foreground">{order.deliveryTimeSlot ?? "Any time"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{formatCurrency(Number(order.totalAmount))}</span>
                  <Badge className="text-xs">{STATUS_LABELS[order.status] ?? order.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
