"use client";

import { FaRobot, FaLeaf, FaArrowRight } from "react-icons/fa";
import { HiTrendingUp } from "react-icons/hi";

interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkLabel: string;
}

const features: FeatureCard[] = [
  {
    icon: <span className="text-sm font-bold tracking-tight">4G</span>,
    title: "Crop Disease Detection",
    description:
      "Snap a photo of your plant and our AI will diagnose pests or diseases in seconds with treatment advice.",
    linkLabel: "Detect Disease",
  },
  {
    icon: <FaLeaf className="h-5 w-5" />,
    title: "Crop Recommendation",
    description:
      "Not sure what to plant? Get AI suggestions based on your soil type, season, and market demand.",
    linkLabel: "Explore Recommendations",
  },
  {
    icon: <FaRobot className="h-5 w-5" />,
    title: "AI Farming Assistant",
    description:
      "Chat with our agricultural LLM trained on millions of farming journals and expert papers.",
    linkLabel: "Ask AI",
  },
  {
    icon: <HiTrendingUp className="h-5 w-5" />,
    title: "Yield Prediction",
    description:
      "Forecast your harvest volume months in advance using historical data and current field stats.",
    linkLabel: "Predict Yield",
  },
];

export default function ServicesSection() {
  return (
    <section className="w-full bg-[#0E1F16] px-6 py-20 md:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-extrabold text-white md:text-4xl">
          AI-Powered Farming Intelligence
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-white/10 bg-[#16291D] p-8 transition-colors hover:border-white/20"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2A4433] text-[#A9D8B4]">
                {feature.icon}
              </div>

              <h3 className="mt-6 text-xl font-bold text-white">
                {feature.title}
              </h3>

              <p className="mt-3 text-[15px] leading-relaxed text-[#A3B3AC]">
                {feature.description}
              </p>

              <button className="mt-6 flex items-center gap-2 text-[15px] font-semibold text-white transition-colors hover:text-[#A9D8B4]">
                {feature.linkLabel}
                <FaArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}