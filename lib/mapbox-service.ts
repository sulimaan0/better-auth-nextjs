// lib/mapbox-service.ts
// First, create this file exactly as shown:

interface MapboxCoordinates {
  latitude: number;
  longitude: number;
}

interface MapboxGeocodeResponse {
  features: Array<{
    center: [number, number]; // [longitude, latitude]
    place_name: string;
    context?: Array<{
      id: string;
      text: string;
    }>;
  }>;
}

interface MapboxMatrixResponse {
  durations: number[][]; // in seconds
  distances: number[][]; // in meters
  code: string;
}

class MapboxService {
  private accessToken: string;
  private baseUrl = "https://api.mapbox.com";

  constructor() {
    this.accessToken = process.env.MAPBOX_ACCESS_TOKEN || "";
    if (!this.accessToken) {
      console.warn(
        "⚠️ MAPBOX_ACCESS_TOKEN not found - using fallback distance calculation"
      );
    }
  }

  async geocodePostcode(postcode: string): Promise<MapboxCoordinates | null> {
    try {
      // First check our local database
      const localResult = await this.getLocalPostcode(postcode);
      if (localResult) {
        console.log("📍 Using cached postcode coordinates");
        return localResult;
      }

      // If no Mapbox token, return null (will use fallback)
      if (!this.accessToken) {
        console.log("⚠️ No Mapbox token - skipping geocoding");
        return null;
      }

      // Use Mapbox Geocoding API
      console.log("🔍 Geocoding postcode with Mapbox:", postcode);

      const cleanPostcode = postcode.replace(/\s/g, "").toUpperCase();
      const url = `${
        this.baseUrl
      }/geocoding/v5/mapbox.places/${encodeURIComponent(cleanPostcode)}.json`;

      const response = await fetch(
        `${url}?access_token=${this.accessToken}&country=GB&types=postcode`
      );

      if (!response.ok) {
        throw new Error(`Mapbox API error: ${response.status}`);
      }

      const data: MapboxGeocodeResponse = await response.json();

      if (data.features.length === 0) {
        console.log("❌ No results found for postcode:", postcode);
        return null;
      }

      const feature = data.features[0];
      const [longitude, latitude] = feature.center;

      const coordinates = { latitude, longitude };

      // Cache the result in our local database
      await this.cachePostcode(cleanPostcode, coordinates, feature.place_name);

      console.log("✅ Geocoded successfully:", coordinates);
      return coordinates;
    } catch (error) {
      console.error("❌ Error geocoding postcode:", error);
      return null;
    }
  }

  async calculateTravelDistance(
    origin: MapboxCoordinates,
    destinations: MapboxCoordinates[]
  ): Promise<
    Array<{
      distance: number;
      duration: number;
      drivingDistance: number;
    } | null>
  > {
    try {
      if (destinations.length === 0) {
        return [];
      }

      // If no Mapbox token, use fallback
      if (!this.accessToken) {
        return destinations.map((dest) => {
          const straightLineDistance = this.calculateStraightLineDistance(
            origin,
            dest
          );
          return {
            distance: straightLineDistance,
            duration: Math.round(straightLineDistance * 3),
            drivingDistance: straightLineDistance * 1609.34,
          };
        });
      }

      console.log("🚗 Calculating travel distances with Mapbox Matrix API");

      const coordinates = [
        `${origin.longitude},${origin.latitude}`,
        ...destinations.map((dest) => `${dest.longitude},${dest.latitude}`),
      ].join(";");

      const url = `${this.baseUrl}/directions-matrix/v1/mapbox/driving/${coordinates}`;

      const response = await fetch(
        `${url}?access_token=${this.accessToken}&sources=0&annotations=distance,duration`
      );

      if (!response.ok) {
        throw new Error(`Mapbox Matrix API error: ${response.status}`);
      }

      const data: MapboxMatrixResponse = await response.json();

      if (data.code !== "Ok") {
        throw new Error(`Mapbox Matrix API returned: ${data.code}`);
      }

      return destinations.map((_, index) => {
        const distanceMeters = data.distances[0][index + 1];
        const durationSeconds = data.durations[0][index + 1];

        if (distanceMeters === null || durationSeconds === null) {
          return null;
        }

        const distanceMiles = distanceMeters * 0.000621371;
        const durationMinutes = durationSeconds / 60;

        return {
          distance: Math.round(distanceMiles * 10) / 10,
          duration: Math.round(durationMinutes),
          drivingDistance: distanceMeters,
        };
      });
    } catch (error) {
      console.error("❌ Error calculating travel distance:", error);
      // Fallback to straight-line distance
      return destinations.map((dest) => {
        const straightLineDistance = this.calculateStraightLineDistance(
          origin,
          dest
        );
        return {
          distance: straightLineDistance,
          duration: Math.round(straightLineDistance * 3),
          drivingDistance: straightLineDistance * 1609.34,
        };
      });
    }
  }

