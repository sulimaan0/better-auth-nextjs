// lib/cleaner-selection-service.ts

import prisma from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

interface CleanerScore {
  cleaner: any;
  score: number;
  distance: number;
  availability: "available" | "busy" | "unavailable";
  workload: number;
  reasons: string[];
}

/**
 * CLEANER SELECTION ALGORITHM
 *
 * Priority Order:
 * 1. AVAILABILITY - Can they work on this day/time?
 * 2. LOCATION - Are they within working radius?
 * 3. WORKLOAD - How busy are they?
 * 4. DISTANCE - How close are they?
 * 5. RATING - How well-rated are they?
 * 6. PREFERENCES - Customer/cleaner preferences
 */

export async function selectBestCleaner(
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
    console.log("🔍 Starting cleaner selection for:", {
      postcode,
      date,
      time,
      serviceType,
    });

    // Step 1: Get coordinates for the booking location
    const coordinates = await getCoordinatesFromPostcode(postcode);
    if (!coordinates) {
      console.log("❌ No coordinates found for postcode:", postcode);
      return { success: false, message: "Location not serviceable" };
    }

    // Step 2: Find all potentially available cleaners
    const potentialCleaners = await findPotentialCleaners(date, serviceType);
    console.log(`📋 Found ${potentialCleaners.length} potential cleaners`);

    if (potentialCleaners.length === 0) {
      return { success: false, message: "No cleaners available" };
    }

    // Step 3: Score and rank each cleaner
    const scoredCleaners = await scoreCleaners(
      potentialCleaners,
      coordinates,
      date,
      time,
      serviceType,
      customerPreferences
    );

    // Step 4: Sort by score (highest first)
    const rankedCleaners = scoredCleaners
      .filter((c) => c.availability === "available")
      .sort((a, b) => b.score - a.score);

    console.log("📊 Cleaner rankings:");
    rankedCleaners.forEach((c, i) => {
      console.log(
        `${i + 1}. ${c.cleaner.user.name} - Score: ${
          c.score
        } - ${c.reasons.join(", ")}`
      );
    });

    if (rankedCleaners.length === 0) {
      return { success: false, message: "No available cleaners found" };
    }

    // Step 5: Return the best cleaner
    const selectedCleaner = rankedCleaners[0];

    return {
      success: true,
      cleaner: selectedCleaner.cleaner,
      score: selectedCleaner.score,
      distance: selectedCleaner.distance,
      reasons: selectedCleaner.reasons,
      alternatives: rankedCleaners.slice(1, 3), // Top 2 alternatives
    };
  } catch (error) {
    console.error("❌ Error in cleaner selection:", error);
    return { success: false, message: "Failed to select cleaner" };
  }
}

