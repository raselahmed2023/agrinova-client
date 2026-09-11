"use client";

import type { ReactNode } from "react";

export default function MarketplaceBackground({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      {/* Background image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/images/marketplace-bg.jpg')",
        }}
      />

      {/* Readability overlay */}
      <div className="fixed inset-0 z-0 bg-white/35" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}