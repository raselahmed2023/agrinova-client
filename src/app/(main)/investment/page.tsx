"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowRight,
  HandCoins,
  MapPin,
  Search,
} from "lucide-react";

import {
  getApprovedInvestmentProjects,
} from "@/services/investment.service";

import type {
  InvestmentProject,
} from "@/types/investment";

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

const formatMoney =
  (value: number) =>
    `৳${Number(value || 0).toLocaleString(
      "en-BD"
    )}`;

export default function InvestmentPublicPage() {
  const [
    projects,
    setProjects,
  ] =
    useState<InvestmentProject[]>(
      []
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

  const [
    search,
    setSearch,
  ] =
    useState("");

  const loadProjects =
    async () => {
      try {
        setLoading(true);
        setError("");

        const result =
          await getApprovedInvestmentProjects(
            search
              ? `search=${encodeURIComponent(
                  search
                )}`
              : undefined
          );

        setProjects(
          result.data
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load investment projects"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              <HandCoins className="h-4 w-4" />
              AgriNova Projects
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Agricultural Investment Projects
            </h1>

            <p className="mt-4 text-base leading-7 text-slate-500">
              Explore farming projects submitted by AgriNova farmers and reviewed by our admin team.
            </p>
          </div>

          <div className="mt-8 max-w-2xl">
            <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-1 items-center gap-3 px-4">
                <Search className="h-5 w-5 text-slate-400" />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key ===
                      "Enter"
                    ) {
                      loadProjects();
                    }
                  }}
                  placeholder="Search project, farmer or district..."
                  className="w-full py-3 text-sm outline-none"
                />
              </div>

              <button
                type="button"
                onClick={
                  loadProjects
                }
                className="bg-emerald-700 px-6 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center text-sm text-slate-500">
            Loading approved projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <HandCoins className="mx-auto h-10 w-10 text-slate-300" />

            <h2 className="mt-4 font-semibold text-slate-900">
              No approved projects found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Approved agricultural projects will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.map(
              (project) => (
                <article
                  key={
                    project._id
                  }
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {project.projectImage ? (
                    <img
                      src={
                        project.projectImage
                      }
                      alt={
                        project.projectName
                      }
                      className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-56 items-center justify-center bg-emerald-50 text-emerald-700">
                      <HandCoins className="h-14 w-14" />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {categoryLabel(
                          project.category
                        )}
                      </span>

                      <span className="text-xs font-medium text-slate-400">
                        {
                          project.projectCode
                        }
                      </span>
                    </div>

                    <h2 className="mt-4 text-xl font-bold text-slate-950">
                      {
                        project.projectName
                      }
                    </h2>

                    <p className="mt-2 flex items-center gap-1 text-sm text-slate-500">
                      <MapPin className="h-4 w-4" />
                      {
                        project.district
                      }
                      ,{" "}
                      {
                        project.division
                      }
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-400">
                          Required
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-900">
                          {formatMoney(
                            project.requiredInvestment
                          )}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-400">
                          Duration
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-900">
                          {
                            project.duration
                          }
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5">
                      <span className="text-sm text-slate-500">
                        Expected return
                      </span>

                      <strong className="text-sm text-emerald-700">
                        {
                          project.expectedReturn
                        }
                      </strong>
                    </div>

                    <Link
                      href={`/investment/${project._id}`}
                      className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                    >
                      View Project
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </section>
    </main>
  );
}