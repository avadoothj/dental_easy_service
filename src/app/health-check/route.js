import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import { currentDateTime } from "@/utils/dateHelper";

export async function GET() {
	noStore();
	return NextResponse.json({ status: true, date: currentDateTime() });
}
