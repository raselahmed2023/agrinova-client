"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { MarketplaceService } from "@/services/marketplace.service";
import {
  ICreateProduct,
  IProduct,
  PRODUCT_CATEGORIES,
  ProductCategory,
  ProductionMethod,
  TransactionType,
} from "@/types/marketplace";

interface Props {
  product: IProduct;
  onSaved?: (updated: IProduct) => void;
  onCancel?: () => void;
}

export default function ManageProductForm({
  product,
  onSaved,
  onCancel,
}: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(
    product.title || ""
  );

  const [category, setCategory] =
    useState<ProductCategory>(
      product.category || "crops"
    );

  const [description, setDescription] =
    useState(product.description || "");

  const [price, setPrice] = useState(
    product.price !== undefined
      ? String(product.price)
      : ""
  );

  const [quantity, setQuantity] =
    useState(
      product.quantity !== undefined
        ? String(product.quantity)
        : ""
    );

  const [unit, setUnit] = useState(
    product.unit || ""
  );

  const [location, setLocation] =
    useState(product.location || "");

  const [division, setDivision] =
    useState(product.division || "");

  const [district, setDistrict] =
    useState(product.district || "");

  const [upazila, setUpazila] =
    useState(product.upazila || "");

  const [productionMethod, setProductionMethod] =
    useState<ProductionMethod>(
      product.productionMethod ||
        "conventional"
    );

  const [transactionType, setTransactionType] =
    useState<TransactionType>(
      product.transactionType || "sale"
    );

  const [images, setImages] =
    useState<string[]>(
      product.images || []
    );

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError(
        "Product name is required."
      );
      return;
    }

    if (!description.trim()) {
      setError(
        "Product description is required."
      );
      return;
    }

    if (
      !quantity ||
      Number(quantity) <= 0
    ) {
      setError(
        "Please enter a valid quantity."
      );
      return;
    }

    if (
      transactionType === "sale" &&
      (!price ||
        Number(price) <= 0)
    ) {
      setError(
        "Please enter a valid price."
      );
      return;
    }

    if (!location.trim()) {
      setError(
        "Location is required."
      );
      return;
    }

    if (!division.trim()) {
      setError(
        "Division is required."
      );
      return;
    }

    if (!district.trim()) {
      setError(
        "District is required."
      );
      return;
    }

    if (!upazila.trim()) {
      setError(
        "Upazila is required."
      );
      return;
    }

    try {
      setSaving(true);

      const payload: Partial<ICreateProduct> =
        {
          title: title.trim(),

          category,

          description:
            description.trim(),

          quantity:
            Number(quantity),

          unit: unit.trim(),

          location:
            location.trim(),

          division:
            division.trim(),

          district:
            district.trim(),

          upazila:
            upazila.trim(),

          productionMethod,

          transactionType,

          images,
        };

      payload.price =
        transactionType === "sale"
          ? Number(price)
          : 0;

      const updated =
        await MarketplaceService.updateProduct(
          product._id,
          payload
        );

      setSuccess(
        "Product updated successfully."
      );

      if (onSaved) {
        onSaved(updated);
        return;
      }

      setTimeout(() => {
        router.push(
          "/marketplace?tab=manage"
        );

        router.refresh();
      }, 700);
    } catch (err: any) {
      setError(
        err?.message ||
          "Failed to update product. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this product?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      await MarketplaceService.deleteProduct(
        product._id
      );

      router.push(
        "/marketplace?tab=manage"
      );

      router.refresh();
    } catch (err: any) {
      setError(
        err?.message ||
          "Failed to delete product."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Manage Product
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Update your marketplace listing.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* PRODUCT NAME */}

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Product Name
          </label>

          <input
            value={title}
            onChange={(event) =>
              setTitle(
                event.target.value
              )
            }
            className="h-11 w-full rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-[#0B513D] focus:ring-2 focus:ring-green-100"
            placeholder="Enter product name"
            required
          />
        </div>

        {/* CATEGORY */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Category
          </label>

          <select
            value={category}
            onChange={(event) =>
              setCategory(
                event.target
                  .value as ProductCategory
              )
            }
            className="h-11 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm outline-none focus:border-[#0B513D]"
          >
            {PRODUCT_CATEGORIES.map(
              (item) => (
                <option
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </option>
              )
            )}
          </select>
        </div>

        {/* TRANSACTION TYPE */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Transaction Type
          </label>

          <select
            value={
              transactionType
            }
            onChange={(event) =>
              setTransactionType(
                event.target
                  .value as TransactionType
              )
            }
            className="h-11 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm outline-none focus:border-[#0B513D]"
          >
            <option value="sale">
              Sale
            </option>

            <option value="free">
              Free
            </option>
          </select>
        </div>

        {/* DESCRIPTION */}

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Description
          </label>

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            rows={5}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#0B513D] focus:ring-2 focus:ring-green-100"
            placeholder="Describe your product"
            required
          />
        </div>

        {/* QUANTITY */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Quantity
          </label>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(event) =>
              setQuantity(
                event.target.value
              )
            }
            className="h-11 w-full rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-[#0B513D]"
            required
          />
        </div>

        {/* UNIT */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Unit
          </label>

          <input
            value={unit}
            onChange={(event) =>
              setUnit(
                event.target.value
              )
            }
            className="h-11 w-full rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-[#0B513D]"
            placeholder="kg, ton, piece..."
            required
          />
        </div>

        {/* PRICE */}

        {transactionType ===
          "sale" && (
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Price
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(event) =>
                setPrice(
                  event.target.value
                )
              }
              className="h-11 w-full rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-[#0B513D]"
              required
            />
          </div>
        )}

        {/* PRODUCTION METHOD */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Production Method
          </label>

          <select
            value={
              productionMethod
            }
            onChange={(event) =>
              setProductionMethod(
                event.target
                  .value as ProductionMethod
              )
            }
            className="h-11 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm outline-none focus:border-[#0B513D]"
          >
            <option value="conventional">
              Conventional
            </option>

            <option value="organic">
              Organic
            </option>

            <option value="natural">
              Natural
            </option>
          </select>
        </div>

        {/* LOCATION */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Location
          </label>

          <input
            value={location}
            onChange={(event) =>
              setLocation(
                event.target.value
              )
            }
            className="h-11 w-full rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-[#0B513D]"
            placeholder="Village / Union / Address"
            required
          />
        </div>

        {/* DIVISION */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Division
          </label>

          <input
            value={division}
            onChange={(event) =>
              setDivision(
                event.target.value
              )
            }
            className="h-11 w-full rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-[#0B513D]"
            placeholder="Division"
            required
          />
        </div>

        {/* DISTRICT */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            District
          </label>

          <input
            value={district}
            onChange={(event) =>
              setDistrict(
                event.target.value
              )
            }
            className="h-11 w-full rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-[#0B513D]"
            placeholder="District"
            required
          />
        </div>

        {/* UPAZILA */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Upazila
          </label>

          <input
            value={upazila}
            onChange={(event) =>
              setUpazila(
                event.target.value
              )
            }
            className="h-11 w-full rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-[#0B513D]"
            placeholder="Upazila"
            required
          />
        </div>
      </div>

      {/* ACTIONS */}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={handleDelete}
          disabled={saving}
          className="rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Delete Product
        </button>

        <div className="flex gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[#0B513D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#083c2d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}