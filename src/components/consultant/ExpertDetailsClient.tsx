"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  useParams,
} from "next/navigation";

import {
  ArrowLeft,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Languages,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Star,
  UserRound,
  Video,
} from "lucide-react";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

import ConsultantBookingModal from "@/components/consultant/ConsultantBookingModal";

import {
  getExpertById,
} from "@/services/expert.service";

import type {
  ExpertProfile,
} from "@/types/expert";

function formatDay(
  value: string
) {
  return value
    .toLowerCase()
    .replace(
      /^./,
      (char) =>
        char.toUpperCase()
    );
}

export default function ExpertDetailsClient() {
  const params =
    useParams<{
      expertId: string;
    }>();

  const expertId =
    params?.expertId;

  const [
    expert,
    setExpert,
  ] =
    useState<ExpertProfile | null>(
      null
    );

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    isBookingOpen,
    setIsBookingOpen,
  ] =
    useState(false);

  const loadExpert =
    useCallback(
      async () => {
        if (!expertId) {
          setExpert(null);

          setError(
            "Expert profile could not be identified."
          );

          setIsLoading(
            false
          );

          return;
        }

        setIsLoading(true);
        setError("");

        try {
          const data =
            await getExpertById(
              expertId
            );

          if (!data) {
            setExpert(null);

            setError(
              "This expert profile is not available."
            );

            return;
          }

          setExpert(data);
        } catch (
          err
        ) {
          console.error(
            "Unable to load expert profile:",
            err
          );

          setExpert(null);

          setError(
            err instanceof Error
              ? err.message
              : "Unable to load this expert profile."
          );
        } finally {
          setIsLoading(
            false
          );
        }
      },
      [expertId]
    );

  useEffect(() => {
    void loadExpert();
  }, [
    loadExpert,
  ]);

  const activeSlots =
    useMemo(
      () =>
        (
          expert
            ?.availabilitySlots ||
          []
        ).filter(
          (slot) =>
            slot.enabled &&
            slot.startTime &&
            slot.endTime
        ),
      [expert]
    );

  const isAcceptingBookings =
    expert
      ?.availabilityStatus ===
      "AVAILABLE" &&
    activeSlots.length > 0;

  if (isLoading) {
    return (
      <PageShell>
        <main className="flex-1">
          <div className="mx-auto w-full max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">

            <div className="mb-5 h-11 w-40 animate-pulse rounded-xl bg-white" />

            <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white">

              <div className="h-[300px] animate-pulse bg-slate-100" />

              <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_360px]">

                <div className="space-y-4">
                  <div className="h-40 animate-pulse rounded-3xl bg-slate-100" />

                  <div className="h-40 animate-pulse rounded-3xl bg-slate-100" />
                </div>

                <div className="h-80 animate-pulse rounded-3xl bg-slate-100" />

              </div>

            </div>

          </div>
        </main>
      </PageShell>
    );
  }

  if (
    !expert ||
    error
  ) {
    return (
      <PageShell>
        <main className="flex flex-1 items-center justify-center px-4 py-16">

          <div className="w-full max-w-xl rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">

              <UserRound className="h-6 w-6" />

            </div>

            <h1 className="mt-5 text-2xl font-black text-slate-950">
              Expert Profile Unavailable
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {error ||
                "The requested expert could not be found."}
            </p>

            <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">

              <button
                type="button"
                onClick={() =>
                  void loadExpert()
                }
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#063B2B] px-5 text-sm font-bold text-white transition hover:bg-[#0B513D]"
              >
                <RefreshCw className="h-4 w-4" />

                Try Again
              </button>

              <Link
                href="/consultant"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700"
              >
                <ArrowLeft className="h-4 w-4" />

                Back to Experts
              </Link>

            </div>

          </div>

        </main>
      </PageShell>
    );
  }

  const hasRating =
    (expert.ratingCount ||
      0) > 0 ||
    (expert.rating ||
      0) > 0;

  return (
    <PageShell>
      <main className="relative flex-1 overflow-hidden">

        {/* BACKGROUND */}

        <div className="pointer-events-none fixed inset-0 -z-20">

          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('/images/marketplace-bg.jpg')",
            }}
          />

          <div className="absolute inset-0 bg-white/85" />

          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-[#F5F8F3]/90 to-[#EEF5F0]" />

        </div>

        <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

          {/* BACK */}

          <Link
            href="/consultant"
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2.5 text-sm font-bold text-emerald-700 shadow-sm transition hover:bg-emerald-50"
          >
            <ArrowLeft className="h-4 w-4" />

            Back to Experts
          </Link>

          {/* HERO */}

          <section className="relative overflow-hidden rounded-[30px] border border-white/80 bg-white shadow-xl shadow-slate-900/10">

            <div className="absolute inset-x-0 top-0 h-[240px] bg-gradient-to-r from-[#052F23] via-[#0B513D] to-[#14765A]" />

            <div className="absolute right-0 top-0 h-[240px] w-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_65%)]" />

            <div className="relative px-5 pb-7 pt-9 sm:px-8 lg:px-10">

              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

                {/* IDENTITY */}

                <div className="flex flex-col gap-5 sm:flex-row sm:items-end">

                  <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-[26px] border-4 border-white bg-slate-100 shadow-xl sm:h-36 sm:w-36">

                    <img
                      src={
                        expert.avatar ||
                        expert.image ||
                        "/images/default-avatar.png"
                      }
                      alt={
                        expert.name
                      }
                      className="h-full w-full object-cover"
                      onError={(
                        event
                      ) => {
                        const target =
                          event.currentTarget;

                        if (
                          !target.src.endsWith(
                            "/images/default-avatar.png"
                          )
                        ) {
                          target.src =
                            "/images/default-avatar.png";
                        }
                      }}
                    />

                    {isAcceptingBookings && (
                      <span className="absolute bottom-2 right-2 h-4 w-4 rounded-full border-[3px] border-white bg-emerald-500" />
                    )}

                  </div>

                  <div className="pb-1">

                    <div className="flex flex-wrap items-center gap-2">

                      <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                        {
                          expert.name
                        }
                      </h1>

                      {expert.isVerified && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur">
                          <BadgeCheck className="h-4 w-4 text-emerald-200" />

                          Verified
                        </span>
                      )}

                    </div>

                    <p className="mt-2 text-sm font-bold text-emerald-100 sm:text-base">
                      {expert.title ||
                        "Agricultural Expert"}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-white/75">

                      {expert.institution && (
                        <span className="inline-flex items-center gap-1.5">

                          <GraduationCap className="h-4 w-4" />

                          {
                            expert.institution
                          }

                        </span>
                      )}

                      {expert.location && (
                        <span className="inline-flex items-center gap-1.5">

                          <MapPin className="h-4 w-4" />

                          {
                            expert.location
                          }

                        </span>
                      )}

                    </div>

                  </div>

                </div>

                {/* STATS */}

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:min-w-[520px]">

                  <HeroStat
                    icon={Star}
                    value={
                      hasRating
                        ? `${Number(
                            expert.rating ||
                              0
                          ).toFixed(
                            1
                          )}/5`
                        : "New"
                    }
                    label="Rating"
                  />

                  <HeroStat
                    icon={
                      BriefcaseBusiness
                    }
                    value={`${
                      expert.experienceYears ||
                      0
                    } yrs`}
                    label="Experience"
                  />

                  <HeroStat
                    icon={Video}
                    value={`${expert.totalConsultations || 0}`}
                    label="Consultations"
                  />

                  <HeroStat
                    icon={
                      CalendarDays
                    }
                    value={`৳${Number(
                      expert.consultationFee ||
                        0
                    ).toLocaleString(
                      "en-BD"
                    )}`}
                    label="Fee"
                  />

                </div>

              </div>

            </div>

          </section>

          {/* BODY */}

          <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">

            {/* LEFT */}

            <div className="space-y-6">

              {/* ABOUT */}

              <ContentCard
                icon={UserRound}
                title="About the Expert"
              >

                <p className="whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-[15px]">

                  {expert.bio?.trim() ||
                    "This expert has not added a professional biography yet."}

                </p>

              </ContentCard>

              {/* SPECIALIZATIONS */}

              <ContentCard
                icon={CheckCircle2}
                title="Areas of Expertise"
              >

                {expert
                  .specialization
                  ?.length ? (

                  <div className="flex flex-wrap gap-2">

                    {expert.specialization.map(
                      (
                        specialization
                      ) => (

                        <span
                          key={
                            specialization
                          }
                          className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800"
                        >
                          {
                            specialization
                          }
                        </span>

                      )
                    )}

                  </div>

                ) : (

                  <p className="text-sm text-slate-500">
                    No specialization information has been added.
                  </p>

                )}

              </ContentCard>

              {/* PROFESSIONAL INFORMATION */}

              <div className="grid gap-4 sm:grid-cols-2">

                <InfoCard
                  icon={
                    GraduationCap
                  }
                  label="Qualification"
                  value={
                    expert.qualification ||
                    "Not provided"
                  }
                />

                <InfoCard
                  icon={
                    BriefcaseBusiness
                  }
                  label="Professional Experience"
                  value={`${expert.experienceYears || 0} years`}
                />

                <InfoCard
                  icon={
                    ShieldCheck
                  }
                  label="Institution"
                  value={
                    expert.institution ||
                    "Not provided"
                  }
                />

                <InfoCard
                  icon={
                    Languages
                  }
                  label="Languages"
                  value={
                    expert.languages
                      ?.length
                      ? expert.languages.join(
                          ", "
                        )
                      : "Not provided"
                  }
                />

              </div>

              {/* AVAILABILITY */}

              <ContentCard
                icon={
                  CalendarDays
                }
                title="Consultation Availability"
              >

                {activeSlots.length >
                0 ? (

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">

                    {activeSlots.map(
                      (
                        slot,
                        index
                      ) => (

                        <div
                          key={`${slot.day}-${slot.startTime}-${slot.endTime}-${index}`}
                          className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                        >

                          <div className="flex items-center justify-between gap-3">

                            <p className="text-sm font-black text-slate-900">
                              {formatDay(
                                slot.day
                              )}
                            </p>

                            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700">

                              <span className="h-2 w-2 rounded-full bg-emerald-500" />

                              Available

                            </span>

                          </div>

                          <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">

                            <Clock3 className="h-3.5 w-3.5" />

                            {
                              slot.startTime
                            }{" "}
                            -{" "}
                            {
                              slot.endTime
                            }{" "}
                            BST

                          </p>

                        </div>

                      )
                    )}

                  </div>

                ) : (

                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-6">

                    <p className="text-sm font-semibold text-slate-600">
                      No consultation schedule is currently published.
                    </p>

                  </div>

                )}

              </ContentCard>

            </div>

            {/* RIGHT BOOKING PANEL */}

            <aside className="lg:sticky lg:top-24 lg:self-start">

              <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-lg shadow-slate-900/5">

                <div className="border-b border-slate-100 bg-gradient-to-br from-emerald-50 to-white p-6">

                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700">
                    Expert Consultation
                  </p>

                  <h2 className="mt-1 text-xl font-black text-slate-950">
                    Book a Consultation
                  </h2>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Discuss your farming problem directly with this agricultural specialist.
                  </p>

                </div>

                <div className="p-6">

                  {/* FEE */}

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      Consultation Fee
                    </p>

                    <div className="mt-1 flex items-end gap-1.5">

                      <p className="text-3xl font-black text-slate-950">
                        ৳
                        {Number(
                          expert.consultationFee ||
                            0
                        ).toLocaleString(
                          "en-BD"
                        )}
                      </p>

                      <span className="pb-1 text-xs font-semibold text-slate-500">
                        / 30 min
                      </span>

                    </div>

                  </div>

                  {/* STATUS */}

                  <div className="mt-5 space-y-4">

                    <StatusRow
                      icon={
                        ShieldCheck
                      }
                      title="Profile"
                      value={
                        expert.isVerified
                          ? "Verified agricultural specialist"
                          : "Agricultural specialist"
                      }
                    />

                    <StatusRow
                      icon={
                        CalendarDays
                      }
                      title="Availability"
                      value={
                        isAcceptingBookings
                          ? "Currently accepting bookings"
                          : "Currently unavailable"
                      }
                    />

                    <StatusRow
                      icon={Star}
                      title="Rating"
                      value={
                        hasRating
                          ? `${Number(
                              expert.rating ||
                                0
                            ).toFixed(
                              1
                            )} · ${
                              expert.ratingCount ||
                              0
                            } reviews`
                          : "No ratings yet"
                      }
                    />

                  </div>

                  <button
                    type="button"
                    disabled={
                      !isAcceptingBookings
                    }
                    onClick={() =>
                      setIsBookingOpen(
                        true
                      )
                    }
                    className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#063B2B] px-5 text-sm font-black text-white shadow-md transition hover:bg-[#0B513D] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
                  >

                    <Video className="h-4 w-4" />

                    {isAcceptingBookings
                      ? "Book Consultation"
                      : "Currently Unavailable"}

                  </button>

                  <p className="mt-3 text-center text-[11px] leading-5 text-slate-400">
                    Select your preferred available date and time during booking.
                  </p>

                </div>

              </div>

            </aside>

          </section>

        </div>

        <ConsultantBookingModal
          isOpen={
            isBookingOpen
          }
          onClose={() =>
            setIsBookingOpen(
              false
            )
          }
          expert={
            expert
          }
        />

      </main>
    </PageShell>
  );
}

