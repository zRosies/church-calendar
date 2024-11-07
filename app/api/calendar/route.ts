import { Events } from "@/app/components/calendar";
import { BookLunch, getMonthData } from "../controllers/calendar";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await getMonthData();
  return NextResponse.json(data, { status: 200 });
}

export async function POST(req: Request) {
  const body: Events = await req.json();
  const data = await BookLunch(body);

  return NextResponse.json(
    { message: "Event added successfully" },
    { status: 201 }
  );
}
