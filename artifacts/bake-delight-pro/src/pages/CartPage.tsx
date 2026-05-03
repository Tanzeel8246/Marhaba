import { useState } from "react";
import { Link } from "wouter";
import { useCartStore } from "@/stores/cart";
import { useValidateCoupon, useListBlackoutDates, useCheckDeliveryCapacity, getCheckDeliveryCapacityQueryKey, useCreateOrder } from "@workspace/api-client-react";
import { StorefrontLayout } from "@/components/StorefrontLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Trash2, ShoppingBag, Minus, Plus, Tag, MessageCircle } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { addDays, format, isBefore } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";

const checkoutSchema = z.object({
  customerName: z.string().min(1, "Name required"),
  customerPhone: z.string().min(1, "Phone required"),
  customerEmail: z.string().email().optional().or(z.literal("")),
  deliveryAddress: z.string().min(1, "Address required"),
  deliveryDate: z.string().min(1, "Delivery date required"),
  deliveryTimeSlot: z.string().optional(),
  notes: z.string().optional(),
});

const TIME_SLOTS = ["9:00 AM - 12:00 PM", "12:00 PM - 3:00 PM", "3:00 PM - 6:00 PM", "6:00 PM - 9:00 PM"];

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, total } = useCartStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number } | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const { data: blackoutDates } = useListBlackoutDates();
  const blackoutSet = new Set((blackoutDates ?? []).map((b) => b.date));

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { customerName: "", customerPhone: "", customerEmail: "", deliveryAddress: "", deliveryDate: "", deliveryTimeSlot: "", notes: "" },
  });

  const selectedDate = form.watch("deliveryDate");
  const selectedTimeSlot = form.watch("deliveryTimeSlot");

  const { data: capacity } = useCheckDeliveryCapacity(
    { date: selectedDate, timeSlot: selectedTimeSlot || undefined },
    { query: { queryKey: getCheckDeliveryCapacityQueryKey({ date: selectedDate }), enabled: !!selectedDate } }
  );

  const validateCoupon = useValidateCoupon({
    mutation: {
      onSuccess: (data) => {
        if (data.valid) {
          setAppliedCoupon({ code: couponCode.toUpperCase(), discountAmount: data.discountAmount });
          toast({ title: "Coupon applied!", description: data.message });
        } else {
          toast({ title: "Invalid coupon", description: data.message, variant: "destructive" });
        }
      },
    },
  });

  const createOrder = useCreateOrder({
    mutation: {
      onSuccess: () => {
        setOrderPlaced(true);
        clearCart();
        queryClient.invalidateQueries();
      },
      onError: (err: { response?: { data?: { error?: string } } }) => {
        toast({ title: "Order failed", description: err?.response?.data?.error ?? "Please try again.", variant: "destructive" });
      },
    },
  });

  const subtotal = total();
  const discount = appliedCoupon?.discountAmount ?? 0;
  const grandTotal = subtotal - discount;

  const minDate = format(addDays(new Date(), 1), "yyyy-MM-dd");

  const isDateDisabled = (dateStr: string) => {
    if (blackoutSet.has(dateStr)) return true;
    const date = new Date(dateStr);
    return isBefore(date, addDays(new Date(), 0.99));
  };

  const generateWhatsappMessage = (orderData: z.infer<typeof checkoutSchema>) => {
    const lines = [
      "🎂 *New Order - Bake Delight Pro*",
      "",
      `*Customer:* ${orderData.customerName}`,
      `*Phone:* ${orderData.customerPhone}`,
      orderData.customerEmail ? `*Email:* ${orderData.customerEmail}` : null,
      "",
      "*Order Items:*",
      ...items.map((item) => {
        const variants = Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(", ");
        const addons = item.selectedAddons.join(", ");
        return [
          `• ${item.productName} × ${item.quantity} = Rs. ${Math.round(item.subtotal).toLocaleString("en-US")}`,
          variants ? `  Variants: ${variants}` : null,
          addons ? `  Add-ons: ${addons}` : null,
          item.customMessage ? `  Message: "${item.customMessage}"` : null,
          item.productImageUrl ? `  Image: ${item.productImageUrl}` : null,
        ].filter(Boolean).join("\n");
      }),
      "",
      `*Subtotal:* Rs. ${Math.round(subtotal).toLocaleString("en-US")}`,
      appliedCoupon ? `*Discount (${appliedCoupon.code}):* -Rs. ${Math.round(discount).toLocaleString("en-US")}` : null,
      `*Total:* Rs. ${Math.round(grandTotal).toLocaleString("en-US")}`,
      "",
      `*Delivery Date:* ${orderData.deliveryDate}`,
      orderData.deliveryTimeSlot ? `*Time Slot:* ${orderData.deliveryTimeSlot}` : null,
      `*Address:* ${orderData.deliveryAddress}`,
      orderData.notes ? `*Notes:* ${orderData.notes}` : null,
    ].filter(Boolean).join("\n");
    return lines;
  };

  const onSubmit = async (data: z.infer<typeof checkoutSchema>) => {
    if (isDateDisabled(data.deliveryDate)) {
      toast({ title: "Date unavailable", description: "Please select a different delivery date.", variant: "destructive" });
      return;
    }
    if (capacity && !capacity.available) {
      toast({ title: "No capacity", description: "This date is fully booked. Please choose another.", variant: "destructive" });
      return;
    }

    const msg = generateWhatsappMessage(data);
    const waUrl = `https://wa.me/1234567890?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");

    createOrder.mutate({
      data: {
        ...data,
        customerEmail: data.customerEmail || null,
        deliveryTimeSlot: data.deliveryTimeSlot || null,
        notes: data.notes || null,
        couponCode: appliedCoupon?.code ?? null,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          selectedVariants: item.selectedVariants,
          selectedAddons: item.selectedAddons,
          customMessage: item.customMessage ?? null,
        })),
      },
    });
  };

  if (orderPlaced) {
    return (
      <StorefrontLayout>
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <div className="text-5xl mb-6">🎉</div>
          <h1 className="text-2xl font-serif font-bold mb-3">Order Sent!</h1>
          <p className="text-muted-foreground mb-6">Your order has been sent via WhatsApp. We'll confirm it shortly!</p>
          <Link href="/shop"><Button size="lg">Continue Shopping</Button></Link>
        </div>
      </StorefrontLayout>
    );
  }

  if (!items.length) {
    return (
      <StorefrontLayout>
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
          <h1 className="text-2xl font-serif font-bold mb-3">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add some delicious treats to get started.</p>
          <Link href="/shop"><Button size="lg">Shop Now</Button></Link>
        </div>
      </StorefrontLayout>
    );
  }

  return (
    <StorefrontLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-serif font-bold mb-8">Your Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items + form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <Card>
              <CardContent className="p-4 divide-y divide-border">
                {items.map((item, i) => (
                  <div key={i} className="py-4 flex gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                      {item.productImageUrl ? (
                        <img src={item.productImageUrl} alt={item.productName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary/30 to-accent/30">
                          <ShoppingBag className="h-8 w-8 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{item.productName}</p>
                      {Object.entries(item.selectedVariants).length > 0 && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(", ")}
                        </p>
                      )}
                      {item.selectedAddons.length > 0 && (
                        <p className="text-xs text-muted-foreground">Add-ons: {item.selectedAddons.join(", ")}</p>
                      )}
                      {item.customMessage && (
                        <p className="text-xs text-muted-foreground italic">"{item.customMessage}"</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 border rounded-lg p-0.5">
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(i, item.quantity - 1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(i, item.quantity + 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm">{formatCurrency(item.subtotal)}</span>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeItem(i)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Customer form */}
            <Card>
              <CardHeader><CardTitle className="text-lg">Delivery Details</CardTitle></CardHeader>
              <CardContent>
                <Form {...form}>
                  <form id="checkout-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="customerName" render={({ field }) => (
                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Your name" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="customerPhone" render={({ field }) => (
                        <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="+92 300 0000000" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="customerEmail" render={({ field }) => (
                      <FormItem><FormLabel>Email (optional)</FormLabel><FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="deliveryAddress" render={({ field }) => (
                      <FormItem><FormLabel>Delivery Address</FormLabel><FormControl><Textarea placeholder="Full delivery address" rows={2} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="deliveryDate" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Date</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              min={minDate}
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                if (isDateDisabled(e.target.value)) {
                                  toast({ title: "Date unavailable", description: "That date is blacked out or too soon.", variant: "destructive" });
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                          {selectedDate && capacity && !capacity.available && (
                            <p className="text-xs text-destructive">This date is fully booked ({capacity.isBlackout ? "blackout" : "at capacity"})</p>
                          )}
                          {selectedDate && capacity && capacity.available && (
                            <p className="text-xs text-green-600">{capacity.remainingSlots} slots remaining</p>
                          )}
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="deliveryTimeSlot" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time Slot (optional)</FormLabel>
                          <FormControl>
                            <select {...field} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                              <option value="">Any time</option>
                              {TIME_SLOTS.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                            </select>
                          </FormControl>
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="notes" render={({ field }) => (
                      <FormItem><FormLabel>Order Notes (optional)</FormLabel><FormControl><Textarea placeholder="Any special instructions..." rows={2} {...field} /></FormControl></FormItem>
                    )} />
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Order summary */}
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-lg">Order Summary</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center gap-1"><Tag className="h-3 w-3" />{appliedCoupon.code}</span>
                      <span>-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(grandTotal)}</span>
                  </div>
                </div>

                {/* Coupon */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Coupon Code</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="SAVE10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => validateCoupon.mutate({ data: { code: couponCode, orderAmount: subtotal } })}
                      disabled={!couponCode || validateCoupon.isPending}
                    >
                      Apply
                    </Button>
                  </div>
                  {appliedCoupon && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <Badge variant="outline" className="text-green-600 border-green-300">{appliedCoupon.code}</Badge> applied!
                      <button onClick={() => setAppliedCoupon(null)} className="text-muted-foreground hover:text-foreground ml-1">×</button>
                    </p>
                  )}
                </div>

                <Button
                  form="checkout-form"
                  type="submit"
                  className="w-full gap-2"
                  size="lg"
                  disabled={createOrder.isPending}
                  data-testid="button-checkout"
                >
                  <MessageCircle className="h-5 w-5" />
                  {createOrder.isPending ? "Sending..." : "Checkout via WhatsApp"}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  This will open WhatsApp with your order details pre-filled.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
