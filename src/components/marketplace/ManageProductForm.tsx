"use client";

import {
  FormEvent,
  type ReactNode,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  Save,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import { MarketplaceService } from "@/services/marketplace.service";
import {
  BY_PRODUCT_USE_OPTIONS,
  POULTRY_TYPE_OPTIONS,
  PRODUCT_CATEGORIES,
} from "@/types/marketplace";
import type {
  ICreateProduct,
  IProduct,
  ProductCategory,
  ProductionMethod,
  TransactionType,
} from "@/types/marketplace";
import {
  DIVISIONS,
  getDistrictsByDivision,
  getUpazilasByDistrict,
} from "@/constants/bangladeshLocations";
import ProductImageUpload from "./ProductImageUpload";

interface Props {
  product: IProduct;
  onSaved?: (updated: IProduct) => void;
  onCancel?: () => void;
}

type FormState = {
  title: string;
  description: string;
  price: string;
  category: ProductCategory;
  transactionType: TransactionType;
  productionMethod: ProductionMethod;
  quantity: string;
  unit: string;
  sellerContact: string;
  location: string;
  division: string;
  district: string;
  upazila: string;
  poultryType: string;
  breed: string;
  ageWeeks: string;
  averageWeightKg: string;
  byProductUses: string[];
};

const STATUS_STYLES: Record<
  string,
  {
    label: string;
    className: string;
    icon: typeof Clock3;
    message: string;
  }
> = {
  pending: {
    label: "Legacy listing",
    className:
      "border-amber-200 bg-amber-50 text-amber-800",
    icon: Clock3,
    message:
      "This is a legacy listing from the previous approval workflow. Saving it will publish it automatically when stock is available.",
  },
  available: {
    label: "Live",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-800",
    icon: ShieldCheck,
    message:
      "This listing is live. Farmer edits publish immediately; AgriNova may hide or remove listings that violate marketplace rules.",
  },
  out_of_stock: {
    label: "Out of stock",
    className:
      "border-orange-200 bg-orange-50 text-orange-800",
    icon: AlertTriangle,
    message:
      "This listing is out of stock. Increase quantity and save to make it live again.",
  },
  disabled: {
    label: "Disabled by admin",
    className:
      "border-slate-300 bg-slate-100 text-slate-700",
    icon: AlertTriangle,
    message:
      "You may update the information, but the listing stays disabled until an admin restores it.",
  },
};

export default function ManageProductForm({
  product,
  onSaved,
  onCancel,
}: Props) {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    title: product.title || "",
    description: product.description || "",
    price: String(product.price ?? 0),
    category: product.category || "crops",
    transactionType: product.transactionType || "sale",
    productionMethod:
      product.productionMethod || "conventional",
    quantity: String(product.quantity ?? 0),
    unit: product.unit || "kg",
    sellerContact: product.sellerContact || "",
    location: product.location || "",
    division: product.division || "",
    district: product.district || "",
    upazila: product.upazila || "",
    poultryType:
      product.poultryDetails?.poultryType || "",
    breed: product.poultryDetails?.breed || "",
    ageWeeks:
      product.poultryDetails?.ageWeeks !== undefined
        ? String(product.poultryDetails.ageWeeks)
        : "",
    averageWeightKg:
      product.poultryDetails?.averageWeightKg !== undefined
        ? String(product.poultryDetails.averageWeightKg)
        : "",
    byProductUses: product.byProductUses || [],
  });

  const [images, setImages] = useState<string[]>(
    product.images || []
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const districtOptions = useMemo(
    () => getDistrictsByDivision(form.division),
    [form.division]
  );

  const upazilaOptions = useMemo(
    () =>
      getUpazilasByDistrict(
        form.division,
        form.district
      ),
    [form.division, form.district]
  );

  const effectiveStatus = product.status;

  const status =
    STATUS_STYLES[effectiveStatus] ||
    STATUS_STYLES.pending;
  const StatusIcon = status.icon;

  const update = <K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const toggleByProductUse = (value: string) => {
    setForm((current) => ({
      ...current,
      byProductUses: current.byProductUses.includes(value)
        ? current.byProductUses.filter(
            (item) => item !== value
          )
        : [...current.byProductUses, value],
    }));
  };

  const validate = () => {
    if (!form.title.trim()) {
      return "Product name is required.";
    }

    if (!form.description.trim()) {
      return "Product description is required.";
    }

    if (!form.unit.trim()) {
      return "Unit is required.";
    }

    if (
      !Number.isFinite(Number(form.quantity)) ||
      Number(form.quantity) < 0
    ) {
      return "Quantity cannot be negative.";
    }

    if (
      form.transactionType === "sale" &&
      (!Number.isFinite(Number(form.price)) ||
        Number(form.price) <= 0)
    ) {
      return "Sale products need a price greater than 0.";
    }

    if (
      form.category === "poultry" &&
      !form.poultryType
    ) {
      return "Please select a poultry type.";
    }

    return "";
  };

  const buildPayload = (): Partial<ICreateProduct> => {
    const payload: Partial<ICreateProduct> = {
      title: form.title.trim(),
      description: form.description.trim(),
      price:
        form.transactionType === "free"
          ? 0
          : Number(form.price),
      category: form.category,
      transactionType: form.transactionType,
      productionMethod: form.productionMethod,
      quantity: Number(form.quantity),
      unit: form.unit.trim(),
      images,
      sellerContact:
        form.sellerContact.trim() || undefined,
      location: form.location.trim() || undefined,
      division: form.division.trim() || undefined,
      district: form.district.trim() || undefined,
      upazila: form.upazila.trim() || undefined,
      poultryDetails:
        form.category === "poultry"
          ? {
              poultryType: form.poultryType || undefined,
              breed: form.breed.trim() || undefined,
              ageWeeks:
                form.ageWeeks === ""
                  ? undefined
                  : Number(form.ageWeeks),
              averageWeightKg:
                form.averageWeightKg === ""
                  ? undefined
                  : Number(form.averageWeightKg),
            }
          : undefined,
      byProductUses:
        form.category === "by_products"
          ? form.byProductUses
          : [],
    };

    return payload;
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      setSuccess("");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updated = await MarketplaceService.updateProduct(
        product._id,
        buildPayload()
      );

      setSuccess(
        updated.status === "disabled"
          ? "Changes saved. This listing remains hidden until AgriNova moderation restores it."
          : updated.status === "out_of_stock"
            ? "Changes saved. This listing is out of stock."
            : "Changes saved and published immediately."
      );

      if (onSaved) {
        onSaved(updated);
        return;
      }

      router.push("/marketplace/listings");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update product."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete "${product.title}"? This removes the listing from the marketplace.`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      await MarketplaceService.deleteProduct(product._id);

      router.push("/marketplace/listings");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete product."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f8f2] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() =>
                onCancel
                  ? onCancel()
                  : router.push("/marketplace/listings")
              }
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to my listings
            </button>

            <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
              Edit Product
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Update your listing, stock, photos and location.
            </p>
          </div>

          <div
            className={`inline-flex max-w-md items-start gap-2 rounded-2xl border px-4 py-3 text-sm ${status.className}`}
          >
            <StatusIcon className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-bold">{status.label}</p>
              <p className="mt-0.5 text-xs leading-5 opacity-80">
                {status.message}
              </p>
            </div>
          </div>
        </div>

        {(product.moderationReason || product.rejectionReason) && (
          <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            <p className="font-bold">Admin feedback</p>
            <p className="mt-1">{product.moderationReason || product.rejectionReason}</p>
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
            <CheckCircle2 className="h-5 w-5" />
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]"
        >
          <div className="space-y-6">
            <Section
              icon={<Package className="h-5 w-5" />}
              title="Product information"
              description="Keep the buyer-facing information clear and accurate."
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Product name"
                  className="sm:col-span-2"
                >
                  <input
                    value={form.title}
                    onChange={(e) => update("title", e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Fresh Aman rice"
                    required
                  />
                </Field>

                <Field label="Category">
                  <select
                    value={form.category}
                    onChange={(e) =>
                      update(
                        "category",
                        e.target.value as ProductCategory
                      )
                    }
                    className={inputClass}
                  >
                    {PRODUCT_CATEGORIES.map((item) => (
                      <option
                        key={item.value}
                        value={item.value}
                      >
                        {item.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Production method">
                  <select
                    value={form.productionMethod}
                    onChange={(e) =>
                      update(
                        "productionMethod",
                        e.target.value as ProductionMethod
                      )
                    }
                    className={inputClass}
                  >
                    <option value="conventional">
                      Conventional
                    </option>
                    <option value="organic">Organic</option>
                    <option value="natural">Natural</option>
                  </select>
                </Field>

                <Field
                  label="Description"
                  className="sm:col-span-2"
                >
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      update("description", e.target.value)
                    }
                    rows={5}
                    className={`${inputClass} h-auto py-3`}
                    placeholder="Describe quality, variety, harvest condition and other useful details."
                    required
                  />
                </Field>
              </div>
            </Section>

            <Section
              title="Price & inventory"
              description="Update stock at any time. Positive stock makes an active listing available immediately."
            >
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <Field label="Transaction">
                  <select
                    value={form.transactionType}
                    onChange={(e) =>
                      update(
                        "transactionType",
                        e.target.value as TransactionType
                      )
                    }
                    className={inputClass}
                  >
                    <option value="sale">For sale</option>
                    <option value="free">Free</option>
                  </select>
                </Field>

                <Field label="Price (৳)">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    disabled={form.transactionType === "free"}
                    value={
                      form.transactionType === "free"
                        ? "0"
                        : form.price
                    }
                    onChange={(e) => update("price", e.target.value)}
                    className={inputClass}
                  />
                </Field>

                <Field label="Quantity">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.quantity}
                    onChange={(e) =>
                      update("quantity", e.target.value)
                    }
                    className={inputClass}
                  />
                </Field>

                <Field label="Unit">
                  <input
                    value={form.unit}
                    onChange={(e) => update("unit", e.target.value)}
                    className={inputClass}
                    placeholder="kg, piece, bag"
                  />
                </Field>
              </div>
            </Section>

            {form.category === "poultry" && (
              <Section
                title="Poultry details"
                description="These values match the marketplace backend options."
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Poultry type">
                    <select
                      value={form.poultryType}
                      onChange={(e) =>
                        update("poultryType", e.target.value)
                      }
                      className={inputClass}
                      required
                    >
                      <option value="">Select type</option>
                      {POULTRY_TYPE_OPTIONS.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Breed">
                    <input
                      value={form.breed}
                      onChange={(e) => update("breed", e.target.value)}
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Age (weeks)">
                    <input
                      type="number"
                      min="0"
                      value={form.ageWeeks}
                      onChange={(e) =>
                        update("ageWeeks", e.target.value)
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Average weight (kg)">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.averageWeightKg}
                      onChange={(e) =>
                        update(
                          "averageWeightKg",
                          e.target.value
                        )
                      }
                      className={inputClass}
                    />
                  </Field>
                </div>
              </Section>
            )}

            {form.category === "by_products" && (
              <Section
                title="By-product uses"
                description="Select every relevant use."
              >
                <div className="flex flex-wrap gap-2">
                  {BY_PRODUCT_USE_OPTIONS.map((option) => {
                    const selected =
                      form.byProductUses.includes(option.value);

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          toggleByProductUse(option.value)
                        }
                        className={`rounded-full border px-3.5 py-2 text-sm font-semibold transition ${
                          selected
                            ? "border-emerald-600 bg-emerald-600 text-white"
                            : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </Section>
            )}

            <Section
              icon={<MapPin className="h-5 w-5" />}
              title="Location & contact"
              description="Help buyers understand where the product is located."
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Division">
                  <select
                    value={form.division}
                    onChange={(e) => {
                      update("division", e.target.value);
                      update("district", "");
                      update("upazila", "");
                    }}
                    className={inputClass}
                  >
                    <option value="">Select division</option>
                    {DIVISIONS.map((division) => (
                      <option key={division} value={division}>
                        {division}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="District">
                  <select
                    value={form.district}
                    onChange={(e) => {
                      update("district", e.target.value);
                      update("upazila", "");
                    }}
                    className={inputClass}
                    disabled={!form.division}
                  >
                    <option value="">Select district</option>
                    {districtOptions.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Upazila">
                  <select
                    value={form.upazila}
                    onChange={(e) =>
                      update("upazila", e.target.value)
                    }
                    className={inputClass}
                    disabled={!form.district}
                  >
                    <option value="">Select upazila</option>
                    {upazilaOptions.map((upazila) => (
                      <option key={upazila} value={upazila}>
                        {upazila}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Seller contact">
                  <input
                    value={form.sellerContact}
                    onChange={(e) =>
                      update("sellerContact", e.target.value)
                    }
                    className={inputClass}
                    placeholder="Phone number"
                  />
                </Field>

                <Field
                  label="Pickup / product location"
                  className="sm:col-span-2"
                >
                  <input
                    value={form.location}
                    onChange={(e) =>
                      update("location", e.target.value)
                    }
                    className={inputClass}
                    placeholder="Village, market, road or pickup point"
                  />
                </Field>
              </div>
            </Section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <Section
              title="Product photos"
              description="Up to 5 images. The first image is used as the cover."
            >
              <ProductImageUpload
                images={images}
                setImages={setImages}
              />
            </Section>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-slate-900">
                Save changes
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Your live listings remain editable. Changes publish immediately unless the listing has been hidden by AgriNova moderation.
              </p>

              <button
                type="submit"
                disabled={saving || deleting}
                className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-bold text-white shadow-sm hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-label="Saving product" /> : "Save Product"}
              </button>

              <button
                type="button"
                disabled={saving || deleting}
                onClick={handleDelete}
                className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                {deleting ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-300 border-t-red-700" aria-label="Removing listing" /> : "Delete Listing"}
              </button>

              <Link
                href="/marketplace/listings"
                className="mt-3 block text-center text-xs font-semibold text-slate-500 hover:text-emerald-700"
              >
                Cancel and return to listings
              </Link>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}

const inputClass =
  "mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400";

function Section({
  icon,
  title,
  description,
  children,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            {icon}
          </div>
        )}
        <div>
          <h2 className="font-bold text-slate-950">{title}</h2>
          {description && (
            <p className="mt-1 text-xs leading-5 text-slate-500">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={className}>
      <span className="text-sm font-semibold text-slate-700">
        {label}
      </span>
      {children}
    </label>
  );
}