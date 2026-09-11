"use client";

import {
  FormEvent,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  ImagePlus,
  Leaf,
  MapPin,
  Package,
  Plus,
} from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  MarketplaceService,
} from "@/services/marketplace.service";
import ProductImageUpload from "./ProductImageUpload";

import type {
  ICreateProduct,
  ProductCategory,
  ProductionMethod,
  TransactionType,
} from "@/types/marketplace";
import {
  BY_PRODUCT_USE_OPTIONS,
  POULTRY_TYPE_OPTIONS,
} from "@/types/marketplace";

const categories: {
  value: ProductCategory;
  label: string;
}[] = [
  {
    value: "crops",
    label: "Crops",
  },
  {
    value: "seeds",
    label: "Seeds",
  },
  {
    value: "fertilizers",
    label: "Fertilizers",
  },
  {
    value: "pesticides",
    label: "Pesticides",
  },
  {
    value: "equipment",
    label: "Equipment",
  },
  {
    value: "poultry",
    label: "Poultry",
  },
  {
    value: "farm_foods",
    label: "Farm Food",
  },
  {
    value: "by_products",
    label: "By Products",
  },
  {
    value: "other",
    label: "Other",
  },
];

const productionMethods: {
  value: ProductionMethod;
  label: string;
}[] = [
  {
    value: "conventional",
    label: "Conventional",
  },
  {
    value: "organic",
    label: "Organic",
  },
  {
    value: "natural",
    label: "Natural",
  },
];

const initialForm: ICreateProduct = {
  title: "",
  description: "",
  price: 0,
  category: "crops",
  transactionType: "sale",
  productionMethod:
    "conventional",
  quantity: 1,
  unit: "kg",
  images: [],
  sellerContact: "",
  location: "",
  division: "",
  district: "",
  upazila: "",
  poultryDetails: {
    poultryType: "",
    breed: "",
    ageWeeks: undefined,
    averageWeightKg:
      undefined,
  },
  byProductUses: [],
};

