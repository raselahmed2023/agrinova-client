"use client";

import {
  Bot,
  CloudSun,
  LayoutGrid,
  TrendingUp,
  Users,
  WalletCards,
} from "lucide-react";
import { motion } from "motion/react";

type FeatureCard = {
  title: string;
  description: string;
  footer: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  accent: "green" | "blue";
};

const features: FeatureCard[] = [
  {
    title: "Manage Your Farm",
    description:
      "Keep your farm information and activities organized. Record parcel boundaries, crops, and daily field actions with simplicity.",
    footer: "Field Logs & Plot Records",
    icon: LayoutGrid,
    accent: "green",
  },
  {
    title: "Weather Intelligence",
    description:
      "Use location-based weather information to plan farm activities. Anticipate precipitation, micro-climate shifts, and spray windows.",
    footer: "Hyperlocal Forecasts & Alerts",
    icon: CloudSun,
    accent: "blue",
  },
  {
    title: "AI Farming Tools",
    description:
      "Use disease detection, smart recommendations, and AI farming assistance tailored to your crops and local agronomic conditions.",
    footer: "Diagnosis & Decision Models",
    icon: Bot,
    accent: "green",
  },
  {
    title: "Farm Finance",
    description:
      "Track farm income and expenses in one place. Keep accurate records of fertilizer, seed purchases, equipment hire, and produce sales.",
    footer: "Cashflow & Expense Ledgers",
    icon: WalletCards,
    accent: "green",
  },
  {
    title: "Expert Consultation",
    description:
      "Connect with agricultural experts for professional guidance. Book sessions, share crop photos, and get actionable advice.",
    footer: "Agronomists & Soil Specialists",
    icon: Users,
    accent: "green",
  },
  {
    title: "Investment Support",
    description:
      "Submit agricultural projects that need investment support. Present structured crop cycles to verified agri-investors and institutions.",
    footer: "Verified Project Pipelines",
    icon: TrendingUp,
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
    y: 35,
    scale: 0.97,
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

export default function AgricultureIntelligence() {
  return (
    <section className="relative overflow-hidden bg-[#F8FAF8] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-emerald-200/20 blur-[100px]" />

      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-blue-200/20 blur-[110px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.4,
          }}
          transition={{
            duration: 0.65,
            ease: "easeOut",
          }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.45,
            }}
            className="mx-auto mb-4 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5"
          >
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-700 sm:text-[11px]">
              Complete Suite
            </span>
          </motion.div>

          <h2 className="text-3xl font-black leading-[1.05] tracking-[-0.035em] text-[#123D31] sm:text-4xl lg:text-[46px]">
            Everything Your Farm Needs,
            <span className="block">
              in One Platform
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-500 sm:text-[15px]">
            Bringing your essential farm management tools, intelligence,
            expert guidance, and agricultural resources together into one
            unified workspace.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.12,
          }}
          className="mt-12 grid grid-cols-1 gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
        >
          {features.map((feature) => {
            const Icon = feature.icon;

            const blue =
              feature.accent === "blue";

            return (
              <motion.article
                key={feature.title}
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  scale: 1.015,
                  transition: {
                    duration: 0.22,
                  },
                }}
                className="group relative flex min-h-[270px] cursor-default flex-col overflow-hidden rounded-[20px] border border-slate-200/80 bg-white p-6 shadow-[0_4px_18px_rgba(15,23,42,0.035)] transition-shadow duration-300 hover:border-emerald-200 hover:shadow-[0_22px_55px_rgba(15,61,48,0.11)] sm:p-7"
              >
                {/* Hover glow */}
                <div
                  className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100 ${
                    blue
                      ? "bg-blue-300/20"
                      : "bg-emerald-300/20"
                  }`}
                />

                {/* Icon */}
                <motion.div
                  whileHover={{
                    rotate: 4,
                    scale: 1.1,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-xl border ${
                    blue
                      ? "border-blue-100 bg-blue-50 text-blue-600"
                      : "border-emerald-100 bg-emerald-50 text-[#0C6048]"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </motion.div>

                {/* Content */}
                <div className="relative z-10 mt-6">
                  <h3 className="text-lg font-extrabold tracking-[-0.02em] text-[#172C25] transition-colors duration-200 group-hover:text-[#075943] sm:text-xl">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-[13px] leading-6 text-slate-500 sm:text-sm">
                    {feature.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="relative z-10 mt-auto pt-6">
                  <div className="h-px w-full bg-slate-100 transition-colors duration-300 group-hover:bg-emerald-100" />

                  <motion.div
                    initial={false}
                    whileHover={{
                      x: 4,
                    }}
                    className={`mt-4 text-[11px] font-bold sm:text-xs ${
                      blue
                        ? "text-blue-600"
                        : "text-emerald-700"
                    }`}
                  >
                    {feature.footer}
                  </motion.div>
                </div>

                {/* Bottom highlight */}
                <div
                  className={`absolute bottom-0 left-0 h-[3px] w-0 transition-all duration-500 group-hover:w-full ${
                    blue
                      ? "bg-blue-500"
                      : "bg-emerald-500"
                  }`}
                />
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}