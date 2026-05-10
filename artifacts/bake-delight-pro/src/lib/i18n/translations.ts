export type LangKey = "en" | "ur";

export type Translation = {
  nav: {
    home: string;
    shop: string;
    admin: string;
    cart: string;
    langLabel: string;
  };
  footer: {
    brand: string;
    tagline: string;
    location: string;
    address: string;
    orderTitle: string;
    orderDesc: string;
    deliveryCharges: string;
    copyright: string;
  };
  home: {
    heroBadge: string;
    heroTitle: string;
    heroSubtitle: string;
    heroBtn: string;
    viewBtn: string;
    whyTitle: string;
    whySubtitle: string;
    features: Array<{ title: string; desc: string }>;
    categoriesTitle: string;
    categoriesSubtitle: string;
    allItems: string;
    popularTitle: string;
    popularSubtitle: string;
    viewAll: string;
    noProducts: string;
    locationTitle: string;
    orderTitle: string;
    orderDesc: string;
    orderBtn: string;
    ctaBadge: string;
    ctaTitle: string;
    ctaDesc: string;
    ctaBtn: string;
    from: string;
    orderNow: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    ourBakery: string;
    addToBag: string;
    heroTitleAura: string;
    exploreBtn: string;
  };
  shop: {
    title: string;
    subtitle: string;
    search: string;
    categories: string;
    allItems: string;
    itemCount: (n: number) => string;
    noItems: string;
    noItemsHint: string;
    soldOut: string;
    from: string;
  };
  cart: {
    title: string;
    back: string;
    backShop: string;
    steps: [string, string, string];
    yourItems: (n: number) => string;
    removeAll: string;
    addons: string;
    deliveryDetails: string;
    fullName: string;
    namePlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    deliveryAddress: string;
    addressPlaceholder: string;
    deliveryDate: string;
    timeSlot: string;
    anyTime: string;
    notes: string;
    notesPlaceholder: string;
    orderReview: string;
    name: string;
    phone2: string;
    date: string;
    time: string;
    address: string;
    note: string;
    orderItems: string;
    leadTime: string;
    whatsappNote: string;
    orderSummary: string;
    subtotal: string;
    deliveryCharges: string;
    total: string;
    couponCode: string;
    remove: string;
    apply: string;
    couponApplied: string;
    nextStep: string;
    reviewOrder: string;
    sendWhatsapp: string;
    sending: string;
    whatsappFooter: string;
    dateUnavailable: string;
    dateFull: string;
    dateBlackout: string;
    slotsRemaining: (n: number) => string;
    orderPlaced: string;
    orderSentDesc: string;
    confirmSoon: string;
    continueShopping: string;
    goHome: string;
    emptyCart: string;
    emptyCartDesc: string;
    shopNow: string;
    wa: {
      header: string;
      customer: string;
      phone: string;
      email: string;
      orderDetails: string;
      subtotal: string;
      discount: (code: string) => string;
      delivery: string;
      total: string;
      deliveryDate: string;
      time: string;
      address: string;
      note: string;
      product: string;
      image: string;
      variants: string;
      addons: string;
      message: string;
    };
  };
  product: {
    back: string;
    unavailable: string;
    addons: string;
    customMessage: string;
    customMessagePlaceholder: string;
    quantity: string;
    total: string;
    addToCart: string;
    unavailableBtn: string;
    relatedTitle: string;
    notFound: string;
    backToShop: string;
    selectOptions: string;
    addedToCart: (name: string, qty: number) => string;
  };
  validation: {
    nameMin: string;
    phoneMin: string;
    emailInvalid: string;
    addressMin: string;
    dateRequired: string;
  };
};

