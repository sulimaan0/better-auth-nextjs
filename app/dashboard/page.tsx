import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { BookingsTabs } from "@/components/dashboard/bookings-tabs";
import { Footer } from "@/components/layout/footer";

const upcomingBookings = [
  {
    id: 1,
    service: "Regular Cleaning",
    date: "2024-01-15",
    time: "10:00 AM",
    cleaner: "Sarah Johnson",
    cleanerImage: "/placeholder.svg?height=40&width=40",
    address: "123 Oak Street, London SW1A 1AA",
    status: "confirmed",
    price: "£45.00",
  },
  {
    id: 2,
    service: "Deep Cleaning",
    date: "2024-01-22",
    time: "2:00 PM",
    cleaner: "Mike Chen",
    cleanerImage: "/placeholder.svg?height=40&width=40",
    address: "123 Oak Street, London SW1A 1AA",
    status: "pending",
    price: "£85.00",
  },
];

const pastBookings = [
  {
    id: 3,
    service: "Regular Cleaning",
    date: "2024-01-08",
    time: "10:00 AM",
    cleaner: "Sarah Johnson",
    cleanerImage: "/placeholder.svg?height=40&width=40",
    address: "123 Oak Street, London SW1A 1AA",
    status: "completed",
    price: "£45.00",
    rating: 5,
  },
  {
    id: 4,
    service: "End of Tenancy",
    date: "2023-12-20",
    time: "9:00 AM",
    cleaner: "Emma Wilson",
    cleanerImage: "/placeholder.svg?height=40&width=40",
    address: "456 Pine Avenue, London SW2B 2BB",
    status: "completed",
    price: "£200.00",
    rating: 4,
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your cleaning bookings and preferences
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
        <StatsCards />

        {/* Bookings Tabs */}
        <BookingsTabs
          upcomingBookings={upcomingBookings}
          pastBookings={pastBookings}
        />
      </div>
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}
