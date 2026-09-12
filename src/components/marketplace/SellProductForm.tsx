"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ImagePlus,
  Leaf,
  MapPin,
  Package,
  Plus,
  ShieldCheck,
} from "lucide-react";

import { MarketplaceService } from "@/services/marketplace.service";
import ProductImageUpload from "./ProductImageUpload";
import {
  BY_PRODUCT_USE_OPTIONS,
  POULTRY_TYPE_OPTIONS,
  PRODUCT_CATEGORIES,
} from "@/types/marketplace";
import type {
  ICreateProduct,
  ProductCategory,
  ProductionMethod,
  TransactionType,
} from "@/types/marketplace";
import {
  DIVISIONS,
  getDistrictsByDivision,
  getUpazilasByDistrict,
} from "@/constants/bangladeshLocations";

const UNIT_OPTIONS = ["kg", "g", "ton", "bag", "crate", "piece", "dozen", "litre"];

const initialForm: ICreateProduct = {
  title: "",
  description: "",
  price: 0,
  category: "crops",
  transactionType: "sale",
  productionMethod: "conventional",
  quantity: 1,
  unit: "kg",
  images: [],
  sellerContact: "",
  location: "",
  division: "",
  district: "",
  upazila: "",
  poultryDetails: {},
  byProductUses: [],
};

