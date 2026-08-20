import HeroSection from "@/components/home/HeroSection";
import AgricultureIntelligence from "@/components/home/AgricultureIntelligence";
import EducationalResources from "@/components/home/EducationalResources";
import ExpertSection from "@/components/home/ExpertSection";
import FeaturePreview from "@/components/home/FeaturePreview";
import GrowSmarterCTA from "@/components/home/GrowSmarterCTA";
import JourneySection from "@/components/home/JourneySection";
import MarketplaceSection from "@/components/home/MarketplaceSection";
import ServicesSection from "@/components/home/ServicesSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AgricultureIntelligence />
      <EducationalResources />
      <ExpertSection />
      <FeaturePreview />
      <JourneySection />
      <MarketplaceSection />
      <ServicesSection />
      <GrowSmarterCTA />
    </main>
  );
}