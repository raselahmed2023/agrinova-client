import EducationalResources from "@/components/home/EducationalResources";
import GrowSmarterCTA from "@/components/home/GrowSmarterCTA";
import JourneySection from "@/components/home/JourneySection";
import Footer from "@/components/shared/Footer";


export default function Home() {
  return (
    <div>
      <EducationalResources/> 
      <JourneySection/>
      <GrowSmarterCTA/>
    </div>
  );
}
