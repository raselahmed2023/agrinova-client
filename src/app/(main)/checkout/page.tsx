"use client";

import {
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  ArrowLeft,
  CreditCard,
  MapPin,
  Package,
  ShieldCheck,
  Truck,
} from "lucide-react";

import MarketplaceBackground from "@/components/marketplace/MarketplaceBackground";

import {
  useCart,
} from "@/context/CartContext";

import {
  useSession,
} from "@/lib/auth-client";

import {
  OrderService,
} from "@/services/order.service";

import type {
  IShippingAddress,
  PaymentMethod,
} from "@/types/marketplace";

/* ============================================================
   DELIVERY FEE
============================================================ */

const DELIVERY_FEE_PER_SELLER =
  Number(
    process.env
      .NEXT_PUBLIC_MARKETPLACE_DELIVERY_FEE ||
      120
  );

/* ============================================================
   INITIAL ADDRESS
============================================================ */

const initialAddress:
  IShippingAddress = {
    fullName: "",
    phone: "",
    address: "",
    division: "",
    district: "",
    upazila: "",
    postalCode: "",
  };

/* ============================================================
   PHONE HELPERS
============================================================ */

const normalizePhone =
  (
    value:
      string
  ) => {
    const cleaned =
      value
        .replace(
          /[\s-]/g,
          ""
        )
        .trim();

    if (
      cleaned.startsWith(
        "+880"
      )
    ) {
      return `0${cleaned.slice(
        4
      )}`;
    }

    return cleaned;
  };

const isValidBangladeshPhone =
  (
    value:
      string
  ) =>
    /^01[3-9]\d{8}$/.test(
      normalizePhone(
        value
      )
    );

/* ============================================================
   CHECKOUT KEY
============================================================ */

const createCheckoutKey =
  () => {
    if (
      typeof crypto !==
        "undefined" &&
      typeof crypto.randomUUID ===
        "function"
    ) {
      return crypto.randomUUID();
    }

    return `checkout-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 15)}`;
  };

/* ============================================================
   PAGE
============================================================ */

