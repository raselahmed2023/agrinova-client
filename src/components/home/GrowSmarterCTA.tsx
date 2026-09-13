"use client";

import Link from "next/link";
import { ArrowRight, Sprout, UserPlus } from "lucide-react";
import { motion } from "motion/react";

export default function GrowSmarterCTA() {
  return (
    <section className="relative overflow-hidden bg-[#F8FAF8] px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
            scale: 0.98,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.65,
            ease: "easeOut",
          }}
          className="relative overflow-hidden rounded-[32px] border border-emerald-400/10 bg-[#073B2D] px-6 py-14 text-center shadow-[0_24px_60px_rgba(7,59,45,0.16)] sm:px-8 md:px-12 md:py-16 lg:px-16"
        >
          {/* Background glow */}
          <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-teal-300/10 blur-3xl" />

          <div className="relative z-10">
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
              }}
              viewport={{ once: true }}
              transition={{
                delay: 0.15,
                duration: 0.4,
              }}
              className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3.5 py-1.5"
            >
              <Sprout className="h-3.5 w-3.5 text-emerald-300" />

              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-200 sm:text-[11px]">
                Start with AgriNova
              </span>
            </motion.div>

            <motion.h2
              initial={{
                opacity: 0,
                y: 15,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true }}
              transition={{
                delay: 0.2,
                duration: 0.5,
              }}
              className="text-3xl font-black tracking-[-0.035em] text-white sm:text-4xl lg:text-[44px]"
            >
              Ready to Grow Smarter?
            </motion.h2>

            <motion.p
              initial={{
                opacity: 0,
                y: 15,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true }}
              transition={{
                delay: 0.28,
                duration: 0.5,
              }}
              className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-emerald-100/70 sm:text-[15px]"
            >
              Create your AgriNova account to access farming tools,
              marketplace features, expert consultation, and agricultural
              resources.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true }}
              transition={{
                delay: 0.36,
                duration: 0.5,
              }}
              className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              {/* Create account */}
              <motion.div
                whileHover={{
                  y: -3,
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                transition={{
                  duration: 0.18,
                }}
                className="w-full sm:w-auto"
              >
                <Link
                  href="/register"
                  className="group flex min-h-12 w-full min-w-[200px] items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#073B2D] shadow-lg shadow-black/10 transition hover:bg-emerald-50 sm:w-auto"
                >
                  <UserPlus className="h-4 w-4" />

                  Create Account

                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </motion.div>

              {/* Join as expert */}
              <motion.div
                whileHover={{
                  y: -3,
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                transition={{
                  duration: 0.18,
                }}
                className="w-full sm:w-auto"
              >
                <Link
                  href="/register/expert"
                  className="group flex min-h-12 w-full min-w-[200px] items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.06] px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:border-emerald-300/40 hover:bg-white/[0.11] sm:w-auto"
                >
                  <Sprout className="h-4 w-4 text-emerald-300" />

                  Join as Expert

                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}