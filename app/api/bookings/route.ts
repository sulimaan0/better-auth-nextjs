// app/api/bookings/route.ts
import { NextResponse } from "next/server";
import { createBooking } from "@/lib/booking-service";
import { auth } from "@/auth";
import { headers } from "next/headers";

export async function POST(request: Request) {
  try {
    // Get the current session to check if user is logged in
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Parse the request body
    const body = await request.json();
    console.log("📝 Received booking data:", body);

    // Validate required fields
    if (!body.serviceType || !body.frequency) {
      return NextResponse.json(
        { success: false, error: "Service type and frequency are required" },
        { status: 400 }
      );
    }

    if (!body.bedrooms || !body.bathrooms || !body.address) {
      return NextResponse.json(
        { success: false, error: "Property details are required" },
        { status: 400 }
      );
    }

    if (!body.date || !body.time) {
      return NextResponse.json(
        { success: false, error: "Date and time are required" },
        { status: 400 }
      );
    }

    if (
      !body.contactInfo?.name ||
      !body.contactInfo?.email ||
      !body.contactInfo?.phone
    ) {
      return NextResponse.json(
        { success: false, error: "Contact information is required" },
        { status: 400 }
      );
    }

    // Prepare the booking data
    const bookingData = {
      serviceType: body.serviceType,
      frequency: body.frequency,
      bedrooms: body.bedrooms,
      bathrooms: body.bathrooms,
      address: body.address,
      instructions: body.instructions || "",
      date: new Date(body.date),
      time: body.time,
      extras: body.extras || [],
      contactInfo: {
        name: body.contactInfo.name,
        email: body.contactInfo.email,
        phone: body.contactInfo.phone,
      },
      userId: session?.user?.id || undefined, // Add user ID if logged in
    };

    console.log("🔄 Creating booking with data:", bookingData);

    // Create the booking using your service
    const result = await createBooking(bookingData);

    if (result.success) {
      console.log("✅ Booking created successfully:", result.booking);
      return NextResponse.json({
        success: true,
        booking: result.booking,
        message: result.message,
      });
    } else {
      console.error("❌ Booking creation failed:", result.error);
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("❌ Booking API error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create booking. Please try again.",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    // You can add logic here to fetch user's bookings
    // const userBookings = await getUserBookings(session.user.id);

    return NextResponse.json({
      success: true,
      message: "Bookings endpoint is working",
    });
  } catch (error) {
    console.error("❌ Get bookings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