export default function CheckoutPage() {
  const router =
    useRouter();

  const idempotencyKeyRef =
    useRef("");

  const submitLockRef =
    useRef(false);

  const {
    data: session,
    isPending:
      sessionLoading,
  } =
    useSession();

  const {
    items,
    subtotal,
    clearCart,
    loading:
      cartLoading,
  } =
    useCart();

  const [
    address,
    setAddress,
  ] =
    useState<IShippingAddress>(
      initialAddress
    );

  const [
    paymentMethod,
    setPaymentMethod,
  ] =
    useState<PaymentMethod>(
      "cod"
    );

  const [
    notes,
    setNotes,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  /* ==========================================================
     ADDRESS
  ========================================================== */

  const updateAddress =
    (
      key:
        keyof IShippingAddress,

      value:
        string
    ) => {
      setAddress(
        (
          current
        ) => ({
          ...current,

          [key]:
            value,
        })
      );

      if (
        error
      ) {
        setError("");
      }
    };

  /* ==========================================================
     IDEMPOTENCY
  ========================================================== */

  const getCheckoutKey =
    () => {
      if (
        !idempotencyKeyRef
          .current
      ) {
        idempotencyKeyRef.current =
          createCheckoutKey();
      }

      return idempotencyKeyRef
        .current;
    };

  /* ==========================================================
     MULTI SELLER DELIVERY
  ========================================================== */

  const sellerIds =
    items.map(
      (
        item
      ) =>
        item.product
          .sellerId ||
        `unknown-${item.product._id}`
    );

  const sellerCount =
    items.length >
    0
      ? new Set(
          sellerIds
        ).size
      : 0;

  const deliveryFee =
    sellerCount *
    DELIVERY_FEE_PER_SELLER;

  const total =
    subtotal +
    deliveryFee;

  /* ==========================================================
     SUBMIT
  ========================================================== */

  const submit =
    async (
      event:
        FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      /**
       * Instant lock.
       *
       * Prevents double click before React
       * has time to update loading state.
       */
      if (
        submitLockRef
          .current ||
        loading
      ) {
        return;
      }

      if (
        sessionLoading ||
        cartLoading
      ) {
        return;
      }

      if (
        !session?.user
      ) {
        router.push(
          "/login?redirect=/checkout"
        );

        return;
      }

      if (
        !items.length
      ) {
        router.push(
          "/marketplace"
        );

        return;
      }

      /* ======================================================
         VALIDATION
      ====================================================== */

      if (
        !address.fullName
          .trim()
      ) {
        setError(
          "Please enter your full name."
        );

        return;
      }

      if (
        !isValidBangladeshPhone(
          address.phone
        )
      ) {
        setError(
          "Enter a valid Bangladesh mobile number, for example 01712345678."
        );

        return;
      }

      if (
        !address.address
          .trim()
      ) {
        setError(
          "Please enter your delivery address."
        );

        return;
      }

      if (
        !address.division
          .trim()
      ) {
        setError(
          "Please enter your division."
        );

        return;
      }

      if (
        !address.district
          .trim()
      ) {
        setError(
          "Please enter your district."
        );

        return;
      }

      submitLockRef.current =
        true;

      try {
        setLoading(true);
        setError("");

        /* ====================================================
           CREATE ORDER
        ==================================================== */

        const order =
          await OrderService
            .createOrder(
              {
                idempotencyKey:
                  getCheckoutKey(),

                items:
                  items.map(
                    (
                      item
                    ) => ({
                      productId:
                        item.product
                          ._id,

                      quantity:
                        item.quantity,
                    })
                  ),

                shippingAddress:
                  {
                    ...address,

                    fullName:
                      address
                        .fullName
                        .trim(),

                    phone:
                      normalizePhone(
                        address.phone
                      ),

                    address:
                      address
                        .address
                        .trim(),

                    division:
                      address
                        .division
                        .trim(),

                    district:
                      address
                        .district
                        .trim(),

                    upazila:
                      address
                        .upazila
                        ?.trim() ||
                      undefined,

                    postalCode:
                      address
                        .postalCode
                        ?.trim() ||
                      undefined,
                  },

                paymentMethod,

                notes:
                  notes.trim() ||
                  undefined,
              }
            );

        /* ====================================================
           CARD
        ==================================================== */

        if (
          paymentMethod ===
          "card"
        ) {
          const stripe =
            await OrderService
              .createStripeCheckoutSession(
                order._id
              );

          const stripeData =
            stripe as {
              checkoutUrl?:
                string;

              url?:
                string;

              sessionUrl?:
                string;

              data?: {
                checkoutUrl?:
                  string;

                url?:
                  string;

                sessionUrl?:
                  string;
              };
            };

          const checkoutUrl =
            stripeData
              .checkoutUrl ||
            stripeData.url ||
            stripeData
              .sessionUrl ||
            stripeData.data
              ?.checkoutUrl ||
            stripeData.data
              ?.url ||
            stripeData.data
              ?.sessionUrl;

          if (
            !checkoutUrl
          ) {
            throw new Error(
              "Stripe checkout URL was not returned by the server."
            );
          }

          window.location.assign(
            checkoutUrl
          );

          return;
        }

        /* ====================================================
           COD SUCCESS
        ==================================================== */

        clearCart();

        router.push(
          `/checkout/success?orderId=${encodeURIComponent(
            order._id
          )}&paymentMethod=cod`
        );
      } catch (
        err
      ) {
        setError(
          err instanceof
            Error
            ? err.message
            : "Unable to create order."
        );
      } finally {
        setLoading(false);

        submitLockRef.current =
          false;
      }
    };

  /* ============================================================
     LOADING
  ============================================================ */

  if (
    cartLoading ||
    sessionLoading
  ) {
    return (
      <MarketplaceBackground>

        <main className="min-h-screen px-4 py-8">

          <div className="mx-auto flex min-h-[520px] max-w-6xl items-center justify-center">

            <div
              className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-emerald-700"
              aria-label="Loading"
            />
          </div>
        </main>
      </MarketplaceBackground>
    );
  }

  /* ============================================================
     LOGIN
  ============================================================ */

  if (
    !session?.user
  ) {
    return (
      <MarketplaceBackground>

        <main className="min-h-screen px-4 py-10">

          <div className="mx-auto flex min-h-[500px] max-w-6xl items-center justify-center">

            <div className="w-full max-w-lg rounded-3xl border border-white/60 bg-white/85 p-8 text-center shadow-xl backdrop-blur-xl">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <ShieldCheck className="h-7 w-7" />
              </div>

              <h1 className="mt-5 text-2xl font-black text-slate-950">
                Login Required
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Login with your Farmer account before completing checkout.
              </p>

              <Link
                href="/login?redirect=/checkout"
                className="mt-6 inline-flex rounded-xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
              >
                Login to Continue
              </Link>
            </div>
          </div>
        </main>
      </MarketplaceBackground>
    );
  }

  /* ============================================================
     EMPTY CART
  ============================================================ */

  if (
    items.length ===
    0
  ) {
    return (
      <MarketplaceBackground>

        <main className="min-h-screen px-4 py-10">

          <div className="mx-auto flex min-h-[500px] max-w-6xl items-center justify-center">

            <div className="rounded-3xl border border-white/60 bg-white/85 p-10 text-center shadow-xl backdrop-blur-xl">

              <Package className="mx-auto h-10 w-10 text-emerald-700" />

              <h1 className="mt-4 text-2xl font-black text-slate-950">
                Your cart is empty
              </h1>

              <Link
                href="/marketplace"
                className="mt-6 inline-flex rounded-xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white"
              >
                Browse Marketplace
              </Link>
            </div>
          </div>
        </main>
      </MarketplaceBackground>
    );
  }

  /* ============================================================
     PAGE
  ============================================================ */

  return (
    <MarketplaceBackground>

      <main className="min-h-screen px-3 py-6 sm:px-5 sm:py-8 lg:px-6">

        <div className="mx-auto w-full max-w-6xl">

          {/* BACK */}

          <Link
            href="/cart"
            className="inline-flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2 text-sm font-bold text-slate-700 backdrop-blur-md transition hover:text-emerald-700"
          >
            <ArrowLeft className="h-4 w-4" />

            Back to Cart
          </Link>

          {/* HERO */}

          <div className="mt-4 overflow-hidden rounded-3xl border border-white/60 bg-white/75 p-5 shadow-lg backdrop-blur-xl sm:p-7">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">
                  Secure Checkout
                </p>

                <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">
                  Complete Your Order
                </h1>

                <p className="mt-2 text-sm text-slate-600">
                  Review your delivery information and choose a payment method.
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <ShieldCheck className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_370px]">

            {/* =================================================
                LEFT
            ================================================= */}

            <form
              onSubmit={
                submit
              }
              className="space-y-5"
            >

              {/* ADDRESS */}

              <section className="rounded-3xl border border-white/60 bg-white/85 p-5 shadow-md backdrop-blur-xl sm:p-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <MapPin className="h-4 w-4" />
                  </div>

                  <div>
                    <h2 className="font-black text-slate-950">
                      Delivery Information
                    </h2>

                    <p className="text-xs text-slate-500">
                      Where should your order be delivered?
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">

                  <Field
                    label="Full Name"
                    value={
                      address.fullName
                    }
                    onChange={(
                      value
                    ) =>
                      updateAddress(
                        "fullName",
                        value
                      )
                    }
                    placeholder="Your full name"
                    required
                  />

                  {/* PHONE */}

                  <label className="block">

                    <span className="text-xs font-bold text-slate-700">
                      Phone
                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </span>

                    <input
                      required
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      maxLength={
                        14
                      }
                      value={
                        address.phone
                      }
                      onChange={(
                        event
                      ) => {
                        const value =
                          event.target
                            .value;

                        if (
                          /^[0-9+\s-]*$/.test(
                            value
                          )
                        ) {
                          updateAddress(
                            "phone",
                            value
                          );
                        }
                      }}
                      placeholder="01712345678"
                      className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />

                    <p className="mt-1 text-[11px] text-slate-400">
                      Bangladesh mobile number
                    </p>
                  </label>

                  <div className="sm:col-span-2">

                    <Field
                      label="Full Address"
                      value={
                        address.address
                      }
                      onChange={(
                        value
                      ) =>
                        updateAddress(
                          "address",
                          value
                        )
                      }
                      placeholder="House, road, village or area"
                      required
                    />
                  </div>

                  <Field
                    label="Division"
                    value={
                      address.division
                    }
                    onChange={(
                      value
                    ) =>
                      updateAddress(
                        "division",
                        value
                      )
                    }
                    placeholder="Dhaka"
                    required
                  />

                  <Field
                    label="District"
                    value={
                      address.district
                    }
                    onChange={(
                      value
                    ) =>
                      updateAddress(
                        "district",
                        value
                      )
                    }
                    placeholder="Dhaka"
                    required
                  />

                  <Field
                    label="Upazila"
                    value={
                      address.upazila ||
                      ""
                    }
                    onChange={(
                      value
                    ) =>
                      updateAddress(
                        "upazila",
                        value
                      )
                    }
                    placeholder="Optional"
                  />

                  <Field
                    label="Postal Code"
                    value={
                      address.postalCode ||
                      ""
                    }
                    onChange={(
                      value
                    ) =>
                      updateAddress(
                        "postalCode",
                        value
                      )
                    }
                    placeholder="Optional"
                  />
                </div>
              </section>

              {/* PAYMENT */}

              <section className="rounded-3xl border border-white/60 bg-white/85 p-5 shadow-md backdrop-blur-xl sm:p-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <CreditCard className="h-4 w-4" />
                  </div>

                  <div>
                    <h2 className="font-black text-slate-950">
                      Payment Method
                    </h2>

                    <p className="text-xs text-slate-500">
                      Choose how you want to pay.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">

                  <PaymentOption
                    active={
                      paymentMethod ===
                      "cod"
                    }
                    icon={
                      <Package className="h-5 w-5" />
                    }
                    title="Cash on Delivery"
                    description="Pay when the order reaches you."
                    onClick={() =>
                      setPaymentMethod(
                        "cod"
                      )
                    }
                  />

                  <PaymentOption
                    active={
                      paymentMethod ===
                      "card"
                    }
                    icon={
                      <CreditCard className="h-5 w-5" />
                    }
                    title="Card Payment"
                    description="Continue to secure Stripe Checkout."
                    onClick={() =>
                      setPaymentMethod(
                        "card"
                      )
                    }
                  />
                </div>

                <div className="mt-5">

                  <label className="text-xs font-bold text-slate-700">
                    Order Notes
                  </label>

                  <textarea
                    value={
                      notes
                    }
                    onChange={(
                      event
                    ) =>
                      setNotes(
                        event.target
                          .value
                      )
                    }
                    rows={
                      3
                    }
                    maxLength={
                      1000
                    }
                    placeholder="Optional delivery instruction..."
                    className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {error && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    {
                      error
                    }
                  </div>
                )}
              </section>

              {/* BUTTON */}

              <button
                type="submit"
                disabled={
                  loading ||
                  !items.length
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b5d42] px-5 py-3.5 text-sm font-black text-white shadow-md transition hover:bg-[#084b35] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                    Processing...
                  </>
                ) : paymentMethod ===
                  "card" ? (
                  <>
                    <CreditCard className="h-4 w-4" />

                    Continue to Secure Payment
                  </>
                ) : (
                  <>
                    <Package className="h-4 w-4" />

                    Place COD Order
                  </>
                )}
              </button>
            </form>

            {/* =================================================
                SUMMARY
            ================================================= */}

            <aside className="h-fit overflow-hidden rounded-3xl border border-white/60 bg-white/90 shadow-lg backdrop-blur-xl lg:sticky lg:top-6">

              <div className="border-b border-slate-100 p-5 sm:p-6">

                <h2 className="font-black text-slate-950">
                  Order Summary
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {items.length}
                  {" "}
                  item
                  {items.length ===
                  1
                    ? ""
                    : "s"}
                  {" • "}
                  {sellerCount}
                  {" "}
                  seller
                  {sellerCount ===
                  1
                    ? ""
                    : "s"}
                </p>
              </div>

              <div className="max-h-[320px] space-y-4 overflow-y-auto p-5 sm:p-6">

                {items.map(
                  ({
                    product,
                    quantity,
                  }) => (
                    <div
                      key={
                        product._id
                      }
                      className="flex items-start justify-between gap-4"
                    >

                      <div className="min-w-0">

                        <p className="truncate text-sm font-bold text-slate-900">
                          {
                            product.title
                          }
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {quantity}
                          {" × ৳"}
                          {Number(
                            product.price
                          ).toLocaleString(
                            "en-BD"
                          )}
                        </p>

                        {product.sellerName && (
                          <p className="mt-1 text-[11px] text-slate-400">
                            {
                              product.sellerName
                            }
                          </p>
                        )}
                      </div>

                      <span className="shrink-0 text-sm font-black text-slate-900">
                        ৳
                        {(
                          Number(
                            product.price
                          ) *
                          quantity
                        ).toLocaleString(
                          "en-BD"
                        )}
                      </span>
                    </div>
                  )
                )}
              </div>

              <div className="border-t border-slate-100 p-5 sm:p-6">

                <SummaryRow
                  label="Subtotal"
                  value={
                    subtotal
                  }
                />

                <div className="mt-3 flex items-start justify-between gap-4 text-sm">

                  <div>

                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Truck className="h-3.5 w-3.5" />

                      <span>
                        Delivery
                      </span>
                    </div>

                    {sellerCount >
                    1 && (
                      <p className="mt-1 text-[10px] text-slate-400">
                        {sellerCount}
                        {" sellers × ৳"}
                        {DELIVERY_FEE_PER_SELLER}
                      </p>
                    )}
                  </div>

                  <span className="font-bold text-slate-900">
                    ৳
                    {deliveryFee.toLocaleString(
                      "en-BD"
                    )}
                  </span>
                </div>

                {sellerCount >
                  1 && (
                  <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-800">

                    Products are coming from{" "}
                    <strong>
                      {
                        sellerCount
                      } different sellers
                    </strong>
                    . Each seller requires a separate pickup and delivery.
                  </div>
                )}

                <div className="my-5 border-t border-slate-200" />

                <div className="flex items-end justify-between">

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Total
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                      Delivery included
                    </p>
                  </div>

                  <span className="text-2xl font-black text-emerald-700">
                    ৳
                    {total.toLocaleString(
                      "en-BD"
                    )}
                  </span>
                </div>

                <div className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs font-semibold text-emerald-800">
                  <ShieldCheck className="h-4 w-4 shrink-0" />

                  Secure AgriNova checkout
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </MarketplaceBackground>
  );
}

