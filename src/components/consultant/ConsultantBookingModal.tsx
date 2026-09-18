"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  X,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CreditCard,
} from "lucide-react";

import type {
  ExpertProfile,
  IAvailabilitySlot,
  WeekDay,
} from "@/types/expert";

import type {
  Consultation,
  ConsultationUrgency,
  CreateConsultationRequestPayload,
} from "@/types/consultation";

import {
  createConsultation,
  createConsultationStripeCheckout,
} from "@/services/consultant-booking.service";

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
}: ConsultantBookingModalProps) {
  const { data: session } = useSession();
  const user = session?.user;

  // Step 1 = Schedule
  // Step 2 = Crop/problem details
  // Step 3 = Stripe Checkout
  const [step, setStep] = useState<1 | 2>(1);

  const [selectedDateStr, setSelectedDateStr] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");

  const [cropType, setCropType] =
    useState<string>("Rice (Aman/Boro)");

  const [customCrop, setCustomCrop] =
    useState<string>("");

  const [problemTitle, setProblemTitle] =
    useState<string>("");

  const [problemDescription, setProblemDescription] =
    useState<string>("");

  const [urgency, setUrgency] =
    useState<ConsultationUrgency>("MEDIUM");

  const [farmName, setFarmName] =
    useState<string>("");

  const [district, setDistrict] =
    useState<string>("Bogra");

  const [farmerName, setFarmerName] =
    useState<string>(user?.name || "");

  const [farmerPhone, setFarmerPhone] =
    useState<string>("");

  const [farmerEmail, setFarmerEmail] =
    useState<string>(user?.email || "");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [submitError, setSubmitError] =
    useState<string | null>(null);

  const [
    existingConsultations,
    setExistingConsultations,
  ] = useState<Consultation[]>([]);

  const [
    activeWithSameExpert,
    setActiveWithSameExpert,
  ] = useState<Consultation | null>(null);

  const availableDates = useMemo(() => {
    if (
      !expert ||
      expert.availabilityStatus !== "AVAILABLE"
    ) {
      return [];
    }

    const enabledSlots =
      (expert.availabilitySlots || []).filter(
        (slot) =>
          slot.enabled &&
          slot.startTime &&
          slot.endTime
      );

    if (enabledSlots.length === 0) {
      return [];
    }

    const enabledDayNames =
      new Set(
        enabledSlots.map(
          (slot) => slot.day
        )
      );

    const dates: {
      dateStr: string;
      displayDay: string;
      displayDate: string;
      weekday: WeekDay;
      slot: IAvailabilitySlot | undefined;
    }[] = [];

    const today = new Date();

    for (let i = 0; i < 14; i++) {
      const date =
        new Date(today);

      date.setDate(
        today.getDate() + i
      );

      const weekdayName =
        WEEKDAY_NAMES[
          date.getDay()
        ];

      if (
        !enabledDayNames.has(
          weekdayName
        )
      ) {
        continue;
      }

      const slot =
        enabledSlots.find(
          (item) =>
            item.day ===
            weekdayName
        );

      const year =
        date.getFullYear();

      const month =
        String(
          date.getMonth() + 1
        ).padStart(2, "0");

      const day =
        String(
          date.getDate()
        ).padStart(2, "0");

      const dateStr =
        `${year}-${month}-${day}`;

      const displayDay =
        date.toLocaleDateString(
          "en-US",
          {
            weekday: "short",
          }
        );

      const displayDate =
        date.toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
          }
        );

      dates.push({
        dateStr,
        displayDay,
        displayDate,
        weekday:
          weekdayName,
        slot,
      });
    }

    return dates;
  }, [expert]);

  React.useEffect(() => {
    if (
      availableDates.length > 0 &&
      !selectedDateStr
    ) {
      setSelectedDateStr(
        availableDates[0]
          .dateStr
      );
    }
  }, [
    availableDates,
    selectedDateStr,
  ]);

  const timeSlots =
    useMemo(() => {
      if (!selectedDateStr) {
        return [];
      }

      const matchedDate =
        availableDates.find(
          (date) =>
            date.dateStr ===
            selectedDateStr
        );

      if (
        !matchedDate?.slot
          ?.startTime ||
        !matchedDate.slot
          .endTime
      ) {
        return [];
      }

      const [
        startHour,
        startMinute,
      ] =
        matchedDate.slot
          .startTime
          .split(":")
          .map(Number);

      const [
        endHour,
        endMinute,
      ] =
        matchedDate.slot
          .endTime
          .split(":")
          .map(Number);

      const startMinutes =
        startHour * 60 +
        (startMinute || 0);

      const endMinutes =
        endHour * 60 +
        (endMinute || 0);

      const slots: string[] =
        [];

      for (
        let minutes =
          startMinutes;
        minutes <
        endMinutes;
        minutes += 30
      ) {
        const hour =
          Math.floor(
            minutes / 60
          );

        const minute =
          minutes % 60;

        const period =
          hour >= 12
            ? "PM"
            : "AM";

        const hour12 =
          hour % 12 === 0
            ? 12
            : hour % 12;

        const time =
          `${String(
            hour12
          ).padStart(
            2,
            "0"
          )}:${String(
            minute
          ).padStart(
            2,
            "0"
          )} ${period}`;

        slots.push(time);
      }

      if (
        slots.length === 0
      ) {
        return [
          "06:00 PM",
          "06:30 PM",
          "07:00 PM",
          "07:30 PM",
          "08:00 PM",
        ];
      }

      return slots;
    }, [
      selectedDateStr,
      availableDates,
    ]);

  React.useEffect(() => {
    if (
      !isOpen ||
      !expert
    ) {
      return;
    }

    getConsultations()
      .then((list) => {
        setExistingConsultations(
          list
        );

        const expertId =
          expert._id ||
          expert.id;

        const expertEmail =
          expert.email
            ?.toLowerCase()
            .trim();

        const match =
          list.find(
            (consultation) => {
              const matchesExpert =
                Boolean(
                  expertId &&
                    (
                      consultation.expertId ===
                        expertId ||
                      consultation
                        .expert
                        ?.id ===
                        expertId ||
                      consultation
                        .expert
                        ?._id ===
                        expertId
                    )
                ) ||
                Boolean(
                  expertEmail &&
                    (
                      consultation
                        .expertEmail
                        ?.toLowerCase()
                        .trim() ===
                        expertEmail ||
                      consultation
                        .expert
                        ?.email
                        ?.toLowerCase()
                        .trim() ===
                        expertEmail
                    )
                );

              const isActive =
                [
                  "PENDING",
                  "ACCEPTED",
                  "SCHEDULED",
                  "ONGOING",
                ].includes(
                  consultation.status
                );

              // Stripe integration:
              // unpaid/failed/cancelled new bookings
              // must not block a new booking.
              //
              // Legacy consultations have no
              // paymentStatus and remain valid.
              const isPaidOrLegacy =
                !consultation.paymentStatus ||
                consultation.paymentStatus ===
                  "PAID";

              return (
                matchesExpert &&
                isActive &&
                isPaidOrLegacy
              );
            }
          );

        setActiveWithSameExpert(
          match || null
        );
      })
      .catch(() => {
        // Do not block booking
        // if old consultation
        // lookup fails.
      });
  }, [
    isOpen,
    expert,
  ]);

  const conflictingSlots =
    useMemo(() => {
      if (
        !selectedDateStr
      ) {
        return new Set<string>();
      }

      const blocked =
        new Set<string>();

      for (
        const consultation
        of existingConsultations
      ) {
        const activeStatus =
          [
            "ACCEPTED",
            "SCHEDULED",
            "ONGOING",
          ].includes(
            consultation.status
          );

        const paidOrLegacy =
          !consultation.paymentStatus ||
          consultation.paymentStatus ===
            "PAID";

        if (
          activeStatus &&
          paidOrLegacy &&
          consultation
            .scheduledDate ===
            selectedDateStr &&
          consultation
            .scheduledTime
        ) {
          blocked.add(
            consultation
              .scheduledTime
          );
        }
      }

      return blocked;
    }, [
      selectedDateStr,
      existingConsultations,
    ]);

  React.useEffect(() => {
    if (
      timeSlots.length === 0
    ) {
      return;
    }

    const firstAvailable =
      timeSlots.find(
        (slot) =>
          !conflictingSlots.has(
            slot
          )
      );

    if (
      firstAvailable &&
      (
        !selectedTimeSlot ||
        conflictingSlots.has(
          selectedTimeSlot
        )
      )
    ) {
      setSelectedTimeSlot(
        firstAvailable
      );
    }
  }, [
    timeSlots,
    conflictingSlots,
    selectedTimeSlot,
  ]);

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    setStep(1);
    setSubmitError(null);

    if (user) {
      setFarmerName(
        user.name || ""
      );

      setFarmerEmail(
        user.email || ""
      );
    }
  }, [
    isOpen,
    expert,
    user,
  ]);

  if (
    !isOpen ||
    !expert
  ) {
    return null;
  }

  const handleProceedToDetails =
    () => {
      if (
        !selectedDateStr ||
        !selectedTimeSlot
      ) {
        setSubmitError(
          "Please pick both an appointment date and an available time slot."
        );

        return;
      }

      setSubmitError(
        null
      );

      setStep(2);
    };

  const handleSubmitBooking =
    async (
      event:
        React.FormEvent
    ) => {
      event.preventDefault();

      if (
        isSubmitting
      ) {
        return;
      }

      if (!user) {
        setSubmitError(
          "Please sign in as a farmer before booking an expert consultation."
        );

        return;
      }

      if (
        activeWithSameExpert
      ) {
        setSubmitError(
          "You already have an active paid consultation with this specialist. Multiple active consultations with the same specialist are not permitted."
        );

        return;
      }

      if (
        !problemTitle.trim()
      ) {
        setSubmitError(
          "Please enter the problem title or observed symptoms."
        );

        return;
      }

      if (
        !problemDescription.trim()
      ) {
        setSubmitError(
          "Please describe the detailed symptoms, affected areas, and history."
        );

        return;
      }

      const effectiveCrop =
        cropType === "Other" &&
        customCrop.trim()
          ? customCrop.trim()
          : cropType;

      const expertId =
        expert._id ||
        expert.id;

      if (!expertId) {
        setSubmitError(
          "A valid specialist is required before booking."
        );

        return;
      }

      const payload:
        CreateConsultationRequestPayload =
        {
          expertId,
          expertName:
            expert.name,

          expertEmail:
            expert.email ||
            undefined,

          cropType:
            effectiveCrop,

          cropName:
            effectiveCrop,

          problemTitle:
            problemTitle.trim(),

          problemDescription:
            problemDescription.trim(),

          urgency,

          farmName:
            farmName.trim() ||
            "Farmland",

          district,

          scheduledDate:
            selectedDateStr,

          scheduledTime:
            selectedTimeSlot,

          preferredDate:
            selectedDateStr,

          preferredTime:
            selectedTimeSlot,

          farmerName:
            farmerName.trim() ||
            user.name ||
            undefined,

          farmerEmail:
            farmerEmail.trim() ||
            user.email ||
            undefined,

          farmerPhone:
            farmerPhone.trim() ||
            undefined,
        };

      setIsSubmitting(
        true
      );

      setSubmitError(
        null
      );

      try {
        // 1. Create consultation in DB.
        // Server should save it as UNPAID.
        const consultation =
          await createConsultation(
            payload
          );

        // 2. Create Stripe Checkout Session.
        const checkout =
          await createConsultationStripeCheckout(
            consultation._id
          );

        if (
          !checkout.url
        ) {
          throw new Error(
            "Stripe did not return a checkout URL. Please try again."
          );
        }

        // 3. Leave AgriNova and open Stripe Checkout.
        // Meeting link will NOT be created here.
        window.location.assign(
          checkout.url
        );
      } catch (error) {
        console.error(
          "Consultation booking/payment error:",
          error
        );

        setSubmitError(
          error instanceof Error
            ? error.message
            : "Failed to start consultation payment. Please try again."
        );
      } finally {
        setIsSubmitting(
          false
        );
      }
    };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/80 p-3 backdrop-blur-sm sm:p-6">

      <div className="relative my-8 w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4">

          <div className="flex items-center gap-2.5">

            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-100 font-bold text-emerald-800">
              <Calendar className="h-4 w-4" />
            </div>

            <div>
              <h3 className="text-sm font-black text-slate-900 sm:text-base">
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
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        {/* Expert Header */}
        <div className="flex items-center justify-between gap-4 bg-emerald-950 p-5 text-white">

          <div className="flex min-w-0 items-center gap-3">

            <img
              src={
                expert.avatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
              }
              alt={expert.name}
              className="h-14 w-14 flex-shrink-0 rounded-2xl border-2 border-emerald-400/40 object-cover"
            />

            <div className="min-w-0">

              <div className="flex items-center gap-1.5">

                <span className="truncate text-sm font-bold sm:text-base">
                  {expert.name}
                </span>

                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-400" />

              </div>

              <p className="truncate text-xs text-emerald-200">
                {expert.title}
              </p>

              <p className="truncate text-[11px] text-emerald-300/80">
                {expert.institution ||
                  "AgriNova Specialist Network"}
              </p>

            </div>

          </div>

          <div className="flex-shrink-0 rounded-2xl border border-emerald-700/50 bg-emerald-900/60 px-3.5 py-2 text-right">

            <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              Fee / Session
            </span>

            <span className="text-base font-black text-emerald-100 sm:text-lg">
              ৳
              {Number(
                expert.consultationFee ||
                  500
              ).toLocaleString(
                "en-BD"
              )}
            </span>

          </div>

        </div>

        {/* Steps */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-3 text-xs">

          <div className="flex items-center gap-2">

            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                step === 1
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              1
            </span>

            <span
              className={`font-semibold ${
                step === 1
                  ? "font-bold text-emerald-900"
                  : "text-slate-600"
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
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              2
            </span>

            <span
              className={`font-semibold ${
                step === 2
                  ? "font-bold text-emerald-900"
                  : "text-slate-600"
              }`}
            >
              Crop Details
            </span>

          </div>

          <div className="h-0.5 w-10 bg-slate-200" />

          <div className="flex items-center gap-2">

            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">
              3
            </span>

            <span className="font-semibold text-slate-600">
              Secure Payment
            </span>

          </div>

        </div>

        {/* Error */}
        {submitError && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">

            <AlertCircle className="h-4 w-4 flex-shrink-0" />

            <span>
              {submitError}
            </span>

          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-6 p-6">

            {activeWithSameExpert && (
              <div className="space-y-2 rounded-2xl border border-amber-300 bg-amber-50 p-4">

                <div className="flex items-start gap-3">

                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />

                  <div className="space-y-1">

                    <h4 className="text-sm font-bold text-amber-950">
                      Active Consultation Already Scheduled
                    </h4>

                    <p className="text-xs leading-relaxed text-amber-900">

                      You already have a{" "}

                      {activeWithSameExpert.status.toLowerCase()}{" "}

                      consultation booked with{" "}

                      <strong>
                        {expert.name}
                      </strong>{" "}

                      on{" "}

                      <strong>
                        {activeWithSameExpert.scheduledDate ||
                          activeWithSameExpert.preferredDate ||
                          "your selected date"}
                      </strong>{" "}

                      at{" "}

                      <strong>
                        {activeWithSameExpert.scheduledTime ||
                          activeWithSameExpert.preferredTime ||
                          "your selected time"}
                      </strong>.

                    </p>

                    <div className="pt-2">

                      <Link
                        href={`/dashboard/farmer/consultation/${
                          activeWithSameExpert._id ||
                          activeWithSameExpert.id
                        }`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-amber-800 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-amber-900"
                      >
                        <span>
                          View Consultation
                        </span>

                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>

                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* Date */}
            <div>

              <label className="mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">

                <Calendar className="h-4 w-4 text-emerald-600" />

                <span>
                  1. Select Available Consultation Date
                </span>

              </label>

              {availableDates.length ===
              0 ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-xs text-slate-500">
                  No upcoming scheduled dates configured for this specialist. Please check back soon.
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-5">

                  {availableDates.map(
                    (item) => {
                      const isSelected =
                        selectedDateStr ===
                        item.dateStr;

                      return (
                        <button
                          key={
                            item.dateStr
                          }
                          type="button"
                          onClick={() => {
                            setSelectedDateStr(
                              item.dateStr
                            );

                            setSelectedTimeSlot(
                              ""
                            );
                          }}
                          className={`flex flex-col items-center justify-center rounded-2xl border p-3 text-xs transition ${
                            isSelected
                              ? "border-emerald-600 bg-emerald-600 font-bold text-white shadow-md"
                              : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50"
                          }`}
                        >

                          <span className="text-[10px] uppercase tracking-wider opacity-80">
                            {
                              item.displayDay
                            }
                          </span>

                          <span className="mt-0.5 text-sm font-extrabold">
                            {
                              item.displayDate
                            }
                          </span>

                          <span
                            className={`mt-1 rounded-full px-1.5 py-0.5 text-[9px] ${
                              isSelected
                                ? "bg-emerald-700 text-white"
                                : "bg-emerald-50 text-emerald-800"
                            }`}
                          >
                            Available
                          </span>

                        </button>
                      );
                    }
                  )}

                </div>
              )}

            </div>

            {/* Time */}
            <div>

              <label className="mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">

                <Clock className="h-4 w-4 text-emerald-600" />

                <span>
                  2. Select 30-Minute Schedule Slot
                </span>

              </label>

              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">

                {timeSlots.map(
                  (slot) => {
                    const isSelected =
                      selectedTimeSlot ===
                      slot;

                    const isConflicted =
                      conflictingSlots.has(
                        slot
                      );

                    if (
                      isConflicted
                    ) {
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled
                          className="flex cursor-not-allowed flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/70 px-3 py-2 text-xs font-semibold text-rose-500 opacity-75"
                          title="You already have another paid consultation booked at this time."
                        >

                          <span className="text-slate-500 line-through">
                            {slot}
                          </span>

                          <span className="text-[9px] font-bold text-rose-600">
                            Time Conflict
                          </span>

                        </button>
                      );
                    }

                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() =>
                          setSelectedTimeSlot(
                            slot
                          )
                        }
                        className={`flex items-center justify-center gap-1.5 rounded-2xl border px-3 py-2.5 text-xs font-semibold transition ${
                          isSelected
                            ? "border-emerald-800 bg-emerald-950 text-emerald-300 shadow-sm"
                            : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/30"
                        }`}
                      >

                        <Clock className="h-3.5 w-3.5 opacity-70" />

                        <span>
                          {slot}
                        </span>

                      </button>
                    );
                  }
                )}

              </div>

            </div>

            {/* Payment/Meeting Info */}
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/70 p-4 text-xs text-emerald-900">

              <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-700" />

              <div>

                <span className="font-bold">
                  Secure Expert Consultation
                </span>

                <p className="mt-0.5 text-[11px] text-emerald-800">
                  After successful Stripe payment, your consultation will be confirmed and your secure meeting room will be created automatically.
                </p>

              </div>

            </div>

            {/* Step 1 Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-2">

              <button
                type="button"
                onClick={
                  onClose
                }
                className="rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleProceedToDetails
                }
                disabled={
                  Boolean(
                    activeWithSameExpert
                  ) ||
                  !selectedDateStr ||
                  !selectedTimeSlot ||
                  conflictingSlots.has(
                    selectedTimeSlot
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-2xl bg-[#063B2B] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#0B513D] disabled:cursor-not-allowed disabled:opacity-50"
              >

                <span>
                  Continue to Crop Details
                </span>

                <ArrowRight className="h-3.5 w-3.5" />

              </button>

            </div>

          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form
            onSubmit={
              handleSubmitBooking
            }
            className="space-y-4 p-6"
          >

            {/* Only show warning when not logged in.
                Old green "Booking as Tanvir..." box removed. */}
            {!user && (
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900">

                <div className="flex items-center gap-2">

                  <AlertCircle className="h-4 w-4 flex-shrink-0 text-amber-600" />

                  <div>

                    <span className="font-bold">
                      Not signed in:
                    </span>{" "}

                    <span className="text-amber-800">
                      Sign in before continuing to secure Stripe payment.
                    </span>

                  </div>

                </div>

                <Link
                  href="/login?redirect=/consultant"
                  className="flex-shrink-0 rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-amber-700"
                >
                  Sign In
                </Link>

              </div>
            )}

            {/* Selected Slot */}
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-xs">

              <div className="flex items-center gap-2 font-bold text-slate-700">

                <Calendar className="h-3.5 w-3.5 text-emerald-700" />

                <span>
                  {selectedDateStr}
                </span>

                <span className="text-slate-300">
                  ·
                </span>

                <Clock className="h-3.5 w-3.5 text-emerald-700" />

                <span>
                  {selectedTimeSlot} (BST)
                </span>

              </div>

              <button
                type="button"
                onClick={() =>
                  setStep(1)
                }
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                Change Time
              </button>

            </div>

            {/* Crop */}
            <div>

              <label className="mb-1.5 block text-xs font-bold text-slate-800">
                Crop Affected{" "}
                <span className="text-rose-500">
                  *
                </span>
              </label>

              <div className="mb-2 flex flex-wrap gap-1.5">

                {COMMON_CROPS.slice(
                  0,
                  8
                ).map(
                  (crop) => (
                    <button
                      key={crop}
                      type="button"
                      onClick={() => {
                        setCropType(
                          crop
                        );

                        setCustomCrop(
                          ""
                        );
                      }}
                      className={`rounded-xl border px-2.5 py-1 text-xs font-medium transition ${
                        cropType ===
                        crop
                          ? "border-emerald-600 bg-emerald-600 font-bold text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300"
                      }`}
                    >
                      {crop}
                    </button>
                  )
                )}

                <button
                  type="button"
                  onClick={() =>
                    setCropType(
                      "Other"
                    )
                  }
                  className={`rounded-xl border px-2.5 py-1 text-xs font-medium transition ${
                    cropType ===
                    "Other"
                      ? "border-emerald-600 bg-emerald-600 font-bold text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300"
                  }`}
                >
                  Other...
                </button>

              </div>

              {cropType ===
                "Other" && (
                <input
                  type="text"
                  placeholder="Enter crop name"
                  value={
                    customCrop
                  }
                  onChange={(
                    event
                  ) =>
                    setCustomCrop(
                      event.target
                        .value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                  required
                />
              )}

            </div>

            {/* Problem Title */}
            <div>

              <label className="mb-1 block text-xs font-bold text-slate-800">
                Problem Title / Observed Symptoms{" "}
                <span className="text-rose-500">
                  *
                </span>
              </label>

              <input
                type="text"
                placeholder="e.g. Brown leaf spot spreading, curling leaves, root decay"
                value={
                  problemTitle
                }
                onChange={(
                  event
                ) =>
                  setProblemTitle(
                    event.target
                      .value
                  )
                }
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                required
              />

            </div>

            {/* Description */}
            <div>

              <label className="mb-1 block text-xs font-bold text-slate-800">
                Detailed Symptoms & History{" "}
                <span className="text-rose-500">
                  *
                </span>
              </label>

              <textarea
                rows={3}
                placeholder="Describe when symptoms started, affected area, previous fertilizers/pesticides sprayed, and soil conditions..."
                value={
                  problemDescription
                }
                onChange={(
                  event
                ) =>
                  setProblemDescription(
                    event.target
                      .value
                  )
                }
                className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                required
              />

            </div>

            {/* Urgency + District */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

              <div>

                <label className="mb-1 block text-xs font-bold text-slate-800">
                  Urgency Level
                </label>

                <select
                  value={
                    urgency
                  }
                  onChange={(
                    event
                  ) =>
                    setUrgency(
                      event.target
                        .value as ConsultationUrgency
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="LOW">
                    Routine Advisory (Low)
                  </option>

                  <option value="MEDIUM">
                    Standard Diagnostic (Moderate)
                  </option>

                  <option value="HIGH">
                    Urgent - Disease Spreading (High)
                  </option>

                  <option value="EMERGENCY">
                    Emergency - Severe Crop Loss
                  </option>
                </select>

              </div>

              <div>

                <label className="mb-1 block text-xs font-bold text-slate-800">
                  District / Location
                </label>

                <select
                  value={
                    district
                  }
                  onChange={(
                    event
                  ) =>
                    setDistrict(
                      event.target
                        .value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-emerald-500 focus:outline-none"
                >

                  {BANGLADESH_DISTRICTS.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}

                </select>

              </div>

            </div>

            {/* Farm + phone */}
            <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">

              <div>

                <label className="mb-1 block text-xs font-bold text-slate-800">
                  Farm Name
                </label>

                <input
                  type="text"
                  placeholder="e.g. Green Valley Farm"
                  value={
                    farmName
                  }
                  onChange={(
                    event
                  ) =>
                    setFarmName(
                      event.target
                        .value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                />

              </div>

              <div>

                <label className="mb-1 block text-xs font-bold text-slate-800">
                  Contact Phone Number
                </label>

                <input
                  type="tel"
                  placeholder="+880 1700-000000"
                  value={
                    farmerPhone
                  }
                  onChange={(
                    event
                  ) =>
                    setFarmerPhone(
                      event.target
                        .value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                />

              </div>

            </div>

            {/* Payment summary */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">

              <div className="flex items-center justify-between gap-4">

                <div>

                  <p className="text-xs font-black text-emerald-950">
                    Expert Consultation Payment
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-emerald-800">
                    You will be redirected to Stripe Checkout. The expert will receive the consultation only after successful payment.
                  </p>

                </div>

                <div className="shrink-0 text-right">

                  <span className="block text-[10px] font-bold uppercase text-emerald-700">
                    Total
                  </span>

                  <strong className="text-lg text-emerald-950">
                    ৳
                    {Number(
                      expert.consultationFee ||
                        500
                    ).toLocaleString(
                      "en-BD"
                    )}
                  </strong>

                </div>

              </div>

            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3">

              <button
                type="button"
                onClick={() =>
                  setStep(1)
                }
                disabled={
                  isSubmitting
                }
                className="inline-flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 disabled:opacity-50"
              >

                <ArrowLeft className="h-3.5 w-3.5" />

                <span>
                  Back
                </span>

              </button>

              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !user
                }
                className="inline-flex items-center gap-1.5 rounded-2xl bg-[#063B2B] px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#0B513D] disabled:cursor-not-allowed disabled:opacity-50"
              >

                {isSubmitting ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />

                    <span>
                      Opening Secure Payment...
                    </span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 text-emerald-300" />

                    <span>
                      Continue to Stripe Payment
                    </span>
                  </>
                )}

              </button>

            </div>

          </form>
        )}

      </div>

    </div>
  );
}