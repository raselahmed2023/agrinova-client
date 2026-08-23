import FarmerSidebar from "@/components/dashboard/FarmerSidebar";

export default function FarmerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F7F9F7]">
      <FarmerSidebar />

      <main className="min-w-0 flex-1">
        {children}
      </main>
    </div>
  );
}