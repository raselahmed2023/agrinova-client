import HeroSection from "@/components/home/HeroSection";
import FeaturePreview from "@/components/home/FeaturePreview";
import MarketplaceSection from "@/components/home/MarketplaceSection";
import ExpertSection from "@/components/ExpertSection";
import EducationalResources from "@/components/home/EducationalResources";
import GrowSmarterCTA from "@/components/home/GrowSmarterCTA";
import JourneySection from "@/components/home/JourneySection";
import AgricultureIntelligence from "@/components/home/AgricultureIntelligence";
import ServicesSection from "@/components/home/ServicesSection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <HeroSection />
      <FeaturePreview />
      <ServicesSection />
      <AgricultureIntelligence />
      <MarketplaceSection />
      <ExpertSection />
      <EducationalResources />
      <JourneySection />
      <GrowSmarterCTA />
    </main>
  );
}