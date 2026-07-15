import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { CartItem } from "../data/cart";

type CartContextValue = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);

// Order-independent comparison — the same toppings picked in a different
// order should still count as "the same configuration".
function sameToppings(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((id, i) => id === sortedB[i]);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Adding the exact same product + size + toppings + drink again just bumps
  // the quantity on the existing line instead of creating a duplicate one.
  const addToCart = (item: CartItem) =>
    setCartItems((prev) => {
      const matchIndex = prev.findIndex(
        (existing) =>
          existing.product.id === item.product.id &&
          existing.sizeId === item.sizeId &&
          existing.drinkId === item.drinkId &&
          sameToppings(existing.toppingIds, item.toppingIds)
      );
      if (matchIndex === -1) return [...prev, item];
      const merged = [...prev];
      const existing = merged[matchIndex];
      merged[matchIndex] = {
        ...existing,
        quantity: existing.quantity + item.quantity,
        total: existing.total + item.total,
      };
      return merged;
    });
  const removeFromCart = (index: number) => setCartItems((prev) => prev.filter((_, i) => i !== index));
  const clearCart = () => setCartItems([]);

  const cartCount = useMemo(() => cartItems.reduce((sum, i) => sum + i.quantity, 0), [cartItems]);
  const cartTotal = useMemo(() => cartItems.reduce((sum, i) => sum + i.total, 0), [cartItems]);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, cartCount, cartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
