"use client";

import Image from "next/image";
import { motion } from "motion/react";
import {
  Activity,
  Check,
  Droplets,
  Leaf,
  Sprout,
} from "lucide-react";

const features = [
  {
    title: "Crop Management",
    description:
      "Keep crop information, growth records, planting activities, and field updates organized for easier day-to-day farm management.",
    highlights: [
      "Crop & Growth Records",
      "Field Activity History",
    ],
    image: "/images/home/crop-managment.jpeg",
    imageAlt: "Crop management dashboard",
    icon: Sprout,
    accent: "emerald",
  },
  {
    title: "Soil Analysis",
    description:
      "Keep soil-related information organized so you can review field conditions and make better decisions for crop planning and management.",
    highlights: [
      "Soil Information",
      "Field Condition Records",
    ],
    image: "/images/home/soil-analysis.jpeg",
    imageAlt: "Farmer reviewing soil and field information",
    icon: Leaf,
    accent: "green",
  },
  {
    title: "Smart Irrigation",
    description:
      "Use farm and weather information to make more informed irrigation decisions and manage water use more efficiently.",
    highlights: [
      "Irrigation Planning",
      "Weather-Aware Decisions",
    ],
    image: "/images/home/smart-irrigation.jpeg",
    imageAlt: "Smart irrigation management in a field",
    icon: Droplets,
    accent: "blue",
  },
  {
    title: "Activity Tracking",
    description:
      "Record important farm activities and keep daily operational information organized in one place.",
    highlights: [
      "Daily Farm Activities",
      "Operational Records",
    ],
    image: "/images/home/activity-tracking.jpeg",
    imageAlt: "Farm activity and operational tracking",
    icon: Activity,
    accent: "emerald",
  },
];

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 32,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
};

export default function FeaturePreview() {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="relative overflow-hidden bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      {/* subtle background */}
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-emerald-100/50 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-sky-100/40 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <motion.header
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
          className="mx-auto max-w-2xl text-center"
        >
          <h2
            id="features-title"
            className="text-3xl font-black tracking-[-0.04em] text-[#103F32] sm:text-4xl lg:text-[44px]"
          >
            Smart Farm Management
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-[15px]"
          >
            Keep essential farm information, field activities, and management
            tools organized in one place.
          </p>
        </motion.header>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:mt-14 lg:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            const iconStyle =
              feature.accent === "blue"
                ? "border-sky-100 bg-sky-50 text-sky-600"
                : feature.accent === "green"
                  ? "border-green-100 bg-green-50 text-green-700"
                  : "border-emerald-100 bg-emerald-50 text-emerald-700";

            const glowStyle =
              feature.accent === "blue"
                ? "bg-sky-300/20"
                : "bg-emerald-300/20";

            return (
              <motion.article
                key={feature.title}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: true,
                  amount: 0.18,
                }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.09,
                  ease: "easeOut",
                }}
                whileHover={{
                  y: -7,
                  transition: {
                    duration: 0.22,
                  },
                }}
                className="group relative overflow-hidden rounded-[24px] border border-slate-200/80 bg-[#FAFCFB] shadow-[0_4px_20px_rgba(15,23,42,0.035)] transition-shadow duration-300 hover:border-emerald-200 hover:shadow-[0_24px_55px_rgba(11,72,53,0.12)]"
              >
                {/* Hover glow */}
                <div
                  className={`pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100 ${glowStyle}`}
                />

                <div className="grid min-h-[310px] grid-cols-1 sm:grid-cols-[minmax(0,1fr)_200px] lg:grid-cols-[minmax(0,1fr)_220px]">
                  {/* Content */}
                  <div className="relative z-10 flex flex-col p-6 sm:p-7 lg:p-8">
                    <motion.div
                      whileHover={{
                        scale: 1.08,
                        rotate: 3,
                      }}
                      transition={{
                        duration: 0.2,
                      }}
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${iconStyle}`}
                    >
                      <Icon className="h-5 w-5" />
                    </motion.div>

                    <h3 className="mt-5 text-xl font-black tracking-[-0.025em] text-[#17372D] transition-colors duration-200 group-hover:text-emerald-700"
                    >
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-[13px] leading-6 text-slate-500 sm:text-sm"
                    >
                      {feature.description}
                    </p>

                    <ul className="mt-auto space-y-2.5 pt-6">
                      {feature.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex items-center gap-2.5 text-xs font-semibold text-[#49615A]"
                        >
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"
                          >
                            <Check className="h-3 w-3" />
                          </span>

                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Image */}
                  <div className="relative min-h-[220px] overflow-hidden sm:min-h-full">
                    <Image
                      src={feature.image}
                      alt={feature.imageAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 35vw, 220px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                    />

                    {/* image overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#062e23]/20 via-transparent to-transparent sm:bg-gradient-to-r sm:from-[#FAFCFB] sm:via-transparent sm:to-transparent"
                    />

                    {/* floating icon */}
                    <motion.div
                      animate={{
                        y: [0, -5, 0],
                      }}
                      transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.35,
                      }}
                      className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/60 bg-white/85 text-[#0D644B] shadow-lg backdrop-blur-md"
                    >
                      <Icon className="h-4 w-4" />
                    </motion.div>
                  </div>
                </div>

                {/* animated bottom line */}
                <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 group-hover:w-full"
                />
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}