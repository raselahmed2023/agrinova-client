"use client";

import Link from "next/link";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  ArrowLeft,
  CreditCard,
  MapPin,
  Package,
} from "lucide-react";

import {
  useCart,
} from "@/context/CartContext";

import {
  OrderService,
} from "@/services/order.service";

import type {
  IShippingAddress,
  PaymentMethod,
} from "@/types/marketplace";

import {
  useSession,
} from "@/lib/auth-client";

const initialAddress: IShippingAddress =
{
  fullName: "",
  phone: "",
  address: "",
  division: "",
  district: "",
  upazila: "",
  postalCode: "",
};

export default function CheckoutPage() {
  const router =
    useRouter();

  const {
    data: session,
    isPending:
    sessionLoading,
  } = useSession();

  const {
    items,
    subtotal,
    clearCart,
  } = useCart();

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
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const updateAddress = (
    key: keyof IShippingAddress,
    value: string
  ) => {
    setAddress(
      (current) => ({
        ...current,
        [key]: value,
      })
    );
  };

  const submit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (
      sessionLoading
    ) {
      return;
    }

    if (!session?.user) {
      router.push(
        "/login?redirect=/checkout"
      );
      return;
    }

    if (!items.length) {
      router.push("/cart");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const order =
        await OrderService.createOrder(
          {
            items:
              items.map(
                (item) => ({
                  productId:
                    item.product
                      ._id,
                  quantity:
                    item.quantity,
                })
              ),

            shippingAddress:
              address,

            paymentMethod,

            notes:
              notes.trim() ||
              undefined,
          }
        );

      if (paymentMethod === "card") {
        const stripe =
          await OrderService.createStripeCheckoutSession(
            order._id
          );

        console.log(
          "STRIPE CHECKOUT RESPONSE:",
          stripe
        );

        const stripeData = stripe as {
          checkoutUrl?: string;
          url?: string;
          sessionUrl?: string;
          data?: {
            checkoutUrl?: string;
            url?: string;
            sessionUrl?: string;
          };
        };

        const checkoutUrl =
          stripeData.checkoutUrl ||
          stripeData.url ||
          stripeData.sessionUrl ||
          stripeData.data?.checkoutUrl ||
          stripeData.data?.url ||
          stripeData.data?.sessionUrl;

        if (!checkoutUrl) {
          throw new Error(
            "Stripe checkout URL was not returned by the server."
          );
        }

        window.location.assign(checkoutUrl);

        return;

    }

      clearCart();

    router.push(
      `/checkout/success?orderId=${encodeURIComponent(
        order._id
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

if (
  !sessionLoading &&
  !session?.user
) {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16">
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-10 text-center shadow-sm">
        <h1 className="text-3xl font-bold">
          Login Required
        </h1>

        <p className="mt-3 text-sm text-slate-500">
          You need to login as a
          farmer before you can
          place a marketplace
          order.
        </p>

        <Link
          href="/login?redirect=/checkout"
          className="mt-6 inline-flex rounded-xl bg-emerald-700 px-6 py-3 font-semibold text-white"
        >
          Login to Continue
        </Link>
      </div>
    </main>
  );
}

if (!items.length) {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16">
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-10 text-center shadow-sm">
        <Package className="mx-auto h-12 w-12 text-slate-300" />

        <h1 className="mt-4 text-2xl font-bold">
          Your cart is empty
        </h1>

        <Link
          href="/marketplace"
          className="mt-5 inline-block rounded-xl bg-emerald-700 px-6 py-3 font-semibold text-white"
        >
          Browse Marketplace
        </Link>
      </div>
    </main>
  );
}

return (
  <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-6xl">
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Cart
      </Link>

      <h1 className="mt-5 text-3xl font-bold text-slate-900">
        Checkout
      </h1>

      <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_360px]">
        <form
          onSubmit={submit}
          className="space-y-5"
        >
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-700" />

              <h2 className="text-lg font-bold">
                Delivery Address
              </h2>
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
                required
              />

              <Field
                label="Phone"
                value={
                  address.phone
                }
                onChange={(
                  value
                ) =>
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
                  onChange={(
                    value
                  ) =>
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
                onChange={(
                  value
                ) =>
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
                onChange={(
                  value
                ) =>
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
                onChange={(
                  value
                ) =>
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
                onChange={(
                  value
                ) =>
                  updateAddress(
                    "postalCode",
                    value
                  )
                }
              />
            </div>
          </section>

          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">
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

            <div className="mt-5">
              <label className="text-sm font-medium text-slate-700">
                Order Notes
              </label>

              <textarea
                value={notes}
                onChange={(
                  event
                ) =>
                  setNotes(
                    event.target
                      .value
                  )
                }
                rows={3}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                placeholder="Optional notes..."
              />
            </div>

            {error && (
              <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}
          </section>

          <button
            type="submit"
            disabled={
              loading ||
              sessionLoading
            }
            className="w-full rounded-xl bg-emerald-700 px-5 py-3.5 text-sm font-bold text-white hover:bg-emerald-800 disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : paymentMethod ===
                "card"
                ? "Continue to Secure Payment"
                : "Place COD Order"}
          </button>
        </form>

        <aside className="h-fit rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">
            Your Items
          </h2>

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
                  <div>
                    <p className="font-semibold">
                      {
                        product.title
                      }
                    </p>

                    <p className="text-slate-500">
                      {
                        quantity
                      }{" "}
                      × ৳
                      {Number(
                        product.price
                      ).toLocaleString(
                        "en-BD"
                      )}
                    </p>
                  </div>

                  <span className="font-semibold">
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

          <div className="my-5 border-t" />

          <div className="flex justify-between text-lg font-bold">
            <span>
              Subtotal
            </span>

            <span>
              ৳
              {subtotal.toLocaleString(
                "en-BD"
              )}
            </span>
          </div>

          <p className="mt-2 text-xs text-slate-500">
            Final delivery fee and
            total are calculated by
            the server.
          </p>
        </aside>
      </div>
    </div>
  </main>
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
      <span className="text-sm font-medium text-slate-700">
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
        className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-500"
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
        : "border-slate-200 hover:bg-slate-50"
        }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-emerald-700">
          {icon}
        </span>

        <span className="font-semibold">
          {title}
        </span>
      </div>

      <p className="mt-2 text-xs text-slate-500">
        {description}
      </p>
    </button>
  );
}