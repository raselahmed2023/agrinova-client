"use client";

import { motion } from "motion/react";

const journeySteps = [
  {
    number: 1,
    title: "Create Account",
    description: "Sign up with your mobile number.",
  },
  {
    number: 2,
    title: "Add Your Farm",
    description: "Mark your farm boundary on the map.",
  },
  {
    number: 3,
    title: "Get Real-time Info",
    description: "Receive soil and weather data.",
  },
  {
    number: 4,
    title: "Expert Support",
    description: "Consult experts for any issues.",
  },
  {
    number: 5,
    title: "Smart Decisions",
    description: "Increase yield and profitability.",
  },
];

export default function JourneySection() {
  return (
    <section className="w-full bg-white py-16">
      <div className="mx-auto max-w-7xl px-4">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12 text-center"
        >
          <h2 className="text-[30px] font-bold text-[#003b2b]">
            Your Journey to Smarter Farming
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative">

          {/* Connecting Line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 1,
              delay: 0.2,
              ease: "easeOut",
            }}
            className="absolute left-[10%] right-[10%] top-7 hidden h-px origin-left bg-gray-300 lg:block"
          />

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-0">
            {journeySteps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.5,
                  delay: 0.3 + index * 0.12,
                  ease: "easeOut",
                }}
                whileHover={{ y: -5 }}
                className="relative flex flex-col items-center text-center"
              >
                {/* Number */}
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-[#003b2b] text-lg font-bold text-white shadow-sm"
                >
                  {step.number}
                </motion.div>

                {/* Content */}
                <div className="mt-5 px-3">
                  <h3 className="text-[16px] font-bold text-[#003b2b]">
                    {step.title}
                  </h3>

                  <p className="mx-auto mt-2 max-w-[180px] text-[13px] leading-relaxed text-gray-500">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}