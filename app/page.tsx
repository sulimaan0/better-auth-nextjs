import { auth } from "@/auth";
import { headers } from "next/headers";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturesSection } from "@/components/home/features-section";
import { ServicesSection } from "@/components/home/services-section";
import { CTASection } from "@/components/home/cta-section";
import { Footer } from "@/components/layout/footer";
import { AuthProvider } from "@/context/AuthContext";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <AuthProvider initialSession={session}>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <HeroSection />
      <FeaturesSection />
      <ServicesSection />
      <CTASection />
      <Footer />
    </div>
    </AuthProvider>
  );
}
