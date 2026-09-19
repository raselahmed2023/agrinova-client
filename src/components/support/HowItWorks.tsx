import type {
  ComponentType,
} from "react";

import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ClipboardList,
  Factory,
  Handshake,
  PackageCheck,
  ShieldCheck,
  Sprout,
  UsersRound,
} from "lucide-react";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: ComponentType<{
    className?: string;
  }>;
}

const steps: Step[] = [
  {
    id: 1,
    title: "Submit Your Produce",
    description:
      "Share product details, quantity, expected price, pickup location, photos, and your preferred AgriNova branch.",
    icon: ClipboardList,
  },
  {
    id: 2,
    title: "AgriNova Reviews",
    description:
      "Our team reviews the submission and verifies the product information before moving it forward.",
    icon: ShieldCheck,
  },
  {
    id: 3,
    title: "Matched With Buyers",
    description:
      "AgriNova connects suitable produce with relevant buyers, businesses, or industries in its supply network.",
    icon: UsersRound,
  },
  {
    id: 4,
    title: "Deal Is Confirmed",
    description:
      "The commercial terms are confirmed before the product moves to the next stage of the supply process.",
    icon: Handshake,
  },
  {
    id: 5,
    title: "Product Handover",
    description:
      "After confirmation, the farmer delivers or sends the accepted produce according to the agreed instructions.",
    icon: PackageCheck,
  },
  {
    id: 6,
    title: "Supply Completed",
    description:
      "AgriNova coordinates the connection between farmer and buyer until the approved supply transaction is completed.",
    icon: CheckCircle2,
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="w-full bg-[#f6f8f7] px-4 py-16 sm:px-6 md:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-[1500px]">

        {/* =====================================================
            HEADING
        ====================================================== */}

        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">
            <Sprout className="h-3.5 w-3.5" />
            AgriNova Supply Bridge
          </div>

          <h2 className="mt-4 text-3xl font-black tracking-[-0.035em] text-slate-950 md:text-4xl">
            From Farmer to the Right Buyer
          </h2>
        </div>

        {/* =====================================================
            BRIDGE EXPLANATION
        ====================================================== */}

        <div className="mx-auto mt-9 grid max-w-5xl items-stretch gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:gap-3">

          <BridgeCard
            icon={
              <Sprout className="h-5 w-5" />
            }
            eyebrow="Supply Side"
            title="Farmer"
            text="Provides available agricultural produce."
          />

          <div className="hidden items-center justify-center sm:flex">
            <ArrowRight className="h-5 w-5 text-emerald-500" />
          </div>

          <BridgeCard
            icon={
              <Handshake className="h-5 w-5" />
            }
            eyebrow="Connection"
            title="AgriNova"
            text="Reviews, matches, and coordinates the supply opportunity."
            highlight
          />

          <div className="hidden items-center justify-center sm:flex">
            <ArrowRight className="h-5 w-5 text-emerald-500" />
          </div>

          <BridgeCard
            icon={
              <Factory className="h-5 w-5" />
            }
            eyebrow="Demand Side"
            title="Buyer / Industry"
            text="Receives suitable produce through the AgriNova network."
          />
        </div>

        {/* =====================================================
            PROCESS
        ====================================================== */}

        <div className="relative mt-12">

          {/* Desktop connector */}
          <div className="pointer-events-none absolute left-[7%] right-[7%] top-[43px] hidden h-[2px] bg-slate-200 xl:block">
            <div className="process-line h-full bg-emerald-500" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {steps.map(
              (
                step,
                index
              ) => {
                const Icon =
                  step.icon;

                return (
                  <div
                    key={
                      step.id
                    }
                    className="relative"
                  >
                    <div className="group relative h-full rounded-[22px] border border-slate-200/90 bg-white p-5 shadow-[0_12px_35px_-28px_rgba(15,23,42,0.35)] transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_20px_45px_-28px_rgba(4,120,87,0.28)]">

                      {/* Icon */}
                      <div className="relative z-10 mx-auto flex h-[86px] w-[86px] items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-[#07583f] shadow-sm transition duration-300 group-hover:bg-emerald-100">

                        <div
                          className="step-pulse absolute inset-0 rounded-full bg-emerald-200/60"
                          style={{
                            animationDelay:
                              `${index * 1.2}s`,
                          }}
                        />

                        <Icon className="relative z-10 h-7 w-7" />

                        <span className="absolute -right-1 top-0 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-[#07583f] text-[10px] font-black text-white shadow-sm">
                          {String(
                            step.id
                          ).padStart(
                            2,
                            "0"
                          )}
                        </span>
                      </div>

                      <div className="mt-5 text-center">
                        <h3 className="text-sm font-black leading-5 text-slate-950 lg:text-[15px]">
                          {step.title}
                        </h3>

                        <p className="mt-2 text-xs leading-5 text-slate-500">
                          {
                            step.description
                          }
                        </p>
                      </div>
                    </div>

                    {/* Mobile connector */}
                    {index <
                      steps.length -
                        1 && (
                      <div className="flex h-10 items-center justify-center xl:hidden">
                        <ArrowDown className="h-4 w-4 text-emerald-500 sm:hidden" />

                        <ArrowRight className="hidden h-4 w-4 text-emerald-500 sm:block lg:hidden" />

                        <ArrowRight className="hidden h-4 w-4 text-emerald-500 lg:block xl:hidden" />
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* =====================================================
            TRUST NOTE
        ====================================================== */}

      </div>

      <style>{`
        @keyframes stepPulse {
          0% {
            transform: scale(1);
            opacity: 0;
          }

          4% {
            opacity: 0.7;
          }

          15% {
            transform: scale(1.22);
            opacity: 0;
          }

          100% {
            transform: scale(1.22);
            opacity: 0;
          }
        }

        .step-pulse {
          animation: stepPulse 8s ease-out infinite;
        }

        @keyframes processLine {
          0% {
            width: 0%;
            opacity: 0.35;
          }

          55% {
            width: 100%;
            opacity: 1;
          }

          80% {
            width: 100%;
            opacity: 0.35;
          }

          100% {
            width: 0%;
            opacity: 0;
          }
        }

        .process-line {
          width: 0%;
          animation: processLine 8s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .step-pulse,
          .process-line {
            animation: none !important;
          }

          .process-line {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}

/* ============================================================
   SMALL COMPONENT
============================================================ */

function BridgeCard({
  icon,
  eyebrow,
  title,
  text,
  highlight = false,
}: {
  icon:
    React.ReactNode;

  eyebrow:
    string;

  title:
    string;

  text:
    string;

  highlight?:
    boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 text-center shadow-sm ${
        highlight
          ? "border-emerald-200 bg-[#07583f] text-white"
          : "border-slate-200 bg-white text-slate-900"
      }`}
    >
      <div
        className={`mx-auto flex h-9 w-9 items-center justify-center rounded-xl ${
          highlight
            ? "bg-white/10 text-emerald-100"
            : "bg-emerald-50 text-emerald-700"
        }`}
      >
        {icon}
      </div>

      <p
        className={`mt-3 text-[8px] font-black uppercase tracking-[0.16em] ${
          highlight
            ? "text-emerald-100"
            : "text-slate-400"
        }`}
      >
        {eyebrow}
      </p>

      <p className="mt-1 text-sm font-black">
        {title}
      </p>

      <p
        className={`mt-1 text-[10px] leading-5 ${
          highlight
            ? "text-white/75"
            : "text-slate-500"
        }`}
      >
        {text}
      </p>
    </div>
  );
}