  private calculateStraightLineDistance(
    point1: MapboxCoordinates,
    point2: MapboxCoordinates
  ): number {
    const R = 3959; // Earth's radius in miles
    const dLat = (point2.latitude - point1.latitude) * (Math.PI / 180);
    const dLon = (point2.longitude - point1.longitude) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(point1.latitude * (Math.PI / 180)) *
        Math.cos(point2.latitude * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private async getLocalPostcode(
    postcode: string
  ): Promise<MapboxCoordinates | null> {
    try {
      const prisma = (await import("@/lib/prisma")).default;

      const result = await prisma.postcode.findUnique({
        where: { postcode: postcode.replace(/\s/g, "").toUpperCase() },
      });

      if (result) {
        return {
          latitude: result.latitude,
          longitude: result.longitude,
        };
      }

      return null;
    } catch (error) {
      console.error("Error accessing local postcode cache:", error);
      return null;
    }
  }

  private async cachePostcode(
    postcode: string,
    coordinates: MapboxCoordinates,
    placeName: string
  ): Promise<void> {
    try {
      const prisma = (await import("@/lib/prisma")).default;

      const district = placeName.split(",")[1]?.trim() || "";

      await prisma.postcode.upsert({
        where: { postcode },
        update: {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          district,
        },
        create: {
          postcode,
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          district,
          country: "UK",
        },
      });

      console.log("💾 Cached postcode in local database");
    } catch (error) {
      console.error("Error caching postcode:", error);
    }
  }

  isAvailable(): boolean {
    return !!this.accessToken;
  }
}

export const mapboxService = new MapboxService();

// lib/booking-service-with-mapbox.ts
// Replace your existing booking service with this version:

import prisma from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { mapboxService } from "./mapbox-service";
import type { ServiceType, Frequency, BookingStatus } from "@prisma/client";

// Keep all your existing interfaces and constants
export interface CreateBookingData {
  serviceType: string;
  frequency: string;
  bedrooms: string;
  bathrooms: string;
  address: string;
  postcode?: string;
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
  customerPreferences?: {
    preferredGender?: "male" | "female";
    previousCleanerId?: string;
    excludeCleanerIds?: string[];
  };
}

interface CleanerScore {
  cleaner: any;
  score: number;
  distance: number;
  duration?: number;
  availability: "available" | "busy" | "unavailable";
  workload: number;
  reasons: string[];
}

// Keep all your existing pricing constants
const EXTRA_PRICES = {
  oven: 15,
  fridge: 10,
  windows: 20,
  carpet: 25,
} as const;

const BASE_PRICES = {
  REGULAR: 15,
  DEEP: 25,
  TENANCY: 200,
  OFFICE: 30,
} as const;

// Keep all your existing helper functions
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
) {
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

  return {
    basePrice: new Decimal(basePrice),
    extrasPrice: new Decimal(extrasPrice),
    totalPrice: new Decimal(basePrice + extrasPrice),
  };
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

function extractPostcodeFromAddress(address: string): string {
  const postcodeRegex = /([A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2})/i;
  const match = address.match(postcodeRegex);
  return match ? match[1].toUpperCase().replace(/\s/g, "") : "UNKNOWN";
}

// Updated cleaner selection using Mapbox
export async function selectBestCleanerWithMapbox(
  postcode: string,
  date: Date,
  time: string,
  serviceType: string,
  customerPreferences?: {
    preferredGender?: "male" | "female";
    previousCleanerId?: string;
    excludeCleanerIds?: string[];
  }
) {
  try {
    console.log("🗺️ Starting Mapbox-powered cleaner selection");

    // Step 1: Get customer coordinates
    const customerCoords = await mapboxService.geocodePostcode(postcode);
    if (!customerCoords) {
      console.log("❌ Could not geocode postcode, using fallback method");
      // You can fall back to your original method here if needed
      return { success: false, message: "Could not locate postcode" };
    }

    // Step 2: Find potential cleaners (keep your existing function)
    const potentialCleaners = await findPotentialCleaners(date, serviceType);
    console.log(`📋 Found ${potentialCleaners.length} potential cleaners`);

    if (potentialCleaners.length === 0) {
      return { success: false, message: "No cleaners available" };
    }

    // Step 3: Get coordinates for cleaners who have them
    const cleanersWithCoords = potentialCleaners
      .filter((cleaner) => cleaner.latitude && cleaner.longitude)
      .map((cleaner) => ({
        cleaner,
        coordinates: {
          latitude: cleaner.latitude,
          longitude: cleaner.longitude,
        },
      }));

    if (cleanersWithCoords.length === 0) {
      return { success: false, message: "No cleaners with valid locations" };
    }

    // Step 4: Calculate real distances using Mapbox
    console.log("🚗 Calculating driving distances...");
    const destinations = cleanersWithCoords.map((c) => c.coordinates);
    const travelData = await mapboxService.calculateTravelDistance(
      customerCoords,
      destinations
    );

    // Step 5: Combine cleaner data with travel info
    const cleanersWithTravel = cleanersWithCoords.map((cleanerData, index) => {
      const travel = travelData[index];
      return {
        cleaner: cleanerData.cleaner,
        distance: travel?.distance || 999,
        duration: travel?.duration || 999,
        drivingDistance: travel?.drivingDistance || 999999,
      };
    });

    // Step 6: Filter by working radius
    const cleanersInRange = cleanersWithTravel.filter((c) => {
      const radiusMeters = c.cleaner.workingRadius * 1609.34; // Convert miles to meters
      return c.drivingDistance <= radiusMeters;
    });

    if (cleanersInRange.length === 0) {
      return { success: false, message: "No cleaners available in your area" };
    }

    // Step 7: Score cleaners with enhanced algorithm
    const scoredCleaners = scoreCleanersWithMapbox(
      cleanersInRange,
      date,
      time,
      serviceType,
      customerPreferences
    );

    // Step 8: Rank and return
    const rankedCleaners = scoredCleaners
      .filter((c) => c.availability === "available")
      .sort((a, b) => b.score - a.score);

    console.log("📊 Mapbox-powered cleaner rankings:");
    rankedCleaners.forEach((c, i) => {
      const durationText = c.duration ? ` (${c.duration}min drive)` : "";
      console.log(
        `${i + 1}. ${c.cleaner.user.name} - ${
          c.distance
        }mi${durationText} - Score: ${c.score}`
      );
    });

    if (rankedCleaners.length === 0) {
      return { success: false, message: "No available cleaners found" };
    }

    const selectedCleaner = rankedCleaners[0];

    return {
      success: true,
      cleaner: selectedCleaner.cleaner,
      score: selectedCleaner.score,
      distance: selectedCleaner.distance,
      drivingTime: selectedCleaner.duration,
      reasons: selectedCleaner.reasons,
      alternatives: rankedCleaners.slice(1, 3),
    };
  } catch (error) {
    console.error("❌ Error in Mapbox cleaner selection:", error);
    return { success: false, message: "Failed to find cleaners" };
  }
}

// Keep your existing helper functions
async function findPotentialCleaners(date: Date, serviceType: string) {
  const dayOfWeek = date.getDay();

  return await prisma.cleanerProfile.findMany({
    where: {
      isActive: true,
      isAvailable: true,
      availability: {
        some: {
          dayOfWeek,
          isAvailable: true,
        },
      },
    },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
      availability: { where: { dayOfWeek, isAvailable: true } },
      assignedBookings: {
        where: {
          date: {
            gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
            lt: new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate() + 1
            ),
          },
          status: { in: ["PENDING", "CONFIRMED", "ASSIGNED", "IN_PROGRESS"] },
        },
        select: { id: true, time: true, estimatedDuration: true, status: true },
      },
      _count: {
        select: {
          assignedBookings: {
            where: {
              date: {
                gte: new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate()
                ),
                lt: new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate() + 1
                ),
              },
              status: {
                in: ["PENDING", "CONFIRMED", "ASSIGNED", "IN_PROGRESS"],
              },
            },
          },
        },
      },
    },
  });
}

