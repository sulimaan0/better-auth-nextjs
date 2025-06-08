// components/dashboard/booking-card.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Star,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import Link from "next/link";

interface BookingCardProps {
  booking: {
    id: string;
    bookingId: string;
    service: string;
    date: string;
    time: string;
    cleaner: string;
    cleanerImage: string;
    address: string;
    status: string;
    price: string;
    rating?: number;
  };
  type: "upcoming" | "past";
}

export function BookingCard({ booking, type }: BookingCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {booking.service}
                </h3>
                <Badge
                  className={`${getStatusColor(booking.status)} shadow-sm`}
                >
                  {booking.status.charAt(0).toUpperCase() +
                    booking.status.slice(1)}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-green-600">
                  {booking.price}
                </p>
                <p className="text-sm text-gray-500">
                  ID: {booking.bookingId.split("-").pop()}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(booking.date).toLocaleDateString("en-GB", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{booking.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{booking.address}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 shadow-md">
                    <AvatarImage
                      src={booking.cleanerImage || "/placeholder.svg"}
                      alt={booking.cleaner}
                    />
                    <AvatarFallback>
                      {booking.cleaner
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {booking.cleaner}
                    </p>
                    {type === "past" && booking.rating && (
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < booking.rating!
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {type === "upcoming" && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>Contact available 24h before</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4 md:mt-0 md:ml-6">
            {/* View Details Button - Available for all bookings */}
            <Button
              variant="outline"
              size="sm"
              asChild
              className="transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-md"
            >
              <Link href={`/booking/${booking.bookingId}`}>
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Link>
            </Button>

            {type === "upcoming" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-md"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-md"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </>
            )}
            {type === "past" && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-md"
              >
                <Link href="/booking">Book Again</Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
