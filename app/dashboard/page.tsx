// app/dashboard/page.tsx
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { BookingsTabs } from "@/components/dashboard/bookings-tabs";
import { Footer } from "@/components/layout/footer";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { getUserBookingsForDashboard } from "@/lib/dashboard-service";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // Get the current user session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect to sign-in if not authenticated
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  // Fetch user's bookings from database
  const { upcomingBookings, pastBookings, totalBookings, stats } =
    await getUserBookingsForDashboard(session.user.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {session.user.name || "User"}!
            </h1>
            <p className="text-gray-600">
              {totalBookings === 0
                ? "Ready to book your first cleaning service?"
                : `You have ${upcomingBookings.length} upcoming bookings`}
            </p>
          </div>
          <Button
            className="mt-4 md:mt-0 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            asChild
          >
            <Link href="/booking">
              <Plus className="w-4 h-4 mr-2" />
              New Booking
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} totalBookings={totalBookings} />

        {/* Bookings Tabs */}
        <BookingsTabs
          upcomingBookings={upcomingBookings}
          pastBookings={pastBookings}
        />

        {/* Empty State */}
        {totalBookings === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No bookings yet
              </h3>
              <p className="text-gray-600 mb-6">
                Get started by booking your first cleaning service. It only
                takes a few minutes!
              </p>
              <Button
                asChild
                className="bg-gradient-to-r from-green-600 to-blue-600"
              >
                <Link href="/booking">Book Your First Cleaning</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}
