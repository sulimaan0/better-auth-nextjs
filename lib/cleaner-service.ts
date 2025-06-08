import { prisma } from "@/lib/prisma";
import type { BookingStatus } from "@prisma/client";

export async function getAvailableJobs(cleanerId?: string) {
  try {
    const jobs = await prisma.booking.findMany({
      where: {
        status: "PENDING",
        cleanerId: null, // Not assigned to any cleaner yet
        date: {
          gte: new Date(), // Only future bookings
        },
      },
      include: {
        customer: {
          select: {
            name: true,
            phone: true,
            rating: true,
          },
        },
        extras: {
          include: {
            extra: true,
          },
        },
      },
      orderBy: [{ priority: "desc" }, { date: "asc" }, { createdAt: "asc" }],
    });

    return jobs;
  } catch (error) {
    console.error("Error fetching available jobs:", error);
    return [];
  }
}

export async function getCleanerJobs(cleanerId: string) {
  try {
    const jobs = await prisma.booking.findMany({
      where: {
        cleanerId,
      },
      include: {
        customer: {
          select: {
            name: true,
            phone: true,
            email: true,
            rating: true,
          },
        },
        extras: {
          include: {
            extra: true,
          },
        },
        reviews: true,
      },
      orderBy: [{ date: "asc" }, { createdAt: "desc" }],
    });

    return jobs;
  } catch (error) {
    console.error("Error fetching cleaner jobs:", error);
    return [];
  }
}

export async function acceptJob(bookingId: string, cleanerId: string) {
  try {
    const booking = await prisma.booking.update({
      where: {
        id: bookingId,
        status: "PENDING",
        cleanerId: null,
      },
      data: {
        cleanerId,
        status: "ACCEPTED",
        acceptedAt: new Date(),
      },
      include: {
        customer: true,
        extras: {
          include: {
            extra: true,
          },
        },
      },
    });

    // Update cleaner's total jobs count
    await prisma.user.update({
      where: { id: cleanerId },
      data: {
        totalJobs: {
          increment: 1,
        },
      },
    });

    return { success: true, booking };
  } catch (error) {
    console.error("Error accepting job:", error);
    return { success: false, error: "Failed to accept job" };
  }
}

export async function declineJob(bookingId: string, cleanerId: string) {
  try {
    // For now, we'll just log the decline
    // In a real app, you might want to track declined jobs
    console.log(`Cleaner ${cleanerId} declined job ${bookingId}`);

    return { success: true, message: "Job declined" };
  } catch (error) {
    console.error("Error declining job:", error);
    return { success: false, error: "Failed to decline job" };
  }
}

export async function updateJobStatus(
  bookingId: string,
  status: BookingStatus,
  cleanerId: string
) {
  try {
    const updateData: any = { status };

    if (status === "COMPLETED") {
      updateData.completedAt = new Date();
    }

    const booking = await prisma.booking.update({
      where: {
        id: bookingId,
        cleanerId,
      },
      data: updateData,
    });

    return { success: true, booking };
  } catch (error) {
    console.error("Error updating job status:", error);
    return { success: false, error: "Failed to update job status" };
  }
}

export async function getCleanerStats(cleanerId: string) {
  try {
    const stats = await prisma.booking.groupBy({
      by: ["status"],
      where: {
        cleanerId,
      },
      _count: {
        status: true,
      },
    });

    const totalEarnings = await prisma.booking.aggregate({
      where: {
        cleanerId,
        status: "COMPLETED",
      },
      _sum: {
        totalPrice: true,
      },
    });

    const avgRating = await prisma.review.aggregate({
      where: {
        cleanerId,
      },
      _avg: {
        rating: true,
      },
    });

    return {
      stats: stats.reduce((acc, stat) => {
        acc[stat.status.toLowerCase()] = stat._count.status;
        return acc;
      }, {} as Record<string, number>),
      totalEarnings: totalEarnings._sum.totalPrice || 0,
      averageRating: avgRating._avg.rating || 0,
    };
  } catch (error) {
    console.error("Error fetching cleaner stats:", error);
    return {
      stats: {},
      totalEarnings: 0,
      averageRating: 0,
    };
  }
}
