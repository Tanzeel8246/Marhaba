import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: number;
  productName: string;
  productImageUrl?: string | null;
  quantity: number;
  unitPrice: number;
  selectedVariants: { [key: string]: string };
  selectedAddons: string[];
  customMessage?: string | null;
  subtotal: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          // Check if same product with same variants/addons exists
          const existingIndex = state.items.findIndex(
            (i) =>
              i.productId === item.productId &&
              JSON.stringify(i.selectedVariants) === JSON.stringify(item.selectedVariants) &&
              JSON.stringify(i.selectedAddons) === JSON.stringify(item.selectedAddons) &&
              i.customMessage === item.customMessage
          );

          if (existingIndex >= 0) {
            const newItems = [...state.items];
            const existingItem = newItems[existingIndex];
            const newQuantity = existingItem.quantity + item.quantity;
            newItems[existingIndex] = {
              ...existingItem,
              quantity: newQuantity,
              subtotal: newQuantity * existingItem.unitPrice,
            };
            return { items: newItems };
          }

          return { items: [...state.items, item] };
        }),
      removeItem: (index) =>
        set((state) => ({
          items: state.items.filter((_, i) => i !== index),
        })),
      updateQuantity: (index, quantity) =>
        set((state) => {
          const newItems = [...state.items];
          if (quantity <= 0) {
            newItems.splice(index, 1);
          } else {
            newItems[index] = {
              ...newItems[index],
              quantity,
              subtotal: quantity * newItems[index].unitPrice,
            };
          }
          return { items: newItems };
        }),
      clearCart: () => set({ items: [] }),
      total: () => {
        return get().items.reduce((acc, item) => acc + item.subtotal, 0);
      },
    }),
    {
      name: "bake-delight-cart",
    }
  )
);