export default function SellProductForm() {
  const router = useRouter();
  const [form, setForm] = useState<ICreateProduct>(initialForm);
  const [images, setImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const districts = useMemo(
    () => getDistrictsByDivision(form.division || ""),
    [form.division]
  );
  const upazilas = useMemo(
    () => getUpazilasByDistrict(form.division || "", form.district || ""),
    [form.division, form.district]
  );

  const set = <K extends keyof ICreateProduct>(key: K, value: ICreateProduct[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const validate = () => {
    if (!form.title.trim()) return "Product name is required.";
    if (!form.description.trim()) return "Product description is required.";
    if (!Number.isFinite(Number(form.quantity)) || Number(form.quantity) <= 0) {
      return "Available quantity must be greater than 0.";
    }
    if (!form.unit.trim()) return "Unit is required.";
    if (
      form.transactionType === "sale" &&
      (!Number.isFinite(Number(form.price)) || Number(form.price) <= 0)
    ) {
      return "Sale products need a price greater than 0.";
    }
    if (form.category === "poultry" && !form.poultryDetails?.poultryType) {
      return "Please select a poultry type.";
    }
    return "";
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validate();
    if (validation) {
      setError(validation);
      setSuccess("");
      return;
    }

    const payload: ICreateProduct = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      price: form.transactionType === "free" ? 0 : Number(form.price),
      quantity: Number(form.quantity),
      unit: form.unit.trim(),
      images,
      sellerContact: form.sellerContact?.trim() || undefined,
      location: form.location?.trim() || undefined,
      division: form.division?.trim() || undefined,
      district: form.district?.trim() || undefined,
      upazila: form.upazila?.trim() || undefined,
      poultryDetails:
        form.category === "poultry" ? form.poultryDetails : undefined,
      byProductUses:
        form.category === "by_products" ? form.byProductUses || [] : [],
    };

    try {
      setSaving(true);
      setError("");
      setSuccess("");
      await MarketplaceService.createProduct(payload);
      setSuccess("Published. Your product is live in the marketplace now.");
      window.setTimeout(() => {
        router.push("/marketplace/listings");
        router.refresh();
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to publish product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f8f2] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/marketplace/listings"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />
          My listings
        </Link>

        <header className="mt-5 rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 p-6 text-white shadow-lg sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
              <Leaf className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-100">
                Farmer Marketplace
              </p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight">
                List a product in minutes
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-50/90">
                Add the essentials, publish instantly, and update stock whenever you need. No admin approval is required before your listing goes live.
              </p>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-xs leading-5 text-emerald-50">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            AgriNova may hide or remove listings that violate marketplace rules and will send the farmer a moderation notice.
          </div>
        </header>

        <form onSubmit={submit} className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_.65fr]">
          <div className="space-y-6">
            <Card icon={<Package className="h-5 w-5" />} title="Product essentials" description="Only the information buyers need to understand the listing.">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Product name" required className="sm:col-span-2">
                  <input
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Fresh BARI Tomato"
                    maxLength={150}
                  />
                </Field>

                <Field label="Category" required>
                  <select
                    value={form.category}
                    onChange={(e) => set("category", e.target.value as ProductCategory)}
                    className={inputClass}
                  >
                    {PRODUCT_CATEGORIES.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Production method">
                  <select
                    value={form.productionMethod}
                    onChange={(e) => set("productionMethod", e.target.value as ProductionMethod)}
                    className={inputClass}
                  >
                    <option value="conventional">Conventional</option>
                    <option value="organic">Organic</option>
                    <option value="natural">Natural</option>
                  </select>
                </Field>

                <Field label="Description" required className="sm:col-span-2">
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    className={textareaClass}
                    placeholder="Variety, quality, harvest condition, size or anything useful to the buyer."
                    maxLength={3000}
                  />
                </Field>
              </div>
            </Card>

            <Card title="Price & stock" description="Stock is reduced automatically when a buyer places an order.">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <Field label="Listing type" required>
                  <select
                    value={form.transactionType}
                    onChange={(e) => set("transactionType", e.target.value as TransactionType)}
                    className={inputClass}
                  >
                    <option value="sale">For sale</option>
                    <option value="free">Free</option>
                  </select>
                </Field>
                <Field label="Price (BDT)" required={form.transactionType === "sale"}>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    disabled={form.transactionType === "free"}
                    value={form.transactionType === "free" ? 0 : form.price}
                    onChange={(e) => set("price", Number(e.target.value))}
                    className={inputClass}
                  />
                </Field>
                <Field label="Available quantity" required>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.quantity}
                    onChange={(e) => set("quantity", Number(e.target.value))}
                    className={inputClass}
                  />
                </Field>
                <Field label="Unit" required>
                  <input
                    list="marketplace-unit-options"
                    value={form.unit}
                    onChange={(e) => set("unit", e.target.value)}
                    className={inputClass}
                    placeholder="kg"
                  />
                  <datalist id="marketplace-unit-options">
                    {UNIT_OPTIONS.map((unit) => <option key={unit} value={unit} />)}
                  </datalist>
                </Field>
              </div>
            </Card>

            <Card icon={<MapPin className="h-5 w-5" />} title="Pickup location" description="Optional, but useful for logistics and nearby buyers.">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Division">
                  <select
                    value={form.division || ""}
                    onChange={(e) => {
                      setForm((current) => ({ ...current, division: e.target.value, district: "", upazila: "" }));
                    }}
                    className={inputClass}
                  >
                    <option value="">Select division</option>
                    {DIVISIONS.map((division) => <option key={division} value={division}>{division}</option>)}
                  </select>
                </Field>
                <Field label="District">
                  <select
                    value={form.district || ""}
                    onChange={(e) => setForm((current) => ({ ...current, district: e.target.value, upazila: "" }))}
                    className={inputClass}
                    disabled={!form.division}
                  >
                    <option value="">Select district</option>
                    {districts.map((district) => <option key={district} value={district}>{district}</option>)}
                  </select>
                </Field>
                <Field label="Upazila">
                  <select
                    value={form.upazila || ""}
                    onChange={(e) => set("upazila", e.target.value)}
                    className={inputClass}
                    disabled={!form.district}
                  >
                    <option value="">Select upazila</option>
                    {upazilas.map((upazila) => <option key={upazila} value={upazila}>{upazila}</option>)}
                  </select>
                </Field>
                <Field label="Pickup point">
                  <input
                    value={form.location || ""}
                    onChange={(e) => set("location", e.target.value)}
                    className={inputClass}
                    placeholder="Village, farm, road or market"
                  />
                </Field>
                <Field label="Contact phone" className="sm:col-span-2">
                  <input
                    value={form.sellerContact || ""}
                    onChange={(e) => set("sellerContact", e.target.value)}
                    className={inputClass}
                    placeholder="Phone used for pickup coordination"
                  />
                </Field>
              </div>
            </Card>

            {form.category === "poultry" && (
              <Card title="Poultry details" description="Poultry type is required; the rest is optional.">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Poultry type" required>
                    <select
                      value={form.poultryDetails?.poultryType || ""}
                      onChange={(e) => set("poultryDetails", { ...form.poultryDetails, poultryType: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">Select type</option>
                      {POULTRY_TYPE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                  </Field>
                  <Field label="Breed">
                    <input
                      value={form.poultryDetails?.breed || ""}
                      onChange={(e) => set("poultryDetails", { ...form.poultryDetails, breed: e.target.value })}
                      className={inputClass}
                    />
                  </Field>
                </div>
              </Card>
            )}

            {form.category === "by_products" && (
              <Card title="Common uses" description="Optional: select relevant uses for this by-product.">
                <div className="flex flex-wrap gap-2">
                  {BY_PRODUCT_USE_OPTIONS.map((option) => {
                    const selected = (form.byProductUses || []).includes(option.value);
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => set("byProductUses", selected
                          ? (form.byProductUses || []).filter((value) => value !== option.value)
                          : [...(form.byProductUses || []), option.value])}
                        className={`rounded-full border px-3.5 py-2 text-sm font-semibold transition ${selected ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300"}`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <Card icon={<ImagePlus className="h-5 w-5" />} title="Product photos" description="Optional. The first photo becomes the cover.">
              <ProductImageUpload images={images} setImages={setImages} />
            </Card>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
                <p className="text-sm font-bold">Publish instantly</p>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Your listing becomes searchable immediately. You can edit quantity, price, photos and details later from My Listings.
              </p>

              {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">{error}</div>
              )}
              {success && (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">{success}</div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-label="Publishing" />
                ) : (
                  <><Plus className="h-4 w-4" /> Publish Product</>
                )}
              </button>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}

const inputClass =
  "mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100";
const textareaClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

function Card({ icon, title, description, children }: { icon?: ReactNode; title: string; description?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        {icon && <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">{icon}</div>}
        <div>
          <h2 className="font-bold text-slate-950">{title}</h2>
          {description && <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>}
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Field({ label, required, className = "", children }: { label: string; required?: boolean; className?: string; children: ReactNode }) {
  return (
    <label className={className}>
      <span className="text-sm font-semibold text-slate-700">
        {label}{required && <span className="ml-1 text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}