/* ============================================================
   FIELD
============================================================ */

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label:
    string;

  value:
    string;

  onChange:
    (
      value:
        string
    ) => void;

  placeholder?:
    string;

  required?:
    boolean;
}) {
  return (
    <label className="block">

      <span className="text-xs font-bold text-slate-700">
        {
          label
        }

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </span>

      <input
        required={
          required
        }
        value={
          value
        }
        placeholder={
          placeholder
        }
        onChange={(
          event
        ) =>
          onChange(
            event.target
              .value
          )
        }
        className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />
    </label>
  );
}

/* ============================================================
   PAYMENT OPTION
============================================================ */

function PaymentOption({
  active,
  icon,
  title,
  description,
  onClick,
}: {
  active:
    boolean;

  icon:
    ReactNode;

  title:
    string;

  description:
    string;

  onClick:
    () => void;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={`rounded-2xl border p-4 text-left transition ${
        active
          ? "border-emerald-500 bg-emerald-50 shadow-sm ring-2 ring-emerald-100"
          : "border-slate-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/30"
      }`}
    >

      <div className="flex items-center gap-3">

        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${
            active
              ? "bg-emerald-600 text-white"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {
            icon
          }
        </span>

        <span className="font-bold text-slate-900">
          {
            title
          }
        </span>
      </div>

      <p className="mt-3 text-xs leading-5 text-slate-500">
        {
          description
        }
      </p>
    </button>
  );
}

/* ============================================================
   SUMMARY
============================================================ */

function SummaryRow({
  label,
  value,
}: {
  label:
    string;

  value:
    number;
}) {
  return (
    <div className="flex justify-between text-sm">

      <span className="text-slate-600">
        {
          label
        }
      </span>

      <span className="font-bold text-slate-900">
        ৳
        {value.toLocaleString(
          "en-BD"
        )}
      </span>
    </div>
  );
}