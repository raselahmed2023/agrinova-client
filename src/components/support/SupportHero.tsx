import Image from "next/image";
import Link from "next/link";

interface SupportHeroProps {
  onSubmitClick?: () => void;
}

export default function SupportHero({
  onSubmitClick,
}: SupportHeroProps) {
  return (
    <section className="w-full bg-[#f8f9fa] py-16 md:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 md:px-12 lg:grid-cols-2">
        <div className="flex flex-col items-start space-y-6">
          <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
            Sell Your Product
            <br />
            Through AgriNova
          </h1>

          <p className="max-w-lg text-base leading-relaxed text-gray-600 md:text-lg">
            Connect your farm products with industries and bulk buyers
            through AgriNova&apos;s supply chain support.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              type="button"
              onClick={onSubmitClick}
              className="rounded-md bg-[#053225] px-6 py-3.5 font-medium text-white hover:bg-[#032018]"
            >
              Submit Your Product
            </button>

            <Link
              href="#how-it-works"
              className="rounded-md bg-[#e9ecef] px-6 py-3.5 font-medium text-gray-800 hover:bg-[#dee2e6]"
            >
              How It Works
            </Link>
          </div>
        </div>

        <div className="relative h-[380px] w-full overflow-hidden rounded-3xl shadow-sm sm:h-[450px] lg:h-[500px]">
          <Image
            src="/images/support/supportHeroImage.png"
            alt="AgriNova Fresh Produce Distribution Center"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}