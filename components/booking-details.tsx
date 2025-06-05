"use client";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Star,
  User,
  Phone,
  Edit,
  Trash2,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  XCircle,
  MessageSquare,
  FileText,
} from "lucide-react";
import Link from "next/link";

interface BookingDetailsProps {
  bookingId: string;
}

export default function BookingDetails({ bookingId }: BookingDetailsProps) {
  // Mock booking data - in real app, fetch based on bookingId
  const booking = {
    id: "BK001",
    service: "Deep Cleaning",
    date: "2024-01-15",
    time: "10:00 AM",
    duration: "3 hours",
    cleaner: {
      name: "Emma Thompson",
      rating: 4.9,
      totalJobs: 156,
      phone: "+44 7987 654321",
      email: "emma.thompson@scrubly.com",
      photo: "/placeholder.svg?height=80&width=80",
      bio: "Professional cleaner with 5+ years experience. Specializes in deep cleaning and eco-friendly products.",
    },
    status: "completed",
    price: 149,
    address: "123 High Street, London, SW1A 1AA",
    addOns: ["Inside Oven", "Interior Windows"],
    notes: "Please focus on the kitchen and bathrooms. Keys are under the mat.",
    rating: 5,
    review: "Excellent service! Emma was thorough and professional.",
    paymentMethod: "•••• •••• •••• 4242",
    bookingDate: "2024-01-10",
    estimatedArrival: "10:00 AM",
    actualArrival: "9:58 AM",
    completedAt: "1:15 PM",
    beforePhotos: ["/placeholder.svg?height=200&width=300"],
    afterPhotos: ["/placeholder.svg?height=200&width=300"],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "upcoming":
        return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "pending":
        return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      case "cancelled":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      default:
        return "text-slate-400 bg-slate-400/10 border-slate-400/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5" />;
      case "upcoming":
        return <Clock className="w-5 h-5" />;
      case "pending":
        return <AlertCircle className="w-5 h-5" />;
      case "cancelled":
        return <XCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard">
          <Button
            variant="outline"
            className="mb-4 border-slate-600 text-slate-300 hover:border-violet-500 hover:text-violet-400 hover:bg-violet-500/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {booking.service}
            </h1>
            <p className="text-slate-300">Booking ID: {booking.id}</p>
          </div>
          <div className="flex items-center space-x-3">
            <span
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                booking.status
              )}`}
            >
              {getStatusIcon(booking.status)}
              <span className="capitalize">{booking.status}</span>
            </span>
            <div className="text-right">
              <p className="text-2xl font-bold text-violet-400">
                £{booking.price}
              </p>
              <p className="text-slate-400 text-sm">{booking.duration}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Information */}
          <div className="glass p-6 rounded-2xl border border-slate-600/30">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Calendar className="w-5 h-5 text-violet-400 mr-2" />
              Booking Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-slate-400 text-sm">Date & Time</p>
                  <p className="text-white font-medium">
                    {new Date(booking.date).toLocaleDateString("en-GB", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-slate-300">
                    {booking.time} ({booking.duration})
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Address</p>
                  <p className="text-white font-medium">{booking.address}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Booked On</p>
                  <p className="text-white font-medium">
                    {new Date(booking.bookingDate).toLocaleDateString("en-GB")}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {booking.status === "completed" && (
                  <>
                    <div>
                      <p className="text-slate-400 text-sm">Arrival Time</p>
                      <p className="text-white font-medium">
                        {booking.actualArrival}
                      </p>
                      <p className="text-emerald-400 text-sm">
                        2 minutes early
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Completed At</p>
                      <p className="text-white font-medium">
                        {booking.completedAt}
                      </p>
                    </div>
                  </>
                )}
                <div>
                  <p className="text-slate-400 text-sm">Payment Method</p>
                  <p className="text-white font-medium">
                    {booking.paymentMethod}
                  </p>
                </div>
              </div>
            </div>

            {booking.addOns.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-600/30">
                <p className="text-slate-400 text-sm mb-3">Add-ons</p>
                <div className="flex flex-wrap gap-2">
                  {booking.addOns.map((addOn) => (
                    <span
                      key={addOn}
                      className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full text-sm border border-violet-500/20"
                    >
                      {addOn}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {booking.notes && (
              <div className="mt-6 pt-6 border-t border-slate-600/30">
                <p className="text-slate-400 text-sm mb-2">
                  Special Instructions
                </p>
                <p className="text-white bg-slate-800/50 p-4 rounded-lg border border-slate-600/30">
                  {booking.notes}
                </p>
              </div>
            )}
          </div>

          {/* Photos */}
          {booking.status === "completed" &&
            (booking.beforePhotos || booking.afterPhotos) && (
              <div className="glass p-6 rounded-2xl border border-slate-600/30">
                <h2 className="text-xl font-semibold text-white mb-6">
                  Before & After Photos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {booking.beforePhotos && (
                    <div>
                      <p className="text-slate-400 text-sm mb-3">Before</p>
                      <div className="grid gap-3">
                        {booking.beforePhotos.map((photo, index) => (
                          <img
                            key={index}
                            src={photo || "/placeholder.svg"}
                            alt={`Before photo ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg border border-slate-600/30"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {booking.afterPhotos && (
                    <div>
                      <p className="text-slate-400 text-sm mb-3">After</p>
                      <div className="grid gap-3">
                        {booking.afterPhotos.map((photo, index) => (
                          <img
                            key={index}
                            src={photo || "/placeholder.svg"}
                            alt={`After photo ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg border border-slate-600/30"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          {/* Your Review */}
          {booking.status === "completed" && booking.rating && (
            <div className="glass p-6 rounded-2xl border border-slate-600/30">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Star className="w-5 h-5 text-violet-400 mr-2" />
                Your Review
              </h2>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-slate-300">Your Rating:</span>
                <div className="flex">
                  {[...Array(booking.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-amber-400 fill-current"
                    />
                  ))}
                </div>
                <span className="text-amber-400 font-medium">
                  {booking.rating}/5
                </span>
              </div>
              {booking.review && (
                <p className="text-slate-300 bg-slate-800/50 p-4 rounded-lg border border-slate-600/30 italic">
                  "{booking.review}"
                </p>
              )}
              <Button
                variant="outline"
                className="mt-4 border-slate-600 text-slate-300 hover:border-violet-500 hover:text-violet-400 hover:bg-violet-500/10"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Review
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cleaner Information */}
          <div className="glass p-6 rounded-2xl border border-slate-600/30">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <User className="w-5 h-5 text-violet-400 mr-2" />
              Your Cleaner
            </h2>
            <div className="text-center mb-6">
              <img
                src={booking.cleaner.photo || "/placeholder.svg"}
                alt={booking.cleaner.name}
                className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-violet-500/20"
              />
              <h3 className="text-lg font-semibold text-white">
                {booking.cleaner.name}
              </h3>
              <div className="flex items-center justify-center space-x-2 mt-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(booking.cleaner.rating)
                          ? "text-amber-400 fill-current"
                          : "text-slate-600"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-amber-400 font-medium">
                  {booking.cleaner.rating}
                </span>
                <span className="text-slate-400">
                  ({booking.cleaner.totalJobs} jobs)
                </span>
              </div>
            </div>
            <p className="text-slate-300 text-sm mb-6">{booking.cleaner.bio}</p>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:border-violet-500 hover:text-violet-400 hover:bg-violet-500/10"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Message
              </Button>
              <Button
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:border-violet-500 hover:text-violet-400 hover:bg-violet-500/10"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Cleaner
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="glass p-6 rounded-2xl border border-slate-600/30">
            <h2 className="text-xl font-semibold text-white mb-6">Actions</h2>
            <div className="space-y-3">
              {booking.status === "upcoming" && (
                <>
                  <Button
                    variant="outline"
                    className="w-full border-slate-600 text-slate-300 hover:border-blue-500 hover:text-blue-400 hover:bg-blue-500/10"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Reschedule
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-slate-600 text-slate-300 hover:border-red-500 hover:text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Cancel Booking
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:border-violet-500 hover:text-violet-400 hover:bg-violet-500/10"
              >
                <FileText className="w-4 h-4 mr-2" />
                Download Receipt
              </Button>
              <Button className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white">
                <Calendar className="w-4 h-4 mr-2" />
                Book Again
              </Button>
            </div>
          </div>

          {/* Support */}
          <div className="glass p-6 rounded-2xl border border-slate-600/30">
            <h2 className="text-xl font-semibold text-white mb-4">
              Need Help?
            </h2>
            <p className="text-slate-300 text-sm mb-4">
              Have questions about your booking? Our support team is here to
              help.
            </p>
            <Button
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:border-violet-500 hover:text-violet-400 hover:bg-violet-500/10"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
