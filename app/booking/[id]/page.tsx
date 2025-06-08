// app/booking/[id]/page.tsx
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { getBookingById } from "@/lib/booking-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Home,
  CheckCircle,
  AlertCircle,
  Star,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

// Updated interface for Next.js 15+ - params is now a Promise
interface BookingPageProps {
  params: Promise<{
    id: string;
  }>;
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "completed":
      return "bg-blue-100 text-blue-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "in_progress":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
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

function getStatusIcon(status: string) {
  switch (status.toLowerCase()) {
    case "confirmed":
    case "completed":
      return <CheckCircle className="h-4 w-4" />;
    case "pending":
      return <Clock className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
}

// Component is now async and awaits params
export default async function BookingDetailsPage({ params }: BookingPageProps) {
  // Await the params Promise
  const { id } = await params;

  // Get current session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Fetch the booking by ID
  const booking = await getBookingById(id);

  // Handle booking not found
  if (!booking) {
    notFound();
  }

  // Check if user owns this booking or is admin
  if (booking.userId && session?.user?.id !== booking.userId) {
    notFound(); // Don't show other users' bookings
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Link
              href="/dashboard"
              className="text-green-600 hover:text-green-700"
            >
              ← Back to Dashboard
            </Link>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Booking Details
              </h1>
              <p className="text-gray-600">
                Booking ID:{" "}
                <span className="font-medium">{booking.bookingId}</span>
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Badge
                className={`${getStatusColor(
                  booking.status
                )} flex items-center gap-1`}
              >
                {getStatusIcon(booking.status)}
                {booking.status.charAt(0).toUpperCase() +
                  booking.status.slice(1).toLowerCase()}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Service Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Service Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Service Type</p>
                <p className="font-medium">
                  {formatServiceType(booking.serviceType)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Frequency</p>
                <p className="font-medium">
                  {booking.frequency.replace("_", "-").toLowerCase()}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Bedrooms</p>
                  <p className="font-medium">{booking.bedrooms}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bathrooms</p>
                  <p className="font-medium">{booking.bathrooms}</p>
                </div>
              </div>
              {booking.extras && booking.extras.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Extra Services</p>
                  <div className="flex flex-wrap gap-2">
                    {booking.extras.map((bookingExtra, index) => (
                      <Badge key={index} variant="outline">
                        {bookingExtra.extra.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Date & Time */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Appointment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium">
                  {format(new Date(booking.date), "EEEE, MMMM d, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-medium">{booking.time}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium">{booking.address}</p>
              </div>
              {booking.instructions && (
                <div>
                  <p className="text-sm text-gray-600">Special Instructions</p>
                  <p className="font-medium text-sm bg-gray-50 p-2 rounded">
                    {booking.instructions}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{booking.customerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{booking.customerEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{booking.customerPhone}</span>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Base Price</span>
                <span className="font-medium">
                  £{booking.basePrice.toString()}
                </span>
              </div>
              {Number(booking.extrasPrice) > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Extras</span>
                  <span className="font-medium">
                    £{booking.extrasPrice.toString()}
                  </span>
                </div>
              )}
              <hr />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-green-600">
                  £{booking.totalPrice.toString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 justify-center">
          <Button variant="outline" asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
          {booking.status === "PENDING" && (
            <>
              <Button variant="outline">Reschedule</Button>
              <Button variant="destructive">Cancel Booking</Button>
            </>
          )}
          {booking.status === "COMPLETED" && <Button>Book Again</Button>}
        </div>

        {/* Booking Timeline */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Booking Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Booking Created</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(booking.createdAt), "PPp")}
                  </p>
                </div>
              </div>
              {booking.status === "CONFIRMED" && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Booking Confirmed</p>
                    <p className="text-sm text-gray-600">Ready for service</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
