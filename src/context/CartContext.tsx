"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface CartProduct {
  _id: string;
  title: string;
  price: number;
  quantity: number;
  unit?: string;
  images?: string[];
  sellerId?: string;
  sellerEmail?: string;
  sellerName?: string;
  transactionType?: string;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  loading: boolean;

  addToCart: (
    product: CartProduct,
    quantity?: number
  ) => void;

  updateQuantity: (
    productId: string,
    quantity: number
  ) => void;

  removeFromCart: (
    productId: string
  ) => void;

  clearCart: () => void;

  getItemQuantity: (
    productId: string
  ) => number;
}

const CartContext =
  createContext<CartContextValue | undefined>(
    undefined
  );

const STORAGE_KEY =
  "agrinova-marketplace-cart";

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] =
    useState<CartItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  /*
   * Restore cart from localStorage.
   *
   * A small delay keeps the loading spinner
   * visible during a page refresh.
   */
  useEffect(() => {
    let timer: ReturnType<
      typeof setTimeout
    >;

    try {
      const saved =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (saved) {
        const parsed =
          JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      localStorage.removeItem(
        STORAGE_KEY
      );
    } finally {
      timer = setTimeout(() => {
        setLoading(false);
      }, 350);
    }

    return () => {
      clearTimeout(timer);
    };
  }, []);

  /*
   * Save cart after initial loading.
   */
  useEffect(() => {
    if (loading) return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(items)
      );
    } catch {
      // Ignore localStorage errors
    }
  }, [items, loading]);

  const addToCart = (
    product: CartProduct,
    quantity = 1
  ) => {
    const safeQuantity = Math.max(
      1,
      Math.floor(quantity)
    );

    setItems((current) => {
      const existing =
        current.find(
          (item) =>
            item.product._id ===
            product._id
        );

      const maxQuantity = Math.max(
        1,
        Number(product.quantity) || 1
      );

      if (!existing) {
        return [
          ...current,
          {
            product,
            quantity: Math.min(
              safeQuantity,
              maxQuantity
            ),
          },
        ];
      }

      return current.map((item) => {
        if (
          item.product._id !==
          product._id
        ) {
          return item;
        }

        return {
          ...item,
          quantity: Math.min(
            item.quantity +
              safeQuantity,
            maxQuantity
          ),
        };
      });
    });
  };

  const updateQuantity = (
    productId: string,
    quantity: number
  ) => {
    setItems((current) =>
      current.map((item) => {
        if (
          item.product._id !==
          productId
        ) {
          return item;
        }

        const maxQuantity = Math.max(
          1,
          Number(
            item.product.quantity
          ) || 1
        );

        return {
          ...item,
          quantity: Math.min(
            Math.max(
              1,
              Math.floor(quantity)
            ),
            maxQuantity
          ),
        };
      })
    );
  };

  const removeFromCart = (
    productId: string
  ) => {
    setItems((current) =>
      current.filter(
        (item) =>
          item.product._id !==
          productId
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemQuantity = (
    productId: string
  ) => {
    return (
      items.find(
        (item) =>
          item.product._id ===
          productId
      )?.quantity ?? 0
    );
  };

  const totalItems = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + item.quantity,
        0
      ),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum +
          Number(
            item.product.price || 0
          ) *
            item.quantity,
        0
      ),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}