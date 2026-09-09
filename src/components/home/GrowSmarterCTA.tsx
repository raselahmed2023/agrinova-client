"use client";

import { motion } from "motion/react";

export default function GrowSmarterCTA() {
  return (
    <section className="bg-[#f5f7fb] px-4 py-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[36px] bg-[#073b2d] px-6 py-14 text-center shadow-[0_20px_50px_rgba(7,59,45,0.15)] md:px-12 md:py-16"
        >
          {/* Decorative Glow */}
          <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-emerald-100/10 blur-3xl" />

          <div className="relative">
            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-3xl font-bold tracking-tight text-white md:text-4xl"
            >
              Ready to Grow Smarter?
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-emerald-100/75 md:text-base"
            >
              Join over 50,000 farmers who are already making data-backed
              decisions to improve their livelihoods.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <motion.button
                type="button"
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="min-w-[235px] rounded-xl bg-white px-7 py-4 text-sm font-semibold text-[#073b2d] shadow-sm transition-colors duration-300 hover:bg-gray-100 hover:shadow-lg"
              >
                Download AgriNova App
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="min-w-[176px] rounded-xl border border-white/30 px-7 py-4 text-sm font-semibold text-white transition-all duration-300 hover:border-white/50 hover:bg-white/10"
              >
                Request a Demo
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}