"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import FinanceSummary, {
  FinanceOverviewChart,
  type FinanceTransaction,
} from "@/components/dashboard/finance/FinanceSummary";
import TransactionForm from "@/components/dashboard/finance/TransactionForm";
import TransactionList from "@/components/dashboard/finance/TransactionList";
import { apiRequest } from "@/services/api.client";
import { getMyFarms } from "@/services/farm.service";
import type { IFarm } from "@/types/farm";

export default function FinancePage() {
  const [
    transactions,
    setTransactions,
  ] = useState<
    FinanceTransaction[]
  >([]);

  const [
    farms,
    setFarms,
  ] = useState<IFarm[]>(
    []
  );

  const [
    selectedFarm,
    setSelectedFarm,
  ] = useState("all");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const fetchTransactions =
    useCallback(
      async () => {
        try {
          setError("");

          const data =
            await apiRequest<
              FinanceTransaction[]
            >(
              "/finance/transactions/me"
            );

          setTransactions(
            Array.isArray(data)
              ? data
              : []
          );
        } catch (err) {
          setTransactions([]);

          throw err;
        }
      },
      []
    );

  const fetchFarms =
    useCallback(
      async () => {
        try {
          const data =
            await getMyFarms();

          setFarms(
            Array.isArray(data)
              ? data
              : []
          );
        } catch {
          /*
           * Finance should remain usable
           * even if the farm lookup fails.
           */
          setFarms([]);
        }
      },
      []
    );

  const refreshFinance =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setError("");

          await Promise.all([
            fetchTransactions(),
            fetchFarms(),
          ]);
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load finance information."
          );
        } finally {
          setLoading(false);
        }
      },
      [
        fetchTransactions,
        fetchFarms,
      ]
    );

  useEffect(() => {
    void refreshFinance();
  }, [refreshFinance]);

  const filteredTransactions =
    useMemo(() => {
      if (
        selectedFarm ===
        "all"
      ) {
        return transactions;
      }

      if (
        selectedFarm ===
        "unassigned"
      ) {
        return transactions.filter(
          (
            transaction
          ) =>
            !transaction.farmId
        );
      }

      return transactions.filter(
        (
          transaction
        ) =>
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
        selectedFarm ===
        "all"
      ) {
        return "All Farms";
      }

      if (
        selectedFarm ===
        "unassigned"
      ) {
        return "General / No Farm";
      }

      const farm =
        farms.find(
          (
            item
          ) =>
            item._id ===
            selectedFarm
        );

      return (
        farm?.name ||
        "Selected Farm"
      );
    }, [
      selectedFarm,
      farms,
    ]);

  const handleDeleteTransaction =
    async (
      transactionId:
        string
    ) => {
      await apiRequest<{
        transactionId?: string;
      }>(
        `/finance/transactions/${encodeURIComponent(
          transactionId
        )}`,
        "DELETE"
      );

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
              Track farm income,
              expenses and net
              profit in one place.
            </p>
          </div>

          <TransactionForm
            farms={farms}
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
                Showing finance
                for{" "}
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
                className="h-10 min-w-[210px] rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#8CB89A] focus:ring-4 focus:ring-[#0B513D]/5"
              >
                <option value="all">
                  All Farms
                </option>

                <option value="unassigned">
                  General / No
                  Farm
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
                      {farm.name}
                      {farm.status ===
                      "Inactive"
                        ? " (Inactive)"
                        : ""}
                    </option>
                  )
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
                (
                  item
                ) => (
                  <div
                    key={
                      item
                    }
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
                  farms={
                    farms
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