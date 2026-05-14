import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import fs from "fs";
import path from "path";
import messages from "@/utils/messages";

export const runtime = "nodejs";      
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    noStore();

    let filePath = request.nextUrl.searchParams.get("path") ?? "";

    if (!filePath) {
      return NextResponse.json(
        { status: false, message: messages.UNAUTHORIZED_ACCESS },
        { status: 401 }
      );
    }

    filePath = filePath.replace(/\.\./g, "");

    const fullPath = path.join(process.cwd(), "public", filePath);

    if (!fs.existsSync(fullPath)) {
      return NextResponse.json(
        { status: false, message: "File not found" },
        { status: 404 }
      );
    }

    const fileBuffer = fs.readFileSync(fullPath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${path.basename(fullPath)}"`,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: false, message: "Error downloading file" },
      { status: 500 }
    );
  }
}