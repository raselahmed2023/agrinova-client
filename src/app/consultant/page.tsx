"use client";

import React, { useEffect, useMemo, useState } from "react";
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
  CheckCircle2,
  FileCheck2,
  HeartPulse,
  PhoneCall,
  RefreshCw,
  Search,
  Sparkles,
  Users,
  Video,
  X,
} from "lucide-react";

const CATEGORIES = [
  { id: "ALL", label: "All Specializations" },
  { id: "PATHOLOGY", label: "Plant Pathology & Disease" },
  { id: "SOIL", label: "Soil & Fertilizer" },
  { id: "IRRIGATION", label: "Precision Irrigation" },
  { id: "HORTICULTURE", label: "Horticulture & Orchards" },
  { id: "ENTOMOLOGY", label: "Pest Management (IPM)" },
  { id: "SEED", label: "Seed & Vegetable" },
];

export default function ConsultantPage() {
  const [experts, setExperts] = useState<ExpertProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [availabilityFilter, setAvailabilityFilter] = useState<
    "ALL" | "AVAILABLE_NOW" | "VERIFIED"
  >("ALL");
  const [sortBy, setSortBy] = useState<
    "RATING" | "EXPERIENCE" | "FEE_LOW"
  >("RATING");

  // Booking Modal
  const [selectedExpertForBooking, setSelectedExpertForBooking] =
    useState<ExpertProfile | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [recentBooking, setRecentBooking] =
    useState<Consultation | null>(null);

  const fetchExperts = async () => {
    setIsLoading(true);

    try {
      const data = await getAllExperts();
      setExperts(data);
    } catch (err) {
      console.error("Error loading experts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExperts();
  }, []);

  const handleOpenBooking = (expert: ExpertProfile) => {
    setSelectedExpertForBooking(expert);
    setIsBookingModalOpen(true);
  };

  const handleBookingSuccess = (consultation: Consultation) => {
    setRecentBooking(consultation);
  };

  // Filtered & Sorted Experts
  const filteredExperts = useMemo(() => {
    return experts
      .filter((exp) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();

          const matchesName = exp.name?.toLowerCase().includes(q);
          const matchesTitle = exp.title?.toLowerCase().includes(q);
          const matchesInstitution = exp.institution
            ?.toLowerCase()
            .includes(q);
          const matchesLocation = exp.location
            ?.toLowerCase()
            .includes(q);

          const specs = (
            Array.isArray(exp.specialization)
              ? exp.specialization.join(" ")
              : String(exp.specialization || "")
          ).toLowerCase();

          const matchesSpec = specs.includes(q);

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
        if (selectedCategory !== "ALL") {
          const specs = (
            Array.isArray(exp.specialization)
              ? exp.specialization.join(" ")
              : String(exp.specialization || "")
          ).toLowerCase();

          if (
            selectedCategory === "PATHOLOGY" &&
            !specs.includes("patholog") &&
            !specs.includes("disease") &&
            !specs.includes("fungal")
          ) {
            return false;
          }

          if (
            selectedCategory === "SOIL" &&
            !specs.includes("soil") &&
            !specs.includes("fertil") &&
            !specs.includes("nutrient")
          ) {
            return false;
          }

          if (
            selectedCategory === "IRRIGATION" &&
            !specs.includes("irrigation") &&
            !specs.includes("water") &&
            !specs.includes("climate")
          ) {
            return false;
          }

          if (
            selectedCategory === "HORTICULTURE" &&
            !specs.includes("horticulture") &&
            !specs.includes("fruit") &&
            !specs.includes("orchard")
          ) {
            return false;
          }

          if (
            selectedCategory === "ENTOMOLOGY" &&
            !specs.includes("pest") &&
            !specs.includes("entomolog") &&
            !specs.includes("armyworm") &&
            !specs.includes("borer")
          ) {
            return false;
          }

          if (
            selectedCategory === "SEED" &&
            !specs.includes("seed") &&
            !specs.includes("vegetable") &&
            !specs.includes("crop")
          ) {
            return false;
          }
        }

        // Availability filter
        if (availabilityFilter === "AVAILABLE_NOW") {
          if (exp.availabilityStatus !== "AVAILABLE") {
            return false;
          }
        }

        if (availabilityFilter === "VERIFIED") {
          if (!exp.isVerified) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "RATING") {
          return (b.rating || 0) - (a.rating || 0);
        }

        if (sortBy === "EXPERIENCE") {
          return (b.experienceYears || 0) - (a.experienceYears || 0);
        }

        if (sortBy === "FEE_LOW") {
          return (a.consultationFee || 0) - (b.consultationFee || 0);
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
    <div className="flex min-h-screen flex-col bg-[#F7F9F8]">
      <Navbar />


      <section className="px-4 pt-6 sm:px-6 lg:px-8 lg:pt-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-emerald-950/5 bg-[linear-gradient(120deg,#063B2B_0%,#07513A_52%,#0B6A4B_100%)] px-6 py-10 text-white shadow-[0_18px_60px_rgba(6,59,43,0.13)] sm:px-8 sm:py-12 lg:px-12">
          {/* Decorative background */}
          <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-emerald-300/10 blur-[80px]" />

          <div className="pointer-events-none absolute -bottom-32 left-[35%] h-80 w-80 rounded-full bg-teal-300/10 blur-[90px]" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-white/[0.07] px-3.5 py-1.5 backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-100 sm:text-[11px]">
                Live Tele-Agri Plant Clinics & 1-on-1 Consultation
              </span>
            </div>

            <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              {/* Left */}
              <div className="max-w-3xl">
                <h1 className="text-3xl font-black leading-[1.05] tracking-[-0.04em] text-white sm:text-4xl lg:text-[48px]">
                  Connect with Certified
                  <span className="mt-1 block text-emerald-300">
                    Agricultural Specialists
                  </span>
                </h1>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-emerald-50/80 sm:text-[15px]">
                  Diagnose crop diseases, optimize soil fertility, and
                  solve pest outbreaks with verified scientists from
                  Bangladesh Agricultural University, BARI, and BRRI via
                  HD video appointments.
                </p>
              </div>

              {/* Right quick stats */}
              <div className="grid grid-cols-2 gap-3">
                <HeroMetric
                  icon={Users}
                  value="50+"
                  label="Verified Agronomists"
                />

                <HeroMetric
                  icon={HeartPulse}
                  value="15,000+"
                  label="Crops Diagnosed"
                />

                <HeroMetric
                  icon={Video}
                  value="Instant Link"
                  label="Jitsi HD Tele-Clinic"
                />

                <HeroMetric
                  icon={FileCheck2}
                  value="100%"
                  label="Prescription Delivery"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

    
      <main className="mx-auto w-full max-w-7xl flex-1 space-y-7 px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
   
        {recentBooking && (
          <div className="flex flex-col gap-5 rounded-[22px] border border-emerald-200/70 bg-white p-5 shadow-[0_5px_20px_rgba(15,23,42,0.04)] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <Calendar className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-700">
                  Active Appointment Reserved
                </span>

                <h4 className="mt-1 text-sm font-black text-slate-900 sm:text-base">
                  {recentBooking.expertName || "Specialist"} ·{" "}
                  {recentBooking.scheduledDate} (
                  {recentBooking.scheduledTime})
                </h4>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Crop:{" "}
                  <span className="font-semibold text-slate-700">
                    {recentBooking.cropType}
                  </span>{" "}
                  · Problem: {recentBooking.problemTitle}
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
              {recentBooking.meetingLink && (
                <a
                  href={recentBooking.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-emerald-700 sm:flex-none"
                >
                  <Video className="h-4 w-4" />
                  Join Video Call
                </a>
              )}

              <Link
                href="/dashboard/farmer/consultation"
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 transition hover:bg-slate-50 sm:flex-none"
              >
                My Dashboard
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}

 
        <section className="rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-[0_5px_24px_rgba(15,23,42,0.04)] sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            {/* Search */}
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search specialists by name, symptom, crop, institution, or specialization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 w-full rounded-xl border border-slate-200 bg-[#FAFCFB] pl-11 pr-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Select filters */}
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-[1fr_1fr_auto] lg:flex">
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
                className="h-12 rounded-xl border border-slate-200 bg-[#FAFCFB] px-4 text-xs font-semibold text-slate-700 outline-none transition hover:border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              >
                <option value="ALL">All Specialists</option>
                <option value="AVAILABLE_NOW">
                  Accepting Consultations
                </option>
                <option value="VERIFIED">
                  Verified Scientists Only
                </option>
              </select>

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
                className="h-12 rounded-xl border border-slate-200 bg-[#FAFCFB] px-4 text-xs font-semibold text-slate-700 outline-none transition hover:border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              >
                <option value="RATING">Highest Rated</option>
                <option value="EXPERIENCE">
                  Most Experienced
                </option>
                <option value="FEE_LOW">
                  Fee: Lowest First
                </option>
              </select>

              <button
                type="button"
                onClick={fetchExperts}
                title="Refresh Specialist Roster"
                className="flex h-12 w-full items-center justify-center rounded-xl border border-slate-200 bg-[#FAFCFB] px-4 text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 sm:w-12 sm:px-0"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    isLoading ? "animate-spin" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Category tabs */}
          <div className="mt-4 border-t border-slate-100 pt-4">
            <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {CATEGORIES.map((cat) => {
                const isSelected =
                  selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() =>
                      setSelectedCategory(cat.id)
                    }
                    className={`shrink-0 rounded-full px-4 py-2 text-[11px] font-bold transition ${
                      isSelected
                        ? "bg-[#073B2D] text-white shadow-sm"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

    
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">
              Expert Directory
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-[-0.03em] text-[#17372D]">
              Agricultural Specialists
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Showing{" "}
              <strong className="font-bold text-slate-800">
                {filteredExperts.length}
              </strong>{" "}
              available agricultural specialists
            </p>
          </div>

          {(searchQuery ||
            selectedCategory !== "ALL" ||
            availabilityFilter !== "ALL") && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex w-fit items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <X className="h-3.5 w-3.5" />
              Reset Filters
            </button>
          )}
        </div>

      
        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="overflow-hidden rounded-[24px] border border-slate-200 bg-white p-5"
              >
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 animate-pulse rounded-2xl bg-slate-100" />

                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-36 animate-pulse rounded bg-slate-100" />
                    <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
                  </div>
                </div>

                <div className="mt-6 h-20 animate-pulse rounded-xl bg-slate-50" />

                <div className="mt-5 h-11 animate-pulse rounded-xl bg-slate-100" />
              </div>
            ))}
          </div>
        ) : filteredExperts.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-[24px] border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Search className="h-6 w-6" />
            </div>

            <h3 className="mt-5 text-lg font-black text-slate-900">
              No Specialists Matched Your Query
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Try another name, crop, specialization, or clear
              the current filters.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#073B2D] px-5 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#0B513D]"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Show All Specialists
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredExperts.map((expert) => (
              <div
                key={expert._id || expert.id}
                className="transition duration-300 hover:-translate-y-1"
              >
                <ExpertCard
                  expert={expert}
                  onBook={handleOpenBooking}
                />
              </div>
            ))}
          </div>
        )}

 
        <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_5px_24px_rgba(15,23,42,0.04)] sm:p-8 lg:p-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">
              Seamless 4-Step Process
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-[#17372D] sm:text-3xl">
              How Farmer Consultation Works
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
              Get certified plant clinic advisory from the
              convenience of your field in four easy steps.
            </p>
          </div>

          <div className="relative mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Desktop connecting line */}
            <div className="pointer-events-none absolute left-[11%] right-[11%] top-6 hidden h-px bg-emerald-100 lg:block" />

            <ProcessCard
              number="1"
              title="Select Your Specialist"
              description="Browse verified agronomists, plant pathologists, and soil researchers based on your crop type and challenge."
            />

            <ProcessCard
              number="2"
              title="Pick Schedule Slot"
              description="Choose an available 30-minute time window that fits your schedule and submit your crop symptoms."
            />

            <ProcessCard
              number="3"
              title="Join 1-on-1 Video Clinic"
              description="Launch the direct Jitsi video room with a single click. Show live crop leaves, roots, and pests over your smartphone camera."
            />

            <ProcessCard
              number="4"
              title="Get Digital Prescription"
              description="Receive customized treatment dosages, organic alternatives, and step-by-step follow-up instructions directly in your dashboard."
            />
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[28px] border border-emerald-200/70 bg-[linear-gradient(120deg,#F0FDF7_0%,#F8FBFA_50%,#EFFCF8_100%)] p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-300/20 blur-[80px]" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex max-w-3xl items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#073B2D] text-white shadow-md">
                <PhoneCall className="h-5 w-5" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-700">
                  Rapid Outbreak Emergency Support
                </p>

                <h3 className="mt-1 text-lg font-black tracking-[-0.02em] text-[#17372D] sm:text-xl">
                  Facing Fast-Spreading Fungal Blight or
                  Armyworm Attack?
                </h3>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Don&apos;t wait for your crops to suffer
                  irreversible damage. Connect with on-call
                  specialists or use AgriNova AI diagnostic scanner.
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              <Link
                href="/dashboard/farmer/ai-diagnose"
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-xs font-bold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50 lg:flex-none"
              >
                <Sparkles className="h-4 w-4 text-emerald-600" />
                AI Crop Scanner
              </Link>

              <Link
                href="/dashboard/farmer/consultation"
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#073B2D] px-5 text-xs font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#0B513D] lg:flex-none"
              >
                My Consultation Hub
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Booking Modal — logic unchanged */}
      <ConsultantBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        expert={selectedExpertForBooking}
        onBookingSuccess={handleBookingSuccess}
      />

      <Footer />
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
    <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-3.5 backdrop-blur transition duration-200 hover:bg-white/[0.11]">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-300/10 text-emerald-200">
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-black text-white sm:text-base">
            {value}
          </p>

          <p className="mt-0.5 text-[9px] leading-4 text-emerald-100/60 sm:text-[10px]">
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
    <div className="group relative z-10 rounded-2xl border border-slate-200/80 bg-[#FAFCFB] p-5 transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:bg-white hover:shadow-[0_14px_35px_rgba(11,72,53,0.08)]">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#073B2D] text-sm font-black text-white shadow-sm transition duration-200 group-hover:scale-105 group-hover:bg-emerald-700">
        {number}
      </div>

      <h4 className="mt-5 text-sm font-black text-[#17372D]">
        {title}
      </h4>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}