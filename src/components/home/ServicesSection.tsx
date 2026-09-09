"use client";

import { FaRobot, FaLeaf, FaArrowRight } from "react-icons/fa";
import { HiTrendingUp } from "react-icons/hi";
import { motion } from "motion/react";

interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkLabel: string;
}

const features: FeatureCard[] = [
  {
    icon: <span className="text-sm font-bold tracking-tight">4G</span>,
    title: "Crop Disease Detection",
    description:
      "Snap a photo of your plant and our AI will diagnose pests or diseases in seconds with treatment advice.",
    linkLabel: "Detect Disease",
  },
  {
    icon: <FaLeaf className="h-5 w-5" />,
    title: "Crop Recommendation",
    description:
      "Not sure what to plant? Get AI suggestions based on your soil type, season, and market demand.",
    linkLabel: "Explore Recommendations",
  },
  {
    icon: <FaRobot className="h-5 w-5" />,
    title: "AI Farming Assistant",
    description:
      "Chat with our agricultural LLM trained on millions of farming journals and expert papers.",
    linkLabel: "Ask AI",
  },
  {
    icon: <HiTrendingUp className="h-5 w-5" />,
    title: "Yield Prediction",
    description:
      "Forecast your harvest volume months in advance using historical data and current field stats.",
    linkLabel: "Predict Yield",
  },
];

export default function ServicesSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#0E1F16] px-6 py-20 md:px-12 lg:px-20">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#2A6B4D]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-[#A9D8B4]/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#A9D8B4]">
            Smart Technology
          </span>

          <h2 className="mt-3 text-3xl font-extrabold text-white md:text-4xl">
            AI-Powered Farming Intelligence
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.55,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              whileHover={{
                y: -6,
                transition: { duration: 0.25 },
              }}
              className="group rounded-2xl border border-white/10 bg-[#16291D] p-8 shadow-sm transition-all duration-300 hover:border-[#A9D8B4]/25 hover:bg-[#192F21] hover:shadow-[0_18px_40px_rgba(0,0,0,0.2)]"
            >
              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.08, rotate: 3 }}
                transition={{ duration: 0.2 }}
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2A4433] text-[#A9D8B4] shadow-sm"
              >
                {feature.icon}
              </motion.div>

              {/* Title */}
              <h3 className="mt-6 text-xl font-bold text-white">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="mt-3 text-[15px] leading-relaxed text-[#A3B3AC]">
                {feature.description}
              </p>

              {/* Link */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="group/link mt-6 flex items-center gap-2 text-[15px] font-semibold text-white"
              >
                <span className="transition-colors duration-300 group-hover/link:text-[#A9D8B4]">
                  {feature.linkLabel}
                </span>

                <FaArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:text-[#A9D8B4]" />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}