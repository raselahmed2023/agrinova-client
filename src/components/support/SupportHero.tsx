// support/SupportHero.tsx
import Image from "next/image";
import Link from "next/link";



export default function SupportHero() {
  return (
    <section className="w-full bg-[#f8f9fa] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content Column */}
        <div className="flex flex-col items-start space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Sell Your Produce <br />
            Through AgriNova
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-lg leading-relaxed">
            Connect your farm products with industries and bulk buyers through
            AgriNova’s supply chain support. We handle the complexity so you
            can focus on growing.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button
            
              className="bg-[#053225] hover:bg-[#032018] text-white font-medium px-6 py-3.5 rounded-md transition-colors duration-200"
            >
              Submit Your Produce
            </button>
            <Link
              href="#how-it-works"
              className="bg-[#e9ecef] hover:bg-[#dee2e6] text-gray-800 font-medium px-6 py-3.5 rounded-md transition-colors duration-200 inline-block"
            >
              How It Works
            </Link>
          </div>
        </div>

        {/* Right Image Column */}
        <div className="relative w-full h-[380px] sm:h-[450px] lg:h-[500px] rounded-3xl overflow-hidden shadow-sm">
          <Image
            src="/images/support/supportHeroImage.png"
            alt="AgriNova Fresh Produce Distribution Center"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}