function checkTimeAvailability(
  cleaner: any,
  requestedTime: string,
  date: Date
) {
  const dayAvailability = cleaner.availability[0];

  if (!dayAvailability) {
    return {
      availability: "unavailable" as const,
      availabilityScore: 0,
      availabilityReason: "Not working this day",
    };
  }

  const requestedHour = parseInt(requestedTime.split(":")[0]);
  const startHour = parseInt(dayAvailability.startTime.split(":")[0]);
  const endHour = parseInt(dayAvailability.endTime.split(":")[0]);

  if (requestedHour < startHour || requestedHour >= endHour) {
    return {
      availability: "unavailable" as const,
      availabilityScore: 0,
      availabilityReason: `Outside working hours (${dayAvailability.startTime}-${dayAvailability.endTime})`,
    };
  }

  const hasConflict = cleaner.assignedBookings.some((booking: any) => {
    const bookingHour = parseInt(booking.time.split(":")[0]);
    const duration = booking.estimatedDuration || 120;
    const endTime = bookingHour + duration / 60;
    return requestedHour >= bookingHour && requestedHour < endTime;
  });

  if (hasConflict) {
    return {
      availability: "busy" as const,
      availabilityScore: 0,
      availabilityReason: "Time slot already booked",
    };
  }

  return {
    availability: "available" as const,
    availabilityScore: 30,
    availabilityReason: `Available ${dayAvailability.startTime}-${dayAvailability.endTime} (+30 pts)`,
  };
}

