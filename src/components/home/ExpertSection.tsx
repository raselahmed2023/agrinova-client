"use client";

import {
  useEffect,
  useState,
} from "react";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  Search,
  Star,
} from "lucide-react";

import {
  getAllExperts,
} from "@/services/expert.service";

import type {
  ExpertProfile,
} from "@/types/expert";

export default function ExpertSection() {
  const [
    experts,
    setExperts,
  ] =
    useState<
      ExpertProfile[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  useEffect(() => {
    let mounted =
      true;

    const load =
      async () => {
        try {
          const result =
            await getAllExperts();

          if (
            mounted
          ) {
            setExperts(
              result.slice(
                0,
                2
              )
            );
          }
        } catch (
          error
        ) {
          console.error(
            "Unable to load homepage experts:",
            error
          );

          if (
            mounted
          ) {
            setExperts(
              []
            );
          }
        } finally {
          if (
            mounted
          ) {
            setLoading(
              false
            );
          }
        }
      };

    void load();

    return () => {
      mounted =
        false;
    };
  }, []);

  return (
    <section className="mx-auto my-8 w-full max-w-6xl rounded-3xl bg-[#F5F8FF] px-4 py-12 md:px-8">
      <div className="flex flex-col items-center gap-12 md:flex-row">
        <div className="w-full md:w-1/2">
          {loading ? (
            <div className="flex min-h-[260px] items-center justify-center">
              <Loader2 className="h-7 w-7 animate-spin text-emerald-700" />
            </div>
          ) : experts.length >
            0 ? (
            <div className="flex flex-col justify-center gap-6 sm:flex-row">
              {experts.map(
                (
                  expert,
                  index
                ) => {
                  const expertId =
                    expert._id ||
                    expert.id;

                  return (
                    <div
                      key={
                        expertId ||
                        expert.name
                      }
                      className={`flex w-full flex-shrink-0 flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:w-64 ${
                        index ===
                        1
                          ? "sm:-mt-8"
                          : ""
                      }`}
                    >
                      <div className="relative mb-4 h-16 w-16 overflow-hidden rounded-full border-2 border-white bg-emerald-50 shadow-sm">
                        {expert.avatar ||
                        expert.image ? (
                          <Image
                            src={
                              expert.avatar ||
                              expert.image ||
                              ""
                            }
                            alt={
                              expert.name
                            }
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-sm font-bold text-emerald-800">
                            {expert.name
                              .slice(
                                0,
                                2
                              )
                              .toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <h3 className="truncate text-sm font-bold text-gray-900">
                          {
                            expert.name
                          }
                        </h3>

                        {expert.isVerified && (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        )}
                      </div>

                      <p className="mt-1 line-clamp-1 text-xs text-gray-500">
                        {expert.title ||
                          "Agricultural Expert"}
                      </p>

                      {expert.rating >
                        0 && (
                        <div className="mt-3 flex items-center gap-1 text-xs">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />

                          <span className="font-bold text-slate-700">
                            {expert.rating.toFixed(
                              1
                            )}
                          </span>

                          <span className="text-slate-400">
                            (
                            {expert.ratingCount ||
                              0}
                            )
                          </span>
                        </div>
                      )}

                      <p className="mt-4 line-clamp-3 flex-1 text-xs leading-6 text-gray-600">
                        {expert.bio ||
                          (
                            expert.specialization ||
                            []
                          )
                            .slice(
                              0,
                              3
                            )
                            .join(
                              ", "
                            ) ||
                          "View this expert's profile and consultation availability."}
                      </p>

                      <Link
                        href="/consultant"
                        className="mt-5 inline-flex items-center text-sm font-semibold text-gray-800 transition hover:text-emerald-700"
                      >
                        Contact
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  );
                }
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <p className="font-semibold text-slate-700">
                No experts are
                available right now.
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Approved experts
                will appear here.
              </p>
            </div>
          )}
        </div>

        <div className="flex w-full flex-col items-start text-left md:w-1/2">
          <h2 className="text-3xl font-bold leading-tight text-[#143B2E] md:text-4xl">
            Get Guidance from
            Agricultural Experts
          </h2>

          <p className="mb-8 mt-4 text-sm leading-relaxed text-gray-600 md:text-base">
            Connect with approved
            agricultural specialists
            for practical advice on
            crop disease, soil,
            irrigation and farm
            management.
          </p>

          <Link
            href="/consultant"
            className="inline-flex items-center rounded-lg bg-[#0A3622] px-6 py-3 font-medium text-white shadow-md transition-colors hover:bg-[#072416]"
          >
            Find an Expert

            <Search className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}