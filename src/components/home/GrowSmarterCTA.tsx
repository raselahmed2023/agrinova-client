export default function GrowSmarterCTA() {
  return (
    <section className="bg-[#f5f7fb] px-4 py-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-[36px] bg-[#073b2d] px-6 py-14 text-center md:px-12 md:py-16">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Ready to Grow Smarter?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-emerald-100/75 md:text-base">
            Join over 50,000 farmers who are already making data-backed
            decisions to improve their livelihoods.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              className="min-w-[235px] rounded-xl bg-white px-7 py-4 text-sm font-semibold text-[#073b2d] transition hover:bg-gray-100"
            >
              Download AgriNova App
            </button>

            <button
              type="button"
              className="min-w-[176px] rounded-xl border border-white/30 px-7 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Request a Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}