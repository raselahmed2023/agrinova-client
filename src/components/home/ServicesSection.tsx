"use client";

import Link from "next/link";
import {
  Bot,
  Camera,
  ChevronRight,
  ClipboardList,
  Leaf,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Sprout,
} from "lucide-react";
import { motion } from "motion/react";

type AIFeature = {
  icon: React.ComponentType<{
    className?: string;
  }>;
  title: string;
  description: string;
  points: string[];
  actionLabel: string;
  href?: string;
  badge: string;
  accent: "emerald" | "blue" | "teal" | "lime";
};

const aiFeatures: AIFeature[] = [
  {
    icon: Camera,
    title: "Crop Disease Detection",
    description:
      "Upload a crop image for AI-assisted analysis of visible disease symptoms and possible crop health problems.",
    points: [
      "Image-based crop analysis",
      "Disease and symptom insights",
      "Recommended actions and prevention guidance",
    ],
    actionLabel: "Analyze Crop Image",
    href: "/dashboard/farmer/ai/disease-detection",
    badge: "Image AI",
    accent: "emerald",
  },
  {
    icon: Sprout,
    title: "Smart Farming Recommendation",
    description:
      "Get farming recommendations using your selected farm information and the agricultural problem you describe.",
    points: [
      "Uses your saved farm information",
      "Considers farm type and location",
      "Problem-specific farming guidance",
    ],
    actionLabel: "Get Recommendation",
    href: "/dashboard/farmer/ai/smart-farming-recommendation",
    badge: "Farm-Aware AI",
    accent: "blue",
  },
  {
    icon: MessageCircle,
    title: "AI Farming Assistant",
    description:
      "Ask farming-related questions and receive practical AI-assisted guidance for common agricultural activities and farm management.",
    points: [
      "Crop and soil questions",
      "Irrigation and pest guidance",
      "General farm management assistance",
    ],
    actionLabel: "Ask Farming Assistant",
    href: "/dashboard/farmer/ai/assistant",
    badge: "AI Assistant",
    accent: "teal",
  },
  {
    icon: ClipboardList,
    title: "AI Treatment Recommendation",
    description:
      "Supports the expert consultation workflow with structured treatment guidance based on crop and problem information.",
    points: [
      "Structured treatment guidance",
      "Recommended follow-up information",
      "Supports expert recommendation workflow",
    ],
    actionLabel: "Expert Consultation",
    href: "/consultant",
    badge: "Expert AI Support",
    accent: "lime",
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

function getAccentClasses(accent: AIFeature["accent"]) {
  switch (accent) {
    case "blue":
      return {
        icon: "border-blue-400/15 bg-blue-400/10 text-blue-300",
        badge: "border-blue-400/15 bg-blue-400/10 text-blue-300",
        glow: "bg-blue-400/15",
        bullet: "text-blue-300",
        line: "from-blue-400 to-cyan-300",
      };

    case "teal":
      return {
        icon: "border-teal-400/15 bg-teal-400/10 text-teal-300",
        badge: "border-teal-400/15 bg-teal-400/10 text-teal-300",
        glow: "bg-teal-400/15",
        bullet: "text-teal-300",
        line: "from-teal-400 to-emerald-300",
      };

    case "lime":
      return {
        icon: "border-lime-400/15 bg-lime-400/10 text-lime-300",
        badge: "border-lime-400/15 bg-lime-400/10 text-lime-300",
        glow: "bg-lime-400/10",
        bullet: "text-lime-300",
        line: "from-lime-400 to-emerald-300",
      };

    default:
      return {
        icon: "border-emerald-400/15 bg-emerald-400/10 text-emerald-300",
        badge:
          "border-emerald-400/15 bg-emerald-400/10 text-emerald-300",
        glow: "bg-emerald-400/15",
        bullet: "text-emerald-300",
        line: "from-emerald-400 to-teal-300",
      };
  }
}

export default function ServicesSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#071C15] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      {/* Background glow */}
      <div className="pointer-events-none absolute -left-48 top-10 h-[430px] w-[430px] rounded-full bg-emerald-400/[0.07] blur-[130px]" />

      <div className="pointer-events-none absolute -right-48 bottom-0 h-[450px] w-[450px] rounded-full bg-cyan-400/[0.06] blur-[140px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{
            opacity: 0,
            y: 24,
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
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.07] px-3.5 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-emerald-300" />

            <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-300 sm:text-[11px]">
              AgriNova AI
            </span>
          </div>

          <h2 className="text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl lg:text-[44px]">
            AI Farming Tools
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#9FB4AB] sm:text-[15px]">
            AI-assisted tools for crop analysis, farm-specific
            recommendations, farming questions, and expert treatment
            workflows.
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
          className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:mt-14 lg:gap-6"
        >
          {aiFeatures.map((feature) => {
            const Icon = feature.icon;
            const accent = getAccentClasses(feature.accent);

            return (
              <motion.article
                key={feature.title}
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  scale: 1.01,
                  transition: {
                    duration: 0.22,
                  },
                }}
                className="group relative flex min-h-[350px] flex-col overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#10271D] p-6 shadow-[0_10px_35px_rgba(0,0,0,0.12)] transition-shadow duration-300 hover:border-white/[0.14] hover:shadow-[0_24px_55px_rgba(0,0,0,0.24)] sm:p-7 lg:p-8"
              >
                {/* Hover glow */}
                <div
                  className={`pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full opacity-0 blur-[70px] transition-opacity duration-500 group-hover:opacity-100 ${accent.glow}`}
                />

                {/* Top */}
                <div className="relative z-10 flex items-start justify-between gap-4">
                  <motion.div
                    whileHover={{
                      rotate: 4,
                      scale: 1.08,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${accent.icon}`}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.div>

                  <span
                    className={`rounded-full border px-3 py-1 text-[9px] font-bold uppercase tracking-[0.13em] ${accent.badge}`}
                  >
                    {feature.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="relative z-10 mt-6">
                  <h3 className="text-xl font-black tracking-[-0.025em] text-white sm:text-[22px]">
                    {feature.title}
                  </h3>

                  <p className="mt-3 max-w-xl text-[13px] leading-6 text-[#9FB0A8] sm:text-sm">
                    {feature.description}
                  </p>

                  <ul className="mt-6 space-y-3">
                    {feature.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2.5 text-xs font-medium text-[#BCCAC4] sm:text-[13px]"
                      >
                        <ShieldCheck
                          className={`mt-0.5 h-4 w-4 shrink-0 ${accent.bullet}`}
                        />

                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action */}
                <div className="relative z-10 mt-auto pt-7">
                  <div className="mb-5 h-px w-full bg-white/[0.08]" />

                  {feature.href ? (
                    <Link
                      href={feature.href}
                      className="group/link inline-flex items-center gap-2 text-sm font-bold text-white transition hover:text-emerald-300"
                    >
                      {feature.actionLabel}

                      <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-1" />
                    </Link>
                  ) : (
                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#9FB0A8]">
                      {feature.actionLabel}

                      <Bot className="h-4 w-4 text-emerald-300" />
                    </div>
                  )}
                </div>

                {/* Bottom animated line */}
                <div
                  className={`absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r transition-all duration-500 group-hover:w-full ${accent.line}`}
                />
              </motion.article>
            );
          })}
        </motion.div>

        {/* Note */}
        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.5,
            delay: 0.2,
          }}
          className="mt-7 flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-4 py-4 sm:px-5"
        >
          <Leaf className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />

          <p className="text-xs leading-5 text-[#82988F]">
            AI tools provide decision support and farming guidance.
            Professional agricultural advice may still be appropriate for
            serious crop health or treatment decisions.
          </p>
        </motion.div>
      </div>
    </section>
  );
}