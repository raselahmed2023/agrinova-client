"use client";

import Image from "next/image";
import { FaExclamationTriangle, FaMoneyBillWave, FaLightbulb } from "react-icons/fa";

interface SidebarItem {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
}

const sidebarItems: SidebarItem[] = [
  {
    icon: <FaExclamationTriangle className="h-5 w-5 text-[#D14343]" />,
    iconBg: "bg-[#FBE1E1]",
    title: "Weather Alerts",
    description: "Hyper-local weather tracking and severe storm warnings.",
  },
  {
    icon: <FaMoneyBillWave className="h-5 w-5 text-[#2F6B4F]" />,
    iconBg: "bg-[#DCF3E3]",
    title: "Cost Tracking",
    description: "Live profit/loss dashboards for every single acre.",
  },
  {
    icon: <FaLightbulb className="h-5 w-5 text-[#2F6B4F]" />,
    iconBg: "bg-[#DCF3E3]",
    title: "Farm Insights",
    description: "Data-driven suggestions for operational efficiency.",
  },
];

function CircularProgress({ percentage }: { percentage: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex h-32 w-32 items-center justify-center sm:h-36 sm:w-36">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="8"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#A9D8B4"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute text-2xl font-bold text-white sm:text-3xl">
        {percentage}%
      </span>
    </div>
  );
}

export default function AgricultureIntelligence() {
  return (
    <section className="w-full bg-[#F7F8FC] px-6 py-20 md:px-12 lg:px-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr_1fr]">
        {/* Left column */}
        <div className="flex flex-col gap-5">
          <h2 className="text-3xl font-extrabold leading-tight text-[#1A2B22] md:text-4xl">
            Agriculture
            <br />
            Intelligence
          </h2>

          {sidebarItems.map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-4 rounded-2xl border border-black/10 bg-white p-5"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.iconBg}`}
              >
                {item.icon}
              </div>
              <div>
                <h3 className="font-bold text-[#1A2B22]">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#6B7570]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Middle card - Live Market Intelligence */}
        <div className="flex flex-col overflow-hidden rounded-3xl bg-[#DCE6F7]">
          <div className="p-8">
            <h3 className="text-2xl font-bold text-[#1A2B22]">
              Live Market Intelligence
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-[#4B5A52]">
              Stay ahead with real-time commodity prices and market trends
              tailored to your region.
            </p>
          </div>
          <div className="relative mt-auto h-56 w-full sm:h-64">
            <Image
              src="/lapto-banner.jpeg"
              alt="Live market intelligence dashboard on a tablet"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Right card - Sustainability Metrics */}
        <div className="flex flex-col rounded-3xl bg-[#1B3A2A] p-8">
          <h3 className="text-2xl font-bold text-white">
            Sustainability Metrics
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-[#B7C7BE]">
            Track your carbon footprint and soil sequestration levels to
            qualify for environmental grants.
          </p>
          <div className="mt-10 flex flex-1 items-center justify-center pb-4">
            <CircularProgress percentage={84} />
          </div>
        </div>
      </div>
    </section>
  );
}
