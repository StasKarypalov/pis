import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const { email, name, calendarTokenJson } = await request.json();

  if (!email || !calendarTokenJson) {
    return NextResponse.json(
      { error: "Email and calendar tokens are required" },
      { status: 400 }
    );
  }

  try {
    await db.user.create({
      data: {
        email,
        name,
        role: "PENDING",
        calendarToken: calendarTokenJson
      }
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Could not register user (maybe email already exists)" },
      { status: 400 }
    );
  }
}

