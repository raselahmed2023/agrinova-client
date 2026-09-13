"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  MarketplaceService,
} from "@/services/marketplace.service";
import { useSession } from "@/lib/auth-client";

import type {
  IProduct,
} from "@/types/marketplace";


export type CartProduct =
  IProduct;

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

  refreshCart:
    () => Promise<void>;

  getItemQuantity: (
    productId: string
  ) => number;
}

const CartContext =
  createContext<
    CartContextValue
      | undefined
  >(undefined);

const STORAGE_KEY_PREFIX =
  "agrinova-marketplace-cart";


const LEGACY_SHARED_STORAGE_KEY =
  "agrinova-marketplace-cart";

const getStorageKey = (userId?: string | null) =>
  `${STORAGE_KEY_PREFIX}:${userId ? `user:${userId}` : "guest"}`;

const readStoredCart = (storageKey: string): CartItem[] => {
  try {
    const saved = localStorage.getItem(storageKey);

    if (!saved) return [];

    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch (error) {
    console.error("Unable to restore marketplace cart:", error);
    localStorage.removeItem(storageKey);
    return [];
  }
};

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [
    items,
    setItems,
  ] =
    useState<
      CartItem[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const {
    data: session,
    isPending: sessionPending,
  } = useSession();

  const userId = session?.user?.id || null;
  const storageKey = getStorageKey(userId);

  const [
    activeStorageKey,
    setActiveStorageKey,
  ] = useState<string | null>(null);

  
  useEffect(() => {
    if (sessionPending) return;

    setLoading(true);

 
    localStorage.removeItem(LEGACY_SHARED_STORAGE_KEY);

    const restoredItems = readStoredCart(storageKey);

    setItems(restoredItems);
    setActiveStorageKey(storageKey);
    setLoading(false);
  }, [sessionPending, storageKey]);

  
  useEffect(() => {
    if (
      loading ||
      sessionPending ||
      activeStorageKey !== storageKey
    ) {
      return;
    }

    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify(items)
      );
    } catch (error) {
      console.error(
        "Unable to save marketplace cart:",
        error
      );
    }
  }, [
    items,
    loading,
    sessionPending,
    activeStorageKey,
    storageKey,
  ]);

  const addToCart = (
    product:
      CartProduct,

    quantity = 1
  ) => {
    if (
      product.status !==
      "available"
    ) {
      return;
    }

    const available =
      Math.max(
        0,

        Number(
          product.quantity ||
            0
        )
      );

    if (
      available <= 0
    ) {
      return;
    }

    const minimumQuantity = Math.min(1, available);
    const requestedQuantity = Number.isFinite(Number(quantity))
      ? Number(quantity)
      : minimumQuantity;

    const safeQuantity = Number(
      Math.min(
        Math.max(minimumQuantity, requestedQuantity),
        available
      ).toFixed(3)
    );

    setItems(
      (
        current
      ) => {
        const existing =
          current.find(
            (
              item
            ) =>
              item
                .product
                ._id ===
              product._id
          );

        if (!existing) {
          return [
            ...current,

            {
              product,

              quantity:
                safeQuantity,
            },
          ];
        }

        return current.map(
          (
            item
          ) => {
            if (
              item
                .product
                ._id !==
              product._id
            ) {
              return item;
            }

            return {
              ...item,

              product,

              quantity:
                Math.min(
                  item.quantity +
                    safeQuantity,

                  available
                ),
            };
          }
        );
      }
    );
  };

  const updateQuantity =
    (
      productId:
        string,

      quantity:
        number
    ) => {
      setItems(
        (
          current
        ) =>
          current.map(
            (
              item
            ) => {
              if (
                item
                  .product
                  ._id !==
                productId
              ) {
                return item;
              }

              const available = Math.max(
                0,
                Number(item.product.quantity || 0)
              );

              if (available <= 0) {
                return item;
              }

              const minimumQuantity = Math.min(1, available);
              const requestedQuantity = Number.isFinite(Number(quantity))
                ? Number(quantity)
                : minimumQuantity;

              return {
                ...item,
                quantity: Number(
                  Math.min(
                    Math.max(minimumQuantity, requestedQuantity),
                    available
                  ).toFixed(3)
                ),
              };
            }
          )
      );
    };

  const removeFromCart =
    (
      productId:
        string
    ) => {
      setItems(
        (
          current
        ) =>
          current.filter(
            (
              item
            ) =>
              item
                .product
                ._id !==
              productId
          )
      );
    };

  const clearCart =
    () => {
      setItems([]);
    };

  const refreshCart =
    async () => {
      if (
        items.length ===
        0
      ) {
        return;
      }

      const refreshed:
        Array<
          CartItem | null
        > =
        await Promise.all(
          items.map(
            async (
              item
            ): Promise<
              CartItem | null
            > => {
              try {
                const product =
                  await MarketplaceService.getProductById(
                    item
                      .product
                      ._id
                  );

                if (
                  product.status !==
                    "available" ||
                  Number(
                    product.quantity
                  ) <= 0
                ) {
                  return null;
                }

                return {
                  product,

                  quantity: Number(
                    Math.min(
                      Math.max(
                        Math.min(1, Number(product.quantity)),
                        Number(item.quantity)
                      ),
                      Number(product.quantity)
                    ).toFixed(3)
                  ),
                };
              } catch {
                
                return null;
              }
            }
          )
        );

      const validItems =
        refreshed.filter(
          (
            item
          ): item is CartItem =>
            item !== null
        );

      setItems(
        validItems
      );
    };

  const getItemQuantity =
    (
      productId:
        string
    ) => {
      return (
        items.find(
          (
            item
          ) =>
            item.product
              ._id ===
            productId
        )?.quantity ??
        0
      );
    };

  const totalItems =
    useMemo(
      () =>
        items.reduce(
          (
            total,
            item
          ) =>
            total +
            item.quantity,

          0
        ),

      [items]
    );

  const subtotal =
    useMemo(
      () =>
        items.reduce(
          (
            total,
            item
          ) =>
            total +
            Number(
              item.product
                .price ||
                0
            ) *
              item.quantity,

          0
        ),

      [items]
    );

  const value =
    useMemo<
      CartContextValue
    >(
      () => ({
        items,

        totalItems,

        subtotal,

        loading,

        addToCart,

        updateQuantity,

        removeFromCart,

        clearCart,

        refreshCart,

        getItemQuantity,
      }),

      [
        items,
        totalItems,
        subtotal,
        loading,
      ]
    );

  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context =
    useContext(
      CartContext
    );

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}