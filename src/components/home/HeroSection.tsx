import Image from "next/image";

const metrics = [
  { label: "Active Farmers", value: "50k+" },
  { label: "Accuracy Rate", value: "98%" },
  { label: "Crop Types", value: "40+" },
];

export default function HeroSection() {
  return (
    <section
      className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_46%_35%,#f9ffff_0%,#eaf6f5_44%,#dceeed_100%)] px-5 py-14 sm:px-8 lg:px-12"
      aria-labelledby="hero-title"
    >
      <div className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-12 lg:grid-cols-[minmax(0,0.94fr)_minmax(420px,1fr)] lg:gap-[clamp(3rem,7vw,7.4rem)]">
        <div className="max-w-xl">
          <h1 id="hero-title" className="max-w-[35rem] text-[clamp(3rem,8vw,5rem)] font-extrabold leading-[.98] tracking-[-0.065em] text-[#063d2d]">
            Smarter Farming Starts with Better Decisions
          </h1>
          <p className="mt-7 max-w-lg text-sm leading-relaxed text-[#3f5650] sm:text-base">
            Optimize your crop management with AI-driven insights and real-time data monitoring. Empower your farm with precision technology to ensure higher yields and sustainable farming practices.
          </p>
          <div className="mt-7 flex flex-wrap gap-4">
            <a href="#get-started" className="inline-flex h-13 items-center justify-center rounded-lg bg-[#063d2d] px-7 text-sm font-bold text-white shadow-[0_9px_16px_rgba(6,61,45,.16)] transition hover:-translate-y-0.5 hover:bg-[#07503a]">Get Started</a>
            <a href="#features" className="inline-flex h-13 items-center justify-center rounded-lg bg-[#e5edfd] px-7 text-sm font-bold text-[#123f33] transition hover:-translate-y-0.5 hover:bg-[#d8e4fb]">Explore Features</a>
          </div>
          <dl className="mt-9 grid grid-cols-3 gap-2 sm:mt-12 sm:gap-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="min-w-0 rounded-[10px] border border-[#c7d3d1] bg-white/35 px-2.5 py-3 sm:px-4 sm:py-4">
                <dt className="text-[10px] text-[#46605a] sm:text-xs">{metric.label}</dt>
                <dd className="mt-1 text-lg font-extrabold leading-none text-[#083e2e] sm:text-xl">{metric.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-2xl aspect-[1.34/1] rounded-[14px] border-[3px] border-white shadow-[0_25px_36px_rgba(50,86,80,.22)]">
          <Image className="rounded-[11px] object-cover" src="/images/home/banner-image.jpeg" alt="Farmer using a tablet in a crop field" fill priority sizes="(max-width: 1024px) 100vw, 48vw" />
          <div className="absolute left-3 top-3 z-10 flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2.5 shadow-[0_9px_18px_rgba(36,61,55,.15)] sm:left-7 sm:top-7 sm:gap-3 sm:px-4 sm:py-3">
            <span className="grid size-5 place-items-center rounded-full border-2 border-[#0a9b4e] text-xs font-extrabold text-[#0a9b4e]">✦</span>
            <span><small className="block text-[10px] leading-none text-[#344640]">Crop Health</small><strong className="mt-1 block text-xs leading-none text-[#08723a]">HEALTHY</strong></span>
          </div>
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2.5 shadow-[0_9px_18px_rgba(36,61,55,.15)] sm:bottom-7 sm:right-6 sm:gap-3 sm:px-4 sm:py-3">
            <span className="grid size-5 place-items-center rounded-full border-2 border-[#1687cf] text-xs font-extrabold text-[#1687cf]">◈</span>
            <span><small className="block text-[10px] leading-none text-[#344640]">Rain Expected</small><strong className="mt-1 block text-xs leading-none text-[#08723a]">In 4 hours</strong></span>
          </div>
        </div>
      </div>
    </section>
  );
}
