"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  X,
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  MapPin,
  Sprout,
  ShieldAlert,
  ExternalLink,
  User,
  Phone,
  Building,
} from "lucide-react";
import type { ExpertProfile, IAvailabilitySlot, WeekDay } from "@/types/expert";
import type {
  Consultation,
  ConsultationUrgency,
  CreateConsultationRequestPayload,
} from "@/types/consultation";
import { createConsultation } from "@/services/consultant-booking.service";
import { getConsultations } from "@/services/consultation.service";
import { useSession } from "@/lib/auth-client";

interface ConsultantBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  expert: ExpertProfile | null;
  onBookingSuccess?: (consultation: Consultation) => void;
}

const COMMON_CROPS = [
  "Rice (Aman/Boro)",
  "Potato",
  "Tomato",
  "Maize / Corn",
  "Mango",
  "Eggplant (Brinjal)",
  "Chili & Pepper",
  "Mustard",
  "Jute",
  "Guava",
  "Wheat",
  "Onion & Garlic",
];

const BANGLADESH_DISTRICTS = [
  "Bogra",
  "Dinajpur",
  "Rajshahi",
  "Jessore",
  "Mymensingh",
  "Rangpur",
  "Comilla",
  "Dhaka",
  "Gazipur",
  "Tangail",
  "Pabna",
  "Khulna",
  "Barisal",
  "Sylhet",
];

const WEEKDAY_NAMES: Record<number, WeekDay> = {
  0: "SUNDAY",
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY",
};

