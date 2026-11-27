import Link from "next/link";
import { Sprout } from "lucide-react";

export default function NotFound() {
  return (
    <main className="grid min-h-svh place-items-center bg-emerald-50 px-5 py-12 text-center text-emerald-950">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-2 text-xl font-bold">
          <Sprout aria-hidden="true" className="size-7 text-emerald-700" />
          AgriNova
        </div>
        <p className="text-6xl font-bold tracking-tight text-emerald-700 sm:text-8xl">404</p>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Page not found</h1>
        <p className="mt-3 text-base leading-relaxed">
          We couldn’t find the page you requested. Check the address or return to the AgriNova homepage.
        </p>
        <Link
          href="/"
          className="mt-7 inline-flex rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-800"
        >
          Go to home
        </Link>
      </div>
    </main>
  );
}
