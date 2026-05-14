import { NextResponse } from "next/server";
import { db } from "@/utils/lib/database";
import { queryGenerator } from "@/utils/lib/queryGenerator";
import { TABLE_LIST } from "@/utils/lib/tablesList";
import messages from "@/utils/messages";

function normalizeLinkPayload(reqBody = {}) {
  return {
    url_link: reqBody.url_link?.toString().trim() || "",
    country: reqBody.country?.toString().trim() || "india",
    groups: reqBody.groups?.toString().trim() || "group B",
    notice_type: reqBody.notice_type?.toString().trim() || "tender notice",
    visit_priority: reqBody.visit_priority?.toString().trim() || "1",
    process_type: reqBody.process_type?.toString().trim() || "crawler",
    is_vpn: reqBody.is_vpn === true || reqBody.is_vpn === "true" || reqBody.is_vpn === 1 || false,
    is_action_taken: true,
  };
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        {
          status: false,
          message: "No file provided",
        },
        { status: 400 }
      );
    }

    // Dynamic import of xlsx
    let XLSX;
    try {
      XLSX = await import("xlsx");
    } catch (error) {
      return NextResponse.json(
        {
          status: false,
          message: "Excel processing library not installed. Please install 'xlsx' package.",
        },
        { status: 500 }
      );
    }

    // Read file as buffer
    const buffer = await file.arrayBuffer();

    // Parse the file
    const workbook = XLSX.read(buffer, { type: "array" });
    const worksheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[worksheetName];
    
    // Extract only the first column (url_link) from the worksheet
    const data = [];
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    
    for (let row = range.s.r + 1; row <= range.e.r; row++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: 0 });
      const cell = worksheet[cellAddress];
      if (cell && cell.v) {
        data.push({
          url_link: cell.v.toString().trim(),
        });
      }
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          status: false,
          message: "No data found in the Excel file",
        },
        { status: 400 }
      );
    }

    // Normalize all rows
    const normalizedRows = data
      .map((row) => normalizeLinkPayload(row))
      .filter((row) => row.url_link);

    if (normalizedRows.length === 0) {
      return NextResponse.json(
        {
          status: false,
          message: "No valid links found in the file",
        },
        { status: 400 }
      );
    }

    // Remove duplicates within the payload
    const uniqueRows = [];
    const seenUrls = new Set();
    let duplicateInPayloadCount = 0;

    normalizedRows.forEach((row) => {
      if (seenUrls.has(row.url_link)) {
        duplicateInPayloadCount++;
        return;
      }
      seenUrls.add(row.url_link);
      uniqueRows.push(row);
    });

    const urlLinks = uniqueRows.map((row) => row.url_link);
    const result = await db.tx(async (transaction) => {
      const existingRows = await transaction.query(
        `SELECT url_link FROM ${TABLE_LIST.ADD_LINK} WHERE url_link = ANY($1)`,
        [urlLinks],
      );

      const existingUrlSet = new Set(existingRows.map((row) => row.url_link));
      const insertableRows = uniqueRows.filter((row) => !existingUrlSet.has(row.url_link));

      let insertedCount = 0;

      // Insert each row
      for (const row of insertableRows) {
        try {
          await transaction.query(
            queryGenerator.generateInsertQuery(row, TABLE_LIST.ADD_LINK),
          );
          insertedCount++;
        } catch (error) {
          console.error(`Error inserting row with url_link ${row.url_link}:`, error);
        }
      }

      return {
        success: true,
        insertedCount,
        skippedExistingCount: existingUrlSet.size,
        skippedDuplicateCount: duplicateInPayloadCount,
        totalReceivedCount: data.length,
      };
    });

    const message = `Bulk upload completed. Inserted: ${result.insertedCount}, Duplicates (in DB): ${result.skippedExistingCount}, Duplicates (in file): ${result.skippedDuplicateCount}, Total received: ${result.totalReceivedCount}`;

    return NextResponse.json(
      {
        status: result.insertedCount > 0,
        message: message,
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing bulk upload:", error);
    return NextResponse.json(
      {
        status: false,
        message: error.message || messages.SERVER_ERROR,
      },
      { status: 500 }
    );
  }
}
