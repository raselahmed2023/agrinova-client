import {
  ClipboardList,
  ShieldCheck,
  Handshake,
  CheckCircle2,
} from "lucide-react";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const steps: Step[] = [
  {
    id: 1,
    title: "Submit Produce",
    description: "Enter your product details and expected price.",
    icon: ClipboardList,
  },
  {
    id: 2,
    title: "AgriNova Reviews",
    description: "Our admin team verifies your listing for quality.",
    icon: ShieldCheck,
  },
  {
    id: 3,
    title: "We Find Buyers",
    description: "We match your produce with verified bulk buyers.",
    icon: Handshake,
  },
  {
    id: 4,
    title: "Complete the Deal",
    description: "Finalize terms and coordinate logistics easily.",
    icon: CheckCircle2,
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="w-full bg-[#f8f9fa] py-16 px-6 md:px-10"
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          How It Works
        </h2>
        <p className="text-gray-600 text-sm md:text-base max-w-xl mx-auto mb-12">
          A streamlined process designed to get your produce from farm to market
          efficiently.
        </p>

        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-3">
          <div className="hidden md:block absolute top-10 left-[12%] right-[12%] h-[1.5px] bg-gray-200 z-0" />

          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.id}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                <div className="relative mb-5">
                  <div className="w-20 h-20 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center">
                    <IconComponent className="w-7 h-7 text-[#053225]" />
                  </div>

                  <span className="absolute top-0 right-0 w-6 h-6 rounded-full bg-[#b2f2bb] text-[#053225] font-bold text-xs flex items-center justify-center shadow-xs">
                    {step.id}
                  </span>
                </div>

                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1.5">
                  {step.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed max-w-[210px]">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
