"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChangeEvent,
  FormEvent,
  useState,
} from "react";
import {
  ArrowLeft,
  BadgeDollarSign,
  Loader2,
  MapPin,
  PackagePlus,
  Phone,
  Store,
  Upload,
} from "lucide-react";

import ProductImageUpload from "./ProductImageUpload";
import ProductPreviewCard from "./ProductPreviewCard";

import { authClient } from "@/lib/auth-client";
import { createMarketplaceProduct } from "@/services/marketplace.service";

const categories = [
  "crops",
  "seeds",
  "fertilizers",
  "equipment",
];

const units = [
  "kg",
  "piece",
  "bag",
  "ton",
  "liter",
];

interface ImgBBResponse {
  success: boolean;
  data?: {
    url: string;
  };
  error?: {
    message?: string;
  };
}

export default function SellProductForm() {
  const router = useRouter();

  const {
    data: session,
    isPending: sessionLoading,
  } = authClient.useSession();

  const IMGBB_API_KEY =
    process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [price, setPrice] = useState("");
  const [category, setCategory] =
    useState("crops");

  const [quantity, setQuantity] =
    useState("");

  const [unit, setUnit] = useState("kg");

  const [location, setLocation] =
    useState("");

  const [
    sellerContact,
    setSellerContact,
  ] = useState("");

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const [
    uploadingImage,
    setUploadingImage,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    setError("");

    if (
      !file.type.startsWith("image/")
    ) {
      setError(
        "Please select a valid image."
      );

      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setError(
        "Image size must be less than 5MB."
      );

      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    setImageFile(file);

    setImagePreview(
      URL.createObjectURL(file)
    );
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    setImageFile(null);
    setImagePreview("");
  };

  const uploadImage = async () => {
    if (!imageFile) {
      return null;
    }

    if (!IMGBB_API_KEY) {
      throw new Error(
        "ImgBB API key is not configured."
      );
    }

    setUploadingImage(true);

    try {
      const formData =
        new FormData();

      formData.append(
        "image",
        imageFile
      );

      const response =
        await fetch(
          `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
          {
            method: "POST",
            body: formData,
          }
        );

      const result: ImgBBResponse =
        await response.json();

      if (
        !response.ok ||
        !result.success ||
        !result.data?.url
      ) {
        throw new Error(
          result.error?.message ||
            "Image upload failed."
        );
      }

      return result.data.url;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (!session?.user?.email) {
        throw new Error(
          "Please login to publish a product."
        );
      }

      if (!title.trim()) {
        throw new Error(
          "Product title is required."
        );
      }

      if (!description.trim()) {
        throw new Error(
          "Description is required."
        );
      }

      if (
        !price ||
        Number(price) <= 0
      ) {
        throw new Error(
          "Valid price is required."
        );
      }

      if (
        !quantity ||
        Number(quantity) <= 0
      ) {
        throw new Error(
          "Valid quantity is required."
        );
      }

      if (!location.trim()) {
        throw new Error(
          "Product location is required."
        );
      }

      let imageUrl:
        | string
        | null = null;

      if (imageFile) {
        imageUrl =
          await uploadImage();
      }

      await createMarketplaceProduct({
        title: title.trim(),

        description:
          description.trim(),

        price: Number(price),

        category,

        quantity: Number(quantity),

        unit,

        images: imageUrl
          ? [imageUrl]
          : [],

        sellerName:
          session.user.name ||
          "Farmer",

        sellerEmail:
          session.user.email,

        sellerContact:
          sellerContact.trim() ||
          undefined,

        location:
          location.trim(),

        status: "available",

        isFeatured: false,
      });

      setSuccess(
        "Product published successfully."
      );

      setTimeout(() => {
        router.push(
          "/dashboard/farmer/marketplace"
        );
      }, 900);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const isSubmitting =
    loading ||
    uploadingImage ||
    sessionLoading;

  return (
    <div className="min-h-screen bg-[#f7f9f8]">
      <div className="mx-auto max-w-[1380px] px-5 py-7 lg:px-8">
        <div className="mb-7">
          <Link
            href="/dashboard/farmer/marketplace"
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Marketplace
          </Link>

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
            Farmer Marketplace
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Create a Product Listing
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Add product information,
            pricing and inventory details
            to publish your listing.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_390px]"
        >
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-7">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <PackagePlus className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Basic Information
                  </h2>

                  <p className="text-sm text-slate-500">
                    Tell buyers what you
                    are selling.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Product Title
                  </label>

                  <input
                    value={title}
                    onChange={(e) =>
                      setTitle(
                        e.target.value
                      )
                    }
                    placeholder="e.g. Premium BRRI Dhan-89 Seeds"
                    className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Description
                  </label>

                  <textarea
                    rows={5}
                    value={description}
                    onChange={(e) =>
                      setDescription(
                        e.target.value
                      )
                    }
                    placeholder="Describe product quality, condition and details..."
                    className="w-full resize-none rounded-xl border border-slate-200 p-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
                  />

                  <p className="mt-2 text-right text-xs text-slate-400">
                    {
                      description.length
                    }{" "}
                    characters
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-7">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <BadgeDollarSign className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Pricing & Inventory
                  </h2>

                  <p className="text-sm text-slate-500">
                    Set category, price
                    and stock.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Category
                  </label>

                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(
                        e.target.value
                      )
                    }
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-emerald-500"
                  >
                    {categories.map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Unit
                  </label>

                  <select
                    value={unit}
                    onChange={(e) =>
                      setUnit(
                        e.target.value
                      )
                    }
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-emerald-500"
                  >
                    {units.map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Price
                  </label>

                  <input
                    type="number"
                    min={1}
                    value={price}
                    onChange={(e) =>
                      setPrice(
                        e.target.value
                      )
                    }
                    placeholder="Price (৳)"
                    className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Quantity
                  </label>

                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        e.target.value
                      )
                    }
                    placeholder={`Quantity (${unit})`}
                    className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-7">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Store className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Seller Details
                  </h2>

                  <p className="text-sm text-slate-500">
                    Location and contact
                    information.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Location
                  </label>

                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      value={location}
                      onChange={(e) =>
                        setLocation(
                          e.target.value
                        )
                      }
                      placeholder="Kushtia, Bangladesh"
                      className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Contact Number
                  </label>

                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      value={
                        sellerContact
                      }
                      onChange={(e) =>
                        setSellerContact(
                          e.target.value
                        )
                      }
                      placeholder="017XXXXXXXX"
                      className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {session?.user && (
                <div className="mt-5 rounded-xl bg-emerald-50 px-4 py-3">
                  <p className="text-xs font-semibold text-emerald-700">
                    Selling as
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {session.user.name ||
                      "Farmer"}
                  </p>

                  <p className="text-xs text-slate-500">
                    {
                      session.user
                        .email
                    }
                  </p>
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-5 xl:sticky xl:top-24">
            <ProductImageUpload
              imageFile={imageFile}
              imagePreview={
                imagePreview
              }
              disabled={
                isSubmitting
              }
              onImageChange={
                handleImageChange
              }
              onRemove={
                removeImage
              }
            />

            <ProductPreviewCard
              title={title}
              category={category}
              price={price}
              quantity={quantity}
              unit={unit}
              location={location}
              imagePreview={
                imagePreview
              }
            />

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {success}
              </div>
            )}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <button
                type="submit"
                disabled={
                  isSubmitting
                }
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploadingImage ? (
                  <>
                    <Upload className="h-4 w-4 animate-pulse" />
                    Uploading Image...
                  </>
                ) : loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : sessionLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading User...
                  </>
                ) : (
                  <>
                    <Store className="h-4 w-4" />
                    Publish Product
                  </>
                )}
              </button>
            </section>
          </aside>
        </form>
      </div>
    </div>
  );
}