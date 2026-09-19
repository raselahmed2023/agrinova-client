import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

import {
  enforcePublicRoleBoundary,
} from "@/lib/enforce-public-role-boundary";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await enforcePublicRoleBoundary();

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}