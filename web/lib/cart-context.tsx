"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { BASE_PRICE, FLOQUAGE_PRICE, type Size } from "./products";

export type CartItem = {
  id: string; // stable key: slug + size + floquage + nom + numero
  slug: string;
  name: string;
  image: string;
  size: Size;
  floque: boolean;
  nom?: string;
  numero?: string;
  qty: number;
};

type AddInput = Omit<CartItem, "id" | "qty"> & { qty?: number };

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (input: AddInput) => void;
  setQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  hydrated: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "tnt-cart";

function makeId(input: AddInput) {
  return [input.slug, input.size, input.floque ? "floque" : "brut", input.nom ?? "", input.numero ?? ""].join("::");
}

export function itemUnitPrice(item: Pick<CartItem, "floque">) {
  return BASE_PRICE + (item.floque ? FLOQUAGE_PRICE : 0);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Reading localStorage can't happen during the initial render (it must
    // match the server-rendered empty cart to avoid a hydration mismatch),
    // so the hydrated cart is applied once, right after mount.
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage unavailable (private mode, quota) — cart just won't persist
    }
  }, [items, hydrated]);

  const addItem = useCallback((input: AddInput) => {
    const id = makeId(input);
    const qty = input.qty ?? 1;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { ...input, id, qty }];
    });
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) =>
      qty <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, qty } : i))
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.reduce((n, i) => n + i.qty, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + itemUnitPrice(i) * i.qty, 0),
    [items]
  );

  const value = useMemo(
    () => ({ items, count, subtotal, addItem, setQty, removeItem, clear, hydrated }),
    [items, count, subtotal, addItem, setQty, removeItem, clear, hydrated]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
