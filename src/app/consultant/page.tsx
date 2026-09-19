"use client";

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ExpertCard from "@/components/consultant/ExpertCard";
import ConsultantBookingModal from "@/components/consultant/ConsultantBookingModal";

import { getAllExperts } from "@/services/expert.service";

import type { ExpertProfile } from "@/types/expert";
import type { Consultation } from "@/types/consultation";

import {
  ArrowRight,
  Calendar,
  PhoneCall,
  RefreshCw,
  Search,
  Users,
  Video,
  X,
} from "lucide-react";

const CATEGORIES = [
  {
    id: "ALL",
    label: "All Specializations",
  },
  {
    id: "PATHOLOGY",
    label: "Plant Pathology & Disease",
  },
  {
    id: "SOIL",
    label: "Soil & Fertilizer",
  },
  {
    id: "IRRIGATION",
    label: "Precision Irrigation",
  },
  {
    id: "HORTICULTURE",
    label: "Horticulture & Orchards",
  },
  {
    id: "ENTOMOLOGY",
    label: "Pest Management (IPM)",
  },
  {
    id: "SEED",
    label: "Seed & Vegetable",
  },
];

export default function ConsultantPage() {
  const [experts, setExperts] = useState<
    ExpertProfile[]
  >([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState("");

  // Search & Filters
  const [searchQuery, setSearchQuery] =
    useState("");

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("ALL");

  const [
    availabilityFilter,
    setAvailabilityFilter,
  ] = useState<
    "ALL" | "AVAILABLE_NOW" | "VERIFIED"
  >("ALL");

  const [sortBy, setSortBy] = useState<
    "RATING" | "EXPERIENCE" | "FEE_LOW"
  >("RATING");

  // Booking Modal
  const [
    selectedExpertForBooking,
    setSelectedExpertForBooking,
  ] = useState<ExpertProfile | null>(null);

  const [
    isBookingModalOpen,
    setIsBookingModalOpen,
  ] = useState(false);

  const [recentBooking, setRecentBooking] =
    useState<Consultation | null>(null);

  const fetchExperts = async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const data =
        await getAllExperts();

      setExperts(data);
    } catch (err) {
      console.error(
        "Error loading experts:",
        err,
      );

      setExperts([]);

      setLoadError(
        err instanceof Error
          ? err.message
          : "Unable to load agricultural specialists right now.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExperts();
  }, []);

  const handleOpenBooking = (
    expert: ExpertProfile,
  ) => {
    setSelectedExpertForBooking(expert);
    setIsBookingModalOpen(true);
  };

  const handleBookingSuccess = (
    consultation: Consultation,
  ) => {
    setRecentBooking(consultation);
  };

  // Filtered & Sorted Experts
  const filteredExperts = useMemo(() => {
    return experts
      .filter((exp) => {
        // Search query
        if (searchQuery.trim()) {
          const q =
            searchQuery.toLowerCase();

          const matchesName =
            exp.name
              ?.toLowerCase()
              .includes(q);

          const matchesTitle =
            exp.title
              ?.toLowerCase()
              .includes(q);

          const matchesInstitution =
            exp.institution
              ?.toLowerCase()
              .includes(q);

          const matchesLocation =
            exp.location
              ?.toLowerCase()
              .includes(q);

          const specs = (
            Array.isArray(
              exp.specialization,
            )
              ? exp.specialization.join(" ")
              : String(
                  exp.specialization || "",
                )
          ).toLowerCase();

          const matchesSpec =
            specs.includes(q);

          if (
            !matchesName &&
            !matchesTitle &&
            !matchesInstitution &&
            !matchesLocation &&
            !matchesSpec
          ) {
            return false;
          }
        }

        // Category filter
        if (
          selectedCategory !== "ALL"
        ) {
          const specs = (
            Array.isArray(
              exp.specialization,
            )
              ? exp.specialization.join(" ")
              : String(
                  exp.specialization || "",
                )
          ).toLowerCase();

          if (
            selectedCategory ===
              "PATHOLOGY" &&
            !specs.includes("patholog") &&
            !specs.includes("disease") &&
            !specs.includes("fungal")
          ) {
            return false;
          }

          if (
            selectedCategory ===
              "SOIL" &&
            !specs.includes("soil") &&
            !specs.includes("fertil") &&
            !specs.includes("nutrient")
          ) {
            return false;
          }

          if (
            selectedCategory ===
              "IRRIGATION" &&
            !specs.includes(
              "irrigation",
            ) &&
            !specs.includes("water") &&
            !specs.includes("climate")
          ) {
            return false;
          }

          if (
            selectedCategory ===
              "HORTICULTURE" &&
            !specs.includes(
              "horticulture",
            ) &&
            !specs.includes("fruit") &&
            !specs.includes("orchard")
          ) {
            return false;
          }

          if (
            selectedCategory ===
              "ENTOMOLOGY" &&
            !specs.includes("pest") &&
            !specs.includes(
              "entomolog",
            ) &&
            !specs.includes(
              "armyworm",
            ) &&
            !specs.includes("borer")
          ) {
            return false;
          }

          if (
            selectedCategory === "SEED" &&
            !specs.includes("seed") &&
            !specs.includes(
              "vegetable",
            ) &&
            !specs.includes("crop")
          ) {
            return false;
          }
        }

        // Availability filter
        if (
          availabilityFilter ===
          "AVAILABLE_NOW"
        ) {
          if (
            exp.availabilityStatus !==
            "AVAILABLE"
          ) {
            return false;
          }
        }

        if (
          availabilityFilter ===
          "VERIFIED"
        ) {
          if (!exp.isVerified) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "RATING") {
          return (
            (b.rating || 0) -
            (a.rating || 0)
          );
        }

        if (
          sortBy === "EXPERIENCE"
        ) {
          return (
            (b.experienceYears || 0) -
            (a.experienceYears || 0)
          );
        }

        if (sortBy === "FEE_LOW") {
          return (
            (a.consultationFee || 0) -
            (b.consultationFee || 0)
          );
        }

        return 0;
      });
  }, [
    experts,
    searchQuery,
    selectedCategory,
    availabilityFilter,
    sortBy,
  ]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("ALL");
    setAvailabilityFilter("ALL");
    setSortBy("RATING");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="relative min-h-screen flex-1 overflow-hidden">
       
        <div className="pointer-events-none fixed inset-0 -z-20">
          <div
            className="consultant-page-bg absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('/images/marketplace-bg.jpg')",
              animation:
                "consultantBg 55s ease-in-out infinite alternate",
            }}
          />

          {/* Strong readability layer: keeps the agricultural image subtle */}
          <div className="absolute inset-0 bg-white/62" />

          {/* Soft depth without exposing too much of the background */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/28 via-[#f5f8f2]/48 to-[#eef5f0]/72" />
        </div>

        <div className="relative mx-auto w-full max-w-[1600px] px-3 py-6 sm:px-4 lg:px-5 lg:py-8">
         
          <section className="relative mb-6 overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-xl shadow-slate-900/10 backdrop-blur-md">
            {/* Decorative glow */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-teal-200/20 blur-3xl" />

            <div className="relative p-6 sm:p-8 lg:p-9">
              <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(390px,.85fr)] xl:items-center">
                {/* LEFT */}
                <div className="max-w-4xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700 shadow-sm">
                    <Users className="h-3.5 w-3.5" />

                    Agricultural Experts
                  </div>

                  <h1 className="mt-4 max-w-3xl text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl">
                    Connect with{" "}
                    <span className="text-emerald-700">
                      Agricultural Specialists
                    </span>
                  </h1>

                  <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                    Find specialists by
                    expertise, availability,
                    experience, rating, and
                    consultation fee. Book
                    consultations directly
                    through AgriNova.
                  </p>

                  {/* Specialization tags */}
                  <div className="mt-6">
                    <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                      Explore expertise
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {[
                        "Plant Disease",
                        "Soil & Fertilizer",
                        "Irrigation",
                        "Horticulture",
                        "Pest Management",
                        "Seed & Crops",
                      ].map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-emerald-100 bg-emerald-50/90 px-3 py-1.5 text-[11px] font-bold text-emerald-700"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT GLASS STATS */}
                <div className="grid grid-cols-2 gap-3">
                  <HeroMetric
                    icon={Users}
                    value={`${experts.length}`}
                    label="Available Experts"
                  />

                  <HeroMetric
                    icon={Search}
                    value={`${filteredExperts.length}`}
                    label="Current Results"
                  />

                  <HeroMetric
                    icon={Video}
                    value="1-on-1"
                    label="Consultation"
                  />

                  <HeroMetric
                    icon={Calendar}
                    value="Booking"
                    label="Flexible Booking"
                  />
                </div>
              </div>
            </div>
          </section>

          {recentBooking && (
            <section className="mb-5 rounded-2xl border border-white/70 bg-white/85 p-4 shadow-lg shadow-slate-900/5 backdrop-blur-md sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <Calendar className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-[0.13em] text-emerald-700">
                      Active Appointment
                      Reserved
                    </span>

                    <h4 className="mt-1 text-sm font-black text-slate-900 sm:text-base">
                      {recentBooking.expertName ||
                        "Specialist"}{" "}
                      ·{" "}
                      {
                        recentBooking.scheduledDate
                      }{" "}
                      (
                      {
                        recentBooking.scheduledTime
                      }
                      )
                    </h4>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Crop:{" "}
                      <span className="font-semibold text-slate-700">
                        {
                          recentBooking.cropType
                        }
                      </span>{" "}
                      · Problem:{" "}
                      {
                        recentBooking.problemTitle
                      }
                    </p>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                  {recentBooking.meetingLink && (
                    <a
                      href={
                        recentBooking.meetingLink
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-800 sm:flex-none"
                    >
                      <Video className="h-4 w-4" />
                      Join Video Call
                    </a>
                  )}

                  <Link
                    href="/dashboard/farmer/consultation"
                    className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700 sm:flex-none"
                  >
                    My Dashboard

                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </section>
          )}

   
          <section className="rounded-2xl border border-white/70 bg-white/85 p-3 shadow-lg shadow-slate-900/5 backdrop-blur-md">
            <div className="grid gap-2.5 lg:grid-cols-[minmax(0,1fr)_210px_210px_48px]">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(
                      e.target.value,
                    )
                  }
                  placeholder="Search specialists by name, crop, location, institution, or specialization..."
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-10 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearchQuery("")
                    }
                    aria-label="Clear search"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Availability */}
              <select
                value={availabilityFilter}
                onChange={(e) =>
                  setAvailabilityFilter(
                    e.target.value as
                      | "ALL"
                      | "AVAILABLE_NOW"
                      | "VERIFIED",
                  )
                }
                className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              >
                <option value="ALL">
                  All Specialists
                </option>

                <option value="AVAILABLE_NOW">
                  Accepting Consultations
                </option>

                <option value="VERIFIED">
                  Verified Only
                </option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as
                      | "RATING"
                      | "EXPERIENCE"
                      | "FEE_LOW",
                  )
                }
                className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              >
                <option value="RATING">
                  Highest Rated
                </option>

                <option value="EXPERIENCE">
                  Most Experienced
                </option>

                <option value="FEE_LOW">
                  Fee: Low to High
                </option>
              </select>

              {/* Refresh */}
              <button
                type="button"
                onClick={fetchExperts}
                title="Refresh Specialist Roster"
                aria-label="Refresh specialist roster"
                className="flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    isLoading
                      ? "animate-spin"
                      : ""
                  }`}
                />
              </button>
            </div>

            {/* Categories */}
            <div className="mt-3 border-t border-slate-100 pt-3">
              <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {CATEGORIES.map((cat) => {
                  const isSelected =
                    selectedCategory ===
                    cat.id;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() =>
                        setSelectedCategory(
                          cat.id,
                        )
                      }
                      className={`shrink-0 rounded-full px-4 py-2 text-[11px] font-bold transition ${
                        isSelected
                          ? "bg-emerald-700 text-white shadow-sm"
                          : "border border-slate-200 bg-white/90 text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reset filters */}
            {(searchQuery ||
              selectedCategory !==
                "ALL" ||
              availabilityFilter !==
                "ALL") && (
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 transition hover:text-emerald-900"
                >
                  <X className="h-3.5 w-3.5" />

                  Clear filters
                </button>
              </div>
            )}
          </section>

          <section className="mt-6">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-700">
                  Expert Directory
                </p>

                <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
                  Agricultural Specialists
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Showing{" "}
                  <strong className="text-slate-800">
                    {
                      filteredExperts.length
                    }
                  </strong>{" "}
                  available agricultural
                  specialists
                </p>
              </div>
            </div>

           
            {loadError && !isLoading ? (
              <div className="rounded-3xl border border-rose-200 bg-white/95 p-8 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                  <RefreshCw className="h-5 w-5" />
                </div>

                <h3 className="mt-4 text-lg font-black text-slate-900">
                  Unable to Load Specialists
                </h3>

                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                  {loadError}
                </p>

                <button
                  type="button"
                  onClick={fetchExperts}
                  className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-700 px-5 text-xs font-bold text-white transition hover:bg-emerald-800"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Try Again
                </button>
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {[
                  1, 2, 3, 4, 5, 6,
                ].map((n) => (
                  <div
                    key={n}
                    className="h-80 animate-pulse rounded-3xl border border-white/70 bg-white/92 shadow-sm backdrop-blur-sm"
                  />
                ))}
              </div>
            ) : filteredExperts.length ===
              0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white/90 p-12 text-center shadow-sm backdrop-blur-md">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <Search className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-lg font-black text-slate-900">
                  No Specialists Matched
                  Your Query
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Try searching with
                  another name, crop,
                  institution, or
                  specialization.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-700 px-5 text-xs font-bold text-white transition hover:bg-emerald-800"
                >
                  <RefreshCw className="h-3.5 w-3.5" />

                  Show All Specialists
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredExperts.map(
                  (expert) => (
                    <div
                      key={
                        expert._id ||
                        expert.id
                      }
                      className="transition duration-300 hover:-translate-y-1"
                    >
                      <ExpertCard
                        expert={expert}
                        onBook={
                          handleOpenBooking
                        }
                      />
                    </div>
                  ),
                )}
              </div>
            )}
          </section>

     
          <section className="mt-8 rounded-3xl border border-white/70 bg-white/92 p-6 shadow-lg shadow-slate-900/5 backdrop-blur-md sm:p-8 lg:p-9">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                Consultation Process
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-950 sm:text-3xl">
                How Farmer Consultation
                Works
              </h2>
            </div>

            <div className="relative mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="pointer-events-none absolute left-[8%] right-[8%] top-6 hidden h-px bg-emerald-100 lg:block" />

              <ProcessCard
                number="1"
                title="Select Your Specialist"
                description="Browse available agricultural specialists based on your crop type and farming challenge."
              />

              <ProcessCard
                number="2"
                title="Pick Schedule Slot"
                description="Choose an available 30-minute time window and submit information about your crop problem."
              />

              <ProcessCard
                number="3"
                title="Complete Payment"
                description="Review the consultation fee and complete the required payment to confirm your booking."
              />

              <ProcessCard
                number="4"
                title="Join Video Consultation"
                description="Join your scheduled consultation and discuss the farming issue directly with the specialist."
              />

              <ProcessCard
                number="5"
                title="Get Recommendation"
                description="Review the consultation recommendation and follow-up information available through your dashboard."
              />
            </div>
          </section>

        </div>

        {/* Booking Modal */}
        <ConsultantBookingModal
          isOpen={isBookingModalOpen}
          onClose={() =>
            setIsBookingModalOpen(false)
          }
          expert={
            selectedExpertForBooking
          }
          onBookingSuccess={
            handleBookingSuccess
          }
        />

        <Footer />

       
        <style jsx global>{`
          @keyframes consultantBg {
            0% {
              transform: scale(1);
            }

            100% {
              transform: scale(1.05);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .consultant-page-bg {
              animation: none !important;
              transform: none !important;
            }
          }
        `}</style>
      </main>
    </div>
  );
}



function HeroMetric({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{
    className?: string;
  }>;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/92 p-4 shadow-sm backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/80 hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700">
          <Icon className="h-4.5 w-4.5" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-base font-black text-slate-950">
            {value}
          </p>

          <p className="mt-0.5 text-[10px] font-medium text-slate-500">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

function ProcessCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative z-10 rounded-2xl border border-white/80 bg-white/75 p-5 shadow-sm backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:bg-white hover:shadow-md">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-700 text-sm font-black text-white shadow-sm transition duration-300 group-hover:scale-105 group-hover:bg-emerald-800">
        {number}
      </div>

      <h4 className="mt-5 text-sm font-black text-slate-900">
        {title}
      </h4>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}