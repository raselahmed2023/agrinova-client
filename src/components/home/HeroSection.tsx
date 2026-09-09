"use client";

import Image from "next/image";
import { motion } from "motion/react";

const metrics = [
  ["Active Farmers", "50k+"],
  ["Accuracy Rate", "98%"],
  ["Crop Types", "40+"],
];

const actions = [
  { label: "Get Started", href: "#get-started", primary: true },
  { label: "Explore Features", href: "#features" },
];

export default function HeroSection() {
  return (
    <section className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_46%_35%,#f9ffff_0%,#eaf6f5_44%,#dceeed_100%)] px-5 py-14 sm:px-8 lg:px-12">
      <div className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-12 lg:grid-cols-[.94fr_1fr] lg:gap-[clamp(3rem,7vw,7.4rem)] px-6 lg:px-8">

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-xl"
        >
          <h1 className="max-w-[35rem] text-[clamp(3rem,8vw,5rem)] font-extrabold leading-[.98] tracking-[-0.065em] text-[#063d2d]">
            Smarter Farming Starts with Better Decisions
          </h1>

          <p className="mt-7 max-w-lg text-sm leading-relaxed text-[#3f5650] sm:text-base">
            Optimize your crop management with AI-driven insights and
            real-time data monitoring. Empower your farm with precision
            technology to ensure higher yields and sustainable farming
            practices.
          </p>

          {/* Actions */}
          <div className="mt-7 flex flex-wrap gap-4">
            {actions.map((action) => (
              <motion.a
                key={action.label}
                href={action.href}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className={`inline-flex h-13 items-center justify-center rounded-lg px-7 text-sm font-bold transition ${
                  action.primary
                    ? "bg-[#063d2d] text-white shadow-[0_9px_16px_rgba(6,61,45,.16)] hover:bg-[#07503a]"
                    : "bg-[#e5edfd] text-[#123f33] hover:bg-[#d8e4fb]"
                }`}
              >
                {action.label}
              </motion.a>
            ))}
          </div>

          {/* Metrics */}
          <div className="mt-9 grid grid-cols-3 gap-2 sm:mt-12 sm:gap-4">
            {metrics.map(([label, value]) => (
              <motion.div
                key={label}
                whileHover={{ y: -3 }}
                className="rounded-[10px] border border-[#c7d3d1] bg-white/40 px-2.5 py-3 backdrop-blur-sm sm:px-4 sm:py-4"
              >
                <p className="text-[10px] text-[#46605a] sm:text-xs">
                  {label}
                </p>

                <p className="mt-1 text-lg font-extrabold leading-none text-[#083e2e] sm:text-xl">
                  {value}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: 35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="relative mx-auto aspect-[1.34/1] w-full max-w-2xl rounded-[14px] border-[3px] border-white shadow-[0_25px_36px_rgba(50,86,80,.22)]"
        >
          <Image
            src="/images/home/banner-image.jpeg"
            alt="Farmer using a tablet in a crop field"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 48vw"
            className="rounded-[11px] object-cover"
          />

          {/* Crop Health */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="absolute left-3 top-3 z-10 flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2.5 shadow-[0_9px_18px_rgba(36,61,55,.15)] sm:left-7 sm:top-7 sm:gap-3 sm:px-4 sm:py-3"
          >
            <span className="grid size-5 place-items-center rounded-full border-2 border-[#0a9b4e] text-xs font-bold text-[#0a9b4e]">
              ✦
            </span>

            <span>
              <small className="block text-[10px] text-[#344640]">
                Crop Health
              </small>
              <strong className="mt-1 block text-xs text-[#08723a]">
                HEALTHY
              </strong>
            </span>
          </motion.div>

          {/* Rain */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="absolute bottom-3 right-3 z-10 flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2.5 shadow-[0_9px_18px_rgba(36,61,55,.15)] sm:bottom-7 sm:right-6 sm:gap-3 sm:px-4 sm:py-3"
          >
            <span className="grid size-5 place-items-center rounded-full border-2 border-[#1687cf] text-xs font-bold text-[#1687cf]">
              ◈
            </span>

            <span>
              <small className="block text-[10px] text-[#344640]">
                Rain Expected
              </small>
              <strong className="mt-1 block text-xs text-[#08723a]">
                In 4 hours
              </strong>
            </span>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}