// Step 1: Find potentially available cleaners
async function findPotentialCleaners(date: Date, serviceType: string) {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.

  return await prisma.cleanerProfile.findMany({
    where: {
      isActive: true,
      isAvailable: true,
      // Must be available on this day of week
      availability: {
        some: {
          dayOfWeek,
          isAvailable: true,
        },
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      availability: {
        where: {
          dayOfWeek,
          isAvailable: true,
        },
      },
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
          status: {
            in: ["PENDING", "CONFIRMED", "ASSIGNED", "IN_PROGRESS"],
          },
        },
        select: {
          id: true,
          time: true,
          estimatedDuration: true,
          status: true,
        },
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

// Step 2: Score each cleaner based on multiple factors
async function scoreCleaners(
  cleaners: any[],
  coordinates: { lat: number; lon: number },
  date: Date,
  time: string,
  serviceType: string,
  preferences?: any
): Promise<CleanerScore[]> {
  return cleaners.map((cleaner) => {
    let score = 0;
    const reasons: string[] = [];

    // FACTOR 1: DISTANCE (0-40 points)
    const distance = calculateDistance(
      coordinates.lat,
      coordinates.lon,
      cleaner.latitude || 0,
      cleaner.longitude || 0
    );

    const withinRadius = distance <= cleaner.workingRadius;
    if (!withinRadius) {
      return {
        cleaner,
        score: 0,
        distance,
        availability: "unavailable" as const,
        workload: cleaner._count.assignedBookings,
        reasons: ["Outside working radius"],
      };
    }

    // Distance scoring: closer = better (max 40 points)
    const distanceScore = Math.max(0, 40 - distance * 2);
    score += distanceScore;
    reasons.push(
      `Distance: ${distance.toFixed(1)}mi (+${distanceScore.toFixed(0)} pts)`
    );

    // FACTOR 2: AVAILABILITY & TIME CONFLICTS (0-30 points)
    const { availability, availabilityScore, availabilityReason } =
      checkTimeAvailability(cleaner, time, date);

    score += availabilityScore;
    reasons.push(availabilityReason);

    if (availability !== "available") {
      return {
        cleaner,
        score: 0,
        distance,
        availability,
        workload: cleaner._count.assignedBookings,
        reasons,
      };
    }

    // FACTOR 3: WORKLOAD (0-20 points)
    const workloadScore = calculateWorkloadScore(
      cleaner._count.assignedBookings
    );
    score += workloadScore;
    reasons.push(
      `Workload: ${cleaner._count.assignedBookings} bookings (+${workloadScore} pts)`
    );

    // FACTOR 4: EXPERIENCE/RATING (0-15 points) - placeholder for now
    const experienceScore = 10; // You can add actual rating calculation later
    score += experienceScore;
    reasons.push(`Experience (+${experienceScore} pts)`);

    // FACTOR 5: CUSTOMER PREFERENCES (0-10 points)
    let preferenceScore = 0;

    // Previous cleaner bonus
    if (preferences?.previousCleanerId === cleaner.id) {
      preferenceScore += 5;
      reasons.push("Previous cleaner (+5 pts)");
    }

    // Exclude certain cleaners
    if (preferences?.excludeCleanerIds?.includes(cleaner.id)) {
      score = 0;
      reasons.push("Excluded by customer");
      return {
        cleaner,
        score: 0,
        distance,
        availability: "unavailable" as const,
        workload: cleaner._count.assignedBookings,
        reasons,
      };
    }

    score += preferenceScore;

    // FACTOR 6: SERVICE TYPE EXPERTISE (0-5 points)
    // You can add service-specific bonuses here
    if (serviceType === "DEEP" && cleaner.hourlyRate.gte(new Decimal(22))) {
      score += 5;
      reasons.push("Deep cleaning specialist (+5 pts)");
    }

    return {
      cleaner,
      score: Math.round(score),
      distance,
      availability: "available" as const,
      workload: cleaner._count.assignedBookings,
      reasons,
    };
  });
}

// Check if cleaner is available at the specific time
function checkTimeAvailability(
  cleaner: any,
  requestedTime: string,
  date: Date
) {
  const dayAvailability = cleaner.availability[0]; // We already filtered by day

  if (!dayAvailability) {
    return {
      availability: "unavailable" as const,
      availabilityScore: 0,
      availabilityReason: "Not working this day",
    };
  }

  // Check if requested time is within working hours
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

  // Check for time conflicts with existing bookings
  const hasConflict = cleaner.assignedBookings.some((booking: any) => {
    const bookingHour = parseInt(booking.time.split(":")[0]);
    const duration = booking.estimatedDuration || 120; // minutes
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

// Calculate workload score (less busy = higher score)
function calculateWorkloadScore(bookingCount: number): number {
  if (bookingCount === 0) return 20; // No bookings = max points
  if (bookingCount === 1) return 15; // Light workload
  if (bookingCount === 2) return 10; // Moderate workload
  if (bookingCount === 3) return 5; // Heavy workload
  return 0; // Overloaded
}

// Calculate distance between two points (Haversine formula)
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Get coordinates for a postcode
async function getCoordinatesFromPostcode(
  postcode: string
): Promise<{ lat: number; lon: number } | null> {
  try {
    const postcodeRecord = await prisma.postcode.findUnique({
      where: { postcode: postcode.replace(/\s/g, "").toUpperCase() },
    });

    if (postcodeRecord) {
      return { lat: postcodeRecord.latitude, lon: postcodeRecord.longitude };
    }

    return null;
  } catch (error) {
    console.error("Error getting coordinates:", error);
    return null;
  }
}

// ALTERNATIVE STRATEGIES FOR DIFFERENT SCENARIOS

// Strategy for peak times (weekends, evenings)
export async function selectCleanerForPeakTime(bookingData: any) {
  // During peak times, prioritize:
  // 1. Cleaners with light workload
  // 2. Cleaners who work extended hours
  // 3. Premium cleaners who charge higher rates

  const result = await selectBestCleaner(
    bookingData.postcode,
    bookingData.date,
    bookingData.time,
    bookingData.serviceType
  );

  return result;
}

// Strategy for last-minute bookings (same day)
export async function selectCleanerForUrgentBooking(bookingData: any) {
  // For urgent bookings, prioritize:
  // 1. Cleaners with no current bookings
  // 2. Closest available cleaners
  // 3. Flexible cleaners who accept same-day bookings

  return await selectBestCleaner(
    bookingData.postcode,
    bookingData.date,
    bookingData.time,
    bookingData.serviceType
  );
}

// Strategy for regular customers
export async function selectCleanerForRegularCustomer(
  bookingData: any,
  customerId: string
) {
  // For regular customers, prioritize:
  // 1. Their previous cleaner (continuity)
  // 2. Cleaners they've rated highly
  // 3. Cleaners who prefer regular schedules

  const previousBookings = await prisma.booking.findMany({
    where: {
      userId: customerId,
      assignedCleanerId: { not: null },
    },
    orderBy: { date: "desc" },
    take: 3,
    select: { assignedCleanerId: true },
  });

  const previousCleanerIds = previousBookings
    .map((b) => b.assignedCleanerId)
    .filter(Boolean);
  const mostRecentCleanerId = previousCleanerIds[0];

  return await selectBestCleaner(
    bookingData.postcode,
    bookingData.date,
    bookingData.time,
    bookingData.serviceType,
    {
      previousCleanerId: mostRecentCleanerId,
    }
  );
}