const en: Translation = {
  nav: {
    home: "Home",
    shop: "Shop",
    admin: "Admin",
    cart: "Cart",
    langLabel: "اردو",
  },
  footer: {
    brand: "Marhaba Sweets & Bakers",
    tagline: "Traditional flavors, crafted with love — fresh sweets & bakery delivered to your door.",
    location: "Our Location",
    address: "Main Road Farooqa\nTehsil Sahiwal, District Sargodha",
    orderTitle: "Order With Us",
    orderDesc: "Order via WhatsApp — 24-hour service",
    deliveryCharges: "Delivery charges: Rs. 300",
    copyright: "Marhaba Sweets & Bakers — All rights reserved",
  },
  home: {
    heroBadge: "Fresh & Delicious",
    heroTitle: "Marhaba Sweets & Bakers",
    heroSubtitle: "Traditional flavors, modern style — fresh sweets & bakery items delivered to your door",
    heroBtn: "Order Now",
    viewBtn: "View Now",
    whyTitle: "Our Features",
    whySubtitle: "Why Choose Us",
    features: [
      { title: "Quality Ingredients", desc: "Only fresh and pure ingredients are used" },
      { title: "Made with Love", desc: "Every item is handcrafted, not machine-made" },
      { title: "Home Delivery", desc: "Delivered to your doorstep for just Rs. 300" },
      { title: "On-Time Delivery", desc: "Guaranteed preparation within 24 hours of order" },
    ],
    categoriesTitle: "Shop by Category",
    categoriesSubtitle: "Browse",
    allItems: "All Items",
    popularTitle: "Most Popular Items",
    popularSubtitle: "Best Sellers",
    viewAll: "View All",
    noProducts: "No products yet — coming soon!",
    locationTitle: "Our Location",
    orderTitle: "How to Order",
    orderDesc: "Order via WhatsApp — 24-hour service\nDelivery charges: Rs. 300 only",
    orderBtn: "Order Now",
    ctaBadge: "For Special Occasions",
    ctaTitle: "Custom Orders Are Also Accepted",
    ctaDesc: "Wedding, birthday, aqeeqah or any special occasion — we will prepare sweets and cakes of your choice.",
    ctaBtn: "Start Ordering Now",
    from: "from",
    orderNow: "Order",
    feature1Title: "Handmade",
    feature1Desc: "Slow Fermented,\nHandcrafted Loaves",
    feature2Title: "Quick Delivery",
    feature2Desc: "Fresh Bakes to Your\nDoor in Hours",
    ourBakery: "Our Bakery",
    addToBag: "Add to Bag",
    heroTitleAura: "Artisanal Breads,\nCrafted With Care.",
    exploreBtn: "Explore Collection",
  },
  shop: {
    title: "Our Bakery",
    subtitle: "Fresh & delicious items — made with love",
    search: "Search...",
    categories: "Categories",
    allItems: "All Items",
    itemCount: (n) => `${n} item${n !== 1 ? "s" : ""}`,
    noItems: "No treats found",
    noItemsHint: "Try a different search or category.",
    soldOut: "Sold Out",
    from: "from",
  },
  cart: {
    title: "Your Cart",
    back: "Back",
    backShop: "Shop",
    steps: ["Cart", "Details", "Confirm"],
    yourItems: (n) => `Your Items (${n})`,
    removeAll: "Remove All",
    addons: "Add-ons",
    deliveryDetails: "Delivery Details",
    fullName: "Full Name *",
    namePlaceholder: "Your name",
    phone: "Phone Number *",
    phonePlaceholder: "+92 300 0000000",
    email: "Email (optional)",
    emailPlaceholder: "you@example.com",
    deliveryAddress: "Delivery Address *",
    addressPlaceholder: "Enter full address",
    deliveryDate: "Delivery Date *",
    timeSlot: "Time Slot (optional)",
    anyTime: "Any Time",
    notes: "Special Instructions (optional)",
    notesPlaceholder: "Any special instructions...",
    orderReview: "Order Review",
    name: "Name",
    phone2: "Phone",
    date: "Date",
    time: "Time",
    address: "Address",
    note: "Note",
    orderItems: "Order Items",
    leadTime: "Orders must be placed at least 24 hours in advance.",
    whatsappNote: 'Pressing "Send on WhatsApp" will open the order on WhatsApp.',
    orderSummary: "Order Summary",
    subtotal: "Subtotal",
    deliveryCharges: "Delivery Charges",
    total: "Total",
    couponCode: "Coupon Code",
    remove: "Remove",
    apply: "Apply",
    couponApplied: "applied!",
    nextStep: "Next Step →",
    reviewOrder: "Review Order →",
    sendWhatsapp: "Send Order on WhatsApp",
    sending: "Sending...",
    whatsappFooter: "Order will open in WhatsApp — confirm and send.",
    dateUnavailable: "Date not available",
    dateFull: "This date is full",
    dateBlackout: "This date is a blackout date",
    slotsRemaining: (n) => `${n} slots remaining`,
    orderPlaced: "Order Sent! 🎉",
    orderSentDesc: "Your order has been sent via WhatsApp.",
    confirmSoon: "We will confirm your order shortly.",
    continueShopping: "Continue Shopping",
    goHome: "Go Home",
    emptyCart: "Cart is Empty",
    emptyCartDesc: "Add some items and place an order.",
    shopNow: "Shop Now",
    wa: {
      header: "🎂 *New Order — Marhaba Sweets & Bakers*",
      customer: "Customer",
      phone: "Phone",
      email: "Email",
      orderDetails: "*Order Details:*",
      subtotal: "Subtotal",
      discount: (code) => `Discount (${code})`,
      delivery: "Delivery Charges",
      total: "Total Amount",
      deliveryDate: "Delivery Date",
      time: "Time",
      address: "Address",
      note: "Note",
      product: "Product",
      image: "Image",
      variants: "Variants",
      addons: "Add-ons",
      message: "Message",
    },
  },
  product: {
    back: "Back",
    unavailable: "Currently Unavailable",
    addons: "Add-ons",
    customMessage: "Cake Message (optional)",
    customMessagePlaceholder: "e.g. Happy Birthday Sarah!",
    quantity: "Quantity",
    total: "Total",
    addToCart: "Add to Cart",
    unavailableBtn: "Unavailable",
    relatedTitle: "You Might Also Like",
    notFound: "Product not found.",
    backToShop: "Back to Shop",
    selectOptions: "Please select all options",
    addedToCart: (name, qty) => `${name} × ${qty} added to cart!`,
  },
  validation: {
    nameMin: "Name must be at least 2 characters",
    phoneMin: "Please enter a valid phone number",
    emailInvalid: "Please enter a valid email",
    addressMin: "Please enter a complete address",
    dateRequired: "Please select a delivery date",
  },
};

