import Header from "@/components/header";
import BookingForm from "@/components/booking-form";
import Footer from "@/components/footer";

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-white mb-4">
              Book Your Cleaning Service
            </h1>
            <p className="text-lg text-slate-300">
              Complete your booking in just a few simple steps
            </p>
          </div>
          <BookingForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
