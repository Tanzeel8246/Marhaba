import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { StorefrontLayout } from "@/components/StorefrontLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, Clock, CheckCircle2, XCircle, ShoppingBag, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { formatCurrency } from "@/lib/currency";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface Order {
  id: number;
  customerName: string;
  totalAmount: string;
  status: string;
  deliveryDate: string;
  createdAt: string;
  items: any[];
}

export default function OrderHistoryPage() {
  const [, navigate] = useLocation();
  const { isUrdu } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.authenticated) {
          setUser(data.user);
          fetchOrders();
        } else {
          navigate("/auth");
        }
      } catch (err) {
        navigate("/auth");
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/auth/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200 uppercase text-[10px]">Pending</Badge>;
      case "confirmed": return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 uppercase text-[10px]">Confirmed</Badge>;
      case "preparing": return <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200 uppercase text-[10px]">Kitchen</Badge>;
      case "delivered": return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 uppercase text-[10px]">Delivered</Badge>;
      case "cancelled": return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 uppercase text-[10px]">Cancelled</Badge>;
      default: return <Badge variant="outline" className="uppercase text-[10px]">{status}</Badge>;
    }
  };

  return (
    <StorefrontLayout>
      <div className="container max-w-4xl py-12 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="ghost" onClick={() => navigate("/shop")} className="p-0 h-auto hover:bg-transparent mb-4 text-muted-foreground gap-2">
              <ArrowLeft className="h-4 w-4" /> {isUrdu ? "واپس شاپ پر جائیں" : "Back to Shop"}
            </Button>
            <h1 className="text-3xl font-serif font-bold">
              {isUrdu ? "آپ کے آرڈرز" : "Your Orders"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {user ? (isUrdu ? `خوش آمدید، ${user.name}` : `Welcome back, ${user.name}`) : "Track your orders here."}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-card/50 rounded-[3rem] border-2 border-dashed border-muted/50">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
            <h2 className="text-xl font-bold mb-2">{isUrdu ? "کوئی آرڈر نہیں ملا" : "No Orders Found"}</h2>
            <p className="text-muted-foreground mb-6">Start shopping to see your orders here.</p>
            <Button onClick={() => navigate("/shop")}>{isUrdu ? "ابھی خریداری کریں" : "Shop Now"}</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((order) => (
              <Card key={order.id} className="border-none shadow-lg overflow-hidden rounded-[2rem] bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                        <Package className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-lg">Order #{order.id}</span>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Placed on {format(new Date(order.createdAt), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right sm:text-right">
                      <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                      <p className="text-xl font-bold text-primary">{formatCurrency(Number(order.totalAmount))}</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-muted/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3 text-sm font-medium">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{isUrdu ? "ڈلیوری کی تاریخ:" : "Delivery Date:"}</span>
                      <span className="text-foreground">{format(new Date(order.deliveryDate), "MMM dd, yyyy")}</span>
                    </div>
                    <Button variant="outline" className="rounded-full text-xs font-bold uppercase tracking-wider h-9" onClick={() => navigate(`/account/orders/${order.id}`)}>
                      {isUrdu ? "تفصیلات دیکھیں" : "View Details"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
}
