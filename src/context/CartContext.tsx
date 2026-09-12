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

import type {
  IProduct,
} from "@/types/marketplace";

/**
 * Marketplace cart products use the same
 * product contract as the API.
 */
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

const STORAGE_KEY =
  "agrinova-marketplace-cart";

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



  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (saved) {
        const parsed =
          JSON.parse(saved);

        if (
          Array.isArray(
            parsed
          )
        ) {
          setItems(
            parsed as CartItem[]
          );
        }
      }
    } catch (
      error
    ) {
      console.error(
        "Unable to restore marketplace cart:",
        error
      );

      localStorage.removeItem(
        STORAGE_KEY
      );
    } finally {
      setLoading(false);
    }
  }, []);

 

  useEffect(() => {
    if (loading) {
      return;
    }

    try {
      localStorage.setItem(
        STORAGE_KEY,

        JSON.stringify(
          items
        )
      );
    } catch (
      error
    ) {
      console.error(
        "Unable to save marketplace cart:",
        error
      );
    }
  }, [
    items,
    loading,
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

    const safeQuantity =
      Math.min(
        Math.max(
          1,

          Math.floor(
            quantity
          )
        ),

        available
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

              const available =
                Math.max(
                  1,

                  Number(
                    item
                      .product
                      .quantity ||
                      1
                  )
                );

              return {
                ...item,

                quantity:
                  Math.min(
                    Math.max(
                      1,

                      Math.floor(
                        quantity
                      )
                    ),

                    available
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

                  quantity:
                    Math.min(
                      item.quantity,

                      Number(
                        product.quantity
                      )
                    ),
                };
              } catch {
                /**
                 * Product may have been:
                 * - deleted
                 * - moderated
                 * - removed
                 * - otherwise unavailable
                 */
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