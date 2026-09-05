import type { ComponentType } from "react";

import {
  TrendingUp,
  UsersRound,
  ShieldCheck,
  Warehouse,
} from "lucide-react";

interface Benefit {
  id: number;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}

const benefits: Benefit[] = [
  {
    id: 1,
    title: "Wider Market Reach",
    description:
      "Reach industries and bulk buyers beyond your local market through AgriNova.",
    icon: TrendingUp,
  },
  {
    id: 2,
    title: "Industry & Buyer Connection",
    description:
      "AgriNova helps connect accepted farm produce with suitable industries and bulk buyers.",
    icon: UsersRound,
  },
  {
    id: 3,
    title: "AgriNova Review & Support",
    description:
      "Your submission is reviewed by the AgriNova team before it moves forward.",
    icon: ShieldCheck,
  },
  {
    id: 4,
    title: "Branch Collection",
    description:
      "Deliver accepted produce to your selected AgriNova branch for the next stage of the selling process.",
    icon: Warehouse,
  },
];

export default function WhySellThroughAgriNova() {
  return (
    <section className="w-full bg-white px-6 py-16 md:px-10 lg:py-20">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#0b6b4b]">
            AgriNova Supply Chain
          </p>

          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Why Sell Through AgriNova
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 md:text-base">
            Get support from product submission to branch delivery while
            AgriNova helps connect your product with wider market opportunities.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <article
                key={benefit.id}
                className="benefit-card group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-500"
                style={{
                  animationDelay: `${index * 140}ms`,
                }}
              >
                {/* Animated top line */}
                <div className="absolute left-0 top-0 h-[3px] w-0 bg-[#0b6b4b] transition-all duration-500 group-hover:w-full" />

                {/* Background glow */}
                <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-[#b2f2bb]/0 blur-2xl transition-all duration-500 group-hover:bg-[#b2f2bb]/50" />

                {/* Icon */}
                <div className="relative mb-5">
                  <div className="icon-pulse absolute inset-0 h-11 w-11 rounded-full bg-[#b2f2bb]/50" />

                  <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#b2f2bb] transition-all duration-500 group-hover:scale-110 group-hover:bg-[#9aebb0]">
                    <Icon className="h-5 w-5 text-[#053225] transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="mb-2 text-base font-bold text-gray-900 transition-colors duration-300 group-hover:text-[#053225]">
                  {benefit.title}
                </h3>

                <p className="text-sm leading-6 text-gray-600">
                  {benefit.description}
                </p>

                {/* Number */}
                <span className="absolute bottom-3 right-4 text-5xl font-black text-gray-100 transition-colors duration-500 group-hover:text-green-50">
                  0{benefit.id}
                </span>
              </article>
            );
          })}
        </div>
      </div>

      <style>{`
        

        @keyframes cardReveal {
          0% {
            opacity: 0;
            transform: translateY(24px) scale(0.98);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .benefit-card {
          opacity: 0;
          animation: cardReveal 0.65s ease-out forwards;
        }



        .benefit-card:hover {
          transform: translateY(-8px);
          box-shadow:
            0 18px 45px rgba(5, 50, 37, 0.10),
            0 4px 12px rgba(5, 50, 37, 0.05);
          border-color: rgba(11, 107, 75, 0.22);
        }


       

        @keyframes iconPulse {
          0% {
            transform: scale(1);
            opacity: 0.45;
          }

          60% {
            transform: scale(1.45);
            opacity: 0;
          }

          100% {
            transform: scale(1.45);
            opacity: 0;
          }
        }

        .icon-pulse {
          animation: iconPulse 2.8s ease-out infinite;
        }


     

        @media (prefers-reduced-motion: reduce) {
          .benefit-card,
          .icon-pulse {
            animation: none !important;
          }

          .benefit-card {
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}