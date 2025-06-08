import { type NextRequest, NextResponse } from "next/server";
import { acceptJob } from "@/lib/cleaner-service";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { cleanerId } = await request.json();

    if (!cleanerId) {
      return NextResponse.json(
        { success: false, error: "Cleaner ID is required" },
        { status: 400 }
      );
    }

    const result = await acceptJob(params.id, cleanerId);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
