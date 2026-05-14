import { processApiResponse } from "@/utils/utils";
import { NextResponse } from "next/server";
import {
  addBulkLinks,
  addSingleLink,
  updateSingleLink,
} from "../../../../controllers/api/web-page-watcher/addLink";
import messages from "@/utils/messages";

export async function POST(request) {
  try {
    const data = await request.json();
    const isBulkRequest = Array.isArray(data);
    const result = isBulkRequest ? await addBulkLinks(data) : await addSingleLink(data);
    const response = processApiResponse(result);
    const httpCode = response.httpCode;
    return NextResponse.json(response, { status: httpCode });
  } catch (error) {
    return NextResponse.json(
      {
        status: false,
        message: messages.SERVER_ERROR,
      },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const result = await updateSingleLink(data.id, data);
    const response = processApiResponse(result);
    const httpCode = response.httpCode;
    return NextResponse.json(response, { status: httpCode });
  } catch (error) {
    return NextResponse.json(
      {
        status: false,
        message: messages.SERVER_ERROR,
      },
      { status: 500 },
    );
  }
}
