import { NextResponse } from "next/server";
import messages from "@/utils/messages";
import { getLinkList } from "../../../../controllers/api/web-page-watcher/addLink";

export async function GET() {
  try {
    const response = await getLinkList();
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        msg: messages.SERVER_ERROR,
      },
      { status: 500 },
    );
  }
}
