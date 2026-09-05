import type { ComponentType } from "react";

import {
  ClipboardList,
  ShieldCheck,
  BadgeCheck,
  PackageCheck,
  Handshake,
  ArrowRight,
  ArrowDown,
} from "lucide-react";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}

const steps: Step[] = [
  {
    id: 1,
    title: "Submit Produce",
    description:
      "Enter your product details, expected price, location, and preferred AgriNova branch.",
    icon: ClipboardList,
  },
  {
    id: 2,
    title: "AgriNova Reviews",
    description:
      "Our admin team reviews your submitted product information.",
    icon: ShieldCheck,
  },
  {
    id: 3,
    title: "Product Accepted",
    description:
      "Once approved, your produce is accepted by AgriNova.",
    icon: BadgeCheck,
  },
  {
    id: 4,
    title: "Deliver to Branch",
    description:
      "Bring or send the accepted product to the AgriNova branch you selected.",
    icon: PackageCheck,
  },
  {
    id: 5,
    title: "AgriNova Handles the Sale",
    description:
      "AgriNova handles the remaining selling process with suitable buyers or industries.",
    icon: Handshake,
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="w-full bg-[#f8f9fa] px-5 py-16 md:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-14 text-center">
          <h2 className="mb-3 text-3xl font-bold text-gray-900 md:text-4xl">
            How It Works
          </h2>

          <p className="mx-auto max-w-2xl text-sm leading-6 text-gray-600 md:text-base">
            A simple process to submit your product and sell it through the
            AgriNova supply chain.
          </p>
        </div>

        {/* Flow */}
        <div className="grid grid-cols-1 items-start md:grid-cols-[1fr_60px_1fr_60px_1fr_60px_1fr_60px_1fr] md:gap-1">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div key={step.id} className="contents">
                {/* Step */}
                <div className="group relative flex flex-col items-center text-center">
                  {/* Icon */}
                  <div className="relative mb-5">
                    {/* Animated Pulse */}
                    <div
                      className="step-pulse absolute inset-0 rounded-full bg-[#b2f2bb]/50"
                      style={{
                        animationDelay: `${index * 1.45}s`,
                      }}
                    />

                    {/* Main Circle */}
                    <div className="relative z-10 flex h-[78px] w-[78px] items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-green-200 group-hover:shadow-md">
                      <Icon className="h-7 w-7 text-[#053225]" />
                    </div>

                    {/* Step Number */}
                    <span className="absolute -right-1 top-0 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-[#b2f2bb] text-[11px] font-bold text-[#053225] shadow-sm">
                      {step.id}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 text-sm font-bold text-gray-900 lg:text-base">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="max-w-[200px] text-xs leading-5 text-gray-600 lg:text-sm">
                    {step.description}
                  </p>
                </div>

                {/* Connector */}
                {index < steps.length - 1 && (
                  <>
                    {/* Desktop Arrow */}
                    <div className="hidden h-[78px] items-center md:flex">
                      <div className="relative w-full">
                        {/* Gray base line */}
                        <div className="h-[2px] w-full bg-gray-200" />

                        {/* Animated green line */}
                        <div
                          className="flow-line absolute left-0 top-0 h-[2px] bg-[#0b6b4b]"
                          style={{
                            animationDelay: `${index * 1.45 + 0.55}s`,
                          }}
                        />

                        {/* Moving arrow */}
                        <ArrowRight
                          className="flow-arrow absolute top-1/2 h-5 w-5 -translate-y-1/2 text-[#0b6b4b]"
                          style={{
                            animationDelay: `${index * 1.45 + 0.55}s`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Mobile Arrow */}
                    <div className="flex h-16 items-center justify-center md:hidden">
                      <div className="relative h-full">
                        {/* Gray base line */}
                        <div className="h-full w-[2px] bg-gray-200" />

                        {/* Animated green line */}
                        <div
                          className="flow-line-mobile absolute left-0 top-0 w-[2px] bg-[#0b6b4b]"
                          style={{
                            animationDelay: `${index * 1.45 + 0.55}s`,
                          }}
                        />

                        {/* Moving down arrow */}
                        <ArrowDown
                          className="flow-arrow-mobile absolute left-1/2 h-5 w-5 -translate-x-1/2 text-[#0b6b4b]"
                          style={{
                            animationDelay: `${index * 1.45 + 0.55}s`,
                          }}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
      

        @keyframes stepPulse {
          0% {
            transform: scale(1);
            opacity: 0;
          }

          4% {
            opacity: 0.8;
          }

          14% {
            transform: scale(1.25);
            opacity: 0;
          }

          100% {
            transform: scale(1.25);
            opacity: 0;
          }
        }

        .step-pulse {
          animation: stepPulse 7.5s ease-out infinite;
        }



        @keyframes flowLine {
          0% {
            width: 0%;
            opacity: 1;
          }

          13% {
            width: 100%;
            opacity: 1;
          }

          20% {
            width: 100%;
            opacity: 0;
          }

          100% {
            width: 100%;
            opacity: 0;
          }
        }

        .flow-line {
          width: 0%;
          animation: flowLine 7.5s ease-in-out infinite;
        }



        @keyframes flowArrow {
          0% {
            left: -8px;
            opacity: 0;
          }

          2% {
            opacity: 1;
          }

          13% {
            left: calc(100% - 12px);
            opacity: 1;
          }

          19% {
            left: calc(100% - 12px);
            opacity: 0;
          }

          100% {
            left: calc(100% - 12px);
            opacity: 0;
          }
        }

        .flow-arrow {
          left: -8px;
          opacity: 0;
          animation: flowArrow 7.5s ease-in-out infinite;
        }



        @keyframes flowLineMobile {
          0% {
            height: 0%;
            opacity: 1;
          }

          13% {
            height: 100%;
            opacity: 1;
          }

          20% {
            height: 100%;
            opacity: 0;
          }

          100% {
            height: 100%;
            opacity: 0;
          }
        }

        .flow-line-mobile {
          height: 0%;
          animation: flowLineMobile 7.5s ease-in-out infinite;
        }


       

        @keyframes flowArrowMobile {
          0% {
            top: -7px;
            opacity: 0;
          }

          2% {
            opacity: 1;
          }

          13% {
            top: calc(100% - 13px);
            opacity: 1;
          }

          19% {
            top: calc(100% - 13px);
            opacity: 0;
          }

          100% {
            top: calc(100% - 13px);
            opacity: 0;
          }
        }

        .flow-arrow-mobile {
          top: -7px;
          opacity: 0;
          animation: flowArrowMobile 7.5s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .step-pulse,
          .flow-line,
          .flow-arrow,
          .flow-line-mobile,
          .flow-arrow-mobile {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}