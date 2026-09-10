"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
  ArrowLeft,
  HandCoins,
  MapPin,
} from "lucide-react";

import {
  getApprovedInvestmentProject,
} from "@/services/investment.service";

import type {
  InvestmentProject,
} from "@/types/investment";

const formatMoney =
  (value: number) =>
    `৳${Number(value || 0).toLocaleString(
      "en-BD"
    )}`;

const categoryLabel =
  (value: string) =>
    value
      .split("_")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join(" ");

export default function InvestmentProjectDetailsPage() {
  const params =
    useParams<{
      projectId: string;
    }>();

  const [
    project,
    setProject,
  ] =
    useState<InvestmentProject | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  useEffect(() => {
    if (!params.projectId) {
      return;
    }

    const load =
      async () => {
        try {
          setLoading(true);

          const result =
            await getApprovedInvestmentProject(
              params.projectId
            );

          setProject(result);
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Project not found"
          );
        } finally {
          setLoading(false);
        }
      };

    load();
  }, [
    params.projectId,
  ]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-20 text-center text-sm text-slate-500">
        Loading project...
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-20">
        <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="font-semibold text-red-800">
            {error ||
              "Project not found"}
          </p>

          <Link
            href="/investment"
            className="mt-5 inline-flex rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Back to Projects
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/investment"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Investment Projects
        </Link>

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid lg:grid-cols-2">
            <div className="min-h-[360px] bg-emerald-50">
              {project.projectImage ? (
                <img
                  src={
                    project.projectImage
                  }
                  alt={
                    project.projectName
                  }
                  className="h-full min-h-[360px] w-full object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[360px] items-center justify-center text-emerald-700">
                  <HandCoins className="h-20 w-20" />
                </div>
              )}
            </div>

            <div className="p-7 sm:p-10">
              <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                {categoryLabel(
                  project.category
                )}
              </span>

              <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                {
                  project.projectName
                }
              </h1>

              <p className="mt-3 flex items-center gap-1.5 text-sm text-slate-500">
                <MapPin className="h-4 w-4" />
                {
                  project.address
                }
                ,{" "}
                {
                  project.upazila
                }
                ,{" "}
                {
                  project.district
                }
                ,{" "}
                {
                  project.division
                }
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">
                    Required Investment
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-950">
                    {formatMoney(
                      project.requiredInvestment
                    )}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">
                    Own Contribution
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-950">
                    {formatMoney(
                      project.ownContribution
                    )}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">
                    Duration
                  </p>

                  <p className="mt-1 text-base font-bold text-slate-950">
                    {
                      project.duration
                    }
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">
                    Expected Return
                  </p>

                  <p className="mt-1 text-base font-bold text-emerald-700">
                    {
                      project.expectedReturn
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 p-7 sm:p-10">
            <h2 className="text-xl font-bold text-slate-950">
              Project Overview
            </h2>

            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
              {
                project.description
              }
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 p-5">
                <p className="text-xs text-slate-400">
                  Estimated Revenue
                </p>

                <p className="mt-2 text-lg font-bold text-slate-900">
                  {formatMoney(
                    project.estimatedRevenue
                  )}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5">
                <p className="text-xs text-slate-400">
                  Estimated Cost
                </p>

                <p className="mt-2 text-lg font-bold text-slate-900">
                  {formatMoney(
                    project.estimatedCost
                  )}
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                <p className="text-xs text-emerald-600">
                  Estimated Profit
                </p>

                <p className="mt-2 text-lg font-bold text-emerald-800">
                  {formatMoney(
                    project.estimatedProfit
                  )}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-5">
              <p className="text-xs text-slate-400">
                Profit Sharing
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-900">
                {
                  project.profitSharing
                }
              </p>
            </div>

            <div className="mt-8 border-t border-slate-100 pt-6">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Farmer
              </p>

              <p className="mt-2 text-base font-semibold text-slate-900">
                {
                  project.farmerName ||
                  "AgriNova Farmer"
                }
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Project Code:{" "}
                {
                  project.projectCode
                }
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}