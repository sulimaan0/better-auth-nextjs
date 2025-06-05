import Header from "@/components/header";
import DashboardContent from "@/components/dashboard-content";
import Footer from "@/components/footer";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <main className="pt-20 pb-16">
        <DashboardContent />
      </main>
      <Footer />
    </div>
  );
}
