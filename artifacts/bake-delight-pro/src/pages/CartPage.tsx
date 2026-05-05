import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
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
import { Trash2, ShoppingBag, Minus, Plus, Tag, MessageCircle, CheckCircle2, ArrowLeft, AlertCircle, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { addDays, format, isBefore } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "نام کم از کم 2 حروف کا ہونا چاہیے"),
  customerPhone: z.string().min(10, "صحیح فون نمبر درج کریں"),
  customerEmail: z.string().email("صحیح ای میل درج کریں").optional().or(z.literal("")),
  deliveryAddress: z.string().min(10, "مکمل پتہ درج کریں"),
  deliveryDate: z.string().min(1, "ڈیلیوری کی تاریخ منتخب کریں"),
  deliveryTimeSlot: z.string().optional(),
  notes: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

const TIME_SLOTS = [
  "9:00 AM - 12:00 PM",
  "12:00 PM - 3:00 PM",
  "3:00 PM - 6:00 PM",
  "6:00 PM - 9:00 PM",
];

const STEPS = ["Cart", "Details", "Confirm"] as const;

export default function CartPage() {
  const [, navigate] = useLocation();
  const { items, removeItem, updateQuantity, clearCart, total } = useCartStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number } | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderData, setPlacedOrderData] = useState<CheckoutForm | null>(null);
  const [whatsappNumber, setWhatsappNumber] = useState("923001234567");

  useEffect(() => {
    fetch("/api/settings/public")
      .then((r) => r.json())
      .then((data) => { if (data.whatsappNumber) setWhatsappNumber(data.whatsappNumber); })
      .catch(() => {});
  }, []);

  const { data: blackoutDates } = useListBlackoutDates();
  const blackoutSet = new Set((blackoutDates ?? []).map((b) => b.date));

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "", customerPhone: "", customerEmail: "",
      deliveryAddress: "", deliveryDate: "", deliveryTimeSlot: "", notes: "",
    },
  });

  const selectedDate = form.watch("deliveryDate");
  const selectedTimeSlot = form.watch("deliveryTimeSlot");
  const formValues = form.watch();

  const { data: capacity } = useCheckDeliveryCapacity(
    { date: selectedDate, timeSlot: selectedTimeSlot || undefined },
    { query: { queryKey: getCheckDeliveryCapacityQueryKey({ date: selectedDate }), enabled: !!selectedDate } }
  );

  const validateCoupon = useValidateCoupon({
    mutation: {
      onSuccess: (data) => {
        if (data.valid) {
          setAppliedCoupon({ code: couponCode.toUpperCase(), discountAmount: data.discountAmount });
          toast({ title: "✅ کوپن لگا دیا گیا!", description: data.message });
        } else {
          toast({ title: "❌ کوپن غلط ہے", description: data.message, variant: "destructive" });
        }
      },
    },
  });

  const createOrder = useCreateOrder({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries();
      },
      onError: () => {
        // Order already shown as placed (WhatsApp opened); DB save failed silently
        queryClient.invalidateQueries();
      },
    },
  });

  const subtotal = total();
  const discount = appliedCoupon?.discountAmount ?? 0;
  const grandTotal = subtotal - discount;
  const minDate = format(addDays(new Date(), 1), "yyyy-MM-dd");

  const isDateDisabled = (dateStr: string) => {
    if (!dateStr) return false;
    if (blackoutSet.has(dateStr)) return true;
    return isBefore(new Date(dateStr), addDays(new Date(), 0.99));
  };

  const siteOrigin = window.location.origin;

  const generateWhatsappMessage = (data: CheckoutForm, cartItems: typeof items) => {
    const lines = [
      "🎂 *نیا آرڈر — Bake Delight Pro*",
      "",
      `*کسٹمر:* ${data.customerName}`,
      `*فون:* ${data.customerPhone}`,
      data.customerEmail ? `*ای میل:* ${data.customerEmail}` : null,
      "",
      "*آرڈر کی تفصیل:*",
      ...cartItems.map((item) => {
        const variants = Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(", ");
        const addons = item.selectedAddons.join(", ");
        const shareUrl = `${siteOrigin}/api/share/product/${item.productId}`;
        return [
          `• *${item.productName}* × ${item.quantity} = ${formatCurrency(item.subtotal)}`,
          variants ? `  Variants: ${variants}` : null,
          addons ? `  Add-ons: ${addons}` : null,
          item.customMessage ? `  پیغام: "${item.customMessage}"` : null,
          `  🔗 پروڈکٹ: ${shareUrl}`,
          item.productImageUrl ? `  🖼 تصویر: ${item.productImageUrl}` : null,
        ].filter(Boolean).join("\n");
      }),
      "",
      `*Subtotal:* ${formatCurrency(subtotal)}`,
      appliedCoupon ? `*Discount (${appliedCoupon.code}):* -${formatCurrency(discount)}` : null,
      `*کل رقم:* ${formatCurrency(grandTotal)}`,
      "",
      `*ڈیلیوری تاریخ:* ${data.deliveryDate}`,
      data.deliveryTimeSlot ? `*وقت:* ${data.deliveryTimeSlot}` : null,
      `*پتہ:* ${data.deliveryAddress}`,
      data.notes ? `*نوٹ:* ${data.notes}` : null,
    ].filter(Boolean).join("\n");
    return lines;
  };

  const handlePlaceOrder = async (data: CheckoutForm) => {
    if (isDateDisabled(data.deliveryDate)) {
      toast({ title: "تاریخ دستیاب نہیں", description: "کوئی اور تاریخ منتخب کریں۔", variant: "destructive" });
      return;
    }
    if (capacity && !capacity.available) {
      toast({ title: "یہ تاریخ بھری ہوئی ہے", description: "کوئی اور تاریخ منتخب کریں۔", variant: "destructive" });
      return;
    }

    // Capture items before cart is cleared
    const currentItems = [...items];

    // 1. Open WhatsApp immediately (must be in direct user-action context)
    const msg = generateWhatsappMessage(data, currentItems);
    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");

    // 2. Show success screen right away — don't wait for DB
    setPlacedOrderData(data);
    setOrderPlaced(true);
    clearCart();

    // 3. Save order to DB in background (admin dashboard will receive it)
    createOrder.mutate({
      data: {
        ...data,
        customerEmail: data.customerEmail || null,
        deliveryTimeSlot: data.deliveryTimeSlot || null,
        notes: data.notes || null,
        couponCode: appliedCoupon?.code ?? null,
        items: currentItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          selectedVariants: item.selectedVariants,
          selectedAddons: item.selectedAddons,
          customMessage: item.customMessage ?? null,
        })),
      },
    });
  };

  // Success screen
  if (orderPlaced) {
    return (
      <StorefrontLayout>
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-serif font-bold mb-2">آرڈر بھیج دیا گیا! 🎉</h1>
          <p className="text-muted-foreground mb-2">آپ کا آرڈر WhatsApp پر بھیج دیا گیا ہے۔</p>
          {placedOrderData && (
            <div className="bg-muted rounded-xl p-4 text-sm text-left mb-6 space-y-1">
              <p><span className="text-muted-foreground">نام:</span> <strong>{placedOrderData.customerName}</strong></p>
              <p><span className="text-muted-foreground">ڈیلیوری:</span> <strong>{placedOrderData.deliveryDate}</strong></p>
              <p><span className="text-muted-foreground">رقم:</span> <strong className="text-primary">{formatCurrency(grandTotal)}</strong></p>
            </div>
          )}
          <p className="text-xs text-muted-foreground mb-6">ہم جلد ہی آرڈر confirm کریں گے۔</p>
          <div className="flex gap-3 justify-center">
            <Link href="/shop"><Button size="lg">مزید خریداری کریں</Button></Link>
            <Link href="/"><Button size="lg" variant="outline">گھر جائیں</Button></Link>
          </div>
        </div>
      </StorefrontLayout>
    );
  }

  // Empty cart
  if (!items.length) {
    return (
      <StorefrontLayout>
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
          <h1 className="text-2xl font-serif font-bold mb-3">کارٹ خالی ہے</h1>
          <p className="text-muted-foreground mb-6">کوئی آئٹم شامل کریں اور آرڈر کریں۔</p>
          <Link href="/shop"><Button size="lg">شاپ کریں</Button></Link>
        </div>
      </StorefrontLayout>
    );
  }

  return (
    <StorefrontLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with back */}
        <div className="flex items-center gap-4 mb-6">
          {step > 0 ? (
            <button onClick={() => setStep((s) => (s - 1) as 0 | 1 | 2)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" /> پیچھے
            </button>
          ) : (
            <button onClick={() => navigate("/shop")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" /> شاپ
            </button>
          )}
          <h1 className="text-2xl font-serif font-bold">آپ کا کارٹ</h1>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${i === step ? "bg-primary text-primary-foreground" : i < step ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"}`}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${i === step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
              {i < STEPS.length - 1 && <div className={`h-px w-8 sm:w-16 ${i < step ? "bg-green-500" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Step content */}
          <div className="lg:col-span-2 space-y-6">

            {/* STEP 0: Cart items */}
            {step === 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>آپ کے آئٹمز ({items.length})</span>
                    <button onClick={clearCart} className="text-xs text-muted-foreground hover:text-destructive transition-colors">سب ہٹائیں</button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 divide-y divide-border">
                  {items.map((item, i) => (
                    <div key={i} className="p-4 flex gap-4">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0">
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
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1 border border-border rounded-lg p-0.5">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQuantity(i, item.quantity - 1)}>
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-7 text-center text-sm font-medium">{item.quantity}</span>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQuantity(i, item.quantity + 1)}>
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-primary">{formatCurrency(item.subtotal)}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={() => removeItem(i)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* STEP 1: Delivery details form */}
            {step === 1 && (
              <Card>
                <CardHeader><CardTitle className="text-lg">ڈیلیوری کی تفصیلات</CardTitle></CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form id="checkout-form" onSubmit={form.handleSubmit(handlePlaceOrder)} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField control={form.control} name="customerName" render={({ field }) => (
                          <FormItem>
                            <FormLabel>مکمل نام *</FormLabel>
                            <FormControl><Input placeholder="آپ کا نام" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="customerPhone" render={({ field }) => (
                          <FormItem>
                            <FormLabel>فون نمبر *</FormLabel>
                            <FormControl><Input placeholder="+92 300 0000000" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>

                      <FormField control={form.control} name="customerEmail" render={({ field }) => (
                        <FormItem>
                          <FormLabel>ای میل (اختیاری)</FormLabel>
                          <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="deliveryAddress" render={({ field }) => (
                        <FormItem>
                          <FormLabel>ڈیلیوری پتہ *</FormLabel>
                          <FormControl><Textarea placeholder="مکمل پتہ درج کریں" rows={2} {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField control={form.control} name="deliveryDate" render={({ field }) => (
                          <FormItem>
                            <FormLabel>ڈیلیوری تاریخ *</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                min={minDate}
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  if (blackoutSet.has(e.target.value)) {
                                    toast({ title: "یہ تاریخ دستیاب نہیں", description: "یہ blackout date ہے۔", variant: "destructive" });
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                            {selectedDate && capacity && !capacity.available && (
                              <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                                <AlertCircle className="h-3 w-3" />
                                {capacity.isBlackout ? "یہ تاریخ blackout ہے" : "یہ تاریخ بھری ہوئی ہے"}
                              </p>
                            )}
                            {selectedDate && capacity?.available && (
                              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                                <CheckCircle2 className="h-3 w-3" />
                                {capacity.remainingSlots} جگہیں باقی ہیں
                              </p>
                            )}
                          </FormItem>
                        )} />

                        <FormField control={form.control} name="deliveryTimeSlot" render={({ field }) => (
                          <FormItem>
                            <FormLabel>وقت کا سلاٹ (اختیاری)</FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              >
                                <option value="">کوئی بھی وقت</option>
                                {TIME_SLOTS.map((slot) => (
                                  <option key={slot} value={slot}>{slot}</option>
                                ))}
                              </select>
                            </FormControl>
                          </FormItem>
                        )} />
                      </div>

                      <FormField control={form.control} name="notes" render={({ field }) => (
                        <FormItem>
                          <FormLabel>خاص ہدایات (اختیاری)</FormLabel>
                          <FormControl><Textarea placeholder="کوئی خاص ہدایت..." rows={2} {...field} /></FormControl>
                        </FormItem>
                      )} />
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            {/* STEP 2: Confirm order */}
            {step === 2 && (
              <Card>
                <CardHeader><CardTitle className="text-lg">آرڈر کی تصدیق</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 rounded-xl p-4 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">نام</span><span className="font-medium">{formValues.customerName}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">فون</span><span className="font-medium">{formValues.customerPhone}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">تاریخ</span><span className="font-medium">{formValues.deliveryDate}</span></div>
                    {formValues.deliveryTimeSlot && <div className="flex justify-between"><span className="text-muted-foreground">وقت</span><span className="font-medium">{formValues.deliveryTimeSlot}</span></div>}
                    <div className="flex justify-between"><span className="text-muted-foreground">پتہ</span><span className="font-medium text-right max-w-xs">{formValues.deliveryAddress}</span></div>
                    {formValues.notes && <div className="flex justify-between"><span className="text-muted-foreground">نوٹ</span><span className="font-medium">{formValues.notes}</span></div>}
                  </div>

                  <div>
                    <p className="text-sm font-semibold mb-2">آرڈر آئٹمز</p>
                    <div className="space-y-1.5">
                      {items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{item.productName} × {item.quantity}</span>
                          <span className="font-medium">{formatCurrency(item.subtotal)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm">
                    <Clock className="h-4 w-4 text-blue-600 shrink-0" />
                    <p className="text-blue-700 dark:text-blue-400">کم از کم 24 گھنٹے پہلے آرڈر ضروری ہے۔</p>
                  </div>

                  <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-sm">
                    <MessageCircle className="h-4 w-4 text-green-600 shrink-0" />
                    <p className="text-green-700 dark:text-green-400">"WhatsApp پر بھیجیں" بٹن دبانے پر آرڈر WhatsApp میں کھل جائے گا۔</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Order summary (always visible) */}
          <div className="space-y-4">
            <Card className="sticky top-20">
              <CardHeader><CardTitle className="text-lg">آرڈر خلاصہ</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  {items.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-muted-foreground">{item.productName} × {item.quantity}</span>
                      <span>{formatCurrency(item.subtotal)}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center gap-1">
                        <Tag className="h-3 w-3" /> {appliedCoupon.code}
                        <button onClick={() => setAppliedCoupon(null)} className="text-muted-foreground hover:text-destructive ml-1 text-xs">×</button>
                      </span>
                      <span>-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-base">
                    <span>کل رقم</span>
                    <span className="text-primary">{formatCurrency(grandTotal)}</span>
                  </div>
                </div>

                {/* Coupon — show on step 0 & 1 */}
                {step < 2 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">کوپن کوڈ</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="SAVE10"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="flex-1"
                        disabled={!!appliedCoupon}
                      />
                      {appliedCoupon ? (
                        <Button variant="outline" size="sm" onClick={() => { setAppliedCoupon(null); setCouponCode(""); }}>
                          ہٹائیں
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => validateCoupon.mutate({ data: { code: couponCode, orderAmount: subtotal } })}
                          disabled={!couponCode || validateCoupon.isPending}
                        >
                          لگائیں
                        </Button>
                      )}
                    </div>
                    {appliedCoupon && (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <Badge variant="outline" className="text-green-600 border-green-300 text-xs">{appliedCoupon.code}</Badge> لگایا گیا!
                      </p>
                    )}
                  </div>
                )}

                {/* Step CTA buttons */}
                {step === 0 && (
                  <Button
                    className="w-full gap-2"
                    size="lg"
                    onClick={() => setStep(1)}
                  >
                    اگلا مرحلہ →
                  </Button>
                )}

                {step === 1 && (
                  <Button
                    className="w-full gap-2"
                    size="lg"
                    onClick={async () => {
                      const valid = await form.trigger();
                      if (valid) {
                        if (isDateDisabled(formValues.deliveryDate)) {
                          toast({ title: "تاریخ دستیاب نہیں", variant: "destructive" });
                          return;
                        }
                        if (capacity && !capacity.available) {
                          toast({ title: "یہ تاریخ بھری ہوئی ہے", variant: "destructive" });
                          return;
                        }
                        setStep(2);
                      }
                    }}
                  >
                    آرڈر کا جائزہ لیں →
                  </Button>
                )}

                {step === 2 && (
                  <Button
                    className="w-full gap-2 bg-green-600 hover:bg-green-700"
                    size="lg"
                    disabled={createOrder.isPending}
                    onClick={form.handleSubmit(handlePlaceOrder)}
                    data-testid="button-checkout"
                  >
                    <MessageCircle className="h-5 w-5" />
                    {createOrder.isPending ? "بھیجا جا رہا ہے..." : "WhatsApp پر آرڈر بھیجیں"}
                  </Button>
                )}

                <p className="text-xs text-center text-muted-foreground">
                  آرڈر WhatsApp میں کھل جائے گا — confirm کریں اور بھیج دیں۔
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
