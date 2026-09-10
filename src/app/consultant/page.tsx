"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ExpertCard from "@/components/consultant/ExpertCard";
import ConsultantBookingModal from "@/components/consultant/ConsultantBookingModal";
import { getAllExperts } from "@/services/expert.service";
import type { ExpertProfile } from "@/types/expert";
import type { Consultation } from "@/types/consultation";
import {
  Search,
  Filter,
  Sparkles,
  ShieldCheck,
  Video,
  Clock,
  CheckCircle2,
  Calendar,
  Users,
  Award,
  Sprout,
  FileCheck2,
  PhoneCall,
  ArrowRight,
  RefreshCw,
  X,
  Stethoscope,
  HeartPulse,
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
  const [sortBy, setSortBy] = useState<"RATING" | "EXPERIENCE" | "FEE_LOW">("RATING");

  // Booking Modal
  const [selectedExpertForBooking, setSelectedExpertForBooking] =
    useState<ExpertProfile | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [recentBooking, setRecentBooking] = useState<Consultation | null>(null);

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
          const matchesInstitution = exp.institution?.toLowerCase().includes(q);
          const matchesLocation = exp.location?.toLowerCase().includes(q);
          const specs = (
            Array.isArray(exp.specialization)
              ? exp.specialization.join(" ")
              : String(exp.specialization || "")
          ).toLowerCase();
          const matchesSpec = specs.includes(q);

          if (!matchesName && !matchesTitle && !matchesInstitution && !matchesLocation && !matchesSpec) {
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

          if (selectedCategory === "PATHOLOGY" && !specs.includes("patholog") && !specs.includes("disease") && !specs.includes("fungal")) {
            return false;
          }
          if (selectedCategory === "SOIL" && !specs.includes("soil") && !specs.includes("fertil") && !specs.includes("nutrient")) {
            return false;
          }
          if (selectedCategory === "IRRIGATION" && !specs.includes("irrigation") && !specs.includes("water") && !specs.includes("climate")) {
            return false;
          }
          if (selectedCategory === "HORTICULTURE" && !specs.includes("horticulture") && !specs.includes("fruit") && !specs.includes("orchard")) {
            return false;
          }
          if (selectedCategory === "ENTOMOLOGY" && !specs.includes("pest") && !specs.includes("entomolog") && !specs.includes("armyworm") && !specs.includes("borer")) {
            return false;
          }
          if (selectedCategory === "SEED" && !specs.includes("seed") && !specs.includes("vegetable") && !specs.includes("crop")) {
            return false;
          }
        }

        // Availability filter
        if (availabilityFilter === "AVAILABLE_NOW") {
          if (exp.availabilityStatus !== "AVAILABLE") return false;
        }
        if (availabilityFilter === "VERIFIED") {
          if (!exp.isVerified) return false;
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
  }, [experts, searchQuery, selectedCategory, availabilityFilter, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("ALL");
    setAvailabilityFilter("ALL");
    setSortBy("RATING");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#042A1F] via-[#063B2B] to-[#084D38] text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 -translate-y-12 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 translate-y-12 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-900/40 px-4 py-1.5 text-xs font-semibold text-emerald-300 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Live Tele-Agri Plant Clinics & 1-on-1 Consultation</span>
          </div>

          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Connect with Certified <br />
              <span className="text-emerald-300">Agricultural Specialists</span>
            </h1>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-2xl">
              Diagnose crop diseases, optimize soil fertility, and solve pest outbreaks with verified scientists from Bangladesh Agricultural University, BARI, and BRRI via HD video appointments.
            </p>
          </div>

          {/* Key Value Proof Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-emerald-800/60 max-w-4xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-800/60 text-emerald-300 border border-emerald-700/50">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <span className="text-lg font-black text-white block">50+</span>
                <span className="text-[11px] text-emerald-200">
                  Verified Agronomists
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-800/60 text-emerald-300 border border-emerald-700/50">
                <HeartPulse className="h-5 w-5" />
              </div>
              <div>
                <span className="text-lg font-black text-white block">15,000+</span>
                <span className="text-[11px] text-emerald-200">
                  Crops Diagnosed
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-800/60 text-emerald-300 border border-emerald-700/50">
                <Video className="h-5 w-5" />
              </div>
              <div>
                <span className="text-lg font-black text-white block">Instant Link</span>
                <span className="text-[11px] text-emerald-200">
                  Jitsi HD Tele-Clinic
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-800/60 text-emerald-300 border border-emerald-700/50">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <div>
                <span className="text-lg font-black text-white block">100%</span>
                <span className="text-[11px] text-emerald-200">
                  Prescription Delivery
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full">
        {/* If farmer booked recently, show direct shortcut banner */}
        {recentBooking && (
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50/80 p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white font-bold flex-shrink-0">
                <Video className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  Active Appointment Reserved
                </span>
                <h4 className="text-sm sm:text-base font-black text-slate-900">
                  {recentBooking.expertName || "Specialist"} · {recentBooking.scheduledDate} ({recentBooking.scheduledTime})
                </h4>
                <p className="text-xs text-slate-600">
                  Crop: <span className="font-semibold text-emerald-900">{recentBooking.cropType}</span> · Problem: {recentBooking.problemTitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              {recentBooking.meetingLink && (
                <a
                  href={recentBooking.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
                >
                  <Video className="h-3.5 w-3.5" />
                  <span>Join Video Call</span>
                </a>
              )}
              <Link
                href="/dashboard/farmer/consultation"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                <span>My Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Search & Filter Control Bar */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search specialists by name, symptom (e.g. Blight, Armyworm), crop, or university..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-10 py-3.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Quick Filter Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={availabilityFilter}
                onChange={(e) =>
                  setAvailabilityFilter(
                    e.target.value as "ALL" | "AVAILABLE_NOW" | "VERIFIED"
                  )
                }
                className="rounded-2xl border border-slate-200 bg-white px-3.5 py-3 text-xs font-semibold text-slate-700 shadow-sm focus:border-emerald-500 focus:outline-none"
              >
                <option value="ALL">All Specialists</option>
                <option value="AVAILABLE_NOW">Accepting Consultations</option>
                <option value="VERIFIED">Verified Scientists Only</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as "RATING" | "EXPERIENCE" | "FEE_LOW"
                  )
                }
                className="rounded-2xl border border-slate-200 bg-white px-3.5 py-3 text-xs font-semibold text-slate-700 shadow-sm focus:border-emerald-500 focus:outline-none"
              >
                <option value="RATING">Sort: Highest Rated</option>
                <option value="EXPERIENCE">Sort: Most Experienced</option>
                <option value="FEE_LOW">Sort: Fee (Lowest First)</option>
              </select>

              <button
                type="button"
                onClick={fetchExperts}
                title="Refresh Specialist Roster"
                className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-600 hover:bg-slate-50 shadow-sm transition"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex-shrink-0 rounded-2xl px-4 py-2 text-xs font-semibold transition ${
                    isSelected
                      ? "bg-[#063B2B] text-white shadow-sm shadow-emerald-950/20"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Info Strip */}
        <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200/60 pb-3">
          <span>
            Showing <strong className="text-slate-800">{filteredExperts.length}</strong> available agricultural specialists
          </span>

          {(searchQuery || selectedCategory !== "ALL" || availabilityFilter !== "ALL") && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
            >
              <X className="h-3.5 w-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Experts Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-80 rounded-3xl bg-slate-200 animate-pulse border border-slate-200"
              />
            ))}
          </div>
        ) : filteredExperts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4 max-w-xl mx-auto">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <Search className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                No Specialists Matched Your Query
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Try searching for different keywords, crop types, or clear your category filters.
              </p>
            </div>
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Show All Specialists</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperts.map((expert) => (
              <ExpertCard
                key={expert._id || expert.id}
                expert={expert}
                onBook={handleOpenBooking}
              />
            ))}
          </div>
        )}

        {/* How It Works Section */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Seamless 4-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              How Farmer Consultation Works
            </h2>
            <p className="text-xs text-slate-500">
              Get certified plant clinic advisory from the convenience of your field in four easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100 space-y-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 font-bold text-sm">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                Select Your Specialist
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Browse verified agronomists, plant pathologists, and soil researchers based on your crop type and challenge.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100 space-y-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 font-bold text-sm">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                Pick Schedule Slot
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Choose an available 30-minute time window that fits your schedule and submit your crop symptoms.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100 space-y-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 font-bold text-sm">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                Join 1-on-1 Video Clinic
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Launch the direct Jitsi video room with a single click. Show live crop leaves, roots, and pests over your smartphone camera.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100 space-y-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 font-bold text-sm">
                4
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                Get Digital Prescription
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Receive customized treatment dosages, organic alternatives, and step-by-step follow-up instructions directly in your dashboard.
              </p>
            </div>
          </div>
        </section>

        {/* Emergency Callout Banner */}
        <section className="rounded-3xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-emerald-200/80 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white flex-shrink-0 shadow-md">
              <PhoneCall className="h-7 w-7" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900">
                Rapid Outbreak Emergency Support
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                Facing Fast-Spreading Fungal Blight or Armyworm Attack?
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Don&apos;t wait for your crops to suffer irreversible damage. Connect with on-call specialists or use AgriNova AI diagnostic scanner.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0 w-full md:w-auto">
            <Link
              href="/dashboard/farmer/ai-diagnose"
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 rounded-2xl bg-white border border-slate-200 px-5 py-3 text-xs font-bold text-slate-800 shadow-sm hover:bg-slate-50 transition"
            >
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span>AI Crop Scanner</span>
            </Link>

            <Link
              href="/dashboard/farmer/consultation"
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 rounded-2xl bg-[#063B2B] px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-[#0B513D] transition"
            >
              <span>My Consultation Hub</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      </main>

      {/* Booking Modal */}
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