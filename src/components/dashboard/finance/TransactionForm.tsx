"use client";

import {
  apiRequest,
} from "@/services/api.client";

import type {
  FarmType,
  IFarm,
} from "@/types/farm";

import {
  Loader2,
  Plus,
  WalletCards,
  X,
} from "lucide-react";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

interface TransactionFormProps {
  farms: IFarm[];

  onAdd:
    () =>
      | void
      | Promise<void>;
}

const generalIncomeCategories =
  [
    "Crop Sale",
    "Fruit Sale",
    "Plant / Seedling Sale",
    "Poultry Sale",
    "Egg Sale",
    "Livestock Sale",
    "Milk Sale",
    "Fish Sale",
    "Marketplace Sale",
    "Other Income",
  ];

const generalExpenseCategories =
  [
    "Seeds",
    "Seedlings",
    "Fertilizer",
    "Pesticide",
    "Irrigation",
    "Chicks / Birds",
    "Animal Purchase",
    "Fish Fry / Fingerlings",
    "Feed",
    "Medicine & Veterinary",
    "Medicine & Treatment",
    "Vaccination",
    "Pruning & Care",
    "Pond Maintenance",
    "Water Management",
    "Labour",
    "Equipment",
    "Transportation",
    "Farm Maintenance",
    "Electricity & Utilities",
    "Other Expense",
  ];

const farmIncomeCategories:
  Record<
    FarmType,
    string[]
  > = {
  Crop: [
    "Crop Sale",
    "Marketplace Sale",
    "Other Income",
  ],

  Orchard: [
    "Fruit Sale",
    "Plant / Seedling Sale",
    "Marketplace Sale",
    "Other Income",
  ],

  Poultry: [
    "Poultry Sale",
    "Egg Sale",
    "Marketplace Sale",
    "Other Income",
  ],

  Livestock: [
    "Livestock Sale",
    "Milk Sale",
    "Marketplace Sale",
    "Other Income",
  ],

  Fishery: [
    "Fish Sale",
    "Marketplace Sale",
    "Other Income",
  ],
};

const farmExpenseCategories:
  Record<
    FarmType,
    string[]
  > = {
  Crop: [
    "Seeds",
    "Fertilizer",
    "Pesticide",
    "Irrigation",
    "Labour",
    "Equipment",
    "Transportation",
    "Farm Maintenance",
    "Other Expense",
  ],

  Orchard: [
    "Seedlings",
    "Fertilizer",
    "Pesticide",
    "Irrigation",
    "Pruning & Care",
    "Labour",
    "Equipment",
    "Transportation",
    "Farm Maintenance",
    "Other Expense",
  ],

  Poultry: [
    "Chicks / Birds",
    "Feed",
    "Medicine & Veterinary",
    "Vaccination",
    "Labour",
    "Electricity & Utilities",
    "Equipment",
    "Transportation",
    "Farm Maintenance",
    "Other Expense",
  ],

  Livestock: [
    "Animal Purchase",
    "Feed",
    "Medicine & Veterinary",
    "Vaccination",
    "Labour",
    "Equipment",
    "Transportation",
    "Farm Maintenance",
    "Other Expense",
  ],

  Fishery: [
    "Fish Fry / Fingerlings",
    "Feed",
    "Medicine & Treatment",
    "Pond Maintenance",
    "Water Management",
    "Labour",
    "Equipment",
    "Transportation",
    "Other Expense",
  ],
};

const todayInputValue =
  () => {
    const now =
      new Date();

    const year =
      now.getFullYear();

    const month =
      String(
        now.getMonth() +
          1
      ).padStart(
        2,
        "0"
      );

    const day =
      String(
        now.getDate()
      ).padStart(
        2,
        "0"
      );

    return `${year}-${month}-${day}`;
  };

