"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: {
    id: string;
    name: string;
    value: string;
  }[];
  teamId: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Computed values
  itemCount: number;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find(i => i.id === item.id);

        if (existingItem) {
          set({
            items: items.map(i =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            )
          });
        } else {
          set({
            items: [...items, { ...item, quantity: 1 }]
          });
        }
      },

      removeItem: (id) => {
        set({
          items: get().items.filter(item => item.id !== id)
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set({
          items: get().items.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      toggleCart: () => {
        set({ isOpen: !get().isOpen });
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      get itemCount() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      get subtotal() {
        return get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      },

      get tax() {
        // Simple 8% tax calculation
        return get().subtotal * 0.08;
      },

      get shipping() {
        const subtotal = get().subtotal;
        // Free shipping over $50
        return subtotal >= 50 ? 0 : 9.99;
      },

      get total() {
        return get().subtotal + get().tax + get().shipping;
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ items: state.items }),
    }
  )
);