"use client";

import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CloudSun,
  Sprout,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

type FeatureAccent = "emerald" | "blue" | "teal" | "green";

type Feature = {
  title: string;
  description: string;
  highlights: string[];
  href: string;
  actionLabel: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  accent: FeatureAccent;
};

const features: Feature[] = [
  {
    title: "My Farms",
    description:
      "Create and manage your farm information, including farm type, location, land area, soil type, status, description, and cover image.",
    highlights: [
      "Farm Information",
      "Location & Land Details",
    ],
    href: "/dashboard/farmer/farms",
    actionLabel: "Manage Farms",
    icon: Sprout,
    accent: "emerald",
  },
  {
    title: "Weather Intelligence",
    description:
      "View weather information to better understand current conditions and support day-to-day farm planning.",
    highlights: [
      "Current Weather",
      "Farm Planning Support",
    ],
    href: "/dashboard/farmer/weather",
    actionLabel: "View Weather",
    icon: CloudSun,
    accent: "blue",
  },
  {
    title: "Farm Finance",
    description:
      "Use the farm finance section to organize and review financial information related to your farming activities.",
    highlights: [
      "Farm Financial Records",
      "Finance Overview",
    ],
    href: "/dashboard/farmer/finance",
    actionLabel: "Open Finance",
    icon: BriefcaseBusiness,
    accent: "teal",
  },
  {
    title: "Expert Consultation",
    description:
      "Connect with agricultural experts for professional guidance and consultation through the AgriNova platform.",
    highlights: [
      "Agricultural Experts",
      "Consultation Support",
    ],
    href: "/consultant",
    actionLabel: "Find an Expert",
    icon: Users,
    accent: "green",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: "easeOut" as const,
    },
  },
};

function getAccentStyles(accent: FeatureAccent) {
  switch (accent) {
    case "blue":
      return {
        icon: "border-sky-100 bg-sky-50 text-sky-600",
        badge: "bg-sky-50 text-sky-700",
        glow: "bg-sky-300/20",
        line: "from-sky-500 to-cyan-400",
      };

    case "teal":
      return {
        icon: "border-teal-100 bg-teal-50 text-teal-700",
        badge: "bg-teal-50 text-teal-700",
        glow: "bg-teal-300/20",
        line: "from-teal-500 to-emerald-400",
      };

    case "green":
      return {
        icon: "border-green-100 bg-green-50 text-green-700",
        badge: "bg-green-50 text-green-700",
        glow: "bg-green-300/20",
        line: "from-green-500 to-emerald-400",
      };

    default:
      return {
        icon: "border-emerald-100 bg-emerald-50 text-emerald-700",
        badge: "bg-emerald-50 text-emerald-700",
        glow: "bg-emerald-300/20",
        line: "from-emerald-500 to-teal-400",
      };
  }
}

export default function FeaturePreview() {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="relative overflow-hidden bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-emerald-100/50 blur-[120px]" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-sky-100/40 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <motion.header
          initial={{
            opacity: 0,
            y: 22,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.35,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="mx-auto mb-4 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-700 sm:text-[11px]">
              Farmer Tools
            </span>
          </div>

          <h2
            id="features-title"
            className="text-3xl font-black tracking-[-0.04em] text-[#103F32] sm:text-4xl lg:text-[44px]"
          >
            Farm Management & Support
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-[15px]">
            Access your farm information, weather, finance tools, and
            agricultural expert support through AgriNova.
          </p>
        </motion.header>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.12,
          }}
          className="mt-12 grid grid-cols-1 gap-5 sm:mt-14 md:grid-cols-2 lg:gap-6"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            const accent = getAccentStyles(feature.accent);

            return (
              <motion.article
                key={feature.title}
                variants={cardVariants}
                whileHover={{
                  y: -7,
                  scale: 1.01,
                  transition: {
                    duration: 0.2,
                  },
                }}
                className="group relative flex min-h-[300px] flex-col overflow-hidden rounded-[24px] border border-slate-200/80 bg-[#FAFCFB] p-6 shadow-[0_4px_20px_rgba(15,23,42,0.035)] transition-shadow duration-300 hover:border-emerald-200 hover:shadow-[0_24px_55px_rgba(11,72,53,0.12)] sm:p-7 lg:p-8"
              >
                {/* Hover glow */}
                <div
                  className={`pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100 ${accent.glow}`}
                />

                {/* Top */}
                <div className="relative z-10 flex items-start justify-between gap-4">
                  <motion.div
                    whileHover={{
                      scale: 1.08,
                      rotate: 3,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${accent.icon}`}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.div>

                  <span
                    className={`rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-[0.12em] ${accent.badge}`}
                  >
                    AgriNova
                  </span>
                </div>

                {/* Content */}
                <div className="relative z-10 mt-6">
                  <h3 className="text-xl font-black tracking-[-0.025em] text-[#17372D] transition-colors duration-200 group-hover:text-emerald-700 sm:text-[22px]">
                    {feature.title}
                  </h3>

                  <p className="mt-3 max-w-xl text-[13px] leading-6 text-slate-500 sm:text-sm">
                    {feature.description}
                  </p>

                  <ul className="mt-6 space-y-2.5">
                    {feature.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="flex items-center gap-2.5 text-xs font-semibold text-[#49615A] sm:text-[13px]"
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${accent.badge}`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        </span>

                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action */}
                <div className="relative z-10 mt-auto pt-7">
                  <div className="mb-5 h-px w-full bg-slate-100 transition-colors duration-300 group-hover:bg-emerald-100" />

                  <Link
                    href={feature.href}
                    className="group/link inline-flex items-center gap-2 text-sm font-bold text-[#174D3C] transition hover:text-emerald-700"
                  >
                    {feature.actionLabel}

                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-1" />
                  </Link>
                </div>

                {/* Bottom animation */}
                <div
                  className={`absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r transition-all duration-500 group-hover:w-full ${accent.line}`}
                />
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}