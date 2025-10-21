import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  attributes?: Record<string, string>;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  total: number;
  itemCount: number;

  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      total: 0,
      itemCount: 0,

      addItem: (item) => {
        const { items } = get();
        const existingItem = items.find(
          (i) => i.productId === item.productId && i.variantId === item.variantId
        );

        if (existingItem) {
          set((state) => ({
            items: state.items.map((i) =>
              i.id === existingItem.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          }));
        } else {
          const newItem: CartItem = {
            ...item,
            id: `${item.productId}-${item.variantId || 'default'}-${Date.now()}`,
          };
          set((state) => ({
            items: [...state.items, newItem],
          }));
        }

        // Update totals
        get().updateTotals();
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
        get().updateTotals();
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
        get().updateTotals();
      },

      clearCart: () => {
        set({ items: [] });
        get().updateTotals();
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      setCartOpen: (open) => {
        set({ isOpen: open });
      },

      updateTotals: () => {
        const { items } = get();
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
        set({ total, itemCount });
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
