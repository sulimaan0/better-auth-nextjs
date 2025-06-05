import Header from "@/components/header";
import BookingDetails from "@/components/booking-details";
import Footer from "@/components/footer";

interface BookingPageProps {
  params: {
    id: string;
  };
}

export default function BookingPage({ params }: BookingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <main className="pt-20 pb-16">
        <BookingDetails bookingId={params.id} />
      </main>
      <Footer />
    </div>
  );
}
