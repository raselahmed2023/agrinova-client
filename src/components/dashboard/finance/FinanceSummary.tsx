"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface FinanceTransaction {
  _id?: string;
  id?: string;
  userId?: string;

  type: "income" | "expense" | "INCOME" | "EXPENSE";
  amount: number;

  category: string;
  date: string;

  description?: string;
  note?: string;

  farmId?: string;
  farm?: string;

  createdAt?: string;
  updatedAt?: string;
}

interface FinanceSummaryProps {
  transactions: FinanceTransaction[];
}

type ChartPeriod =
  | "THIS_MONTH"
  | "LAST_3_MONTHS"
  | "THIS_YEAR";

const formatCurrency = (amount: number) => {
  return `৳${amount.toLocaleString("en-BD", {
    maximumFractionDigits: 0,
  })}`;
};

const normalizeType = (type: string) =>
  type.toLowerCase();

export default function FinanceSummary({
  transactions,
}: FinanceSummaryProps) {
  const summary = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction) => {
      const amount = Number(transaction.amount) || 0;

      if (
        normalizeType(transaction.type) === "income"
      ) {
        totalIncome += amount;
      }

      if (
        normalizeType(transaction.type) === "expense"
      ) {
        totalExpense += amount;
      }
    });

    return {
      totalIncome,
      totalExpense,
      netProfit: totalIncome - totalExpense,
    };
  }, [transactions]);

  const cards = [
    {
      title: "Total Income",
      value: summary.totalIncome,
      description: "All recorded income",
      icon: TrendingUp,
      trendIcon: ArrowUpRight,
      className:
        "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Total Expense",
      value: summary.totalExpense,
      description: "All recorded expenses",
      icon: TrendingDown,
      trendIcon: ArrowDownRight,
      className: "bg-rose-50 text-rose-700",
    },
    {
      title: "Net Profit",
      value: summary.netProfit,
      description: "Income − Expense",
      icon: Wallet,
      trendIcon:
        summary.netProfit >= 0
          ? ArrowUpRight
          : ArrowDownRight,
      className:
        summary.netProfit >= 0
          ? "bg-[#EAF4ED] text-[#0B513D]"
          : "bg-rose-50 text-rose-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const TrendIcon = card.trendIcon;

        return (
          <div
            key={card.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                  {formatCurrency(card.value)}
                </h2>

                <p className="mt-2 text-xs text-slate-400">
                  {card.description}
                </p>
              </div>

              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.className}`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-1.5 border-t border-slate-100 pt-4">
              <TrendIcon
                className={`h-4 w-4 ${
                  card.value >= 0
                    ? "text-emerald-600"
                    : "text-rose-600"
                }`}
              />

              <span className="text-xs text-slate-500">
                Based on recorded transactions
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function FinanceOverviewChart({
  transactions,
}: FinanceSummaryProps) {
  const [period, setPeriod] =
    useState<ChartPeriod>("THIS_MONTH");

  const filteredTransactions = useMemo(() => {
    const now = new Date();

    return transactions.filter((transaction) => {
      const transactionDate = new Date(
        transaction.date
      );

      if (
        Number.isNaN(transactionDate.getTime())
      ) {
        return false;
      }

      if (period === "THIS_MONTH") {
        return (
          transactionDate.getFullYear() ===
            now.getFullYear() &&
          transactionDate.getMonth() ===
            now.getMonth()
        );
      }

      if (period === "LAST_3_MONTHS") {
        const start = new Date(
          now.getFullYear(),
          now.getMonth() - 2,
          1
        );

        return transactionDate >= start;
      }

      return (
        transactionDate.getFullYear() ===
        now.getFullYear()
      );
    });
  }, [transactions, period]);

  const chartData = useMemo(() => {
    if (period === "THIS_MONTH") {
      const grouped = new Map<
        number,
        { income: number; expense: number }
      >();

      filteredTransactions.forEach(
        (transaction) => {
          const date = new Date(transaction.date);
          const week =
            Math.floor((date.getDate() - 1) / 7) + 1;

          const current = grouped.get(week) || {
            income: 0,
            expense: 0,
          };

          if (
            normalizeType(transaction.type) ===
            "income"
          ) {
            current.income += Number(
              transaction.amount
            );
          } else {
            current.expense += Number(
              transaction.amount
            );
          }

          grouped.set(week, current);
        }
      );

      return [1, 2, 3, 4, 5].map((week) => ({
        name: `Week ${week}`,
        income:
          grouped.get(week)?.income || 0,
        expense:
          grouped.get(week)?.expense || 0,
      }));
    }

    const monthMap = new Map<
      string,
      {
        name: string;
        income: number;
        expense: number;
        sortDate: number;
      }
    >();

    filteredTransactions.forEach(
      (transaction) => {
        const date = new Date(transaction.date);

        const key = `${date.getFullYear()}-${date.getMonth()}`;

        const existing = monthMap.get(key) || {
          name: date.toLocaleString("en-US", {
            month: "short",
          }),
          income: 0,
          expense: 0,
          sortDate: new Date(
            date.getFullYear(),
            date.getMonth(),
            1
          ).getTime(),
        };

        if (
          normalizeType(transaction.type) ===
          "income"
        ) {
          existing.income += Number(
            transaction.amount
          );
        } else {
          existing.expense += Number(
            transaction.amount
          );
        }

        monthMap.set(key, existing);
      }
    );

    return Array.from(monthMap.values())
      .sort((a, b) => a.sortDate - b.sortDate)
      .map(({ sortDate, ...item }) => item);
  }, [filteredTransactions, period]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Income & Expense Overview
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Financial activity from your real
            transactions.
          </p>
        </div>

        <CalendarDays className="h-5 w-5 text-[#477A5B]" />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {[
          {
            value: "THIS_MONTH" as const,
            label: "This Month",
          },
          {
            value: "LAST_3_MONTHS" as const,
            label: "Last 3 Months",
          },
          {
            value: "THIS_YEAR" as const,
            label: "This Year",
          },
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() =>
              setPeriod(option.value)
            }
            className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
              period === option.value
                ? "bg-[#0B513D] text-white"
                : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mt-6 h-[280px] w-full">
        {chartData.some(
          (item) =>
            item.income > 0 ||
            item.expense > 0
        ) ? (
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <AreaChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                fontSize={11}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={11}
                tickFormatter={(value) =>
                  `৳${Number(value) / 1000}k`
                }
              />

              <Tooltip
                formatter={(value) =>
                  formatCurrency(
                    Number(value || 0)
                  )
                }
              />

              <Area
                type="monotone"
                dataKey="income"
                stroke="#15803d"
                fill="#dcfce7"
                strokeWidth={2}
                name="Income"
              />

              <Area
                type="monotone"
                dataKey="expense"
                stroke="#e11d48"
                fill="#ffe4e6"
                strokeWidth={2}
                name="Expense"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full flex-col items-center justify-center rounded-xl bg-slate-50 text-center">
            <Wallet className="h-8 w-8 text-slate-300" />

            <p className="mt-3 text-sm font-medium text-slate-500">
              No financial activity
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Add transactions to see the chart.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}