export default function ConsultantBookingModal({
  isOpen,
  onClose,
  expert,
  onBookingSuccess,
}: ConsultantBookingModalProps) {
  const { data: session } = useSession();
  const user = session?.user;

  // Multi-step state: 1 = Schedule, 2 = Details, 3 = Confirmed
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Schedule selections
  const [selectedDateStr, setSelectedDateStr] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");

  // Step 2: Problem & Farm details
  const [cropType, setCropType] = useState<string>("Rice (Aman/Boro)");
  const [customCrop, setCustomCrop] = useState<string>("");
  const [problemTitle, setProblemTitle] = useState<string>("");
  const [problemDescription, setProblemDescription] = useState<string>("");
  const [urgency, setUrgency] = useState<ConsultationUrgency>("MEDIUM");
  const [farmName, setFarmName] = useState<string>("");
  const [district, setDistrict] = useState<string>("Bogra");
  const [farmerName, setFarmerName] = useState<string>(user?.name || "");
  const [farmerPhone, setFarmerPhone] = useState<string>("");
  const [farmerEmail, setFarmerEmail] = useState<string>(user?.email || "");

  // Step 3: Result
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedConsultation, setConfirmedConsultation] =
    useState<Consultation | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Compute upcoming available dates matching enabled weekdays
  const availableDates = useMemo(() => {
    if (!expert) return [];
    const enabledSlots = (expert.availabilitySlots || []).filter((s) => s.enabled);
    const enabledDayNames = new Set(
      enabledSlots.length > 0
        ? enabledSlots.map((s) => s.day)
        : (["SATURDAY", "SUNDAY", "TUESDAY", "THURSDAY"] as WeekDay[])
    );

    const dates: {
      dateStr: string;
      displayDay: string;
      displayDate: string;
      weekday: WeekDay;
      slot: IAvailabilitySlot | undefined;
    }[] = [];

    const today = new Date();
    // Look ahead 14 days
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      const dayIndex = d.getDay();
      const weekdayName = WEEKDAY_NAMES[dayIndex];

      if (enabledDayNames.has(weekdayName)) {
        const slot = enabledSlots.find((s) => s.day === weekdayName);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const dateStr = `${yyyy}-${mm}-${dd}`;

        const displayDay = d.toLocaleDateString("en-US", { weekday: "short" });
        const displayDate = d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        dates.push({
          dateStr,
          displayDay,
          displayDate,
          weekday: weekdayName,
          slot,
        });
      }
    }
    return dates;
  }, [expert]);

  // Set default selected date once available
  React.useEffect(() => {
    if (availableDates.length > 0 && !selectedDateStr) {
      setSelectedDateStr(availableDates[0].dateStr);
    }
  }, [availableDates, selectedDateStr]);

  // Compute time slots for the selected date
  const timeSlots = useMemo(() => {
    if (!selectedDateStr) return [];
    const matchedDate = availableDates.find((d) => d.dateStr === selectedDateStr);
    const startTimeStr = matchedDate?.slot?.startTime || "18:00";
    const endTimeStr = matchedDate?.slot?.endTime || "21:00";

    const [startH, startM] = startTimeStr.split(":").map(Number);
    const [endH, endM] = endTimeStr.split(":").map(Number);

    const startMinutes = startH * 60 + (startM || 0);
    const endMinutes = endH * 60 + (endM || 0);

    const slots: string[] = [];
    // 30 minute intervals
    for (let m = startMinutes; m < endMinutes; m += 30) {
      const h = Math.floor(m / 60);
      const min = m % 60;
      const period = h >= 12 ? "PM" : "AM";
      const h12 = h % 12 === 0 ? 12 : h % 12;
      const timeStr = `${String(h12).padStart(2, "0")}:${String(min).padStart(
        2,
        "0"
      )} ${period}`;
      slots.push(timeStr);
    }

    if (slots.length === 0) {
      return ["06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM"];
    }
    return slots;
  }, [selectedDateStr, availableDates]);

  const [existingConsultations, setExistingConsultations] = useState<Consultation[]>([]);
  const [activeWithSameExpert, setActiveWithSameExpert] = useState<Consultation | null>(null);

  // Load existing farmer consultations to check same-expert duplicate & time conflicts
  React.useEffect(() => {
    if (isOpen && expert) {
      getConsultations()
        .then((list) => {
          setExistingConsultations(list);
          const expId = expert._id || expert.id;
          const expEmail = expert.email?.toLowerCase().trim();
          const match = list.find((c) => {
            const matchesExpert =
              (expId && (c.expertId === expId || c.expert?.id === expId)) ||
              (expEmail &&
                (c.expertEmail?.toLowerCase() === expEmail ||
                  c.expert?.email?.toLowerCase() === expEmail));
            const isActive = [
              "PENDING",
              "ACCEPTED",
              "SCHEDULED",
              "ONGOING",
            ].includes(c.status);
            return matchesExpert && isActive;
          });
          setActiveWithSameExpert(match || null);
        })
        .catch(() => {
          // Ignore lookup failure
        });
    }
  }, [isOpen, expert]);

  // Set of timeslots that conflict with farmer's other consultations on selectedDateStr
  const conflictingSlots = useMemo(() => {
    if (!selectedDateStr) return new Set<string>();
    const set = new Set<string>();
    for (const c of existingConsultations) {
      if (
        ["ACCEPTED", "SCHEDULED", "ONGOING"].includes(c.status) &&
        c.scheduledDate === selectedDateStr &&
        c.scheduledTime
      ) {
        set.add(c.scheduledTime);
      }
    }
    return set;
  }, [selectedDateStr, existingConsultations]);

  // Set default slot to first non-conflicted slot
  React.useEffect(() => {
    if (timeSlots.length > 0) {
      const firstNonConflicted = timeSlots.find((slot) => !conflictingSlots.has(slot));
      if (firstNonConflicted && (!selectedTimeSlot || conflictingSlots.has(selectedTimeSlot))) {
        setSelectedTimeSlot(firstNonConflicted);
      }
    }
  }, [timeSlots, conflictingSlots, selectedTimeSlot]);

  // Reset states when expert changes or modal opens
  React.useEffect(() => {
    if (isOpen) {
      setStep(1);
      setConfirmedConsultation(null);
      setSubmitError(null);
      if (user) {
        setFarmerName(user.name || "");
        setFarmerEmail(user.email || "");
      }
    }
  }, [isOpen, expert, user]);

  if (!isOpen || !expert) return null;

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleProceedToDetails = () => {
    if (!selectedDateStr || !selectedTimeSlot) {
      setSubmitError("Please pick both an appointment date and an available time slot.");
      return;
    }
    setSubmitError(null);
    setStep(2);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (activeWithSameExpert) {
      setSubmitError(
        "You already have an active consultation request with this specialist. Multiple active requests to the same specialist are not permitted."
      );
      return;
    }
    if (!problemTitle.trim()) {
      setSubmitError("Please enter the problem title or observed symptoms.");
      return;
    }

    if (!problemDescription.trim()) {
      setSubmitError("Please describe the detailed symptoms, affected areas, and history.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const effectiveCrop =
      cropType === "Other" && customCrop.trim() ? customCrop.trim() : cropType;

    const payload: CreateConsultationRequestPayload = {
      expertId: expert._id || expert.id,
      expertName: expert.name,
      expertEmail: expert.email,
      cropType: effectiveCrop,
      cropName: effectiveCrop,
      problemTitle: problemTitle.trim(),
      problemDescription: problemDescription.trim(),
      urgency,
      farmName: farmName.trim() || "Farmland",
      district,
      scheduledDate: selectedDateStr,
      scheduledTime: selectedTimeSlot,
      preferredDate: selectedDateStr,
      preferredTime: selectedTimeSlot,
      farmerName: farmerName.trim() || user?.name || "Farmer",
      farmerEmail: farmerEmail.trim() || user?.email || "farmer@agrinova.io",
      farmerPhone: farmerPhone.trim() || "+880 1700-000000",
    };

    try {
      const result = await createConsultation(payload);
      setConfirmedConsultation(result);
      setStep(3);
      if (onBookingSuccess) {
        onBookingSuccess(result);
      }
    } catch (err: any) {
      console.error("Booking error:", err);
      setSubmitError(
        err?.message || "Failed to create consultation appointment. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 sm:p-6 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-2xl transition-all my-8">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 font-bold">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                Book Expert Consultation
              </h3>
              <p className="text-[11px] text-slate-500">
                1-on-1 Video Diagnosis & Plant Pathology Advisory
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Specialist Header Card */}
        <div className="bg-emerald-950 p-5 text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={
                expert.avatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
              }
              alt={expert.name}
              className="h-14 w-14 rounded-2xl border-2 border-emerald-400/40 object-cover flex-shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm sm:text-base truncate">
                  {expert.name}
                </span>
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              </div>
              <p className="text-xs text-emerald-200 truncate">{expert.title}</p>
              <p className="text-[11px] text-emerald-300/80 truncate">
                {expert.institution || "AgriNova Specialist Network"}
              </p>
            </div>
          </div>

          <div className="text-right flex-shrink-0 bg-emerald-900/60 px-3.5 py-2 rounded-2xl border border-emerald-700/50">
            <span className="text-[10px] text-emerald-300 block uppercase font-bold tracking-wider">
              Fee / Session
            </span>
            <span className="text-base sm:text-lg font-black text-emerald-100">
              ৳{expert.consultationFee || 500}
            </span>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-3 bg-slate-50/50 text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                step === 1
                  ? "bg-emerald-600 text-white"
                  : step > 1
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              1
            </span>
            <span
              className={`font-semibold ${
                step === 1 ? "text-emerald-900 font-bold" : "text-slate-600"
              }`}
            >
              Select Schedule
            </span>
          </div>

          <div className="h-0.5 w-10 bg-slate-200" />

          <div className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                step === 2
                  ? "bg-emerald-600 text-white"
                  : step > 2
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              2
            </span>
            <span
              className={`font-semibold ${
                step === 2 ? "text-emerald-900 font-bold" : "text-slate-600"
              }`}
            >
              Crop Details
            </span>
          </div>

          <div className="h-0.5 w-10 bg-slate-200" />

          <div className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                step === 3
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              3
            </span>
            <span
              className={`font-semibold ${
                step === 3 ? "text-emerald-900 font-bold" : "text-slate-600"
              }`}
            >
              Meeting Link
            </span>
          </div>
        </div>

        {submitError && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-2xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 border border-rose-200">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        {/* STEP 1: Date & Time Selection */}
        {step === 1 && (
          <div className="p-6 space-y-6">
            {activeWithSameExpert && (
              <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 space-y-2">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-amber-950">
                      Active Consultation Already Scheduled
                    </h4>
                    <p className="text-xs text-amber-900 leading-relaxed">
                      You already have a {activeWithSameExpert.status.toLowerCase()} consultation booked with{" "}
                      <strong>{expert.name}</strong> on{" "}
                      <strong>{activeWithSameExpert.scheduledDate || activeWithSameExpert.preferredDate}</strong> at{" "}
                      <strong>{activeWithSameExpert.scheduledTime || activeWithSameExpert.preferredTime}</strong>.
                      To ensure fair specialist access, farmers can have only one active request per specialist.
                    </p>
                    <div className="pt-2">
                      <Link
                        href={`/dashboard/farmer/consultation/${activeWithSameExpert._id || activeWithSameExpert.id}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-amber-800 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-amber-900 transition"
                      >
                        <span>View / Reschedule Consultation</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-2.5">
                <Calendar className="h-4 w-4 text-emerald-600" />
                <span>1. Select Available Consultation Date</span>
              </label>

              {availableDates.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-xs text-slate-500">
                  No upcoming scheduled dates configured for this specialist. Please check back soon.
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                  {availableDates.map((item) => {
                    const isSelected = selectedDateStr === item.dateStr;
                    return (
                      <button
                        key={item.dateStr}
                        type="button"
                        onClick={() => setSelectedDateStr(item.dateStr)}
                        className={`flex flex-col items-center justify-center rounded-2xl p-3 text-xs transition border ${
                          isSelected
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-md font-bold"
                            : "bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50"
                        }`}
                      >
                        <span className="text-[10px] uppercase tracking-wider opacity-80">
                          {item.displayDay}
                        </span>
                        <span className="text-sm font-extrabold mt-0.5">
                          {item.displayDate}
                        </span>
                        <span
                          className={`text-[9px] mt-1 px-1.5 py-0.5 rounded-full ${
                            isSelected
                              ? "bg-emerald-700 text-white"
                              : "bg-emerald-50 text-emerald-800"
                          }`}
                        >
                          {item.slot?.startTime ? "Available" : "Evening"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-2.5">
                <Clock className="h-4 w-4 text-emerald-600" />
                <span>2. Select 30-Minute Schedule Slot</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {timeSlots.map((slot) => {
                  const isSelected = selectedTimeSlot === slot;
                  const isConflicted = conflictingSlots.has(slot);
                  if (isConflicted) {
                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={true}
                        className="flex flex-col items-center justify-center rounded-2xl px-3 py-2 text-xs font-semibold border border-rose-200 bg-rose-50/70 text-rose-500 cursor-not-allowed opacity-75"
                        title="Time Conflict: You already have another consultation booked at this time with another specialist."
                      >
                        <span className="line-through text-slate-500">{slot}</span>
                        <span className="text-[9px] font-bold text-rose-600">Time Conflict</span>
                      </button>
                    );
                  }

                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`flex items-center justify-center gap-1.5 rounded-2xl px-3 py-2.5 text-xs font-semibold transition border ${
                        isSelected
                          ? "bg-emerald-950 text-emerald-300 border-emerald-800 shadow-sm"
                          : "bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30"
                      }`}
                    >
                      <Clock className="h-3.5 w-3.5 opacity-70" />
                      <span>{slot}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200/80 p-4 text-xs text-emerald-900 flex items-start gap-3">
              <Sparkles className="h-4 w-4 text-emerald-700 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-bold">Instant HD Video Session Guarantee:</span>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  Your meeting room will be automatically created upon booking. You will be able to show your diseased crops live to {expert.name} using your phone camera.
                </p>
              </div>
            </div>

            {/* Step 1 Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-2xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleProceedToDetails}
                disabled={
                  Boolean(activeWithSameExpert) ||
                  !selectedDateStr ||
                  !selectedTimeSlot ||
                  conflictingSlots.has(selectedTimeSlot)
                }
                title={
                  activeWithSameExpert
                    ? "You already have an active request with this specialist."
                    : conflictingSlots.has(selectedTimeSlot)
                    ? "Selected slot has a time conflict with another consultation."
                    : undefined
                }
                className="inline-flex items-center gap-1.5 rounded-2xl bg-[#063B2B] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0B513D] disabled:opacity-50 transition"
              >
                <span>Continue to Crop Details</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Problem & Farm Details */}
        {step === 2 && (
          <form onSubmit={handleSubmitBooking} className="p-6 space-y-4">
            {/* Account Status Pill */}
            {!user ? (
              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3.5 text-xs text-amber-900 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                  <div>
                    <span className="font-bold">Not signed in:</span>{" "}
                    <span className="text-amber-800">
                      Sign in to save this booking to your database and view it in your dashboard.
                    </span>
                  </div>
                </div>
                <Link
                  href="/login?redirect=/consultant"
                  className="rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700 flex-shrink-0 transition"
                >
                  Sign In
                </Link>
              </div>
            ) : (
              <div className="rounded-2xl bg-emerald-50/80 border border-emerald-200/80 px-3.5 py-2 text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>
                  Booking as <strong>{user.name || user.email}</strong>. This appointment will be saved to your dashboard at <strong>/dashboard/farmer/consultation</strong>.
                </span>
              </div>
            )}

            {/* Slot Summary Pill */}
            <div className="flex items-center justify-between rounded-2xl bg-slate-100 px-4 py-2.5 text-xs border border-slate-200">
              <div className="flex items-center gap-2 text-slate-700 font-bold">
                <Calendar className="h-3.5 w-3.5 text-emerald-700" />
                <span>{selectedDateStr}</span>
                <span className="text-slate-300">·</span>
                <Clock className="h-3.5 w-3.5 text-emerald-700" />
                <span>{selectedTimeSlot} (BST)</span>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                Change Time
              </button>
            </div>

            {/* Crop Selection */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1.5">
                Crop Affected <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {COMMON_CROPS.slice(0, 8).map((crop) => (
                  <button
                    key={crop}
                    type="button"
                    onClick={() => {
                      setCropType(crop);
                      setCustomCrop("");
                    }}
                    className={`rounded-xl px-2.5 py-1 text-xs font-medium transition border ${
                      cropType === crop
                        ? "bg-emerald-600 text-white border-emerald-600 font-bold"
                        : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300"
                    }`}
                  >
                    {crop}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setCropType("Other")}
                  className={`rounded-xl px-2.5 py-1 text-xs font-medium transition border ${
                    cropType === "Other"
                      ? "bg-emerald-600 text-white border-emerald-600 font-bold"
                      : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300"
                  }`}
                >
                  Other...
                </button>
              </div>

              {cropType === "Other" && (
                <input
                  type="text"
                  placeholder="Enter crop name (e.g. Papaya, Strawberry, Bitter Gourd)"
                  value={customCrop}
                  onChange={(e) => setCustomCrop(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                  required
                />
              )}
            </div>

            {/* Problem Title & Description */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Problem Title / Observed Symptoms <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Brown leaf spot spreading, curling leaves, root decay"
                value={problemTitle}
                onChange={(e) => setProblemTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Detailed Symptoms & History <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Describe when symptoms started, affected area, previous fertilizers/pesticides sprayed, and soil conditions..."
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none resize-none"
                required
              />
            </div>

            {/* Urgency & Farmland Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Urgency Level
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as ConsultationUrgency)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none bg-white font-medium"
                >
                  <option value="LOW">Routine Advisory (Low)</option>
                  <option value="MEDIUM">Standard Diagnostic (Moderate)</option>
                  <option value="HIGH">Urgent - Disease Spreading (High)</option>
                  <option value="EMERGENCY">Emergency - Severe Crop Loss</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  District / Location
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none bg-white font-medium"
                >
                  {BANGLADESH_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Farmer Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Farm Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Green Valley Farm"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+880 1700-000000"
                  value={farmerPhone}
                  onChange={(e) => setFarmerPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Step 2 Actions */}
            <div className="pt-3 flex items-center justify-between gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-2xl"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 rounded-2xl bg-[#063B2B] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#0B513D] disabled:opacity-50 transition"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Confirming Booking...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    <span>Confirm & Generate Meeting</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Booking Confirmed & Meeting Room */}
        {step === 3 && confirmedConsultation && (
          <div className="p-6 space-y-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-700 shadow-inner">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                Booking Confirmed
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                Your Consultation is Scheduled!
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                A live video room has been reserved with {expert.name}. Both you and the specialist have received confirmation.
              </p>
            </div>

            {/* Appointment Summary Box */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5 text-left space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs border-b border-slate-200/60 pb-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Specialist
                  </span>
                  <span className="font-bold text-slate-900">
                    {expert.name}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Crop & Problem
                  </span>
                  <span className="font-bold text-slate-900 truncate block">
                    {confirmedConsultation.cropType} · {confirmedConsultation.problemTitle}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Scheduled Date & Time
                  </span>
                  <span className="font-bold text-emerald-800">
                    {confirmedConsultation.scheduledDate} at {confirmedConsultation.scheduledTime}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Advisory Platform
                  </span>
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <Video className="h-3 w-3 text-emerald-600" />
                    Jitsi Secure Tele-Clinic
                  </span>
                </div>
              </div>
            </div>

            {/* Meeting Link Box */}
            {confirmedConsultation.meetingLink && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <Video className="h-3.5 w-3.5 text-emerald-700" />
                    <span>Your Direct Video Meeting Link:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyLink(confirmedConsultation.meetingLink!)
                    }
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-950"
                  >
                    {copiedLink ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    <span>{copiedLink ? "Copied!" : "Copy Link"}</span>
                  </button>
                </div>
                <div className="rounded-xl bg-white border border-emerald-200/80 px-3 py-2 text-xs font-mono text-emerald-900 truncate">
                  {confirmedConsultation.meetingLink}
                </div>
              </div>
            )}

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {confirmedConsultation.meetingLink && (
                <a
                  href={confirmedConsultation.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition"
                >
                  <Video className="h-4 w-4" />
                  <span>Join Video Meeting Now</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}

              <Link
                href="/dashboard/farmer/consultation"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                <span>View My Consultations</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
