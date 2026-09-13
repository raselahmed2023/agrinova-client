import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

import { auth, authDb } from "@/lib/auth";

const text = (value: unknown, max = 200) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    if (!ObjectId.isValid(session.user.id)) {
      return NextResponse.json(
        { success: false, message: "Invalid user account" },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const users = authDb.collection("user");
    const _id = new ObjectId(session.user.id);

    const current = await users.findOne(
      { _id },
      { projection: { role: 1, status: 1 } }
    );

    if (!current) {
      return NextResponse.json(
        { success: false, message: "User account not found" },
        { status: 404 }
      );
    }

    const currentRole = String(current.role || "FARMER").toUpperCase();
    const currentStatus = String(current.status || "APPROVED").toUpperCase();

    if (currentRole === "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Admin accounts cannot submit expert applications" },
        { status: 403 }
      );
    }

    if (currentRole === "EXPERT" && currentStatus === "APPROVED") {
      return NextResponse.json(
        { success: false, message: "This expert account is already approved" },
        { status: 409 }
      );
    }

    const experienceYears = Number(body?.experienceYears);

    const update = {
      role: "EXPERT",
      status: "PENDING",
      phone: text(body?.phone, 50),
      specialization: text(body?.specialization, 150),
      qualification: text(body?.qualification, 250),
      experienceYears:
        Number.isFinite(experienceYears) && experienceYears >= 0
          ? experienceYears
          : 0,
      rejectionReason: "",
      updatedAt: new Date(),
    };

    await users.updateOne({ _id }, { $set: update });

    return NextResponse.json({
      success: true,
      message: "Expert application submitted for admin review",
    });
  } catch (error) {
    console.error("Expert application submission failed:", error);

    return NextResponse.json(
      { success: false, message: "Unable to submit expert application" },
      { status: 500 }
    );
  }
}