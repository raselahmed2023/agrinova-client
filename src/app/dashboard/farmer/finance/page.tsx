"use client";

import React, { useState, useEffect, useCallback } from "react";
import FinanceSummary, { FinanceOverviewChart } from "@/components/dashboard/finance/FinanceSummary";
import TransactionForm from "@/components/dashboard/finance/TransactionForm";
import TransactionList from "@/components/dashboard/finance/TransactionList";
import { authClient } from "@/lib/auth-client";
import { Loader2, AlertTriangle, RefreshCw } from "lucide-react";

export default function FinancePage() {
  const { data: session, isPending: isSessionLoading } = authClient.useSession();
  const userId = session?.user?.id;

  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // API Params-এ userId পাঠিয়ে ট্রানজ্যাকশন আনার ফাংশন
  const fetchTransactions = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      // Path Parameter হিসেবে userId পাঠানো হচ্ছে
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/finance/transactions/${userId}`
      );

      // Safe JSON parsing handling
      let data: any = null;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      }

      if (response.ok && data) {
        setTransactions(data.data || data || []);
      } else {
       
        setTransactions([]);
        setError(data?.message || `Failed to fetch transactions (Status: ${response.status})`);
      }
    } catch (err: any) {
      console.error("Error fetching transactions:", err);
      setTransactions([]);
      setError("Server connection failed or data undefined. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchTransactions();
    } else if (!isSessionLoading && !userId) {
      // যদি User Session না থাকে
      setLoading(false);
      setError("User authentication required");
    }
  }, [userId, isSessionLoading, fetchTransactions]);

  // Session চেক করা এবং API ফেচ করা পর্যন্ত ফুল লোডিং থাকবে
  const isPageLoading = loading || isSessionLoading;
  console.log('transactions', transactions)

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-slate-50 min-h-screen text-slate-800">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#063928]">Finance</h1>
          <p className="text-sm text-slate-500">
            Track your farming income, expenses, and profit in one place.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <TransactionForm onAdd={fetchTransactions} />
        </div>
      </div>

      {/* 1. Full Page Loading State */}
      {isPageLoading ? (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-2xl border border-slate-200 shadow-sm gap-3">
          <Loader2 size={36} className="animate-spin text-[#063928]" />
          <p className="text-sm font-semibold text-slate-600">
            Loading financial data...
          </p>
          <p className="text-xs text-slate-400">Please wait a moment</p>
        </div>
      ) : error ? (
        /* 2. Failed / Undefined / Error State */
        <div className="flex flex-col items-center justify-center py-20 bg-rose-50/50 rounded-2xl border border-rose-200 text-center p-6 gap-3">
          <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
            <AlertTriangle size={24} />
          </div>
          <h3 className="text-base font-bold text-rose-900">Data Loading Failed</h3>
          <p className="text-xs text-rose-600 max-w-md">{error}</p>
          <button
            onClick={fetchTransactions}
            className="mt-2 flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw size={14} /> Try Again
          </button>
        </div>
      ) : (
        /* 3. Successful Loaded State */
        <>
          {/* Summary Cards */}
          <div className="mb-6">
            <FinanceSummary transactions={transactions} />
          </div>

          {/* Main Content (Chart & Table) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <FinanceOverviewChart transactions={transactions} />
            </div>
            <div className="lg:col-span-8">
              <TransactionList transactions={transactions} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}