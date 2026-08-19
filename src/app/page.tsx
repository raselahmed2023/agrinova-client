import MarketplaceSection from "../components/MarketplaceSection";
import ExpertSection from "../components/ExpertSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans dark:bg-black">
      <main className="flex-1 w-full flex flex-col py-8 px-4 sm:px-8">
        {/* Placeholder header to keep things looking balanced */}
        <header className="w-full max-w-6xl mx-auto py-6 mb-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-emerald-800 dark:text-emerald-400">Agrinova</h1>
        </header>

        <MarketplaceSection />
        <ExpertSection />
      </main>
    </div>
  );
}