function calculateWorkloadScore(bookingCount: number): number {
  if (bookingCount === 0) return 20;
  if (bookingCount === 1) return 15;
  if (bookingCount === 2) return 10;
  if (bookingCount === 3) return 5;
  return 0;
}

function scoreCleanersWithMapbox(
  cleaners: any[],
  date: Date,
  time: string,
  serviceType: string,
  preferences?: any
): CleanerScore[] {
  return cleaners.map((cleanerData) => {
    let score = 0;
    const reasons: string[] = [];
    const { cleaner, distance, duration } = cleanerData;

    // Enhanced distance scoring with driving time
    const distanceScore = Math.max(0, 40 - distance * 2);
    score += distanceScore;

    const timeText = duration ? ` in ${duration}min` : "";
    reasons.push(
      `Distance: ${distance}mi${timeText} (+${distanceScore.toFixed(0)} pts)`
    );

    // Availability check
    const { availability, availabilityScore, availabilityReason } =
      checkTimeAvailability(cleaner, time, date);

    score += availabilityScore;
    reasons.push(availabilityReason);

    if (availability !== "available") {
      return {
        cleaner,
        score: 0,
        distance,
        duration,
        availability,
        workload: cleaner._count?.assignedBookings || 0,
        reasons,
      };
    }

    // Workload scoring
    const workloadScore = calculateWorkloadScore(
      cleaner._count?.assignedBookings || 0
    );
    score += workloadScore;
    reasons.push(
      `Workload: ${
        cleaner._count?.assignedBookings || 0
      } bookings (+${workloadScore} pts)`
    );

    // Quick arrival bonus (new with Mapbox!)
    if (duration) {
      const timeBonus = Math.max(0, 10 - duration / 5);
      score += timeBonus;
      reasons.push(`Quick arrival (+${timeBonus.toFixed(0)} pts)`);
    }

    // Experience score
    const experienceScore = 10;
    score += experienceScore;
    reasons.push(`Experience (+${experienceScore} pts)`);

    // Customer preferences
    if (preferences?.previousCleanerId === cleaner.id) {
      score += 5;
      reasons.push("Previous cleaner (+5 pts)");
    }

    if (preferences?.excludeCleanerIds?.includes(cleaner.id)) {
      return {
        cleaner,
        score: 0,
        distance,
        duration,
        availability: "unavailable" as const,
        workload: cleaner._count?.assignedBookings || 0,
        reasons: ["Excluded by customer"],
      };
    }

    return {
      cleaner,
      score: Math.round(score),
      distance,
      duration,
      availability: "available" as const,
      workload: cleaner._count?.assignedBookings || 0,
      reasons,
    };
  });
}

// Strategy for regular customers
export async function selectCleanerForRegularCustomer(
  bookingData: any,
  customerId: string
) {
  const previousBookings = await prisma.booking.findMany({
    where: { userId: customerId, assignedCleanerId: { not: null } },
    orderBy: { date: "desc" },
    take: 3,
    select: { assignedCleanerId: true },
  });

  const previousCleanerIds = previousBookings
    .map((b) => b.assignedCleanerId)
    .filter(Boolean);
  const mostRecentCleanerId = previousCleanerIds[0];

  return await selectBestCleanerWithMapbox(
    bookingData.postcode,
    bookingData.date,
    bookingData.time,
    bookingData.serviceType,
    { previousCleanerId: mostRecentCleanerId }
  );
}

