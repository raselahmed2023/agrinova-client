"use client";

import {
  apiRequest,
} from "@/services/api.client";

import type {
  FarmType,
  IFarm,
} from "@/types/farm";

import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  FinanceTransaction,
} from "./FinanceSummary";

import {
  formatFinanceCurrency,
} from "./FinanceSummary";

interface TransactionListProps {
  transactions:
    FinanceTransaction[];

  farms:
    IFarm[];

  onRefresh?:
    () =>
      | void
      | Promise<void>;

  onDelete?:
    (
      id:
        string
    ) =>
      | void
      | Promise<void>;
}

const PAGE_SIZE =
  6;

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

const normalizeType =
  (
    type:
      string
  ) =>
    String(
      type ||
        ""
    ).toLowerCase();

const getTransactionId =
  (
    transaction:
      FinanceTransaction
  ) =>
    transaction._id ||
    transaction.id ||
    "";

const getDateInputValue =
  (
    value:
      string
  ) => {
    if (!value) {
      return "";
    }

    return value.slice(
      0,
      10
    );
  };

const getFarmName =
  (
    farmId:
      | string
      | undefined,

    farms:
      IFarm[]
  ) => {
    if (!farmId) {
      return "General";
    }

    return (
      farms.find(
        (
          farm
        ) =>
          farm._id ===
          farmId
      )?.name ||
      "Unknown farm"
    );
  };

