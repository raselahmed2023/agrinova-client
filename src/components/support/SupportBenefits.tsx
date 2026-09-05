import { TrendingUp, Users, Eye, Truck } from "lucide-react";

interface Benefit {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const benefits: Benefit[] = [
  {
    id: 1,
    title: "Better Market Access",
    description: "Reach national industrial buyers outside your local network.",
    icon: TrendingUp,
  },
  {
    id: 2,
    title: "Buyer Connection",
    description: "Direct links to verified, trustworthy bulk purchasers.",
    icon: Users,
  },
  {
    id: 3,
    title: "Transparent Offers",
    description: "Clear pricing and negotiation terms with no hidden fees.",
    icon: Eye,
  },
  {
    id: 4,
    title: "Supply Coordination",
    description: "Logistical support to ensure your produce arrives fresh.",
    icon: Truck,
  },
];

export default function SupportBenefits() {
  return (
    <section className="w-full bg-[#f8f9fa] py-16 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 text-left">
          Why Sell Through AgriNova
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit) => {
            const IconComponent = benefit.icon;
            return (
              <div
                key={benefit.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col items-start transition-shadow duration-200 hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-full bg-[#b2f2bb] flex items-center justify-center mb-6">
                  <IconComponent className="w-6 h-6 text-[#053225]" />
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
