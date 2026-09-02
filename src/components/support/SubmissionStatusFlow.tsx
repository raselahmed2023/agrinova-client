

export default function SubmissionStatusFlow() {
  return (
    <section className="w-full bg-[#f8f9fa] py-16 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#053225] rounded-[2rem] px-6 py-14 md:py-16 text-center shadow-lg">

          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
            Ready to Sell Your Produce?
          </h2>


          <p className="text-gray-300 text-sm md:text-base max-w-xl mx-auto mb-8 font-normal leading-relaxed">
            Submit your produce details and let AgriNova help connect you with suitable buyers today.
          </p>


          <button
     
            className="bg-[#b2f2bb] hover:bg-[#9eeaa8] text-[#053225] font-semibold px-6 py-3 rounded-md text-sm md:text-base transition-colors duration-200 shadow-sm"
          >
            Submit Your Produce
          </button>
        </div>
      </div>
    </section>
  );
}