export default function TransactionList({
  transactions,
  farms,
  onRefresh,
  onDelete,
}: TransactionListProps) {
  const [
    typeFilter,
    setTypeFilter,
  ] =
    useState(
      "all"
    );

  const [
    categoryFilter,
    setCategoryFilter,
  ] =
    useState(
      "all"
    );

  const [
    dateFilter,
    setDateFilter,
  ] =
    useState("");

  const [
    page,
    setPage,
  ] =
    useState(1);

  const [
    editingTransaction,
    setEditingTransaction,
  ] =
    useState<
      FinanceTransaction | null
    >(null);

  const [
    deleteTarget,
    setDeleteTarget,
  ] =
    useState<
      FinanceTransaction | null
    >(null);

  const [
    deleting,
    setDeleting,
  ] =
    useState(false);

  const [
    deleteError,
    setDeleteError,
  ] =
    useState("");

  const categories =
    useMemo(
      () =>
        Array.from(
          new Set(
            transactions
              .map(
                (
                  transaction
                ) =>
                  transaction.category
              )
              .filter(
                Boolean
              )
          )
        ).sort(),
      [
        transactions,
      ]
    );

  const filteredTransactions =
    useMemo(() => {
      return [
        ...transactions,
      ]
        .filter(
          (
            transaction
          ) => {
            const type =
              normalizeType(
                transaction.type
              );

            if (
              typeFilter !==
                "all" &&
              type !==
                typeFilter
            ) {
              return false;
            }

            if (
              categoryFilter !==
                "all" &&
              transaction.category !==
                categoryFilter
            ) {
              return false;
            }

            if (
              dateFilter &&
              getDateInputValue(
                transaction.date
              ) !==
                dateFilter
            ) {
              return false;
            }

            return true;
          }
        )
        .sort(
          (
            a,
            b
          ) => {
            const aDate =
              new Date(
                a.date
              ).getTime();

            const bDate =
              new Date(
                b.date
              ).getTime();

            if (
              bDate !==
              aDate
            ) {
              return (
                bDate -
                aDate
              );
            }

            const aCreated =
              new Date(
                a.createdAt ||
                  a.date
              ).getTime();

            const bCreated =
              new Date(
                b.createdAt ||
                  b.date
              ).getTime();

            return (
              bCreated -
              aCreated
            );
          }
        );
    }, [
      transactions,
      typeFilter,
      categoryFilter,
      dateFilter,
    ]);

  const totalPages =
    Math.max(
      1,

      Math.ceil(
        filteredTransactions.length /
          PAGE_SIZE
      )
    );

  useEffect(() => {
    setPage(1);
  }, [
    typeFilter,
    categoryFilter,
    dateFilter,
  ]);

  /*
   * Important:
   * If deleting the last record on the last
   * page reduces totalPages, do not leave
   * the UI on an empty invalid page.
   */
  useEffect(() => {
    setPage(
      (
        current
      ) =>
        Math.min(
          current,
          totalPages
        )
    );
  }, [
    totalPages,
  ]);

  const currentTransactions =
    filteredTransactions.slice(
      (page - 1) *
        PAGE_SIZE,

      page *
        PAGE_SIZE
    );

  const confirmDelete =
    async () => {
      if (
        !deleteTarget ||
        !onDelete
      ) {
        return;
      }

      const id =
        getTransactionId(
          deleteTarget
        );

      if (!id) {
        setDeleteError(
          "Transaction ID is missing."
        );

        return;
      }

      try {
        setDeleting(
          true
        );

        setDeleteError(
          ""
        );

        await onDelete(
          id
        );

        setDeleteTarget(
          null
        );
      } catch (err) {
        setDeleteError(
          err instanceof
            Error
            ? err.message
            : "Unable to delete transaction."
        );
      } finally {
        setDeleting(
          false
        );
      }
    };

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5">
          <h2 className="text-base font-semibold text-slate-900">
            Recent
            Transactions
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Filter and manage
            your financial
            activity.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <select
              value={
                typeFilter
              }
              onChange={(
                event
              ) =>
                setTypeFilter(
                  event.target
                    .value
                )
              }
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none"
            >
              <option value="all">
                All Types
              </option>

              <option value="income">
                Income
              </option>

              <option value="expense">
                Expense
              </option>
            </select>

            <select
              value={
                categoryFilter
              }
              onChange={(
                event
              ) =>
                setCategoryFilter(
                  event.target
                    .value
                )
              }
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none"
            >
              <option value="all">
                All Categories
              </option>

              {categories.map(
                (
                  category
                ) => (
                  <option
                    key={
                      category
                    }
                    value={
                      category
                    }
                  >
                    {
                      category
                    }
                  </option>
                )
              )}
            </select>

            <input
              type="date"
              value={
                dateFilter
              }
              onChange={(
                event
              ) =>
                setDateFilter(
                  event.target
                    .value
                )
              }
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none"
            />
          </div>
        </div>

        {currentTransactions.length ===
        0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center p-6 text-center">
            <h3 className="text-sm font-semibold text-slate-900">
              No transactions
              found
            </h3>

            <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
              Try changing your
              filters or add a
              new transaction.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Transaction
                    </th>

                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Farm
                    </th>

                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Type
                    </th>

                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Date
                    </th>

                    <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Amount
                    </th>

                    <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {currentTransactions.map(
                    (
                      transaction
                    ) => {
                      const id =
                        getTransactionId(
                          transaction
                        );

                      const isIncome =
                        normalizeType(
                          transaction.type
                        ) ===
                        "income";

                      return (
                        <tr
                          key={
                            id
                          }
                          className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60"
                        >
                          <td className="px-5 py-4">
                            <p className="text-sm font-medium text-slate-800">
                              {transaction.description ||
                                transaction.note ||
                                transaction.category}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {
                                transaction.category
                              }
                            </p>
                          </td>

                          <td className="px-5 py-4 text-xs text-slate-600">
                            {getFarmName(
                              transaction.farmId,
                              farms
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                isIncome
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-rose-50 text-rose-700"
                              }`}
                            >
                              {isIncome
                                ? "Income"
                                : "Expense"}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-xs text-slate-500">
                            {new Date(
                              transaction.date
                            ).toLocaleDateString(
                              "en-BD"
                            )}
                          </td>

                          <td
                            className={`px-5 py-4 text-right text-sm font-bold ${
                              isIncome
                                ? "text-emerald-700"
                                : "text-rose-700"
                            }`}
                          >
                            {isIncome
                              ? "+"
                              : "−"}

                            {formatFinanceCurrency(
                              Number(
                                transaction.amount ||
                                  0
                              )
                            )}
                          </td>

                          <td className="px-5 py-4 text-right">
                            <div className="inline-flex gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingTransaction(
                                    transaction
                                  )
                                }
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-[#0B513D]"
                                aria-label="Edit transaction"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setDeleteError(
                                    ""
                                  );

                                  setDeleteTarget(
                                    transaction
                                  );
                                }}
                                className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                                aria-label="Delete transaction"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-slate-100 md:hidden">
              {currentTransactions.map(
                (
                  transaction
                ) => {
                  const id =
                    getTransactionId(
                      transaction
                    );

                  const isIncome =
                    normalizeType(
                      transaction.type
                    ) ===
                    "income";

                  return (
                    <div
                      key={
                        id
                      }
                      className="p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {transaction.description ||
                              transaction.note ||
                              transaction.category}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {
                              transaction.category
                            }{" "}
                            ·{" "}
                            {getFarmName(
                              transaction.farmId,
                              farms
                            )}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {new Date(
                              transaction.date
                            ).toLocaleDateString(
                              "en-BD"
                            )}
                          </p>
                        </div>

                        <p
                          className={`shrink-0 text-sm font-bold ${
                            isIncome
                              ? "text-emerald-700"
                              : "text-rose-700"
                          }`}
                        >
                          {isIncome
                            ? "+"
                            : "−"}

                          {formatFinanceCurrency(
                            Number(
                              transaction.amount ||
                                0
                            )
                          )}
                        </p>
                      </div>

                      <div className="mt-3 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setEditingTransaction(
                              transaction
                            )
                          }
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600"
                        >
                          <Pencil className="h-3.5 w-3.5" />

                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setDeleteTarget(
                              transaction
                            )
                          }
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />

                          Delete
                        </button>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </>
        )}

        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 text-xs text-slate-500">
          <span>
            {filteredTransactions.length ===
            0
              ? 0
              : (page -
                    1) *
                  PAGE_SIZE +
                1}
            –
            {Math.min(
              page *
                PAGE_SIZE,
              filteredTransactions.length
            )}{" "}
            of{" "}
            {
              filteredTransactions.length
            }
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={
                page === 1
              }
              onClick={() =>
                setPage(
                  (
                    value
                  ) =>
                    Math.max(
                      1,
                      value -
                        1
                    )
                )
              }
              className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="font-semibold text-slate-600">
              {page} /{" "}
              {
                totalPages
              }
            </span>

            <button
              type="button"
              disabled={
                page >=
                totalPages
              }
              onClick={() =>
                setPage(
                  (
                    value
                  ) =>
                    Math.min(
                      totalPages,
                      value +
                        1
                    )
                )
              }
              className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {editingTransaction && (
        <EditTransactionModal
          transaction={
            editingTransaction
          }
          farms={
            farms
          }
          onClose={() =>
            setEditingTransaction(
              null
            )
          }
          onUpdated={async () => {
            await onRefresh?.();

            setEditingTransaction(
              null
            );
          }}
        />
      )}

      {deleteTarget && (
        <DeleteTransactionModal
          transaction={
            deleteTarget
          }
          loading={
            deleting
          }
          error={
            deleteError
          }
          onClose={() => {
            if (
              !deleting
            ) {
              setDeleteTarget(
                null
              );

              setDeleteError(
                ""
              );
            }
          }}
          onConfirm={
            confirmDelete
          }
        />
      )}
    </>
  );
}

function DeleteTransactionModal({
  transaction,
  loading,
  error,
  onClose,
  onConfirm,
}: {
  transaction:
    FinanceTransaction;

  loading:
    boolean;

  error:
    string;

  onClose:
    () => void;

  onConfirm:
    () =>
      | void
      | Promise<void>;
}) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
            <AlertTriangle className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Delete
              Transaction?
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {
                transaction.category
              }{" "}
              ·{" "}
              {formatFinanceCurrency(
                Number(
                  transaction.amount ||
                    0
                )
              )}
            </p>

            <p className="mt-2 text-xs leading-5 text-slate-400">
              This removes the
              entry from your
              finance ledger and
              cannot be undone.
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-600">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={
              loading
            }
            onClick={
              onClose
            }
            className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={
              loading
            }
            onClick={() =>
              void onConfirm()
            }
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-rose-600 px-5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />

                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />

                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditTransactionModal({
  transaction,
  farms,
  onClose,
  onUpdated,
}: {
  transaction:
    FinanceTransaction;

  farms:
    IFarm[];

  onClose:
    () => void;

  onUpdated:
    () =>
      | void
      | Promise<void>;
}) {
  const [
    type,
    setType,
  ] =
    useState<
      | "income"
      | "expense"
    >(
      normalizeType(
        transaction.type
      ) ===
        "expense"
        ? "expense"
        : "income"
    );

  const [
    amount,
    setAmount,
  ] =
    useState(
      String(
        transaction.amount
      )
    );

  const [
    category,
    setCategory,
  ] =
    useState(
      transaction.category
    );

  const [
    farmId,
    setFarmId,
  ] =
    useState(
      transaction.farmId ||
        ""
    );

  const [
    date,
    setDate,
  ] =
    useState(
      getDateInputValue(
        transaction.date
      )
    );

  const [
    description,
    setDescription,
  ] =
    useState(
      transaction.description ||
        transaction.note ||
        ""
    );

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
        farms,
        farmId,
      ]
    );

  const categories =
    useMemo(() => {
      const farmType =
        selectedFarm?.farmType;

      const base =
        farmType
          ? type ===
            "income"
            ? farmIncomeCategories[
                farmType
              ]
            : farmExpenseCategories[
                farmType
              ]
          : type ===
            "income"
          ? generalIncomeCategories
          : generalExpenseCategories;

      /*
       * Keep a legacy/custom category visible
       * while editing an old transaction.
       */
      return base.includes(
        category
      ) ||
        !category
        ? base
        : [
            category,
            ...base,
          ];
    }, [
      type,
      selectedFarm,
      category,
    ]);

  const handleSubmit =
    async (
      event:
        FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      const id =
        getTransactionId(
          transaction
        );

      const numericAmount =
        Number(
          amount
        );

      if (!id) {
        setError(
          "Transaction ID is missing."
        );

        return;
      }

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
        setLoading(
          true
        );

        setError("");

        await apiRequest(
          `/finance/transactions/${encodeURIComponent(
            id
          )}`,
          "PATCH",
          {
            type:
              type ===
              "income"
                ? "Income"
                : "Expense",

            amount:
              numericAmount,

            category,

            /*
             * Empty string intentionally clears
             * the old farm relationship.
             */
            farmId:
              farmId ||
              "",

            date,

            /*
             * Empty string intentionally removes
             * an existing description.
             */
            description:
              description.trim(),
          }
        );

        await onUpdated();
      } catch (err) {
        setError(
          err instanceof
            Error
            ? err.message
            : "Unable to update transaction."
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[2px]">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Edit
              Transaction
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Update the type,
              farm, category,
              date or note.
            </p>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            disabled={
              loading
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
          className="space-y-4 p-5"
        >
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                "income",
                "expense",
              ] as const
            ).map(
              (
                value
              ) => (
                <button
                  key={
                    value
                  }
                  type="button"
                  onClick={() => {
                    if (
                      value !==
                      type
                    ) {
                      setType(
                        value
                      );

                      setCategory(
                        ""
                      );
                    }
                  }}
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold capitalize ${
                    type ===
                    value
                      ? "border-[#0B513D] bg-[#EEF6F1] text-[#0B513D]"
                      : "border-slate-200 text-slate-500"
                  }`}
                >
                  {
                    value
                  }
                </button>
              )
            )}
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
              ) => {
                setFarmId(
                  event.target
                    .value
                );

                setCategory(
                  ""
                );
              }}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#8CB89A] focus:ring-4 focus:ring-[#0B513D]/5"
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

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={
                onClose
              }
              disabled={
                loading
              }
              className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                loading
              }
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#0B513D] px-5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {loading
                ? "Updating..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}