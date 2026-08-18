const journeySteps = [
  {
    number: 1,
    title: "Create Account",
    description: "Sign up with your mobile number.",
  },
  {
    number: 2,
    title: "Add Your Farm",
    description: "Mark your farm boundary on the map.",
  },
  {
    number: 3,
    title: "Get Real-time Info",
    description: "Receive soil and weather data.",
  },
  {
    number: 4,
    title: "Expert Support",
    description: "Consult experts for any issues.",
  },
  {
    number: 5,
    title: "Smart Decisions",
    description: "Increase yield and profitability.",
  },
];

export default function JourneySection() {
  return (
    <section className="w-full bg-white py-16">
      <div className="mx-auto max-w-7xl px-4">
        {/* Heading */}
        <div className="mb-12 text-center">
          <h2 className="text-xl font-bold text-[30px] text-[#003b2b] sm:text-2xl">
            Your Journey to Smarter Farming
          </h2>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-[10%] right-[10%] top-7 hidden h-px bg-gray-300 lg:block" />

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-0">
            {journeySteps.map((step) => (
              <div
                key={step.number}
                className="relative flex flex-col items-center text-center"
              >
                {/* Number */}
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-[#003b2b] text-lg font-bold text-white shadow-sm">
                  {step.number}
                </div>

                {/* Content */}
                <div className="mt-5 px-3">
                  <h3 className="text-[11px] font-bold text-[#003b2b] sm:text-[16px]">
                    {step.title}
                  </h3>

                  <p className="mx-auto mt-2  text-[9px] leading-relaxed text-gray-500 sm:text-[14px]">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}