"use client";

import { authClient } from "@/lib/auth-client";
import {
  Loader2,
  Plus,
  WalletCards,
  X,
} from "lucide-react";
import {
  FormEvent,
  useEffect,
  useState,
} from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

interface TransactionFormProps {
  onAdd: () => void | Promise<void>;
}

interface FarmOption {
  _id?: string;
  id?: string;
  name?: string;
  farmName?: string;
  cropName?: string;
}

const incomeCategories = [
  "Crop Sale",
  "Marketplace Sale",
  "Other Income",
];

const expenseCategories = [
  "Seeds",
  "Fertilizer",
  "Irrigation",
  "Pesticide",
  "Labour",
  "Equipment",
  "Transportation",
  "Other Expense",
];

export default function TransactionForm({
  onAdd,
}: TransactionFormProps) {
  const { data: session } =
    authClient.useSession();

  const userId = session?.user?.id;

  const [open, setOpen] = useState(false);

  const [type, setType] = useState<
    "income" | "expense"
  >("income");

  const [amount, setAmount] = useState("");
  const [category, setCategory] =
    useState("");
  const [farmId, setFarmId] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] =
    useState("");

  const [farms, setFarms] = useState<
    FarmOption[]
  >([]);

  const [loadingFarms, setLoadingFarms] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  const categories =
    type === "income"
      ? incomeCategories
      : expenseCategories;

  useEffect(() => {
    setCategory("");
  }, [type]);

  useEffect(() => {
    if (!open || !API_URL) return;

    const fetchFarms = async () => {
      try {
        setLoadingFarms(true);

        const response = await fetch(
          `${API_URL}/farms`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          setFarms([]);
          return;
        }

        const data = await response.json();

        const farmData =
          data?.data?.farms ||
          data?.data ||
          data ||
          [];

        setFarms(
          Array.isArray(farmData)
            ? farmData
            : []
        );
      } catch {
        setFarms([]);
      } finally {
        setLoadingFarms(false);
      }
    };

    void fetchFarms();
  }, [open]);

  const resetForm = () => {
    setType("income");
    setAmount("");
    setCategory("");
    setFarmId("");
    setDate("");
    setDescription("");
    setError("");
  };

  const closeModal = () => {
    if (submitting) return;

    setOpen(false);
    resetForm();
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!API_URL) {
      setError(
        "API configuration is missing."
      );
      return;
    }

    if (!userId) {
      setError(
        "You must be logged in to add a transaction."
      );
      return;
    }

    if (
      !amount ||
      Number(amount) <= 0 ||
      !category ||
      !date
    ) {
      setError(
        "Please complete all required fields."
      );
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const payload = {
        userId,
        type: type === "income" ? "Income" : "Expense",
        amount: Number(amount),
        category,
        date,
        description: description.trim() || undefined,
        farm: farmId || undefined,
      };

      const response = await fetch(
        `${API_URL}/finance/transactions`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const contentType =
        response.headers.get("content-type");

      const data =
        contentType?.includes(
          "application/json"
        )
          ? await response.json()
          : null;

      if (!response.ok) {
        throw new Error(
          data?.message ||
          "Failed to add transaction."
        );
      }

      await onAdd();

      setOpen(false);
      resetForm();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to add transaction."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0B513D] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#084330]"
      >
        <Plus className="h-4 w-4" />
        Add Transaction
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[2px]">
          <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF4ED] text-[#0B513D]">
                  <WalletCards className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Add Transaction
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Record farm income or expense.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5 sm:p-6"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Transaction Type
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      value:
                        "income" as const,
                      label: "Income",
                    },
                    {
                      value:
                        "expense" as const,
                      label: "Expense",
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setType(option.value)
                      }
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${type === option.value
                        ? "border-[#0B513D] bg-[#EEF6F1] text-[#0B513D]"
                        : "border-slate-200 text-slate-500 hover:bg-slate-50"
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Amount
                  <span className="ml-1 text-rose-500">
                    *
                  </span>
                </label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                    ৳
                  </span>

                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(event) =>
                      setAmount(
                        event.target.value
                      )
                    }
                    placeholder="0"
                    className="h-11 w-full rounded-xl border border-slate-200 pl-8 pr-3 text-sm outline-none transition focus:border-[#8CB89A] focus:ring-4 focus:ring-[#0B513D]/5"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Category
                  <span className="ml-1 text-rose-500">
                    *
                  </span>
                </label>

                <select
                  required
                  value={category}
                  onChange={(event) =>
                    setCategory(
                      event.target.value
                    )
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#8CB89A] focus:ring-4 focus:ring-[#0B513D]/5"
                >
                  <option value="">
                    Select category
                  </option>

                  {categories.map(
                    (categoryOption) => (
                      <option
                        key={categoryOption}
                        value={categoryOption}
                      >
                        {categoryOption}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Related Farm
                  <span className="ml-1 text-xs font-normal text-slate-400">
                    Optional
                  </span>
                </label>

                <select
                  value={farmId}
                  onChange={(event) =>
                    setFarmId(
                      event.target.value
                    )
                  }
                  disabled={loadingFarms}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none disabled:bg-slate-50 focus:border-[#8CB89A] focus:ring-4 focus:ring-[#0B513D]/5"
                >
                  <option value="">
                    {loadingFarms
                      ? "Loading farms..."
                      : "No specific farm"}
                  </option>

                  {farms.map((farm) => {
                    const id =
                      farm._id || farm.id;

                    if (!id) return null;

                    return (
                      <option
                        key={id}
                        value={id}
                      >
                        {farm.name ||
                          farm.farmName ||
                          farm.cropName ||
                          "Unnamed Farm"}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Date
                  <span className="ml-1 text-rose-500">
                    *
                  </span>
                </label>

                <input
                  type="date"
                  required
                  value={date}
                  onChange={(event) =>
                    setDate(event.target.value)
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-700 outline-none focus:border-[#8CB89A] focus:ring-4 focus:ring-[#0B513D]/5"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Description
                  <span className="ml-1 text-xs font-normal text-slate-400">
                    Optional
                  </span>
                </label>

                <textarea
                  rows={3}
                  maxLength={500}
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  placeholder="Add a short note..."
                  className="w-full resize-none rounded-xl border border-slate-200 p-3 text-sm leading-6 outline-none placeholder:text-slate-400 focus:border-[#8CB89A] focus:ring-4 focus:ring-[#0B513D]/5"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs leading-5 text-rose-600">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0B513D] px-5 text-sm font-semibold text-white transition hover:bg-[#084330] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}

                  {submitting
                    ? "Saving..."
                    : "Save Transaction"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}