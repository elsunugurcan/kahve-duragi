"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Grind, Weight } from "@/lib/pricing";

export type CartItem = { key: string; productId: number; slug: string; name: string; color: string; grind: Grind; weight: Weight; unitPrice: number; qty: number };

type CartState = {
  items: CartItem[];
  open: boolean;
  add: (item: Omit<CartItem, "key" | "qty">, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  setOpen: (v: boolean) => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      open: false,
      add: (item, qty = 1) => set((s) => {
        const key = `${item.productId}-${item.grind}-${item.weight}`;
        const found = s.items.find((i) => i.key === key);
        const items = found ? s.items.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i)) : [...s.items, { ...item, key, qty }];
        return { items, open: true };
      }),
      setQty: (key, qty) => set((s) => ({ items: qty <= 0 ? s.items.filter((i) => i.key !== key) : s.items.map((i) => (i.key === key ? { ...i, qty } : i)) })),
      remove: (key) => set((s) => ({ items: s.items.filter((i) => i.key !== key) })),
      clear: () => set({ items: [] }),
      setOpen: (open) => set({ open }),
    }),
    { name: "kahve-duragi-cart", partialize: (s) => ({ items: s.items }) }
  )
);

export const cartSubtotal = (items: CartItem[]) => items.reduce((a, i) => a + i.unitPrice * i.qty, 0);
export const cartCount = (items: CartItem[]) => items.reduce((a, i) => a + i.qty, 0);
