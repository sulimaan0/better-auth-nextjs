"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { BookingCard } from "@/components/dashboard/booking-card";

interface BookingsTabsProps {
  upcomingBookings: any[];
  pastBookings: any[];
}

export function BookingsTabs({
  upcomingBookings,
  pastBookings,
}: BookingsTabsProps) {
  return (
    <Tabs defaultValue="upcoming" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="upcoming">Upcoming Bookings</TabsTrigger>
        <TabsTrigger value="past">Past Bookings</TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming" className="space-y-4">
        {upcomingBookings.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No upcoming bookings
              </h3>
              <p className="text-gray-600 mb-4">
                Book your next cleaning service to get started
              </p>
              <Button asChild>
                <Link href="/booking">Book Now</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          upcomingBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} type="upcoming" />
          ))
        )}
      </TabsContent>

      <TabsContent value="past" className="space-y-4">
        {pastBookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} type="past" />
        ))}
      </TabsContent>
    </Tabs>
  );
}
