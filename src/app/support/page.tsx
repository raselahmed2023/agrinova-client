import React from 'react'
import  Navbar  from '@/components/shared/Navbar';
import SupportHero from '@/components/support/SupportHero';
import HowItWorks from '@/components/support/HowItWorks';
import SupportBenefits from '@/components/support/SupportBenefits';

export default function page() {
  return (
   <div>
     <Navbar/>
    <SupportHero/>
    <HowItWorks/>
    <SupportBenefits/>
   </div>
  )
}
