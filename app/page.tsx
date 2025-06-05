import { auth } from "@/auth";
import { headers } from "next/headers";
import Header from "@/components/header";
import Hero from "@/components/hero";
import HowItWorks from "@/components/how-it-works";
import Reviews from "@/components/reviews";
import Footer from "@/components/footer";
import { AuthProvider } from "@/context/AuthContext";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <AuthProvider initialSession={session}>
      <div>
        <Header />
        <main>
          <Hero />
          <HowItWorks />
          <Reviews />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