// Main booking function (replace your existing one)
export async function createBookingWithCleanerAssignment(
  data: CreateBookingData
) {
  try {
    console.log("🔄 Starting booking creation with Mapbox cleaner assignment");

    // Validate and convert data (keep existing logic)
    const serviceType = data.serviceType.toUpperCase() as ServiceType;
    const frequency = data.frequency
      .toUpperCase()
      .replace("-", "_") as Frequency;
    const bedrooms = Number.parseInt(data.bedrooms);
    const bathrooms = Number.parseInt(data.bathrooms);
    const postcode = data.postcode || extractPostcodeFromAddress(data.address);

    // Calculate pricing (keep existing logic)
    const { basePrice, extrasPrice, totalPrice } = calculatePricing(
      data.serviceType,
      bedrooms,
      bathrooms,
      data.extras
    );

    console.log("💰 Calculated pricing:", {
      basePrice: basePrice.toString(),
      extrasPrice: extrasPrice.toString(),
      totalPrice: totalPrice.toString(),
    });

    // Find cleaner using Mapbox (NEW!)
    console.log("🗺️ Finding best cleaner with Mapbox...");

    let cleanerSelection;
    if (data.userId) {
      cleanerSelection = await selectCleanerForRegularCustomer(
        {
          postcode,
          date: data.date,
          time: data.time,
          serviceType: data.serviceType,
        },
        data.userId
      );
    } else {
      cleanerSelection = await selectBestCleanerWithMapbox(
        postcode,
        data.date,
        data.time,
        data.serviceType,
        data.customerPreferences
      );
    }

    // Create booking (keep existing transaction logic)
    const result = await prisma.$transaction(async (tx) => {
      const newBooking = await tx.booking.create({
        data: {
          serviceType,
          frequency,
          bedrooms,
          bathrooms,
          address: data.address,
          postcode,
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
          assignedCleanerId: cleanerSelection.success
            ? cleanerSelection.cleaner.id
            : null,
          assignedAt: cleanerSelection.success ? new Date() : null,
        },
      });

      // Add extras (keep existing logic)
      if (data.extras.length > 0) {
        for (const extraId of data.extras) {
          await tx.extra.upsert({
            where: { id: extraId },
            update: {},
            create: {
              id: extraId,
              name: getExtraName(extraId),
              price: new Decimal(
                EXTRA_PRICES[extraId as keyof typeof EXTRA_PRICES] || 0
              ),
            },
          });
        }

        await tx.bookingExtra.createMany({
          data: data.extras.map((extraId) => ({
            bookingId: newBooking.id,
            extraId,
          })),
        });
      }

      return newBooking;
    });

    // Fetch complete booking
    const completeBooking = await prisma.booking.findUnique({
      where: { id: result.id },
      include: {
        user: true,
        assignedCleaner: {
          include: { user: { select: { id: true, name: true, image: true } } },
        },
        extras: { include: { extra: true } },
      },
    });

    // Return enhanced result with Mapbox data
    return {
      success: true,
      booking: completeBooking,
      message: `Booking created successfully! Your booking ID is ${result.bookingId}`,
      cleanerAssignment: {
        success: cleanerSelection.success,
        cleaner: cleanerSelection.success
          ? {
              id: cleanerSelection.cleaner.id,
              name: cleanerSelection.cleaner.user.name,
              image: cleanerSelection.cleaner.user.image,
              distance: cleanerSelection.distance?.toFixed(1),
              drivingTime: cleanerSelection.drivingTime, // NEW: Real driving time!
              score: cleanerSelection.score,
              reasons: cleanerSelection.reasons,
            }
          : null,
        message: cleanerSelection.success
          ? `Assigned to ${cleanerSelection.cleaner.user.name}`
          : cleanerSelection.message,
        alternatives:
          cleanerSelection.alternatives?.slice(0, 2).map((alt) => ({
            id: alt.cleaner.id,
            name: alt.cleaner.user.name,
            distance: alt.distance.toFixed(1),
            drivingTime: alt.duration,
            score: alt.score,
          })) || [],
      },
    };
  } catch (error) {
    console.error("❌ Error creating booking with Mapbox:", error);
    return {
      success: false,
      error: "Failed to create booking. Please try again.",
    };
  }
}