/* =========================================================
   PAGE SHELL
========================================================= */

function PageShell({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">

      <Navbar />

      {children}

      <Footer />

    </div>
  );
}

/* =========================================================
   HERO STAT
========================================================= */

function HeroStat({
  icon: Icon,
  value,
  label,
}: {
  icon:
    React.ComponentType<{
      className?: string;
    }>;

  value: string;

  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/15 bg-black/10 p-3 backdrop-blur-sm">

      <Icon className="h-4 w-4 text-emerald-100" />

      <p className="mt-3 text-lg font-black text-white">
        {value}
      </p>

      <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-50/70">
        {label}
      </p>

    </div>
  );
}

/* =========================================================
   CONTENT CARD
========================================================= */

function ContentCard({
  icon: Icon,
  title,
  children,
}: {
  icon:
    React.ComponentType<{
      className?: string;
    }>;

  title: string;

  children:
    React.ReactNode;
}) {
  return (
    <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

      <div className="mb-4 flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">

          <Icon className="h-4 w-4" />

        </div>

        <h2 className="text-lg font-black text-slate-950">
          {title}
        </h2>

      </div>

      {children}

    </section>
  );
}

/* =========================================================
   INFO CARD
========================================================= */

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon:
    React.ComponentType<{
      className?: string;
    }>;

  label: string;

  value: string;
}) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">

        <Icon className="h-4 w-4" />

      </div>

      <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold leading-6 text-slate-800">
        {value}
      </p>

    </div>
  );
}

/* =========================================================
   STATUS ROW
========================================================= */

function StatusRow({
  icon: Icon,
  title,
  value,
}: {
  icon:
    React.ComponentType<{
      className?: string;
    }>;

  title: string;

  value: string;
}) {
  return (
    <div className="flex items-start gap-3">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">

        <Icon className="h-4 w-4" />

      </div>

      <div className="min-w-0">

        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
          {title}
        </p>

        <p className="mt-0.5 text-xs font-bold leading-5 text-slate-700">
          {value}
        </p>

      </div>

    </div>
  );
}