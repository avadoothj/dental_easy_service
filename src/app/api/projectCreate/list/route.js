import { NextResponse } from "next/server";
import messages from "@/utils/messages";
import { getProjectListData } from "../../../../controllers/api/project";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams.entries());
    const response = await getProjectListData(params);
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