export default function TransactionForm({
  farms,
  onAdd,
}: TransactionFormProps) {
  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    type,
    setType,
  ] =
    useState<
      | "income"
      | "expense"
    >(
      "income"
    );

  const [
    amount,
    setAmount,
  ] =
    useState("");

  const [
    category,
    setCategory,
  ] =
    useState("");

  const [
    farmId,
    setFarmId,
  ] =
    useState("");

  const [
    date,
    setDate,
  ] =
    useState(
      todayInputValue()
    );

  const [
    description,
    setDescription,
  ] =
    useState("");

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const selectedFarm =
    useMemo(
      () =>
        farms.find(
          (
            farm
          ) =>
            farm._id ===
            farmId
        ) ||
        null,
      [
        farmId,
        farms,
      ]
    );

  const categories =
    useMemo(() => {
      const farmType =
        selectedFarm?.farmType;

      if (!farmType) {
        return type ===
          "income"
          ? generalIncomeCategories
          : generalExpenseCategories;
      }

      return type ===
        "income"
        ? farmIncomeCategories[
            farmType
          ]
        : farmExpenseCategories[
            farmType
          ];
    }, [
      type,
      selectedFarm,
    ]);

  useEffect(() => {
    setCategory("");
  }, [
    type,
    farmId,
  ]);

  const resetForm =
    () => {
      setType(
        "income"
      );

      setAmount("");

      setCategory("");

      setFarmId("");

      setDate(
        todayInputValue()
      );

      setDescription("");

      setError("");
    };

  const closeModal =
    () => {
      if (
        submitting
      ) {
        return;
      }

      setOpen(
        false
      );

      resetForm();
    };

  const handleSubmit =
    async (
      event:
        FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      const numericAmount =
        Number(
          amount
        );

      if (
        !Number.isFinite(
          numericAmount
        ) ||
        numericAmount <=
          0
      ) {
        setError(
          "Amount must be greater than 0."
        );

        return;
      }

      if (
        !category ||
        !date
      ) {
        setError(
          "Please complete all required fields."
        );

        return;
      }

      try {
        setSubmitting(
          true
        );

        setError("");

        await apiRequest(
          "/finance/transactions",
          "POST",
          {
            type:
              type ===
              "income"
                ? "Income"
                : "Expense",

            amount:
              numericAmount,

            category,

            farmId:
              farmId ||
              "",

            date,

            description:
              description.trim(),
          }
        );

        await onAdd();

        setOpen(
          false
        );

        resetForm();
      } catch (err) {
        setError(
          err instanceof
            Error
            ? err.message
            : "Unable to add transaction."
        );
      } finally {
        setSubmitting(
          false
        );
      }
    };

  return (
    <>
      <button
        type="button"
        onClick={() =>
          setOpen(
            true
          )
        }
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
                    Add
                    Transaction
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Record farm
                    income or
                    expense.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={
                  closeModal
                }
                disabled={
                  submitting
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-50"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-5 p-5 sm:p-6"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Transaction
                  Type
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setType(
                        "income"
                      )
                    }
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
                      type ===
                      "income"
                        ? "border-[#0B513D] bg-[#EEF6F1] text-[#0B513D]"
                        : "border-slate-200 text-slate-500"
                    }`}
                  >
                    Income
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setType(
                        "expense"
                      )
                    }
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
                      type ===
                      "expense"
                        ? "border-[#0B513D] bg-[#EEF6F1] text-[#0B513D]"
                        : "border-slate-200 text-slate-500"
                    }`}
                  >
                    Expense
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Related Farm

                  <span className="ml-1 text-xs font-normal text-slate-400">
                    Optional
                  </span>
                </label>

                <select
                  value={
                    farmId
                  }
                  onChange={(
                    event
                  ) =>
                    setFarmId(
                      event.target
                        .value
                    )
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#8CB89A] focus:ring-4 focus:ring-[#0B513D]/5"
                >
                  <option value="">
                    General / No
                    specific farm
                  </option>

                  {farms.map(
                    (
                      farm
                    ) => (
                      <option
                        key={
                          farm._id
                        }
                        value={
                          farm._id
                        }
                      >
                        {
                          farm.name
                        }{" "}
                        (
                        {
                          farm.farmType
                        }
                        )
                        {farm.status ===
                        "Inactive"
                          ? " — Inactive"
                          : ""}
                      </option>
                    )
                  )}
                </select>

                <p className="mt-1.5 text-xs text-slate-400">
                  Inactive farms
                  remain available
                  so older finance
                  records can be
                  maintained
                  correctly.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Amount
                </label>

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  inputMode="decimal"
                  required
                  value={
                    amount
                  }
                  onChange={(
                    event
                  ) =>
                    setAmount(
                      event.target
                        .value
                    )
                  }
                  placeholder="0.00"
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#8CB89A] focus:ring-4 focus:ring-[#0B513D]/5"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Category
                </label>

                <select
                  required
                  value={
                    category
                  }
                  onChange={(
                    event
                  ) =>
                    setCategory(
                      event.target
                        .value
                    )
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#8CB89A] focus:ring-4 focus:ring-[#0B513D]/5"
                >
                  <option value="">
                    Select category
                  </option>

                  {categories.map(
                    (
                      item
                    ) => (
                      <option
                        key={
                          item
                        }
                        value={
                          item
                        }
                      >
                        {
                          item
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Date
                </label>

                <input
                  type="date"
                  required
                  value={
                    date
                  }
                  onChange={(
                    event
                  ) =>
                    setDate(
                      event.target
                        .value
                    )
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#8CB89A] focus:ring-4 focus:ring-[#0B513D]/5"
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
                  maxLength={
                    500
                  }
                  value={
                    description
                  }
                  onChange={(
                    event
                  ) =>
                    setDescription(
                      event.target
                        .value
                    )
                  }
                  placeholder="Add a short note about this transaction"
                  className="w-full resize-none rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-[#8CB89A] focus:ring-4 focus:ring-[#0B513D]/5"
                />

                <p className="mt-1 text-right text-[11px] text-slate-400">
                  {
                    description.length
                  }
                  /500
                </p>
              </div>

              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-600">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={
                    closeModal
                  }
                  disabled={
                    submitting
                  }
                  className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    submitting
                  }
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#0B513D] px-5 text-sm font-semibold text-white disabled:opacity-60"
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