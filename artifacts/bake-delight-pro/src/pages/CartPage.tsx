import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { useCartStore } from "@/stores/cart";
import { useValidateCoupon, useListBlackoutDates, useCheckDeliveryCapacity, getCheckDeliveryCapacityQueryKey, useCreateOrder } from "@workspace/api-client-react";
import { StorefrontLayout } from "@/components/StorefrontLayout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingBag, Minus, Plus, Tag, MessageCircle, CheckCircle2, ArrowLeft, ArrowRight, AlertCircle, Clock, Camera } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { addDays, format, isBefore } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useRef } from "react";
import html2canvas from "html2canvas";

type CheckoutForm = {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  deliveryDate: string;
  deliveryTimeSlot: string;
  paymentMethod: "cod" | "jazzcash" | "easypaisa" | "bank";
  transactionId?: string;
  paymentScreenshot?: string;
  notes: string;
};

const TIME_SLOTS = [
  "9:00 AM - 12:00 PM",
  "12:00 PM - 3:00 PM",
  "3:00 PM - 6:00 PM",
  "6:00 PM - 9:00 PM",
];

export default function CartPage() {
  const [, navigate] = useLocation();
  const { items, removeItem, updateQuantity, clearCart, total } = useCartStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t, isUrdu } = useLanguage();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(data => {
      if (data.authenticated) setCurrentUser(data.user);
    });
  }, []);
  const [step, setStep] = useState<0 | 1 | 2>(0);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number } | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderData, setPlacedOrderData] = useState<CheckoutForm | null>(null);
  const [placedOrderItems, setPlacedOrderItems] = useState<typeof items>([]);
  const [whatsappNumber, setWhatsappNumber] = useState("923001234567");
  const [paymentSettings, setPaymentSettings] = useState({
    jazzcash: "0300-1234567 (Ali Ahmed)",
    easypaisa: "0321-7654321 (Ali Ahmed)",
    bank: "HBL: 1234-5678-9012-3456 (Marhaba Bakers)"
  });
  const receiptRef = useRef<HTMLDivElement>(null);

  const downloadReceipt = async () => {
    if (!receiptRef.current) return;
    try {
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: "#f4f4f5",
        scale: 2,
        useCORS: true, // Crucial for cross-origin product images
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `Receipt_Order_${Date.now()}.png`;
      link.click();
      toast({ title: "✅ Receipt Downloaded", description: "You can now attach it to WhatsApp." });
    } catch (err) {
      console.error("Screenshot error:", err);
      toast({ title: "❌ Screenshot Failed", variant: "destructive" });
    }
  };

  const [deliveryCharges, setDeliveryCharges] = useState(300);

  useEffect(() => {
    fetch(`/api/settings/public?t=${Date.now()}`)
      .then((r) => r.json())
      .then((data) => { 
        if (data.whatsappNumber) setWhatsappNumber(data.whatsappNumber); 
        if (data.deliveryCharges) setDeliveryCharges(Number(data.deliveryCharges));
        setPaymentSettings({
          jazzcash: data.jazzcashDetails || paymentSettings.jazzcash,
          easypaisa: data.easypaisaDetails || paymentSettings.easypaisa,
          bank: data.bankDetails || paymentSettings.bank
        });
      })
      .catch((err) => {
        console.error("Settings fetch error:", err);
      });
  }, []);

  const checkoutSchema = useMemo(() => z.object({
    customerName: z.string().min(2, t.validation.nameMin),
    customerPhone: z.string().min(10, t.validation.phoneMin),
    customerEmail: z.string().email(t.validation.emailInvalid).optional().or(z.literal("")),
    deliveryAddress: z.string().min(10, t.validation.addressMin),
    deliveryDate: z.string().min(1, t.validation.dateRequired),
    deliveryTimeSlot: z.string().optional(),
    paymentMethod: z.enum(["cod", "jazzcash", "easypaisa", "bank"]).default("cod"),
    transactionId: z.string().optional(),
    paymentScreenshot: z.string().optional(),
    notes: z.string().optional(),
  }).refine((data) => {
    if (data.paymentMethod !== "cod") {
      return !!data.transactionId && data.transactionId.length > 3;
    }
    return true;
  }, {
    message: "Transaction ID is required for online payments",
    path: ["transactionId"]
  }).refine((data) => {
    if (data.paymentMethod !== "cod") {
      return !!data.paymentScreenshot;
    }
    return true;
  }, {
    message: "Payment screenshot is required for online payments",
    path: ["paymentScreenshot"]
  }), [t]);

  const { data: blackoutDates } = useListBlackoutDates();
  const blackoutSet = new Set((blackoutDates ?? []).map((b) => b.date));

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "", customerPhone: "", customerEmail: "",
      deliveryAddress: "", deliveryDate: "", deliveryTimeSlot: "", paymentMethod: "cod", notes: "",
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
          toast({ title: `✅ ${t.cart.couponCode}`, description: data.message });
        } else {
          toast({ title: `❌ ${t.cart.couponCode}`, description: data.message, variant: "destructive" });
        }
      },
    },
  });

  const createOrder = useCreateOrder({
    mutation: {
      onSuccess: () => { queryClient.invalidateQueries(); },
      onError: () => { queryClient.invalidateQueries(); },
    },
  });

  const subtotal = total();
  const discount = appliedCoupon?.discountAmount ?? 0;
  const grandTotal = subtotal - discount + deliveryCharges;
  const maxLeadHours = items.length > 0 ? Math.max(0, ...items.map(item => item.leadTimeHours || 0)) : 0;
  const leadDays = Math.ceil(maxLeadHours / 24);
  const minDate = format(addDays(new Date(), leadDays), "yyyy-MM-dd");

  const isDateDisabled = (dateStr: string) => {
    if (!dateStr) return false;
    if (blackoutSet.has(dateStr)) return true;
    return isBefore(new Date(dateStr), addDays(new Date(), leadDays - 0.01));
  };

  const siteOrigin = window.location.origin;
  const wa = t.cart.wa;

  const generateWhatsappMessage = (data: CheckoutForm, cartItems: typeof items) => {
    const lines = [
      wa.header,
      "",
      `*${wa.customer}:* ${data.customerName}`,
      `*${wa.phone}:* ${data.customerPhone}`,
      data.customerEmail ? `*${wa.email}:* ${data.customerEmail}` : null,
      "",
      wa.orderDetails,
      ...cartItems.map((item) => {
        const variants = Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(", ");
        const addons = item.selectedAddons.join(", ");
        const shareUrl = `${siteOrigin}/api/share/product/${item.productId}`;
        const imageUrl = item.productImageUrl?.startsWith('http') 
          ? item.productImageUrl 
          : `${siteOrigin}${item.productImageUrl}`;
        return [
          `• *${item.productName}* × ${item.quantity} = ${formatCurrency(item.subtotal)}`,
          variants ? `  ${wa.variants}: ${variants}` : null,
          addons ? `  ${wa.addons}: ${addons}` : null,
          item.customMessage ? `  ${wa.message}: "${item.customMessage}"` : null,
          `  🔗 ${wa.product}: ${shareUrl}`,
          imageUrl ? `  🖼 ${wa.image}: ${imageUrl}` : null,
        ].filter(Boolean).join("\n");
      }),
      "",
      `*${wa.subtotal}:* ${formatCurrency(subtotal)}`,
      appliedCoupon ? `*${wa.discount(appliedCoupon.code)}:* -${formatCurrency(discount)}` : null,
      `*${wa.delivery}:* ${formatCurrency(deliveryCharges)}`,
      `*${wa.total}:* ${formatCurrency(grandTotal)}`,
      "",
      `*${wa.deliveryDate}:* ${data.deliveryDate}`,
      data.deliveryTimeSlot ? `*${wa.time}:* ${data.deliveryTimeSlot}` : null,
      `*${wa.address}:* ${data.deliveryAddress}`,
      `*Payment Method:* ${data.paymentMethod.toUpperCase()}`,
      data.transactionId ? `*Transaction ID:* ${data.transactionId}` : null,
      data.notes ? `*${wa.note}:* ${data.notes}` : null,
      "",
      "📸 *Note:* I have attached the payment receipt and product images below.",
    ].filter(Boolean).join("\n");
    return lines;
  };

  const handlePlaceOrder = async (data: CheckoutForm) => {
    if (isDateDisabled(data.deliveryDate)) {
      toast({ title: t.cart.dateUnavailable, description: t.cart.dateBlackout, variant: "destructive" });
      return;
    }
    if (capacity && !capacity.available) {
      toast({ title: t.cart.dateFull, variant: "destructive" });
      return;
    }

    const currentItems = [...items];
    const msg = generateWhatsappMessage(data, currentItems);
    


    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");

    setPlacedOrderData(data);
    setPlacedOrderItems(currentItems);
    setOrderPlaced(true);
    clearCart();

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

  const BackArrow = isUrdu ? ArrowRight : ArrowLeft;

  if (orderPlaced) {
    return (
      <StorefrontLayout>
        <div className="max-w-lg mx-auto px-4 py-24 text-center neu-pressed rounded-[3rem] mt-12">
          <div className="w-24 h-24 neu-flat rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-serif font-bold mb-4 uppercase tracking-wide">{t.cart.orderPlaced}</h1>
          <p className="text-muted-foreground mb-8 text-sm">{t.cart.orderSentDesc}</p>
          {placedOrderData && (
            <div ref={receiptRef} className="neu-flat rounded-[2rem] p-6 text-sm text-left mb-8 space-y-4 bg-background border border-primary/10">
              <div className="flex justify-between items-center border-b border-dashed pb-3 mb-3">
                <h3 className="font-serif font-bold text-lg text-primary">Marhaba Bakers</h3>
                <span className="text-[10px] font-bold text-muted-foreground uppercase">{format(new Date(), 'dd MMM yyyy')}</span>
              </div>
              <div className="flex justify-between"><span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{t.cart.name}</span> <span className="font-bold">{placedOrderData.customerName}</span></div>
              <div className="flex justify-between"><span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{t.cart.date}</span> <span className="font-bold">{placedOrderData.deliveryDate}</span></div>
              
              <div className="py-2 border-y border-dashed border-muted/50 space-y-3">
                {placedOrderItems.map((item, i) => (
                  <div key={i} className="flex gap-3 items-start border-b border-muted/20 pb-2 last:border-0">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-primary/10">
                      {item.productImageUrl ? (
                        <img src={item.productImageUrl} crossOrigin="anonymous" alt={item.productName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-background text-[8px]">No Image</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-bold">{item.productName} × {item.quantity}</span>
                        <span className="font-bold text-primary">{formatCurrency(item.subtotal)}</span>
                      </div>
                      {Object.entries(item.selectedVariants).length > 0 && (
                        <p className="text-[9px] text-muted-foreground">{Object.entries(item.selectedVariants).map(([k,v])=>`${k}: ${v}`).join(", ")}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-2"><span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{t.cart.total}</span> <span className="text-primary font-bold text-lg">{formatCurrency(grandTotal)}</span></div>
              <p className="text-[9px] text-center text-muted-foreground italic pt-4">Thank you for choosing Marhaba Bakers!</p>
            </div>
          )}
          
          <div className="flex flex-col gap-4 mb-8">
            <button 
              onClick={downloadReceipt}
              className="neu-flat px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/5 active:neu-pressed transition-all w-full flex items-center justify-center gap-2"
            >
              📷 {isUrdu ? "رسید ڈاؤن لوڈ کریں" : "Download Digital Receipt"}
            </button>
            
            {navigator.share && (
              <button 
                onClick={async () => {
                  if (!placedOrderData) return;
                  try {
                    const firstItem = placedOrderItems[0];
                    let file: File | null = null;
                    
                    if (firstItem && firstItem.productImageUrl) {
                      try {
                        let imgUrl = firstItem.productImageUrl;
                        if (imgUrl.startsWith('http://localhost:3000')) {
                          imgUrl = imgUrl.replace('http://localhost:3000', '');
                        }
                        const response = await fetch(imgUrl);
                        const blob = await response.blob();
                        const ext = blob.type.split('/')[1] || 'jpg';
                        file = new File([blob], `product.${ext}`, { type: blob.type });
                      } catch (e) {
                        console.error("Failed to fetch product image for share:", e);
                      }
                    }
                    
                    const msg = generateWhatsappMessage(placedOrderData, placedOrderItems);
                    
                    const shareData: ShareData = {
                      title: 'Order Details',
                      text: msg
                    };
                    
                    if (file) {
                      shareData.files = [file];
                    }
                    
                    await navigator.share(shareData);
                  } catch (err) {
                    console.error("Share error:", err);
                    toast({ title: "❌ Share Failed", variant: "destructive" });
                  }
                }}
                className="neu-flat px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest text-green-600 hover:bg-green-50 active:neu-pressed transition-all w-full flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-4 w-4" /> {isUrdu ? "واٹس ایپ پر شیئر کریں" : "Share on WhatsApp"}
              </button>
            )}
            
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{t.cart.confirmSoon}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop"><button className="neu-flat px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:text-primary active:neu-pressed transition-all w-full">{t.cart.continueShopping}</button></Link>
            <Link href="/"><button className="neu-pressed px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:text-primary transition-all w-full">{t.cart.goHome}</button></Link>
          </div>
        </div>
      </StorefrontLayout>
    );
  }

  if (!items.length) {
    return (
      <StorefrontLayout>
        <div className="max-w-lg mx-auto px-4 py-24 text-center neu-pressed rounded-[3rem] mt-12">
          <div className="w-24 h-24 neu-flat rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="h-10 w-10 text-muted-foreground/30" />
          </div>
          <h1 className="text-3xl font-serif font-bold mb-4 uppercase tracking-wide">{t.cart.emptyCart}</h1>
          <p className="text-muted-foreground mb-8 text-sm">{t.cart.emptyCartDesc}</p>
          <Link href="/shop"><button className="neu-flat px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:text-primary active:neu-pressed transition-all">{t.cart.shopNow}</button></Link>
        </div>
      </StorefrontLayout>
    );
  }

  const STEPS = t.cart.steps;

  return (
    <StorefrontLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col mb-10">
          <div className="flex items-center gap-4 mb-8">
            {step > 0 ? (
              <button onClick={() => setStep((s) => (s - 1) as 0 | 1 | 2)} className="w-10 h-10 neu-flat rounded-full flex items-center justify-center active:neu-pressed text-muted-foreground hover:text-foreground transition-all shrink-0">
                <BackArrow className="h-4 w-4" />
              </button>
            ) : (
              <button onClick={() => navigate("/shop")} className="w-10 h-10 neu-flat rounded-full flex items-center justify-center active:neu-pressed text-muted-foreground hover:text-foreground transition-all shrink-0">
                <BackArrow className="h-4 w-4" />
              </button>
            )}
            <h1 className="text-3xl sm:text-4xl font-serif font-bold uppercase tracking-wide">{t.cart.title}</h1>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-2 pl-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i === step ? "neu-flat text-primary" : i < step ? "neu-flat text-green-600" : "neu-pressed text-muted-foreground/50"
                }`}>
                  {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-[10px] uppercase tracking-widest font-bold hidden sm:block ${i === step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
                {i < STEPS.length - 1 && <div className={`h-[2px] w-8 sm:w-16 rounded-full mx-2 ${i < step ? "bg-green-600" : "bg-muted"}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Step content */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">

            {/* STEP 0: Cart items */}
            {step === 0 && (
              <div className="neu-flat rounded-[2.5rem] p-6 sm:p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">{t.cart.yourItems(items.length)}</h2>
                  <button onClick={clearCart} className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:text-destructive transition-colors">{t.cart.removeAll}</button>
                </div>
                <div className="space-y-6">
                  {items.map((item, i) => (
                    <div key={i} className="neu-pressed rounded-[2rem] p-4 flex flex-col sm:flex-row gap-6">
                      <div className="w-full sm:w-24 h-48 sm:h-24 rounded-[1.5rem] overflow-hidden bg-muted shrink-0 neu-flat p-1">
                        {item.productImageUrl ? (
                          <img 
                            src={item.productImageUrl} 
                            alt={item.productName} 
                            crossOrigin="anonymous"
                            className="w-full h-full object-cover rounded-xl" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center rounded-xl bg-background">
                            <ShoppingBag className="h-8 w-8 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 py-1 flex flex-col">
                        <p className="font-serif font-bold text-sm uppercase tracking-wide mb-1">{item.productName}</p>
                        <div className="space-y-1 mb-4">
                          {Object.entries(item.selectedVariants).length > 0 && (
                            <p className="text-[10px] text-muted-foreground font-medium">
                              {Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(", ")}
                            </p>
                          )}
                          {item.selectedAddons.length > 0 && (
                            <p className="text-[10px] text-muted-foreground font-medium">{t.cart.addons}: {item.selectedAddons.join(", ")}</p>
                          )}
                          {item.customMessage && (
                            <p className="text-[10px] text-muted-foreground italic mt-1">"{item.customMessage}"</p>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-3">
                            <button className="w-8 h-8 neu-flat rounded-full flex items-center justify-center active:neu-pressed text-foreground hover:text-primary transition-all shrink-0" onClick={() => updateQuantity(i, item.quantity - 1)}>
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                            <button className="w-8 h-8 neu-flat rounded-full flex items-center justify-center active:neu-pressed text-foreground hover:text-primary transition-all shrink-0" onClick={() => updateQuantity(i, item.quantity + 1)}>
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-bold text-sm text-primary">{formatCurrency(item.subtotal)}</span>
                            <button className="w-8 h-8 neu-flat rounded-full flex items-center justify-center active:neu-pressed text-muted-foreground hover:text-destructive transition-all shrink-0" onClick={() => removeItem(i)}>
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 1: Delivery details form */}
            {step === 1 && (
              <div className="neu-flat rounded-[2.5rem] p-6 sm:p-10">
                <h2 className="text-xl font-serif font-bold uppercase tracking-wide mb-8">{t.cart.deliveryDetails}</h2>
                <Form {...form}>
                  <form id="checkout-form" onSubmit={form.handleSubmit(handlePlaceOrder)} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField control={form.control} name="customerName" render={({ field }) => (
                        <FormItem>
                          <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-2 block">{t.cart.fullName}</label>
                          <FormControl><input className="w-full neu-pressed rounded-full px-5 py-3 text-sm outline-none bg-transparent" placeholder={t.cart.namePlaceholder} {...field} /></FormControl>
                          <FormMessage className="text-[10px] mt-2" />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="customerPhone" render={({ field }) => (
                        <FormItem>
                          <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-2 block">{t.cart.phone}</label>
                          <FormControl><input className="w-full neu-pressed rounded-full px-5 py-3 text-sm outline-none bg-transparent" placeholder={t.cart.phonePlaceholder} {...field} /></FormControl>
                          <FormMessage className="text-[10px] mt-2" />
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="customerEmail" render={({ field }) => (
                      <FormItem>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-2 block">{t.cart.email}</label>
                        <FormControl><input type="email" className="w-full neu-pressed rounded-full px-5 py-3 text-sm outline-none bg-transparent" placeholder={t.cart.emailPlaceholder} {...field} /></FormControl>
                        <FormMessage className="text-[10px] mt-2" />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="deliveryAddress" render={({ field }) => (
                      <FormItem>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-2 block">{t.cart.deliveryAddress}</label>
                        <FormControl><textarea className="w-full neu-pressed rounded-[2rem] px-5 py-4 text-sm outline-none bg-transparent resize-none" placeholder={t.cart.addressPlaceholder} rows={3} {...field} /></FormControl>
                        <FormMessage className="text-[10px] mt-2" />
                      </FormItem>
                    )} />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField control={form.control} name="deliveryDate" render={({ field }) => (
                        <FormItem>
                          <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-2 block">{t.cart.deliveryDate}</label>
                          <FormControl>
                            <input
                              type="date"
                              min={minDate}
                              className="w-full neu-pressed rounded-full px-5 py-3 text-sm outline-none bg-transparent"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                if (blackoutSet.has(e.target.value)) {
                                  toast({ title: t.cart.dateUnavailable, description: t.cart.dateBlackout, variant: "destructive" });
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage className="text-[10px] mt-2" />
                          {selectedDate && capacity && !capacity.available && (
                            <p className="text-[10px] text-destructive flex items-center gap-1 mt-2 font-bold uppercase tracking-widest">
                              <AlertCircle className="h-3 w-3" /> {capacity.isBlackout ? t.cart.dateBlackout : t.cart.dateFull}
                            </p>
                          )}
                          {selectedDate && capacity?.available && (
                            <p className="text-[10px] text-green-600 flex items-center gap-1 mt-2 font-bold uppercase tracking-widest">
                              <CheckCircle2 className="h-3 w-3" /> {t.cart.slotsRemaining(capacity.remainingSlots)}
                            </p>
                          )}
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="deliveryTimeSlot" render={({ field }) => (
                        <FormItem>
                          <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-2 block">{t.cart.timeSlot}</label>
                          <FormControl>
                            <select
                              {...field}
                              className="w-full neu-pressed rounded-full px-5 py-3 text-sm outline-none bg-transparent appearance-none"
                            >
                              <option value="" className="bg-background">{t.cart.anyTime}</option>
                              {TIME_SLOTS.map((slot) => (
                                <option key={slot} value={slot} className="bg-background">{slot}</option>
                              ))}
                            </select>
                          </FormControl>
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="notes" render={({ field }) => (
                      <FormItem>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-2 block">{t.cart.notes}</label>
                        <FormControl><textarea className="w-full neu-pressed rounded-[2rem] px-5 py-4 text-sm outline-none bg-transparent resize-none" placeholder={t.cart.notesPlaceholder} rows={2} {...field} /></FormControl>
                      </FormItem>
                    )} />
                  </form>
                </Form>
              </div>
            )}

            {/* STEP 2: Confirm order */}
            {step === 2 && (
              <div className="neu-flat rounded-[2.5rem] p-6 sm:p-10">
                <h2 className="text-xl font-serif font-bold uppercase tracking-wide mb-8">{t.cart.orderReview}</h2>
                <Form {...form}>
                  <div className="space-y-8">
                  <div className="neu-pressed rounded-[2rem] p-6 space-y-4 text-sm">
                    <div className="flex justify-between"><span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t.cart.name}</span><span className="font-bold">{formValues.customerName}</span></div>
                    <div className="flex justify-between"><span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t.cart.phone2}</span><span className="font-bold">{formValues.customerPhone}</span></div>
                    <div className="flex justify-between"><span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t.cart.date}</span><span className="font-bold">{formValues.deliveryDate}</span></div>
                    {formValues.deliveryTimeSlot && <div className="flex justify-between"><span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t.cart.time}</span><span className="font-bold">{formValues.deliveryTimeSlot}</span></div>}
                    <div className="flex justify-between"><span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t.cart.address}</span><span className="font-bold text-right max-w-xs">{formValues.deliveryAddress}</span></div>
                    {formValues.notes && <div className="flex justify-between mt-4 border-t border-muted pt-4"><span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t.cart.note}</span><span className="font-medium italic text-right max-w-xs">{formValues.notes}</span></div>}
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 pl-2">{t.cart.orderItems}</p>
                    <div className="neu-pressed rounded-[2rem] p-6 space-y-3">
                      {items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm items-center">
                          <span className="font-bold text-muted-foreground">{item.productName} × {item.quantity}</span>
                          <span className="font-bold text-primary">{formatCurrency(item.subtotal)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 neu-flat rounded-[1.5rem] p-4 text-xs">
                      <div className="w-8 h-8 neu-pressed rounded-full flex items-center justify-center shrink-0">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <p className="font-medium text-muted-foreground">{t.cart.leadTime}</p>
                    </div>

                    <div className="flex items-center gap-3 neu-flat rounded-[1.5rem] p-4 text-xs">
                      <div className="w-8 h-8 neu-pressed rounded-full flex items-center justify-center shrink-0">
                        <MessageCircle className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <p className="font-medium text-muted-foreground">{t.cart.whatsappNote}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 pl-2">Select Payment Method</p>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      {[
                        { id: 'cod', label: 'COD', color: 'bg-slate-100' },
                        { id: 'jazzcash', label: 'JazzCash', color: 'bg-red-50 text-red-600' },
                        { id: 'easypaisa', label: 'EasyPaisa', color: 'bg-green-50 text-green-600' },
                        { id: 'bank', label: 'Bank Transfer', color: 'bg-blue-50 text-blue-600' }
                      ].map((pm) => (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => form.setValue('paymentMethod', pm.id as any)}
                          className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 border-2 transition-all ${
                            formValues.paymentMethod === pm.id ? 'border-primary bg-primary/5' : 'border-transparent neu-flat'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[8px] ${pm.color}`}>
                            {pm.id.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider">{pm.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Payment Details Section */}
                  {formValues.paymentMethod !== 'cod' && (
                    <div className="neu-pressed rounded-[2rem] p-6 space-y-6">
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary">Transfer Details</h4>
                        {formValues.paymentMethod === 'jazzcash' && <p className="text-sm font-medium">JazzCash: {paymentSettings.jazzcash}</p>}
                        {formValues.paymentMethod === 'easypaisa' && <p className="text-sm font-medium">EasyPaisa: {paymentSettings.easypaisa}</p>}
                        {formValues.paymentMethod === 'bank' && <p className="text-sm font-medium">Bank: {paymentSettings.bank}</p>}
                        <p className="text-[10px] text-muted-foreground italic">Please transfer the total amount and provide the details below.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField control={form.control} name="transactionId" render={({ field }) => (
                          <FormItem>
                            <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-2 block">Transaction ID / TID</label>
                            <FormControl><input className="w-full neu-flat rounded-full px-5 py-3 text-sm outline-none bg-background" placeholder="Enter TID" {...field} /></FormControl>
                          </FormItem>
                        )} />
                        
                        <FormField control={form.control} name="paymentScreenshot" render={({ field }) => (
                          <FormItem className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground block">Upload Screenshot</label>
                            <div className="relative">
                              <input 
                                type="file" 
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      field.onChange(reader.result as string);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                              <div className="w-full neu-flat rounded-full px-5 py-3 text-xs font-bold text-muted-foreground flex items-center justify-between">
                                <span>{field.value ? "✅ Image Selected" : "Choose File"}</span>
                                <Camera className="h-4 w-4" />
                              </div>
                            </div>
                            {field.value && (
                              <div className="mt-4 p-2 neu-pressed rounded-2xl overflow-hidden">
                                <img src={field.value} className="w-full h-32 object-cover rounded-xl" alt="Payment Proof" />
                              </div>
                            )}
                            <FormMessage className="text-[10px]" />
                          </FormItem>
                        )} />
                      </div>
                    </div>
                  )}
                  </div>
                </Form>
                
                {!currentUser && (
                  <div className="mt-8 p-6 neu-flat rounded-[2rem] bg-primary/5 border border-primary/10 flex items-start gap-4">
                    <div className="w-10 h-10 neu-flat rounded-full flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm mb-1">{isUrdu ? "کیا آپ اپنے آرڈر کو ٹریک کرنا چاہتے ہیں؟" : "Want to track your order?"}</h4>
                      <p className="text-xs text-muted-foreground mb-3">{isUrdu ? "آرڈر کی صورتحال جاننے کے لیے لاگ ان کریں۔ یہ بالکل آپشنل ہے!" : "Login to save this order to your account. It's completely optional!"}</p>
                      <Button variant="outline" size="sm" className="h-8 text-[10px] uppercase font-bold tracking-widest rounded-full" onClick={() => navigate("/auth")}>
                        {isUrdu ? "لاگ ان یا رجسٹر کریں" : "Login / Register"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Order summary */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            <div className="neu-flat rounded-[2.5rem] p-6 sm:p-8 sticky top-24">
              <h2 className="text-xl font-serif font-bold uppercase tracking-wide mb-6">{t.cart.orderSummary}</h2>
              <div className="space-y-6">
                <div className="space-y-3 text-sm font-bold text-muted-foreground">
                  {items.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="truncate pr-4">{item.productName} × {item.quantity}</span>
                      <span className="shrink-0">{formatCurrency(item.subtotal)}</span>
                    </div>
                  ))}
                  <div className="h-px bg-muted/50 my-4" />
                  <div className="flex justify-between"><span className="text-[10px] uppercase tracking-widest">{t.cart.subtotal}</span><span>{formatCurrency(subtotal)}</span></div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-primary">
                      <span className="flex items-center gap-2">
                        <Tag className="h-3 w-3" /> {appliedCoupon.code}
                        <button onClick={() => setAppliedCoupon(null)} className="w-5 h-5 neu-flat rounded-full flex items-center justify-center text-[10px] hover:text-destructive active:neu-pressed ml-2">×</button>
                      </span>
                      <span>-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[10px] uppercase tracking-widest">{t.cart.deliveryCharges}</span>
                    <span>{formatCurrency(deliveryCharges)}</span>
                  </div>
                  <div className="h-px bg-muted/50 my-4" />
                  <div className="flex justify-between text-lg text-foreground">
                    <span className="font-serif uppercase tracking-wide">{t.cart.total}</span>
                    <span className="text-primary font-bold">{formatCurrency(grandTotal)}</span>
                  </div>
                </div>

                {/* Coupon */}
                {step < 2 && (
                  <div className="space-y-3 pt-4">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground pl-2">{t.cart.couponCode}</label>
                    <div className="flex gap-3">
                      <input
                        placeholder="SAVE10"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="flex-1 neu-pressed rounded-full px-4 text-sm font-bold outline-none bg-transparent uppercase"
                        disabled={!!appliedCoupon}
                      />
                      {appliedCoupon ? (
                        <button className="neu-flat px-4 py-3 rounded-full text-xs font-bold uppercase tracking-widest active:neu-pressed" onClick={() => { setAppliedCoupon(null); setCouponCode(""); }}>
                          {t.cart.remove}
                        </button>
                      ) : (
                        <button
                          className="neu-flat px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest active:neu-pressed disabled:opacity-50"
                          onClick={() => validateCoupon.mutate({ data: { code: couponCode, orderAmount: subtotal } })}
                          disabled={!couponCode || validateCoupon.isPending}
                        >
                          {t.cart.apply}
                        </button>
                      )}
                    </div>
                    {appliedCoupon && (
                      <p className="text-[10px] text-primary flex items-center gap-1 font-bold uppercase tracking-widest pl-2">
                        <CheckCircle2 className="h-3 w-3" /> {appliedCoupon.code} {t.cart.couponApplied}
                      </p>
                    )}
                  </div>
                )}

                {/* Step CTA buttons */}
                <div className="pt-6">
                  {step === 0 && (
                    <button className="w-full neu-flat rounded-full py-4 text-xs font-bold uppercase tracking-widest hover:text-primary active:neu-pressed transition-all flex items-center justify-center gap-2" onClick={() => setStep(1)}>
                      {t.cart.nextStep} {!isUrdu && <ArrowRight className="h-4 w-4" />}
                    </button>
                  )}

                  {step === 1 && (
                    <button
                      className="w-full neu-flat rounded-full py-4 text-xs font-bold uppercase tracking-widest hover:text-primary active:neu-pressed transition-all flex items-center justify-center gap-2"
                      onClick={async () => {
                        const valid = await form.trigger();
                        if (valid) {
                          if (isDateDisabled(formValues.deliveryDate)) { toast({ title: t.cart.dateUnavailable, variant: "destructive" }); return; }
                          if (capacity && !capacity.available) { toast({ title: t.cart.dateFull, variant: "destructive" }); return; }
                          setStep(2);
                        }
                      }}
                    >
                      {t.cart.reviewOrder} {!isUrdu && <ArrowRight className="h-4 w-4" />}
                    </button>
                  )}

                  {step === 2 && (
                    <button
                      className="w-full neu-flat rounded-full py-4 text-xs font-bold uppercase tracking-widest text-primary active:neu-pressed transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:pointer-events-none"
                      disabled={createOrder.isPending}
                      onClick={form.handleSubmit(handlePlaceOrder)}
                      data-testid="button-checkout"
                    >
                      <MessageCircle className="h-4 w-4" />
                      {createOrder.isPending ? t.cart.sending : t.cart.sendWhatsapp}
                    </button>
                  )}
                </div>

                <p className="text-[10px] text-center font-bold uppercase tracking-widest text-muted-foreground pt-4">
                  {t.cart.whatsappFooter}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
