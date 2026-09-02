"use client";

import type { FinanceTransaction } from "./FinanceSummary";
import { authClient } from "@/lib/auth-client";

import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

interface TransactionListProps {
  transactions: FinanceTransaction[];

  onRefresh?: () =>
    | void
    | Promise<void>;

  onDelete?: (
    id: string
  ) => void | Promise<void>;
}

const PAGE_SIZE = 6;

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

const normalizeType = (type: string) =>
  type.toLowerCase();

const getTransactionId = (
  transaction: FinanceTransaction
) => transaction._id || transaction.id || "";

const formatCurrency = (value: number) =>
  `৳${Number(value || 0).toLocaleString(
    "en-BD"
  )}`;

export default function TransactionList({
  transactions,
  onRefresh,
  onDelete,
}: TransactionListProps) {
  const [search, setSearch] = useState("");

  const [typeFilter, setTypeFilter] =
    useState("all");

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState("all");

  const [dateFilter, setDateFilter] =
    useState("");

  const [page, setPage] = useState(1);

  const [
    editingTransaction,
    setEditingTransaction,
  ] =
    useState<FinanceTransaction | null>(
      null
    );

  const [
    deleteTarget,
    setDeleteTarget,
  ] =
    useState<FinanceTransaction | null>(
      null
    );

  const [deleting, setDeleting] =
    useState(false);

  const [deleteError, setDeleteError] =
    useState("");

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        transactions
          .map(
            (transaction) =>
              transaction.category
          )
          .filter(Boolean)
      )
    ).sort();
  }, [transactions]);

  const filteredTransactions =
    useMemo(() => {
      const searchValue =
        search.trim().toLowerCase();

      return [...transactions]
        .filter((transaction) => {
          const type = normalizeType(
            transaction.type
          );

          if (
            typeFilter !== "all" &&
            type !== typeFilter
          ) {
            return false;
          }

          if (
            categoryFilter !== "all" &&
            transaction.category !==
              categoryFilter
          ) {
            return false;
          }

          if (
            dateFilter &&
            transaction.date.slice(0, 10) !==
              dateFilter
          ) {
            return false;
          }

          if (!searchValue) {
            return true;
          }

          const searchable = [
            transaction.category,
            transaction.description,
            transaction.note,
            transaction.farm,
            transaction.type,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return searchable.includes(
            searchValue
          );
        })
        .sort(
          (a, b) =>
            new Date(b.date).getTime() -
            new Date(a.date).getTime()
        );
    }, [
      transactions,
      search,
      typeFilter,
      categoryFilter,
      dateFilter,
    ]);

  useEffect(() => {
    setPage(1);
  }, [
    search,
    typeFilter,
    categoryFilter,
    dateFilter,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredTransactions.length /
        PAGE_SIZE
    )
  );

  const currentTransactions =
    filteredTransactions.slice(
      (page - 1) * PAGE_SIZE,
      page * PAGE_SIZE
    );

  const openDeleteModal = (
    transaction: FinanceTransaction
  ) => {
    setDeleteError("");
    setDeleteTarget(transaction);
  };

  const closeDeleteModal = () => {
    if (deleting) return;

    setDeleteTarget(null);
    setDeleteError("");
  };

  const confirmDelete = async () => {
    if (!deleteTarget || !onDelete) {
      return;
    }

    const id =
      getTransactionId(deleteTarget);

    if (!id) {
      setDeleteError(
        "Transaction ID is missing."
      );
      return;
    }

    try {
      setDeleting(true);
      setDeleteError("");

      await onDelete(id);

      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(
        err instanceof Error
          ? err.message
          : "Unable to delete transaction."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Header + filters */}
        <div className="border-b border-slate-100 p-5">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Recent Transactions
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Search, filter and manage your
              financial activity.
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="relative sm:col-span-2 xl:col-span-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search transactions..."
                className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-xs outline-none transition placeholder:text-slate-400 focus:border-[#8CB89A] focus:ring-4 focus:ring-[#0B513D]/5"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(
                  event.target.value
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
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(
                  event.target.value
                )
              }
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none"
            >
              <option value="all">
                All Categories
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                )
              )}
            </select>

            <input
              type="date"
              value={dateFilter}
              onChange={(event) =>
                setDateFilter(
                  event.target.value
                )
              }
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none"
            />
          </div>
        </div>

        {currentTransactions.length ===
        0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center p-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Search className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-900">
              No transactions found
            </h3>

            <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
              Try changing your search or
              filters, or add a new
              transaction.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Transaction
                    </th>

                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Category
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
                    (transaction) => {
                      const id =
                        getTransactionId(
                          transaction
                        );

                      const isIncome =
                        normalizeType(
                          transaction.type
                        ) === "income";

                      return (
                        <tr
                          key={id}
                          className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60"
                        >
                          <td className="px-5 py-4">
                            <p className="text-sm font-medium text-slate-800">
                              {transaction.description ||
                                transaction.note ||
                                transaction.category}
                            </p>

                            {transaction.farm && (
                              <p className="mt-1 text-[11px] text-slate-400">
                                {
                                  transaction.farm
                                }
                              </p>
                            )}
                          </td>

                          <td className="px-5 py-4 text-xs text-slate-600">
                            {
                              transaction.category
                            }
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
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </td>

                          <td
                            className={`px-5 py-4 text-right text-sm font-semibold ${
                              isIncome
                                ? "text-emerald-700"
                                : "text-rose-700"
                            }`}
                          >
                            {isIncome
                              ? "+"
                              : "-"}{" "}
                            {formatCurrency(
                              transaction.amount
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingTransaction(
                                    transaction
                                  )
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                title="Edit"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  openDeleteModal(
                                    transaction
                                  )
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                                title="Delete"
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

            {/* Mobile cards */}
            <div className="divide-y divide-slate-100 md:hidden">
              {currentTransactions.map(
                (transaction) => {
                  const id =
                    getTransactionId(
                      transaction
                    );

                  const isIncome =
                    normalizeType(
                      transaction.type
                    ) === "income";

                  return (
                    <div
                      key={id}
                      className="p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {transaction.description ||
                              transaction.category}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {
                              transaction.category
                            }{" "}
                            ·{" "}
                            {new Date(
                              transaction.date
                            ).toLocaleDateString()}
                          </p>
                        </div>

                        <p
                          className={`text-sm font-semibold ${
                            isIncome
                              ? "text-emerald-700"
                              : "text-rose-700"
                          }`}
                        >
                          {isIncome
                            ? "+"
                            : "-"}{" "}
                          {formatCurrency(
                            transaction.amount
                          )}
                        </p>
                      </div>

                      <div className="mt-3 flex justify-between">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                            isIncome
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {isIncome
                            ? "Income"
                            : "Expense"}
                        </span>

                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              setEditingTransaction(
                                transaction
                              )
                            }
                            className="text-xs font-medium text-slate-500"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openDeleteModal(
                                transaction
                              )
                            }
                            className="text-xs font-medium text-rose-600"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </>
        )}

        {/* Pagination */}
        <div className="flex flex-col justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center">
          <p className="text-xs text-slate-500">
            Showing{" "}
            {filteredTransactions.length === 0
              ? 0
              : (page - 1) * PAGE_SIZE + 1}
            –
            {Math.min(
              page * PAGE_SIZE,
              filteredTransactions.length
            )}{" "}
            of {filteredTransactions.length}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page === 1}
              onClick={() =>
                setPage((previous) =>
                  Math.max(
                    1,
                    previous - 1
                  )
                )
              }
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="text-xs font-medium text-slate-600">
              {page} / {totalPages}
            </span>

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() =>
                setPage((previous) =>
                  Math.min(
                    totalPages,
                    previous + 1
                  )
                )
              }
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingTransaction && (
        <EditTransactionModal
          transaction={
            editingTransaction
          }
          onClose={() =>
            setEditingTransaction(null)
          }
          onUpdated={async () => {
            setEditingTransaction(null);

            if (onRefresh) {
              await onRefresh();
            }
          }}
        />
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteTransactionModal
          transaction={deleteTarget}
          loading={deleting}
          error={deleteError}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
}

/* ===============================
   DELETE MODAL
================================ */

function DeleteTransactionModal({
  transaction,
  loading,
  error,
  onClose,
  onConfirm,
}: {
  transaction: FinanceTransaction;
  loading: boolean;
  error: string;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <Trash2 className="h-5 w-5" />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            Delete Transaction?
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            This transaction will be
            permanently removed from your
            financial records. This action
            cannot be undone.
          </p>

          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-800">
              {transaction.description ||
                transaction.note ||
                transaction.category}
            </p>

            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                {transaction.category}
              </span>

              <span className="text-sm font-semibold text-slate-800">
                {formatCurrency(
                  transaction.amount
                )}
              </span>
            </div>
          </div>

          {error && (
            <div className="mt-4 flex gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />

              <p className="text-xs leading-5 text-rose-600">
                {error}
              </p>
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                void onConfirm()
              }
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
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
    </div>
  );
}

/* ===============================
   EDIT MODAL
================================ */

function EditTransactionModal({
  transaction,
  onClose,
  onUpdated,
}: {
  transaction: FinanceTransaction;
  onClose: () => void;
  onUpdated: () => void | Promise<void>;
}) {
  const [type, setType] = useState<
    "income" | "expense"
  >(
    normalizeType(transaction.type) ===
      "expense"
      ? "expense"
      : "income"
  );

  const [amount, setAmount] = useState(
    String(transaction.amount)
  );

  const [category, setCategory] =
    useState(transaction.category);

  const [date, setDate] = useState(
    transaction.date.slice(0, 10)
  );

  const [description, setDescription] =
    useState(
      transaction.description ||
        transaction.note ||
        ""
    );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState("");

  const categories =
    type === "income"
      ? incomeCategories
      : expenseCategories;

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

    const id =
      getTransactionId(transaction);

    if (!id) {
      setError(
        "Transaction ID is missing."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const {
        data: tokenData,
        error: tokenError,
      } = await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error(
          "Authentication required"
        );
      }

      const response = await fetch(
        `${API_URL}/finance/transactions/${id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },

          body: JSON.stringify({
            type:
              type === "income"
                ? "Income"
                : "Expense",

            amount: Number(amount),
            category,
            date,

            description:
              description.trim() ||
              undefined,
          }),
        }
      );

      const contentType =
        response.headers.get(
          "content-type"
        );

      const data =
        contentType?.includes(
          "application/json"
        )
          ? await response.json()
          : null;

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to update transaction."
        );
      }

      await onUpdated();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update transaction."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Edit Transaction
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Update your financial record.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-5"
        >
          <div className="grid grid-cols-2 gap-3">
            {[
              "income",
              "expense",
            ].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setType(
                    value as
                      | "income"
                      | "expense"
                  );

                  setCategory("");
                }}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold capitalize ${
                  type === value
                    ? "border-[#0B513D] bg-[#EEF6F1] text-[#0B513D]"
                    : "border-slate-200 text-slate-500"
                }`}
              >
                {value}
              </button>
            ))}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Amount
            </label>

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
              className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#8CB89A] focus:ring-4 focus:ring-[#0B513D]/5"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Category
            </label>

            <select
              required
              value={category}
              onChange={(event) =>
                setCategory(
                  event.target.value
                )
              }
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#8CB89A] focus:ring-4 focus:ring-[#0B513D]/5"
            >
              <option value="">
                Select category
              </option>

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
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Date
            </label>

            <input
              type="date"
              required
              value={date}
              onChange={(event) =>
                setDate(
                  event.target.value
                )
              }
              className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#8CB89A] focus:ring-4 focus:ring-[#0B513D]/5"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              rows={3}
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              className="w-full resize-none rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-[#8CB89A] focus:ring-4 focus:ring-[#0B513D]/5"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-600">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#0B513D] px-5 text-sm font-semibold text-white transition hover:bg-[#084330] disabled:opacity-60"
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