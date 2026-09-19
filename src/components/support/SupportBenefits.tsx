import type {
  ComponentType,
} from "react";

import {
  Building2,
  Network,
  ShieldCheck,
  Sprout,
  TrendingUp,
  UsersRound,
} from "lucide-react";

interface Benefit {
  id: number;
  title: string;
  description: string;
  icon: ComponentType<{
    className?: string;
  }>;
}

const benefits: Benefit[] = [
  {
    id: 1,
    title: "Wider Market Access",
    description:
      "Reach beyond your local market and access more potential demand through the AgriNova network.",
    icon: TrendingUp,
  },
  {
    id: 2,
    title: "Relevant Buyer Connections",
    description:
      "Get connected with suitable buyers, businesses, or industries looking for agricultural supply.",
    icon: UsersRound,
  },
  {
    id: 3,
    title: "Organized Supply Support",
    description:
      "Keep product information, communication, and supply coordination in one structured process.",
    icon: Network,
  },
  {
    id: 4,
    title: "More Confident Handover",
    description:
      "Receive clear instructions for the next step after a supply opportunity is confirmed.",
    icon: Building2,
  },
];

export default function WhySellThroughAgriNova() {
  return (
    <section className="w-full bg-white px-4 py-16 sm:px-6 md:px-8 lg:py-20">
      <div className="mx-auto max-w-[1400px]">

        {/* =====================================================
            HEADING
        ====================================================== */}

        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">
            <Sprout className="h-3.5 w-3.5" />
            Farmer Benefits
          </div>

          <h2 className="mt-4 text-3xl font-black tracking-[-0.035em] text-slate-950 md:text-4xl">
            Why Farmers Use AgriNova
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            AgriNova helps farmers access wider market opportunities and manage
            supply connections in a more organized way.
          </p>
        </div>

        {/* =====================================================
            BENEFIT CARDS
        ====================================================== */}

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {benefits.map(
            (
              benefit,
              index
            ) => {
              const Icon =
                benefit.icon;

              return (
                <article
                  key={
                    benefit.id
                  }
                  className="benefit-card group relative flex min-h-[235px] flex-col overflow-hidden rounded-[24px] border border-slate-200/90 bg-white p-5 shadow-[0_14px_40px_-30px_rgba(15,23,42,0.32)] transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_20px_50px_-30px_rgba(4,120,87,0.28)]"
                  style={{
                    animationDelay:
                      `${index * 120}ms`,
                  }}
                >
                  {/* Top accent */}
                  <div className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-emerald-600 transition-transform duration-300 group-hover:scale-x-100" />

                  {/* Number */}
                  <span className="pointer-events-none absolute -right-1 bottom-0 text-[72px] font-black leading-none text-slate-50 transition group-hover:text-emerald-50/80">
                    {String(
                      benefit.id
                    ).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  {/* Icon */}
                  <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700 transition duration-300 group-hover:bg-emerald-100">
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 mt-5">
                    <h3 className="text-lg font-black tracking-tight text-slate-950">
                      {benefit.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {benefit.description}
                    </p>
                  </div>

                  <div className="relative z-10 mt-auto pt-5">
                    <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-wide text-emerald-700">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      AgriNova Support
                    </div>
                  </div>
                </article>
              );
            }
          )}
        </div>
      </div>

      <style>{`
        @keyframes cardReveal {
          0% {
            opacity: 0;
            transform: translateY(18px);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .benefit-card {
          opacity: 0;
          animation: cardReveal 0.55s ease-out forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .benefit-card {
            animation: none !important;
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}