export default function SellProductForm() {
  const router = useRouter();

  const [form, setForm] =
    useState<ICreateProduct>(
      initialForm
    );

  const [imageUrls, setImageUrls] =
    useState<string[]>([]);


  const [byProductUse, setByProductUse] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const updateField = <
    K extends keyof ICreateProduct
  >(
    key: K,
    value: ICreateProduct[K]
  ) => {
    setForm(
      (current) => ({
        ...current,
        [key]: value,
      })
    );
  };

  const updatePoultry = <
    K extends keyof NonNullable<
      ICreateProduct["poultryDetails"]
    >
  >(
    key: K,
    value: NonNullable<
      ICreateProduct["poultryDetails"]
    >[K]
  ) => {
    setForm(
      (current) => ({
        ...current,
        poultryDetails: {
          ...(current.poultryDetails ||
            {}),
          [key]: value,
        },
      })
    );
  };


  const addByProductUse = () => {
    const value =
      byProductUse.trim();

    if (!value) {
      return;
    }

    const current =
      form.byProductUses ||
      [];

    if (
      current.includes(value)
    ) {
      setByProductUse("");
      return;
    }

    updateField(
      "byProductUses",
      [
        ...current,
        value,
      ]
    );

    setByProductUse("");
  };

  const removeByProductUse = (
    value: string
  ) => {
    updateField(
      "byProductUses",
      (
        form.byProductUses ||
        []
      ).filter(
        (item) =>
          item !== value
      )
    );
  };

  const validate = () => {
    if (
      !form.title.trim()
    ) {
      return "Product name is required.";
    }

    if (
      !form.description.trim()
    ) {
      return "Product description is required.";
    }

    if (
      !form.category
    ) {
      return "Please select a category.";
    }

    if (
      Number(form.quantity) <=
      0
    ) {
      return "Quantity must be greater than 0.";
    }

    if (
      form.transactionType ===
        "sale" &&
      Number(form.price) <=
        0
    ) {
      return "Sale products must have a price greater than 0.";
    }

    if (
      !form.unit.trim()
    ) {
      return "Unit is required.";
    }

    return null;
  };

  const payload = useMemo(
    (): ICreateProduct => {
      const clean: ICreateProduct =
        {
          title:
            form.title.trim(),

          description:
            form.description.trim(),

          price:
            form.transactionType ===
            "free"
              ? 0
              : Number(
                  form.price
                ),

          category:
            form.category,

          transactionType:
            form.transactionType,

          productionMethod:
            form.productionMethod,

          quantity:
            Number(
              form.quantity
            ),

          unit:
            form.unit.trim(),

          images:
            imageUrls,

          sellerContact:
            form.sellerContact?.trim() ||
            undefined,

          location:
            form.location?.trim() ||
            undefined,

          division:
            form.division?.trim() ||
            undefined,

          district:
            form.district?.trim() ||
            undefined,

          upazila:
            form.upazila?.trim() ||
            undefined,
        };

      if (
        form.category ===
        "poultry"
      ) {
        clean.poultryDetails =
          {
            poultryType:
              form.poultryDetails
                ?.poultryType
                ?.trim() ||
              undefined,

            breed:
              form.poultryDetails
                ?.breed
                ?.trim() ||
              undefined,

            ageWeeks:
              form.poultryDetails
                ?.ageWeeks,

            averageWeightKg:
              form.poultryDetails
                ?.averageWeightKg,
          };
      }

      if (
        form.category ===
        "by_products"
      ) {
        clean.byProductUses =
          form.byProductUses ||
          [];
      }

      return clean;
    },
    [
      form,
      imageUrls,
    ]
  );

  const submit = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    const validation =
      validate();

    if (validation) {
      setError(
        validation
      );
      setSuccess("");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await MarketplaceService.createProduct(
        payload
      );

      setSuccess(
        "Product submitted successfully. It is now waiting for approval."
      );

      setTimeout(() => {
        router.push(
          "/marketplace/listings"
        );

        router.refresh();
      }, 700);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit product."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f8f2] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/marketplace/listings"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Manage Products
        </Link>

        <div className="mt-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white">
              <Leaf className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Sell a Product
              </h1>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Add your agricultural
                product to the
                AgriNova marketplace.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={submit}
          className="mt-7 space-y-6"
        >
          {/* BASIC INFORMATION */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionTitle
              icon={
                <Package className="h-5 w-5" />
              }
              title="Product Information"
              description="Tell buyers what you are offering."
            />

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Field
                label="Product Name"
                required
                value={
                  form.title
                }
                onChange={(
                  value
                ) =>
                  updateField(
                    "title",
                    value
                  )
                }
                placeholder="e.g. Fresh BARI Tomato"
              />

              <SelectField
                label="Category"
                required
                value={
                  form.category
                }
                onChange={(
                  value
                ) =>
                  updateField(
                    "category",
                    value as ProductCategory
                  )
                }
                options={
                  categories
                }
              />

              <div className="md:col-span-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Description
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </span>

                  <textarea
                    required
                    rows={5}
                    value={
                      form.description
                    }
                    onChange={(
                      event
                    ) =>
                      updateField(
                        "description",
                        event
                          .target
                          .value
                      )
                    }
                    placeholder="Describe quality, condition, variety, freshness, etc."
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </label>
              </div>
            </div>
          </section>

          {/* PRICE / QUANTITY */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionTitle
              icon={
                <Package className="h-5 w-5" />
              }
              title="Pricing & Quantity"
              description="Set how much you have available."
            />

            <div className="mt-6 grid gap-5 md:grid-cols-3">
              <SelectField
                label="Transaction Type"
                required
                value={
                  form.transactionType
                }
                onChange={(
                  value
                ) =>
                  updateField(
                    "transactionType",
                    value as TransactionType
                  )
                }
                options={[
                  {
                    value:
                      "sale",
                    label:
                      "For Sale",
                  },
                  {
                    value:
                      "free",
                    label:
                      "Free",
                  },
                ]}
              />

              <Field
                label="Price"
                type="number"
                min="0"
                required={
                  form.transactionType ===
                  "sale"
                }
                value={String(
                  form.price
                )}
                disabled={
                  form.transactionType ===
                  "free"
                }
                onChange={(
                  value
                ) =>
                  updateField(
                    "price",
                    Number(
                      value
                    )
                  )
                }
                placeholder="0"
              />

              <Field
                label="Unit"
                required
                value={
                  form.unit
                }
                onChange={(
                  value
                ) =>
                  updateField(
                    "unit",
                    value
                  )
                }
                placeholder="kg, bag, piece, crate..."
              />

              <Field
                label="Available Quantity"
                type="number"
                min="1"
                required
                value={String(
                  form.quantity
                )}
                onChange={(
                  value
                ) =>
                  updateField(
                    "quantity",
                    Number(
                      value
                    )
                  )
                }
                placeholder="100"
              />

              <SelectField
                label="Production Method"
                value={
                  form.productionMethod
                }
                onChange={(
                  value
                ) =>
                  updateField(
                    "productionMethod",
                    value as ProductionMethod
                  )
                }
                options={
                  productionMethods
                }
              />
            </div>
          </section>

          {/* IMAGES */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionTitle
              icon={
                <ImagePlus className="h-5 w-5" />
              }
              title="Product Images"
              description="Upload product images"
            />

            <div className="mt-6">
              <ProductImageUpload
                images={imageUrls}
                setImages={(next) => {
                  setImageUrls(next);
                  updateField("images", next);
                }}
              />
            </div>
          </section>

          {/* LOCATION */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionTitle
              icon={
                <MapPin className="h-5 w-5" />
              }
              title="Location"
              description="Help nearby buyers understand where the product is located."
            />

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Field
                label="Location"
                value={
                  form.location ||
                  ""
                }
                onChange={(
                  value
                ) =>
                  updateField(
                    "location",
                    value
                  )
                }
                placeholder="Farm / village / market"
              />

              <Field
                label="Division"
                value={
                  form.division ||
                  ""
                }
                onChange={(
                  value
                ) =>
                  updateField(
                    "division",
                    value
                  )
                }
                placeholder="e.g. Dhaka"
              />

              <Field
                label="District"
                value={
                  form.district ||
                  ""
                }
                onChange={(
                  value
                ) =>
                  updateField(
                    "district",
                    value
                  )
                }
                placeholder="e.g. Gazipur"
              />

              <Field
                label="Upazila"
                value={
                  form.upazila ||
                  ""
                }
                onChange={(
                  value
                ) =>
                  updateField(
                    "upazila",
                    value
                  )
                }
                placeholder="e.g. Sreepur"
              />

              <Field
                label="Seller Contact"
                value={
                  form.sellerContact ||
                  ""
                }
                onChange={(
                  value
                ) =>
                  updateField(
                    "sellerContact",
                    value
                  )
                }
                placeholder="Phone number"
              />
            </div>
          </section>

          {/* POULTRY */}
          {form.category ===
            "poultry" && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionTitle
                icon={
                  <Package className="h-5 w-5" />
                }
                title="Poultry Details"
                description="Add additional information about the poultry."
              />

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Poultry Type
                  </label>
                  <select
                    value={
                      form.poultryDetails?.poultryType || ""
                    }
                    onChange={(event) =>
                      updatePoultry(
                        "poultryType",
                        event.target.value
                      )
                    }
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    required
                  >
                    <option value="">Select poultry type</option>
                    {POULTRY_TYPE_OPTIONS.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <Field
                  label="Breed"
                  value={
                    form
                      .poultryDetails
                      ?.breed ||
                    ""
                  }
                  onChange={(
                    value
                  ) =>
                    updatePoultry(
                      "breed",
                      value
                    )
                  }
                  placeholder="Breed"
                />

                <Field
                  label="Age (weeks)"
                  type="number"
                  min="0"
                  value={
                    form
                      .poultryDetails
                      ?.ageWeeks !==
                    undefined
                      ? String(
                          form
                            .poultryDetails
                            .ageWeeks
                        )
                      : ""
                  }
                  onChange={(
                    value
                  ) =>
                    updatePoultry(
                      "ageWeeks",
                      value
                        ? Number(
                            value
                          )
                        : undefined
                    )
                  }
                  placeholder="e.g. 12"
                />

                <Field
                  label="Average Weight (kg)"
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    form
                      .poultryDetails
                      ?.averageWeightKg !==
                    undefined
                      ? String(
                          form
                            .poultryDetails
                            .averageWeightKg
                        )
                      : ""
                  }
                  onChange={(
                    value
                  ) =>
                    updatePoultry(
                      "averageWeightKg",
                      value
                        ? Number(
                            value
                          )
                        : undefined
                    )
                  }
                  placeholder="e.g. 1.8"
                />
              </div>
            </section>
          )}

          {/* BY PRODUCTS */}
          {form.category ===
            "by_products" && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionTitle
                icon={
                  <Package className="h-5 w-5" />
                }
                title="Common Uses"
                description="Tell buyers what this by-product can be used for."
              />

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <select
                  value={byProductUse}
                  onChange={(event) =>
                    setByProductUse(event.target.value)
                  }
                  className="h-11 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-emerald-500"
                >
                  <option value="">Select a use</option>
                  {BY_PRODUCT_USE_OPTIONS.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      disabled={(form.byProductUses || []).includes(
                        option.value
                      )}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={
                    addByProductUse
                  }
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  <Plus className="h-4 w-4" />
                  Add Use
                </button>
              </div>

              {(
                form.byProductUses ||
                []
              ).length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {(
                    form.byProductUses ||
                    []
                  ).map(
                    (use) => (
                      <button
                        type="button"
                        key={use}
                        onClick={() =>
                          removeByProductUse(
                            use
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700"
                      >
                        {BY_PRODUCT_USE_OPTIONS.find(
                          (option) => option.value === use
                        )?.label || use}

                        <span>
                          ×
                        </span>
                      </button>
                    )
                  )}
                </div>
              )}
            </section>
          )}

          {/* SERVER RESPONSE */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
              {success}
            </div>
          )}

          {/* SUBMIT */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/marketplace/listings"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-7 text-sm font-bold text-white shadow-sm hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Submitting...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Submit Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function SectionTitle({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
        {icon}
      </div>

      <div>
        <h2 className="font-bold text-slate-900">
          {title}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  min,
  step,
  required = false,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  placeholder?: string;
  type?: string;
  min?: string;
  step?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </span>

      <input
        type={type}
        value={value}
        min={min}
        step={step}
        required={required}
        disabled={disabled}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder={placeholder}
        className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  options: {
    value: string;
    label: string;
  }[];
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </span>

      <select
        value={value}
        required={required}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      >
        {options.map(
          (option) => (
            <option
              key={
                option.value
              }
              value={
                option.value
              }
            >
              {
                option.label
              }
            </option>
          )
        )}
      </select>
    </label>
  );
}