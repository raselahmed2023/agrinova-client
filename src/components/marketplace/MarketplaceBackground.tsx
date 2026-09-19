import type {
  ReactNode,
} from "react";

export default function MarketplaceBackground({
  children,
  overlayClassName = "bg-white/35",
}: {
  children: ReactNode;
  overlayClassName?: string;
}) {
  return (
    <div className="relative min-h-screen">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/images/marketplace-bg.jpg')",
        }}
      />

      <div
        className={`fixed inset-0 z-0 ${overlayClassName}`}
      />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}