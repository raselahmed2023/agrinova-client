import Image from "next/image";

type FeatureIcon = "crop" | "soil" | "irrigation" | "activity";

const features: {
  title: string;
  description: string;
  highlights: string[];
  image: string;
  imageAlt: string;
  icon: FeatureIcon;
}[] = [
  {
    title: "Crop Management",
    description:
      "Monitor growth cycles, health indices, and planting schedules for every plot. Get automated alerts for harvesting windows and potential health issues.",
    highlights: ["Growth Phase Tracking", "Historical Field Data"],
    image: "/images/home/crop-managment.jpeg",
    imageAlt: "Crop management dashboard",
    icon: "crop",
  },
  {
    title: "Soil Analysis",
    description:
      "Advanced mapping of soil health, nutrient levels, and pH balance. Integration with soil sensors provides 24/7 subterranean visibility.",
    highlights: ["Nutrient Heatmaps", "pH Level Monitoring"],
    image: "/images/home/soil-analysis.jpeg",
    imageAlt: "Farmer reviewing field data on a tablet",
    icon: "soil",
  },
  {
    title: "Smart Irrigation",
    description:
      "Automated watering based on real-time soil moisture and evapotranspiration data. Reduce water waste while keeping your crops perfectly hydrated.",
    highlights: ["Schedule Automation", "Water Usage Analytics"],
    image: "/images/home/smart-irrigation.jpeg",
    imageAlt: "Smart irrigation app used in a field",
    icon: "irrigation",
  },
  {
    title: "Activity Tracking",
    description:
      "Log daily tasks, coordinate with your team, and track machinery usage. A comprehensive logbook for audits and operational efficiency.",
    highlights: ["Team Management", "Inventory Log"],
    image: "/images/home/activity-tracking.jpeg",
    imageAlt: "Farm team reviewing inventory",
    icon: "activity",
  },
];

function FeatureIcon({ icon }: { icon: FeatureIcon }) {
  const paths = {
    crop: <><path d="M5 10h14l-1.1 8H6.1L5 10Z" /><path d="M9 6.5h6M12 3.5v3M8.2 14h7.6" /></>,
    soil: <><path d="M12 3.5v8" /><path d="M12 3.5c-2.6 2.3-4 4.4-4 6.5a4 4 0 1 0 8 0c0-2.1-1.4-4.2-4-6.5Z" /><path d="M5 20h14" /></>,
    irrigation: <><path d="M12 3.5C8.8 7 7 9.4 7 12a5 5 0 0 0 10 0c0-2.6-1.8-5-5-8.5Z" /><path d="M8.5 17.5h7" /></>,
    activity: <><rect x="5" y="4" width="14" height="16" rx="2" /><path d="M9 4V2.8M15 4V2.8M8.5 10h7M8.5 14h5" /></>,
  };

  return (
    <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-[#174d3c] text-white">
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {paths[icon]}
      </svg>
    </span>
  );
}

export default function FeaturePreview() {
  return (
    <section id="features" className="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24" aria-labelledby="features-title">
      <div className="mx-auto max-w-6xl">
        <header className="mx-auto max-w-2xl text-center">
          <h2 id="features-title" className="text-3xl font-extrabold tracking-[-0.04em] text-[#202934] sm:text-4xl">
            Smart Farm Management
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#48525a]">
            Harness the power of real-time data to streamline your daily operations and maximize every acre of your land.
          </p>
        </header>

        <div className="mt-10 grid gap-5 md:grid-cols-2 md:gap-6 lg:mt-12">
          {features.map((feature) => (
            <article key={feature.title} className="group grid min-h-[250px] grid-cols-[minmax(0,1fr)_7.25rem] gap-4 overflow-hidden rounded-2xl bg-[#edf4ff] p-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-[#e7f1ff] hover:shadow-[0_18px_32px_rgba(34,75,103,0.16)] sm:grid-cols-[minmax(0,1fr)_9.5rem] sm:gap-5 sm:p-5 lg:min-h-[275px] lg:grid-cols-[minmax(0,1fr)_10rem] lg:p-6">
              <div className="flex min-w-0 flex-col">
                <FeatureIcon icon={feature.icon} />
                <h3 className="mt-2.5 text-base font-extrabold tracking-[-0.025em] text-[#27313a] sm:text-lg">{feature.title}</h3>
                <p className="mt-2 text-[11px] leading-[1.45] text-[#4a545d] sm:text-xs">{feature.description}</p>
                <ul className="mt-auto space-y-1 pt-4 text-[10px] font-medium text-[#43534e] sm:text-[11px]">
                  {feature.highlights.map((highlight) => <li key={highlight} className="flex items-center gap-1.5"><span aria-hidden="true" className="grid size-2.5 place-items-center rounded-full border border-[#46655b] text-[7px] leading-none">✓</span>{highlight}</li>)}
                </ul>
              </div>
              <div className="relative my-auto aspect-[.93] w-full overflow-hidden rounded-lg border border-white/80 shadow-sm">
                <Image src={feature.image} alt={feature.imageAlt} fill className="object-cover transition-transform duration-500 ease-out group-hover:scale-105" sizes="(max-width: 640px) 116px, (max-width: 1024px) 152px, 160px" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
