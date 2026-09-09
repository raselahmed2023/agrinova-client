"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { experts } from "@/data/mockData";

export default function ExpertSection() {
  return (
    <section className="mx-auto my-8 w-full max-w-7xl rounded-3xl bg-[#F5F8FF] px-4 py-12 md:px-8 dark:bg-zinc-900">
      <div className="flex flex-col items-center gap-12 md:flex-row">

        {/* Left Side: Expert Cards */}
        <div className="flex w-full flex-col justify-center gap-6 sm:flex-row md:w-1/2">
          {experts.map((expert, index) => (
            <motion.div
              key={expert.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.55,
                delay: index * 0.12,
                ease: "easeOut",
              }}
              whileHover={{
                y: -8,
                transition: { duration: 0.25 },
              }}
              className={`flex w-full flex-shrink-0 flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-xl sm:w-64 dark:border-zinc-800 dark:bg-zinc-950 ${
                index === 1 ? "sm:-mt-8" : ""
              }`}
            >
              {/* Profile Image */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.25 }}
                className="relative mb-4 h-16 w-16 overflow-hidden rounded-full border-2 border-white shadow-sm"
              >
                <Image
                  src={expert.image}
                  alt={expert.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </motion.div>

              {/* Name */}
              <h3 className="mb-1 text-sm font-bold text-gray-900 dark:text-white">
                {expert.name}
              </h3>

              {/* Title */}
              <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
                {expert.title}
              </p>

              {/* Description */}
              <p className="mb-6 flex-1 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
                {expert.description}
              </p>

              {/* Contact */}
              <button className="group flex items-center text-sm font-semibold text-gray-800 dark:text-zinc-200">
                Contact
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1 transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Right Side: Content */}
        <motion.div
          initial={{ opacity: 0, x: 35 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: 0.65,
            ease: "easeOut",
          }}
          className="flex w-full flex-col items-start text-left md:w-1/2"
        >
          {/* Small Label */}
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#3D7560]"
          >
            Expert Support
          </motion.span>

          <h2 className="mb-4 text-3xl font-bold leading-tight text-[#143B2E] md:text-4xl dark:text-emerald-400">
            Get Guidance from Agricultural Experts
          </h2>

          <p className="mb-8 text-sm leading-relaxed text-gray-600 md:text-base dark:text-gray-300">
            Connect with certified agronomists and specialists who can help
            you solve complex farm problems. From soil testing results to
            harvest strategies, we bring the experts to your phone.
          </p>

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="group flex items-center rounded-lg bg-[#0A3622] px-6 py-3 font-medium text-white shadow-md transition-colors duration-300 hover:bg-[#072416]"
          >
            Find an Expert

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}