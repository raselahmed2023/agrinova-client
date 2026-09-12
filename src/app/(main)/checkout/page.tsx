
"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  CreditCard,
  MapPin,
  Package,
} from "lucide-react";

import MarketplaceBackground from "@/components/marketplace/MarketplaceBackground";

import { useCart } from "@/context/CartContext";

import { OrderService } from "@/services/order.service";

import type {
  IShippingAddress,
  PaymentMethod,
} from "@/types/marketplace";

import { useSession } from "@/lib/auth-client";

const DELIVERY_FEE = 120;

const initialAddress: IShippingAddress = {
  fullName: "",
  phone: "",
  address: "",
  division: "",
  district: "",
  upazila: "",
  postalCode: "",
};

export default function CheckoutPage() {
  const router = useRouter();

  const {
    data: session,
    isPending: sessionLoading,
  } = useSession();

  const {
    items,
    subtotal,
    clearCart,
    refreshCart,
    loading: cartLoading,
  } = useCart();

  const [address, setAddress] =
    useState<IShippingAddress>(
      initialAddress
    );

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("cod");

  const [notes, setNotes] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!cartLoading) {
      refreshCart().catch(() => undefined);
    }
    // Refresh persisted product stock once before checkout.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartLoading]);

  const updateAddress = (
    key: keyof IShippingAddress,
    value: string
  ) => {
    setAddress((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const deliveryFee = DELIVERY_FEE;

  const total =
    subtotal + deliveryFee;

  const submit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (sessionLoading || cartLoading) {
      return;
    }

    if (!session?.user) {
      router.push(
        "/login?redirect=/checkout"
      );
      return;
    }

    if (!items.length) {
      router.push("/marketplace");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const order =
        await OrderService.createOrder({
          items: items.map((item) => ({
            productId:
              item.product._id,
            quantity:
              item.quantity,
          })),

          shippingAddress:
            address,

          paymentMethod,

          notes:
            notes.trim() ||
            undefined,
        });

      if (
        paymentMethod === "card"
      ) {
        const stripe =
          await OrderService.createStripeCheckoutSession(
            order._id
          );

        if (!stripe.url) {
          throw new Error(
            "Stripe checkout URL was not returned by the server."
          );
        }

        window.location.assign(stripe.url);

        return;
      }

      clearCart();

      router.push(
        `/checkout/success?orderId=${encodeURIComponent(
          order._id
        )}&paymentMethod=${encodeURIComponent(
          paymentMethod
        )}`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create order."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Page loading
   * Spinner only — no text, no icon.
   */
  if (
    cartLoading ||
    sessionLoading
  ) {
    return (
      <MarketplaceBackground>
        <main className="min-h-screen px-3 py-6 sm:px-5 sm:py-8 lg:px-6">
          <div className="mx-auto flex min-h-[500px] w-full max-w-6xl items-center justify-center">
            <div
              className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-emerald-700"
              aria-label="Loading"
            />
          </div>
        </main>
      </MarketplaceBackground>
    );
  }

  /*
   * Login required
   */
  if (!session?.user) {
    return (
      <MarketplaceBackground>
        <main className="min-h-screen px-3 py-8 sm:px-5 lg:px-6">
          <div className="mx-auto flex min-h-[500px] max-w-6xl items-center justify-center">
            <div className="w-full max-w-xl rounded-3xl border border-white/70 bg-white/90 p-8 text-center shadow-lg backdrop-blur-sm sm:p-10">
              <h1 className="text-3xl font-bold text-black">
                Login Required
              </h1>

              <p className="mt-3 text-sm leading-6 text-black">
                You need to login as a
                farmer before you can
                place a marketplace
                order.
              </p>

              <Link
                href="/login?redirect=/checkout"
                className="mt-6 inline-flex rounded-xl bg-emerald-700 px-6 py-3 font-semibold text-white transition hover:bg-emerald-800"
              >
                Login to Continue
              </Link>
            </div>
          </div>
        </main>
      </MarketplaceBackground>
    );
  }

  return (
    <MarketplaceBackground>
      <main className="min-h-screen px-3 py-6 sm:px-5 sm:py-8 lg:px-6">
        <div className="mx-auto w-full max-w-6xl">

          {/* Back */}
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm font-semibold text-black transition hover:text-emerald-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Link>

          {/* Heading */}
          <h1 className="mt-5 text-3xl font-bold text-black">
            Checkout
          </h1>

          <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_360px]">

            {/* Left */}
            <form
              onSubmit={submit}
              className="space-y-5"
            >

              {/* Delivery Address */}
              <section className="rounded-2xl border border-white/70 bg-white/90 p-5 shadow-sm backdrop-blur-sm sm:p-6">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-emerald-700" />

                  <h2 className="text-lg font-bold text-black">
                    Delivery Address
                  </h2>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">

                  <Field
                    label="Full Name"
                    value={
                      address.fullName
                    }
                    onChange={(value) =>
                      updateAddress(
                        "fullName",
                        value
                      )
                    }
                    required
                  />

                  <Field
                    label="Phone"
                    value={
                      address.phone
                    }
                    onChange={(value) =>
                      updateAddress(
                        "phone",
                        value
                      )
                    }
                    required
                  />

                  <div className="sm:col-span-2">
                    <Field
                      label="Address"
                      value={
                        address.address
                      }
                      onChange={(value) =>
                        updateAddress(
                          "address",
                          value
                        )
                      }
                      required
                    />
                  </div>

                  <Field
                    label="Division"
                    value={
                      address.division
                    }
                    onChange={(value) =>
                      updateAddress(
                        "division",
                        value
                      )
                    }
                    required
                  />

                  <Field
                    label="District"
                    value={
                      address.district
                    }
                    onChange={(value) =>
                      updateAddress(
                        "district",
                        value
                      )
                    }
                    required
                  />

                  <Field
                    label="Upazila"
                    value={
                      address.upazila ||
                      ""
                    }
                    onChange={(value) =>
                      updateAddress(
                        "upazila",
                        value
                      )
                    }
                  />

                  <Field
                    label="Postal Code"
                    value={
                      address.postalCode ||
                      ""
                    }
                    onChange={(value) =>
                      updateAddress(
                        "postalCode",
                        value
                      )
                    }
                  />

                </div>
              </section>

              {/* Payment */}
              <section className="rounded-2xl border border-white/70 bg-white/90 p-5 shadow-sm backdrop-blur-sm sm:p-6">
                <h2 className="text-lg font-bold text-black">
                  Payment Method
                </h2>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">

                  <PaymentOption
                    active={
                      paymentMethod ===
                      "cod"
                    }
                    icon={
                      <Package className="h-5 w-5" />
                    }
                    title="Cash on Delivery"
                    description="Pay when your order arrives."
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
                    title="Card"
                    description="Secure Stripe Checkout."
                    onClick={() =>
                      setPaymentMethod(
                        "card"
                      )
                    }
                  />

                </div>

                {/* Notes */}
                <div className="mt-5">
                  <label className="text-sm font-medium text-black">
                    Order Notes
                  </label>

                  <textarea
                    value={notes}
                    onChange={(event) =>
                      setNotes(
                        event.target.value
                      )
                    }
                    rows={3}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-black outline-none focus:border-emerald-500"
                    placeholder="Optional notes..."
                  />
                </div>

                {error && (
                  <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                    {error}
                  </div>
                )}
              </section>

              {/* Submit */}
              <button
                type="submit"
                disabled={
                  loading ||
                  !items.length
                }
                className="w-full rounded-xl bg-emerald-700 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Processing
                  </span>
                ) : paymentMethod === "card" ? (
                  "Continue to Secure Payment"
                ) : (
                  "Place COD Order"
                )}
              </button>

            </form>

            {/* Right - Order Summary */}
            <aside className="h-fit rounded-2xl border border-white/70 bg-white/90 p-5 shadow-sm backdrop-blur-sm sm:p-6 lg:sticky lg:top-6">

              <h2 className="text-lg font-bold text-black">
                Order Summary
              </h2>

              {/* Items */}
              <div className="mt-5 space-y-4">
                {items.map(
                  ({
                    product,
                    quantity,
                  }) => (
                    <div
                      key={
                        product._id
                      }
                      className="flex justify-between gap-4 text-sm"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-black">
                          {
                            product.title
                          }
                        </p>

                        <p className="mt-1 text-black">
                          {quantity} × ৳
                          {Number(
                            product.price
                          ).toLocaleString(
                            "en-BD"
                          )}
                        </p>
                      </div>

                      <span className="shrink-0 font-semibold text-black">
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

              <div className="my-5 border-t border-slate-300" />

              {/* Subtotal */}
              <div className="flex justify-between text-sm text-black">
                <span>
                  Subtotal
                </span>

                <span className="font-semibold">
                  ৳
                  {subtotal.toLocaleString(
                    "en-BD"
                  )}
                </span>
              </div>

              {/* Delivery Fee */}
              <div className="mt-3 flex justify-between text-sm text-black">
                <span>
                  Delivery Charge
                </span>

                <span className="font-semibold">
                  ৳
                  {deliveryFee.toLocaleString(
                    "en-BD"
                  )}
                </span>
              </div>

              <div className="my-5 border-t border-slate-300" />

              {/* Total */}
              <div className="flex justify-between text-lg font-bold text-black">
                <span>
                  Total
                </span>

                <span className="text-emerald-700">
                  ৳
                  {total.toLocaleString(
                    "en-BD"
                  )}
                </span>
              </div>

              <p className="mt-3 text-xs leading-5 text-black">
                Delivery charge is ৳120 and is
                included in your total.
              </p>

            </aside>
          </div>
        </div>
      </main>
    </MarketplaceBackground>
  );
}



function Field({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-black">
        {label}
      </span>

      <input
        required={required}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-black outline-none focus:border-emerald-500"
      />
    </label>
  );
}



function PaymentOption({
  active,
  icon,
  title,
  description,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-4 text-left transition ${active
          ? "border-emerald-600 bg-emerald-50 ring-2 ring-emerald-100"
          : "border-slate-300 bg-white hover:bg-slate-50"
        }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-emerald-700">
          {icon}
        </span>

        <span className="font-semibold text-black">
          {title}
        </span>
      </div>

      <p className="mt-2 text-xs text-black">
        {description}
      </p>
    </button>
  );
}

