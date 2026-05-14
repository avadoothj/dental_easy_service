import { processApiResponse } from "@/utils/utils";
import { NextResponse } from "next/server";
import { addProject } from "../../../../controllers/api/project";
import messages from "@/utils/messages";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const data = {};
    let file = null;

    for (const [key, value] of formData.entries()) {
      if (key === "document" && value instanceof File) {
        file = value;
      } else {
        data[key] = value;
      }
    }

    // Handle file upload
    if (file) {
      const uploadDir = path.join(process.cwd(), "public", "files", "document");
      await mkdir(uploadDir, { recursive: true });
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadDir, fileName);
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buffer);
      data.document = `/files/document/${fileName}`;
    }

    const result = await addProject(data);
    const response = processApiResponse(result);
    return NextResponse.json(response, { status: response.httpCode });
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
