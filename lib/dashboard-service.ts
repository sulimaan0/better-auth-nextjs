// lib/dashboard-service.ts
import prisma from "@/lib/prisma";
import { format } from "date-fns";

export async function getUserBookingsForDashboard(userId: string) {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        extras: {
          include: {
            extra: true,
          },
        },
      },
      orderBy: { date: "asc" },
    });

    // Transform database bookings to match your dashboard format
    const transformedBookings = bookings.map((booking) => ({
      id: booking.id,
      bookingId: booking.bookingId,
      service: formatServiceType(booking.serviceType),
      date: format(new Date(booking.date), "yyyy-MM-dd"),
      time: booking.time,
      cleaner: "Sarah Johnson", // You'll need to add cleaner assignment later
      cleanerImage: "/placeholder.svg?height=40&width=40",
      address: booking.address,
      status: booking.status.toLowerCase(),
      price: `£${booking.totalPrice}`,
      rating: booking.status === "COMPLETED" ? 5 : undefined, // Default rating for completed bookings
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,
      instructions: booking.instructions,
      bedrooms: booking.bedrooms,
      bathrooms: booking.bathrooms,
      extras: booking.extras.map((be) => be.extra.name),
    }));

    // Split into upcoming and past bookings
    const now = new Date();
    const upcomingBookings = transformedBookings.filter(
      (booking) => new Date(booking.date) >= now
    );
    const pastBookings = transformedBookings.filter(
      (booking) => new Date(booking.date) < now
    );

    return {
      upcomingBookings,
      pastBookings,
      totalBookings: bookings.length,
      stats: calculateStats(bookings),
    };
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return {
      upcomingBookings: [],
      pastBookings: [],
      totalBookings: 0,
      stats: { totalSpent: 0, averageRating: 0, moneySaved: 0 },
    };
  }
}

function formatServiceType(serviceType: string): string {
  switch (serviceType) {
    case "REGULAR":
      return "Regular Cleaning";
    case "DEEP":
      return "Deep Cleaning";
    case "TENANCY":
      return "End of Tenancy";
    case "OFFICE":
      return "Office Cleaning";
    default:
      return serviceType;
  }
}

function calculateStats(bookings: any[]) {
  const completedBookings = bookings.filter((b) => b.status === "COMPLETED");
  const totalSpent = bookings.reduce(
    (sum, booking) => sum + Number(booking.totalPrice),
    0
  );

  return {
    totalSpent: totalSpent,
    averageRating: 4.8, // You can calculate this based on actual ratings later
    moneySaved: Math.round(totalSpent * 0.15), // Assuming 15% savings compared to agencies
  };
}
