"use client";

import React, { useState } from "react";
import SupportHero from "@/components/support/SupportHero";
import HowItWorks from "@/components/support/HowItWorks";
import SupportBenefits from "@/components/support/SupportBenefits";
import SubmissionStatusFlow from "@/components/support/SubmissionStatusFlow";
import ProduceSubmissionModal from "@/components/support/ProduceSubmissionModal";

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div>

      <SupportHero onSubmitClick={handleOpenModal} />
      <HowItWorks />
      <SupportBenefits />
      <SubmissionStatusFlow onSubmitClick={handleOpenModal} />

      {/* Modal Component */}
      <ProduceSubmissionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}