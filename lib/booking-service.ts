import { prisma } from "@/lib/prisma";
import type { ServiceType, Frequency, BookingStatus } from "@prisma/client";

export interface CreateBookingData {
  serviceType: string;
  frequency: string;
  bedrooms: string;
  bathrooms: string;
  address: string;
  instructions?: string;
  date: Date;
  time: string;
  extras: string[];
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  userId?: string;
}

// Extra pricing configuration
const EXTRA_PRICES = {
  oven: 15,
  fridge: 10,
  windows: 20,
  carpet: 25,
} as const;

// Base pricing configuration
const BASE_PRICES = {
  REGULAR: 15, // per hour
  DEEP: 25, // per hour
  TENANCY: 200, // flat rate
  OFFICE: 30, // per hour
} as const;

function calculateEstimatedHours(
  serviceType: string,
  bedrooms: number,
  bathrooms: number
): number {
  const bedroomHours = bedrooms * 0.5;
  const bathroomHours = bathrooms * 0.75;
  const baseHours = serviceType === "DEEP" ? 2 : 1;

  return Math.max(2, bedroomHours + bathroomHours + baseHours);
}

function calculatePricing(
  serviceType: string,
  bedrooms: number,
  bathrooms: number,
  extras: string[]
): { basePrice: number; extrasPrice: number; totalPrice: number } {
  const serviceTypeKey = serviceType.toUpperCase() as keyof typeof BASE_PRICES;
  const hourlyRate = BASE_PRICES[serviceTypeKey] || BASE_PRICES.REGULAR;

  let basePrice: number;

  if (serviceType === "TENANCY") {
    basePrice = BASE_PRICES.TENANCY;
  } else {
    const estimatedHours = calculateEstimatedHours(
      serviceType,
      bedrooms,
      bathrooms
    );
    basePrice = hourlyRate * estimatedHours;
  }

  const extrasPrice = extras.reduce((total, extraId) => {
    const price = EXTRA_PRICES[extraId as keyof typeof EXTRA_PRICES] || 0;
    return total + price;
  }, 0);

  const totalPrice = basePrice + extrasPrice;

  return { basePrice, extrasPrice, totalPrice };
}

export async function createBooking(data: CreateBookingData) {
  try {
    // Validate and convert data
    const serviceType = data.serviceType.toUpperCase() as ServiceType;
    const frequency = data.frequency
      .toUpperCase()
      .replace("-", "_") as Frequency;
    const bedrooms = Number.parseInt(data.bedrooms);
    const bathrooms = Number.parseInt(data.bathrooms);

    // Calculate pricing
    const { basePrice, extrasPrice, totalPrice } = calculatePricing(
      data.serviceType,
      bedrooms,
      bathrooms,
      data.extras
    );

    // Create booking with transaction to ensure data consistency
    const booking = await prisma.$transaction(async (tx) => {
      // Create the booking
      const newBooking = await tx.booking.create({
        data: {
          serviceType,
          frequency,
          bedrooms,
          bathrooms,
          address: data.address,
          instructions: data.instructions || null,
          date: data.date,
          time: data.time,
          basePrice,
          extrasPrice,
          totalPrice,
          customerName: data.contactInfo.name,
          customerEmail: data.contactInfo.email,
          customerPhone: data.contactInfo.phone,
          userId: data.userId || null,
          status: "PENDING" as BookingStatus,
        },
      });

      // Add extras if any
      if (data.extras.length > 0) {
        // First, ensure all extras exist in the database
        for (const extraId of data.extras) {
          await tx.extra.upsert({
            where: { id: extraId },
            update: {},
            create: {
              id: extraId,
              name: getExtraName(extraId),
              price: EXTRA_PRICES[extraId as keyof typeof EXTRA_PRICES] || 0,
            },
          });
        }

        // Create booking-extra relationships
        await tx.bookingExtra.createMany({
          data: data.extras.map((extraId) => ({
            bookingId: newBooking.id,
            extraId,
          })),
        });
      }

      return newBooking;
    });

    // Fetch the complete booking with relations
    const completeBooking = await prisma.booking.findUnique({
      where: { id: booking.id },
      include: {
        user: true,
        extras: {
          include: {
            extra: true,
          },
        },
      },
    });

    return {
      success: true,
      booking: completeBooking,
      message: `Booking created successfully! Your booking ID is ${booking.bookingId}`,
    };
  } catch (error) {
    console.error("Error creating booking:", error);
    return {
      success: false,
      error: "Failed to create booking. Please try again.",
    };
  }
}

function getExtraName(extraId: string): string {
  const names = {
    oven: "Oven Cleaning",
    fridge: "Fridge Cleaning",
    windows: "Window Cleaning",
    carpet: "Carpet Cleaning",
  };
  return names[extraId as keyof typeof names] || extraId;
}

export async function getBookingById(bookingId: string) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { bookingId },
      include: {
        user: true,
        extras: {
          include: {
            extra: true,
          },
        },
      },
    });

    return booking;
  } catch (error) {
    console.error("Error fetching booking:", error);
    return null;
  }
}

export async function getUserBookings(userId: string) {
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
      orderBy: { createdAt: "desc" },
    });

    return bookings;
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return [];
  }
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus
) {
  try {
    const booking = await prisma.booking.update({
      where: { bookingId },
      data: { status },
    });

    return { success: true, booking };
  } catch (error) {
    console.error("Error updating booking status:", error);
    return { success: false, error: "Failed to update booking status" };
  }
}
