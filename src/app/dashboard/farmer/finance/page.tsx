"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { authClient } from "@/lib/auth-client";

import FinanceSummary, {
  FinanceOverviewChart,
  type FinanceTransaction,
} from "@/components/dashboard/finance/FinanceSummary";

import TransactionForm from "@/components/dashboard/finance/TransactionForm";
import TransactionList from "@/components/dashboard/finance/TransactionList";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

interface FarmOption {
  _id?: string;
  id?: string;
  name?: string;
  farmName?: string;
  status?: "Active" | "Inactive";
}

export default function FinancePage() {
  const [
    transactions,
    setTransactions,
  ] = useState<FinanceTransaction[]>([]);

  const [farms, setFarms] =
    useState<FarmOption[]>([]);

  const [
    selectedFarm,
    setSelectedFarm,
  ] = useState("all");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const fetchTransactions =
    useCallback(async () => {
      if (!API_URL) {
        setError(
          "API configuration is missing."
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const {
          data: tokenData,
          error: tokenError,
        } =
          await authClient.token();

        if (
          tokenError ||
          !tokenData?.token
        ) {
          throw new Error(
            "Authentication required"
          );
        }

        const response =
          await fetch(
            `${API_URL}/finance/transactions/me`,
            {
              headers: {
                Accept:
                  "application/json",
                Authorization: `Bearer ${tokenData.token}`,
              },
              cache: "no-store",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to fetch transactions."
          );
        }

        setTransactions(
          Array.isArray(data?.data)
            ? data.data
            : []
        );
      } catch (err) {
        setTransactions([]);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load transactions."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  const fetchFarms =
    useCallback(async () => {
      if (!API_URL) return;

      try {
        const {
          data: tokenData,
          error: tokenError,
        } =
          await authClient.token();

        if (
          tokenError ||
          !tokenData?.token
        ) {
          setFarms([]);
          return;
        }

        const response =
          await fetch(
            `${API_URL}/farms`,
            {
              headers: {
                Accept:
                  "application/json",
                Authorization: `Bearer ${tokenData.token}`,
              },
              cache: "no-store",
            }
          );

        if (!response.ok) {
          setFarms([]);
          return;
        }

        const data =
          await response.json();

        const farmData =
          data?.data?.farms ||
          data?.data ||
          data ||
          [];

        const activeFarms =
          Array.isArray(farmData)
            ? farmData.filter(
                (
                  farm: FarmOption
                ) =>
                  farm.status ===
                  "Active"
              )
            : [];

        setFarms(activeFarms);
      } catch {
        setFarms([]);
      }
    }, []);

  useEffect(() => {
    void fetchTransactions();
    void fetchFarms();
  }, [
    fetchTransactions,
    fetchFarms,
  ]);

  const filteredTransactions =
    useMemo(() => {
      if (
        selectedFarm === "all"
      ) {
        return transactions;
      }

      return transactions.filter(
        (transaction) =>
          transaction.farmId ===
          selectedFarm
      );
    }, [
      transactions,
      selectedFarm,
    ]);

  const selectedFarmName =
    useMemo(() => {
      if (
        selectedFarm === "all"
      ) {
        return "All Farms";
      }

      const farm = farms.find(
        (item) =>
          (item._id ||
            item.id) ===
          selectedFarm
      );

      return (
        farm?.name ||
        farm?.farmName ||
        "Selected Farm"
      );
    }, [
      selectedFarm,
      farms,
    ]);

  const handleDeleteTransaction =
    async (
      transactionId: string
    ) => {
      if (!API_URL) {
        throw new Error(
          "API configuration is missing."
        );
      }

      const {
        data: tokenData,
        error: tokenError,
      } =
        await authClient.token();

      if (
        tokenError ||
        !tokenData?.token
      ) {
        throw new Error(
          "Authentication required"
        );
      }

      const response =
        await fetch(
          `${API_URL}/finance/transactions/${transactionId}`,
          {
            method: "DELETE",
            headers: {
              Accept:
                "application/json",
              Authorization: `Bearer ${tokenData.token}`,
            },
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to delete transaction."
        );
      }

      await fetchTransactions();
    };

  return (
    <div className="min-h-full bg-[#F8FAFB]">
      <div className="mx-auto w-full max-w-[1600px] space-y-5 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#073B2D]">
              Finance
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Track your farming
              income, expenses and
              profit in one place.
            </p>
          </div>

          <TransactionForm
            onAdd={
              fetchTransactions
            }
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Finance Overview
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Showing finance for{" "}
                <span className="font-semibold text-[#0B513D]">
                  {
                    selectedFarmName
                  }
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-slate-500">
                Farm
              </label>

              <select
                value={
                  selectedFarm
                }
                onChange={(
                  event
                ) =>
                  setSelectedFarm(
                    event.target
                      .value
                  )
                }
                className="h-10 min-w-[180px] rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#8CB89A] focus:ring-4 focus:ring-[#0B513D]/5"
              >
                <option value="all">
                  All Farms
                </option>

                {farms.map(
                  (farm) => {
                    const id =
                      farm._id ||
                      farm.id;

                    if (!id) {
                      return null;
                    }

                    return (
                      <option
                        key={id}
                        value={id}
                      >
                        {farm.name ||
                          farm.farmName ||
                          "Unnamed Farm"}
                      </option>
                    );
                  }
                )}
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {error}
          </div>
        )}

        {loading ? (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={item}
                    className="h-[185px] animate-pulse rounded-2xl border border-slate-200 bg-white"
                  />
                )
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="h-[430px] animate-pulse rounded-2xl border border-slate-200 bg-white lg:col-span-4" />

              <div className="h-[430px] animate-pulse rounded-2xl border border-slate-200 bg-white lg:col-span-8" />
            </div>
          </>
        ) : (
          <>
            <FinanceSummary
              transactions={
                filteredTransactions
              }
            />

            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <FinanceOverviewChart
                  transactions={
                    filteredTransactions
                  }
                />
              </div>

              <div className="lg:col-span-8">
                <TransactionList
                  transactions={
                    filteredTransactions
                  }
                  onDelete={
                    handleDeleteTransaction
                  }
                  onRefresh={
                    fetchTransactions
                  }
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}