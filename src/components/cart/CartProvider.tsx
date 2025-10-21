"use client";

import { createContext, useContext, ReactNode } from "react";
import { useCartStore } from "@/state/cart";

interface CartContextType {
  // Cart state and actions will be provided by the store
}

const CartContext = createContext<CartContextType>({});

export function CartProvider({ children }: { children: ReactNode }) {
  return (
    <CartContext.Provider value={{}}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useCartStore();
}
