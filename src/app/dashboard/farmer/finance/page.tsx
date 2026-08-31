"use client";

import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import FinanceSummary, {
  FinanceOverviewChart,
  type FinanceTransaction,
} from "@/components/dashboard/finance/FinanceSummary";

import TransactionForm from "@/components/dashboard/finance/TransactionForm";
import TransactionList from "@/components/dashboard/finance/TransactionList";
import { authClient } from "@/lib/auth-client";

import {
  AlertTriangle,
  Loader2,
  RefreshCw,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function FinancePage() {
  const {
    data: session,
    isPending: isSessionLoading,
  } = authClient.useSession();

  const userId = session?.user?.id;

  const [transactions, setTransactions] = useState<
    FinanceTransaction[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(
    null
  );

  const getApiUrl = () => {
    if (!API_URL) {
      throw new Error(
        "NEXT_PUBLIC_API_URL is not configured"
      );
    }

    return API_URL;
  };

  const fetchTransactions = useCallback(async () => {
    if (!userId) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const baseUrl = getApiUrl();

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
        `${baseUrl}/finance/transactions/me`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          cache: "no-store",
        }
      );

      const contentType =
        response.headers.get("content-type");

      const data =
        contentType?.includes("application/json")
          ? await response.json()
          : null;

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `Failed to fetch transactions (${response.status})`
        );
      }

      const transactionData =
        data?.data ?? data ?? [];

      setTransactions(
        Array.isArray(transactionData)
          ? transactionData
          : []
      );
    } catch (err) {
      console.error(
        "Error fetching transactions:",
        err
      );

      setTransactions([]);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load financial data."
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const handleDeleteTransaction = async (
    transactionId: string
  ) => {
    const baseUrl = getApiUrl();

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
      `${baseUrl}/finance/transactions/${transactionId}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${tokenData.token}`,
        },
      }
    );

    const contentType =
      response.headers.get("content-type");

    const data =
      contentType?.includes("application/json")
        ? await response.json()
        : null;

    if (!response.ok) {
      throw new Error(
        data?.message ||
          "Failed to delete transaction"
      );
    }

    await fetchTransactions();
  };

  useEffect(() => {
    if (userId) {
      void fetchTransactions();
      return;
    }

    if (!isSessionLoading && !userId) {
      setLoading(false);
      setError("User authentication required");
    }
  }, [
    userId,
    isSessionLoading,
    fetchTransactions,
  ]);

  const isPageLoading =
    loading || isSessionLoading;

  return (
    <div className="min-h-screen w-full bg-slate-50 p-4 text-slate-800 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#063928] sm:text-3xl">
              Finance
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Track your farming income, expenses,
              and profit in one place.
            </p>
          </div>

          <TransactionForm
            onAdd={fetchTransactions}
          />
        </div>

        {isPageLoading ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <Loader2 className="h-9 w-9 animate-spin text-[#063928]" />

            <p className="text-sm font-semibold text-slate-600">
              Loading financial data...
            </p>

            <p className="text-xs text-slate-400">
              Please wait a moment
            </p>
          </div>
        ) : error ? (
          <div className="flex min-h-[380px] flex-col items-center justify-center gap-3 rounded-2xl border border-rose-200 bg-rose-50/50 p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <h3 className="text-base font-bold text-rose-900">
              Data Loading Failed
            </h3>

            <p className="max-w-md text-xs leading-5 text-rose-600">
              {error}
            </p>

            {userId && (
              <button
                type="button"
                onClick={() =>
                  void fetchTransactions()
                }
                className="mt-2 flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-rose-700"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Try Again
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-6">
              <FinanceSummary
                transactions={transactions}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <FinanceOverviewChart
                  transactions={transactions}
                />
              </div>

              <div className="lg:col-span-8">
                <TransactionList
                  transactions={transactions}
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