const ur: Translation = {
  nav: {
    home: "ہوم",
    shop: "شاپ",
    admin: "ایڈمن",
    cart: "کارٹ",
    langLabel: "English",
  },
  footer: {
    brand: "مرحبا سویٹس اینڈ بیکرز",
    tagline: "روایتی ذائقہ، محبت سے تیار — تازہ مٹھائی اور بیکری آئٹمز آپ کے دروازے تک۔",
    location: "ہماری لوکیشن",
    address: "مین روڈ فروکہ\nتحصیل ساہیوال، ضلع سرگودھا",
    orderTitle: "آرڈر کریں",
    orderDesc: "واٹس ایپ پر آرڈر کریں — چوبیس گھنٹے سروس",
    deliveryCharges: "ڈیلیوری چارجز: صرف ۳۰۰ روپے",
    copyright: "مرحبا سویٹس اینڈ بیکرز — تمام حقوق محفوظ ہیں",
  },
  home: {
    heroBadge: "تازہ اور لذیذ",
    heroTitle: "مرحبا سویٹس اینڈ بیکرز",
    heroSubtitle: "روایتی ذائقہ، جدید انداز — تازہ مٹھائی اور بیکری آئٹمز آپ کے دروازے تک",
    heroBtn: "ابھی آرڈر کریں",
    viewBtn: "ابھی دیکھیں",
    whyTitle: "ہماری خصوصیات",
    whySubtitle: "ہمیں کیوں منتخب کریں",
    features: [
      { title: "معیاری اجزاء", desc: "صرف تازہ اور خالص اجزاء استعمال کیے جاتے ہیں" },
      { title: "محبت سے تیار", desc: "ہر آئٹم ہاتھ سے بنایا جاتا ہے، مشینی نہیں" },
      { title: "گھر تک ڈیلیوری", desc: "صرف ۳۰۰ روپے میں آپ کے دروازے تک" },
      { title: "وقت پر ڈیلیوری", desc: "آرڈر پر چوبیس گھنٹے میں تیاری کی ضمانت" },
    ],
    categoriesTitle: "قسم کے مطابق خریدیں",
    categoriesSubtitle: "دیکھیں",
    allItems: "تمام آئٹمز",
    popularTitle: "مشہور ترین آئٹمز",
    popularSubtitle: "سب سے زیادہ پسند",
    viewAll: "سب دیکھیں",
    noProducts: "ابھی کوئی پروڈکٹ نہیں — جلد آ رہا ہے!",
    locationTitle: "ہماری لوکیشن",
    orderTitle: "آرڈر کا طریقہ",
    orderDesc: "واٹس ایپ پر آرڈر کریں — چوبیس گھنٹے سروس\nڈیلیوری چارجز: صرف ۳۰۰ روپے",
    orderBtn: "ابھی آرڈر کریں",
    ctaBadge: "خاص مواقع کے لیے",
    ctaTitle: "کسٹم آرڈر بھی قبول کیے جاتے ہیں",
    ctaDesc: "شادی، سالگرہ، عقیقہ یا کوئی بھی خاص موقع — ہم آپ کی پسند کی مٹھائی اور کیک تیار کریں گے۔",
    ctaBtn: "ابھی آرڈر شروع کریں",
    from: "سے",
    orderNow: "آرڈر کریں",
    feature1Title: "ہاتھ سے تیار",
    feature1Desc: "آہستہ خمیر شدہ،\nمحبت سے تیار روٹیاں",
    feature2Title: "تیز ڈیلیوری",
    feature2Desc: "تازہ بیکری آئٹمز\nچند گھنٹوں میں آپ کے دروازے پر",
    ourBakery: "ہماری بیکری",
    addToBag: "بیگ میں شامل کریں",
    heroTitleAura: "روایتی انداز،\nمحبت سے تیار کردہ۔",
    exploreBtn: "ہماری کلیکشن دیکھیں",
  },
  shop: {
    title: "ہماری بیکری",
    subtitle: "تازہ اور لذیذ آئٹمز — محبت سے تیار کردہ",
    search: "تلاش کریں...",
    categories: "اقسام",
    allItems: "تمام آئٹمز",
    itemCount: (n) => `${n} آئٹمز`,
    noItems: "کوئی آئٹم نہیں ملا",
    noItemsHint: "کوئی اور تلاش یا قسم آزمائیں۔",
    soldOut: "دستیاب نہیں",
    from: "سے",
  },
  cart: {
    title: "آپ کا کارٹ",
    back: "پیچھے",
    backShop: "شاپ",
    steps: ["آئٹمز", "ڈیلیوری", "تصدیق"],
    yourItems: (n) => `آپ کے آئٹمز (${n})`,
    removeAll: "سب ہٹائیں",
    addons: "اضافی آئٹمز",
    deliveryDetails: "ڈیلیوری کی تفصیلات",
    fullName: "مکمل نام *",
    namePlaceholder: "آپ کا نام",
    phone: "فون نمبر *",
    phonePlaceholder: "+92 300 0000000",
    email: "ای میل (اختیاری)",
    emailPlaceholder: "you@example.com",
    deliveryAddress: "ڈیلیوری پتہ *",
    addressPlaceholder: "مکمل پتہ درج کریں",
    deliveryDate: "ڈیلیوری تاریخ *",
    timeSlot: "وقت کا سلاٹ (اختیاری)",
    anyTime: "کوئی بھی وقت",
    notes: "خاص ہدایات (اختیاری)",
    notesPlaceholder: "کوئی خاص ہدایت...",
    orderReview: "آرڈر کی تصدیق",
    name: "نام",
    phone2: "فون",
    date: "تاریخ",
    time: "وقت",
    address: "پتہ",
    note: "نوٹ",
    orderItems: "آرڈر آئٹمز",
    leadTime: "کم از کم ۲۴ گھنٹے پہلے آرڈر ضروری ہے۔",
    whatsappNote: '"واٹس ایپ پر بھیجیں" بٹن دبانے پر آرڈر واٹس ایپ میں کھل جائے گا۔',
    orderSummary: "آرڈر خلاصہ",
    subtotal: "ذیلی کل",
    deliveryCharges: "ڈیلیوری چارجز",
    total: "کل رقم",
    couponCode: "کوپن کوڈ",
    remove: "ہٹائیں",
    apply: "لگائیں",
    couponApplied: "لگایا گیا!",
    nextStep: "اگلا مرحلہ",
    reviewOrder: "آرڈر کا جائزہ لیں",
    sendWhatsapp: "واٹس ایپ پر آرڈر بھیجیں",
    sending: "بھیجا جا رہا ہے...",
    whatsappFooter: "آرڈر واٹس ایپ میں کھل جائے گا — تصدیق کریں اور بھیج دیں۔",
    dateUnavailable: "تاریخ دستیاب نہیں",
    dateFull: "یہ تاریخ بھری ہوئی ہے",
    dateBlackout: "یہ تاریخ بند ہے",
    slotsRemaining: (n) => `${n} جگہیں باقی ہیں`,
    orderPlaced: "آرڈر بھیج دیا گیا! 🎉",
    orderSentDesc: "آپ کا آرڈر واٹس ایپ پر بھیج دیا گیا ہے۔",
    confirmSoon: "ہم جلد ہی آرڈر تصدیق کریں گے۔",
    continueShopping: "مزید خریداری کریں",
    goHome: "گھر جائیں",
    emptyCart: "کارٹ خالی ہے",
    emptyCartDesc: "کوئی آئٹم شامل کریں اور آرڈر کریں۔",
    shopNow: "شاپ کریں",
    wa: {
      header: "🎂 *نیا آرڈر — مرحبا سویٹس اینڈ بیکرز*",
      customer: "کسٹمر",
      phone: "فون",
      email: "ای میل",
      orderDetails: "*آرڈر کی تفصیل:*",
      subtotal: "ذیلی کل",
      discount: (code) => `چھوٹ (${code})`,
      delivery: "ڈیلیوری چارجز",
      total: "کل رقم",
      deliveryDate: "ڈیلیوری تاریخ",
      time: "وقت",
      address: "پتہ",
      note: "نوٹ",
      product: "پروڈکٹ",
      image: "تصویر",
      variants: "اقسام",
      addons: "اضافی آئٹمز",
      message: "پیغام",
    },
  },
  product: {
    back: "پیچھے",
    unavailable: "فی الحال دستیاب نہیں",
    addons: "اضافی آئٹمز",
    customMessage: "کیک پر پیغام (اختیاری)",
    customMessagePlaceholder: "مثال: Happy Birthday Sarah!",
    quantity: "تعداد",
    total: "کل",
    addToCart: "کارٹ میں شامل کریں",
    unavailableBtn: "دستیاب نہیں",
    relatedTitle: "یہ بھی پسند آ سکتے ہیں",
    notFound: "پروڈکٹ نہیں ملا۔",
    backToShop: "شاپ پر جائیں",
    selectOptions: "تمام آپشنز منتخب کریں",
    addedToCart: (name, qty) => `${name} × ${qty} کارٹ میں شامل ہو گیا!`,
  },
  validation: {
    nameMin: "نام کم از کم ۲ حروف کا ہونا چاہیے",
    phoneMin: "صحیح فون نمبر درج کریں",
    emailInvalid: "صحیح ای میل درج کریں",
    addressMin: "مکمل پتہ درج کریں",
    dateRequired: "ڈیلیوری کی تاریخ منتخب کریں",
  },
};

export const translations: Record<LangKey, Translation> = { en, ur };
