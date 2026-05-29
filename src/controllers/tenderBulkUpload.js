// "use server";

// import { insertTenderUploadData } from "@/controllers/tender";
// import { options } from "@/app/api/auth/[...nextauth]/options";
// import { getServerSession } from "next-auth";
// import { queryWithRetry } from "@/utils/lib/database";
// import { TABLE_LIST } from "@/utils/lib/tablesList";
// import messages from "@/utils/messages";
// import { deleteFromS3, uploadToS3 } from "@/utils/s3Update";
// import { randomUUID } from "crypto";
// import { mkdir, readdir, readFile, rm, writeFile } from "fs/promises";
// import path from "path";
// import { promisify } from "util";
// import { execFile } from "child_process";
// import unzipper from "unzipper";
// import fs from "fs";

// const execFileAsync = promisify(execFile);

// const ROW_DEFAULTS = {
//   source_tag: "",
//   tender_organisation: "",
//   tender_office_name: "",
//   department: "",
//   ministry_name: "",
//   tender_bidding_type: "NCB",
//   tender_value: "",
//   tender_publishing_date: "",
//   tender_city: "",
//   tender_pincode: "",
//   tender_financier: "Self Financier",
//   tender_email_id: "",
//   tender_website: "",
//   tender_emd: "",
//   estimated_bid_value: "",
//   tender_type: "OPEN",
//   tender_contract_type: "",
//   tender_category: "",
//   tender_evaluation: "L1 Ranking",
//   tender_procurement_process: "Electronic Documents, First(One Cover)",
//   tender_contact_person: "",
//   tender_contract_period: "",
//   required_documents: []
// };

// const REQUIRED_FIELDS = [
//   "tender_number",
//   "tender_title",
//   "tender_description",
//   "main_category",
//   "sub_category",
//   "tender_start_date",
//   "tender_end_date",
//   "tender_purchaser_address",
//   "tender_purchaser_name",
//   "tender_country",
//   "tender_state",
//   "tender_documents_path",
// ];

// const HEADER_ALIASES = {
//   tendernumber: "tender_number",
//   tenderreferencenumber: "tender_number",
//   referencenumber: "tender_number",
//   sourcetag: "source_tag",
//   tendertitle: "tender_title",
//   tenderdescription: "tender_description",
//   tenderorganisation: "tender_organisation",
//   organisation: "tender_organisation",
//   tenderofficename: "tender_office_name",
//   officename: "tender_office_name",
//   department: "department",
//   ministryname: "ministry_name",
//   tenderbiddingtype: "tender_bidding_type",
//   maincategory: "main_category",
//   subcategory: "sub_category",
//   tendervalue: "tender_value",
//   tenderstartdate: "tender_start_date",
//   tenderpublishingdate: "tender_publishing_date",
//   tenderenddate: "tender_end_date",
//   tenderpurchaseraddress: "tender_purchaser_address",
//   tenderpurchasername: "tender_purchaser_name",
//   tendercountry: "tender_country",
//   tenderstate: "tender_state",
//   tendercity: "tender_city",
//   tenderpincode: "tender_pincode",
//   tenderfinancier: "tender_financier",
//   tenderemailid: "tender_email_id",
//   tenderwebsite: "tender_website",
//   tenderemd: "tender_emd",
//   estimatedbidvalue: "estimated_bid_value",
//   tendertype: "tender_type",
//   tendercontracttype: "tender_contract_type",
//   tendercategory: "tender_category",
//   tenderevaluation: "tender_evaluation",
//   tenderprocurementprocess: "tender_procurement_process",
//   tendercontactperson: "tender_contact_person",
//   tendercontractperiod: "tender_contract_period",
//   requireddocuments: "required_documents",
//   status: "status",
//   tenderdocumentspath: "tender_documents_path",
// };

// const normalizeHeader = (header) =>
//   String(header || "")
//     .trim()
//     .toLowerCase()
//     .replace(/[^a-z0-9]/g, "");

// const pad = (value) => String(value).padStart(2, "0");

// const normalizeDateString = (year, month, day) =>
//   `${year}-${pad(month)}-${pad(day)}`;

// const normalizeDateValue = (value, XLSX) => {
//   if (value === null || value === undefined || value === "") {
//     return "";
//   }

//   if (value instanceof Date && !Number.isNaN(value.getTime())) {
//     return normalizeDateString(
//       value.getUTCFullYear(),
//       value.getUTCMonth() + 1,
//       value.getUTCDate(),
//     );
//   }

//   if (typeof value === "number") {
//     const parsedDate = XLSX?.SSF?.parse_date_code?.(value);

//     if (parsedDate?.y && parsedDate?.m && parsedDate?.d) {
//       return normalizeDateString(parsedDate.y, parsedDate.m, parsedDate.d);
//     }
//   }

//   const normalizedValue = String(value).trim();

//   if (!normalizedValue) {
//     return "";
//   }

//   if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(normalizedValue)) {
//     const [year, month, day] = normalizedValue.split("-");
//     return normalizeDateString(year, month, day);
//   }

//   const slashMatch = normalizedValue.match(
//     /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/,
//   );
//   if (slashMatch) {
//     const [, day, month, year] = slashMatch;
//     return normalizeDateString(year, month, day);
//   }

//   const parsed = new Date(normalizedValue);
//   if (!Number.isNaN(parsed.getTime())) {
//     return normalizeDateString(
//       parsed.getUTCFullYear(),
//       parsed.getUTCMonth() + 1,
//       parsed.getUTCDate(),
//     );
//   }

//   return "";
// };

// const normalizeRequiredDocuments = (value) => {
//   if (!value) {
//     return [];
//   }

//   return String(value)
//     .split(",")
//     .map((item) => item.trim())
//     .filter(Boolean)
//     .map((name, i) => ({ id: i + 1, name: name }));
// };

// const normalizeRow = (row = {}, XLSX) => {
//   const normalizedRow = {
//     ...ROW_DEFAULTS,
//   };

//   Object.entries(row).forEach(([header, value]) => {
//     const canonicalHeader = HEADER_ALIASES[normalizeHeader(header)];

//     if (!canonicalHeader) {
//       return;
//     }

//     if (
//       canonicalHeader === "tender_start_date" ||
//       canonicalHeader === "tender_publishing_date" ||
//       canonicalHeader === "tender_end_date"
//     ) {
//       normalizedRow[canonicalHeader] = normalizeDateValue(value, XLSX);
//       return;
//     }

//     if (canonicalHeader === "required_documents") {
//       normalizedRow.required_documents = normalizeRequiredDocuments(value);
//       return;
//     }

//     normalizedRow[canonicalHeader] = String(value ?? "").trim();
//   });

//   return normalizedRow;
// };

// const validateRow = (row) => {
//   const missingFields = REQUIRED_FIELDS.filter(
//     (field) => !String(row[field] || "").trim(),
//   );

//   if (missingFields.length > 0) {
//     return `Missing required fields: ${missingFields.join(", ")}`;
//   }

//   return "";
// };

// const buildTenderFormData = (row) => {
//   const formData = new FormData();

//   Object.entries(row).forEach(([key, value]) => {
//     if (key === "required_documents") {
//       formData.append(key, JSON.stringify(value ?? []));
//       return;
//     }

//     if (key === "tender_documents_path") {
//       formData.append(key, JSON.stringify(value ?? []));
//       return;
//     }

//     formData.append(key, value ?? "");
//   });
//   return formData;
// };

// const BULK_UPLOAD_STORAGE_ROOT = path.join(
//   process.cwd(),
//   "public/files",
//   "tender-bulk-upload",
// );

// const MIME_TYPES = {
//   ".pdf": "application/pdf",
//   ".png": "image/png",
//   ".jpg": "image/jpeg",
//   ".jpeg": "image/jpeg",
//   ".doc": "application/msword",
//   ".docx":
//     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//   ".xls": "application/vnd.ms-excel",
//   ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   ".csv": "text/csv",
//   ".txt": "text/plain",
// };

// const BULK_UPLOAD_STATUS = {
//   PROCESSING: 0,
//   SUCCESS: 1,
//   FAILED: 2,
//   PARTIAL_SUCCESS: 3,
// };

// const ACTIVE_BULK_UPLOAD_JOBS =
//   globalThis.__ACTIVE_TENDER_BULK_UPLOAD_JOBS__ || new Set();
// globalThis.__ACTIVE_TENDER_BULK_UPLOAD_JOBS__ = ACTIVE_BULK_UPLOAD_JOBS;

// let pendingRecoveryTimer =
//   globalThis.__TENDER_BULK_UPLOAD_RECOVERY_TIMER__ || null;
// globalThis.__TENDER_BULK_UPLOAD_RECOVERY_TIMER__ = pendingRecoveryTimer;

// const createEmptySummary = () => ({
//   processedBy: "",
//   userEmail: "",
//   stage: "queued",
//   insertedCount: 0,
//   failedCount: 0,
//   totalReceivedCount: 0,
//   currentProcessedCount: 0,
//   lastProcessedRow: 0,
//   matchedDocumentCount: 0,
//   missingDocumentCount: 0,
//   excelServerPath: "",
//   zipServerPath: "",
//   extractedServerPath: "",
//   failedRowsExcelPath: "",
//   successRows: [],
//   failedRows: [],
// });

// const createRowSuccessEntry = ({
//   rowNumber,
//   normalizedRow,
//   processedBy,
//   documentCount,
//   resumed = false,
// }) => ({
//   row: rowNumber,
//   tender_number: normalizedRow.tender_number,
//   tender_title: normalizedRow.tender_title,
//   user: processedBy,
//   status: "success",
//   documentCount,
//   resumed,
// });

// const createRowFailureEntry = ({
//   rowNumber,
//   normalizedRow,
//   processedBy,
//   error,
// }) => ({
//   row: rowNumber,
//   tender_number: normalizedRow?.tender_number || "",
//   tender_title: normalizedRow?.tender_title || "",
//   user: processedBy,
//   status: "failed",
//   error,
// });

// const parseJsonValue = (value, fallback) => {
//   if (value === null || value === undefined || value === "") {
//     return fallback;
//   }

//   if (typeof value === "object") {
//     return value;
//   }

//   try {
//     return JSON.parse(value);
//   } catch (error) {
//     return fallback;
//   }
// };

// const sanitizeFileName = (fileName = "") =>
//   String(fileName || "")
//     .replace(/[<>:"/\\|?*\x00-\x1f]/g, "_")
//     .replace(/\s+/g, "_");

// const normalizeLookupKey = (value = "") =>
//   String(value || "")
//     .trim()
//     .replace(/\\/g, "/")
//     .replace(/^\/+/, "")
//     .replace(/^\.\//, "")
//     .toLowerCase();

// const getMimeType = (fileName = "") =>
//   MIME_TYPES[path.extname(String(fileName || "")).toLowerCase()] ||
//   "application/octet-stream";

// const saveFileToServer = async (file, destinationDir) => {
//   await mkdir(destinationDir, { recursive: true });

//   const fileName = `${Date.now()}_${sanitizeFileName(file?.name || "upload")}`;
//   const filePath = path.join(destinationDir, fileName);
//   const buffer = Buffer.from(await file.arrayBuffer());

//   await writeFile(filePath, buffer);
//   return filePath;
//   // if(destinationDir.includes("excel")){
//   //   let path = `${process.env.FRONTEND_DOMAIN}` + "files/tender-bulk-upload/excel/" + fileName;
//   //   return path;
//   // }else{
//   //   let path = `${process.env.FRONTEND_DOMAIN}` + "files/tender-bulk-upload/zip/" + fileName;
//   //   return path;
//   // }
// };

// const saveFailedRowsWorkbook = async ({
//   XLSX,
//   failedRows,
//   destinationDir,
//   sourceFileName,
// }) => {
//   if (!Array.isArray(failedRows) || failedRows.length === 0) {
//     return "";
//   }

//   await mkdir(destinationDir, { recursive: true });

//   const worksheet = XLSX.utils.json_to_sheet(failedRows);
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, "Failed Rows");

//   const safeSourceName = sanitizeFileName(
//     path.basename(sourceFileName || "bulk-upload"),
//   ).replace(path.extname(sourceFileName || ""), "");
//   const fileName = `${Date.now()}_${safeSourceName}_failed_rows.xlsx`;
//   const filePath = path.join(destinationDir, fileName);
//   const workbookBuffer = XLSX.write(workbook, {
//     type: "buffer",
//     bookType: "xlsx",
//   });

//   await writeFile(filePath, workbookBuffer);
//   return filePath;
// };

// const unzipArchive = async (zipPath, destinationDir) => {
//   await mkdir(destinationDir, { recursive: true });

//   // const escapedZipPath = String(zipPath).replace(/'/g, "''");
//   // const escapedDestinationPath = String(destinationDir).replace(/'/g, "''");

//   // await execFileAsync("powershell.exe", [
//   //   "-NoProfile",
//   //   "-Command",
//   //   `Expand-Archive -LiteralPath '${escapedZipPath}' -DestinationPath '${escapedDestinationPath}' -Force`,
//   // ]);
//   return new Promise((resolve, reject) => {
//     fs.createReadStream(zipPath)
//       .pipe(unzipper.Extract({ path: destinationDir }))
//       .on("close", resolve)
//       .on("error", reject);
//   });
// };

// const deleteDirectoryIfExists = async (directoryPath) => {
//   if (!directoryPath) {
//     return;
//   }

//   try {
//     await rm(directoryPath, { recursive: true, force: true });
//   } catch (error) {
//     console.error("Failed to delete bulk upload directory:", error);
//   }
// };

// const walkDirectory = async (directoryPath, rootDir = directoryPath) => {
//   const entries = await readdir(directoryPath, { withFileTypes: true });
//   const files = [];

//   for (const entry of entries) {
//     const absolutePath = path.join(directoryPath, entry.name);

//     if (entry.isDirectory()) {
//       const nestedFiles = await walkDirectory(absolutePath, rootDir);
//       files.push(...nestedFiles);
//       continue;
//     }

//     if (!entry.isFile()) {
//       continue;
//     }

//     files.push({
//       absolutePath,
//       relativePath: path.relative(rootDir, absolutePath).replace(/\\/g, "/"),
//       name: entry.name,
//     });
//   }

//   return files;
// };

// const indexExtractedFiles = async (directoryPath) => {
//   const fileIndex = new Map();
//   const fileList = await walkDirectory(directoryPath);

//   fileList.forEach((fileInfo) => {
//     const relativeKey = normalizeLookupKey(fileInfo.relativePath);
//     const nameKey = normalizeLookupKey(fileInfo.name);
//     const relativeMatches = fileIndex.get(relativeKey) || [];
//     const nameMatches = fileIndex.get(nameKey) || [];

//     relativeMatches.push(fileInfo);
//     nameMatches.push(fileInfo);
//     fileIndex.set(relativeKey, relativeMatches);
//     fileIndex.set(nameKey, nameMatches);
//   });

//   return fileIndex;
// };

// const resolveDocumentReference = (reference, fileIndex) => {
//   const normalizedReference = normalizeLookupKey(reference);
//   const directMatches = fileIndex.get(normalizedReference) || [];

//   if (directMatches.length === 1) {
//     return { file: directMatches[0], error: "" };
//   }

//   if (directMatches.length > 1) {
//     return {
//       file: null,
//       error: `Multiple files matched for "${reference}"`,
//     };
//   }

//   const baseName = normalizeLookupKey(path.basename(normalizedReference));
//   const baseNameMatches = fileIndex.get(baseName) || [];

//   if (baseNameMatches.length === 1) {
//     return { file: baseNameMatches[0], error: "" };
//   }

//   if (baseNameMatches.length > 1) {
//     return {
//       file: null,
//       error: `Multiple files matched for "${reference}"`,
//     };
//   }

//   return {
//     file: null,
//     error: `File not found in ZIP for "${reference}"`,
//   };
// };

// const getDocumentReferences = (value) =>
//   String(value || "")
//     .split(",")
//     .map((item) => item.trim())
//     .filter(Boolean);

// const createServerFileObject = async (absolutePath) => {
//   const fileBuffer = await readFile(absolutePath);

//   return {
//     name: path.basename(absolutePath),
//     type: getMimeType(absolutePath),
//     async arrayBuffer() {
//       const nextBuffer = await readFile(absolutePath);
//       return nextBuffer.buffer.slice(
//         nextBuffer.byteOffset,
//         nextBuffer.byteOffset + nextBuffer.byteLength,
//       );
//     },
//     size: fileBuffer.byteLength,
//   };
// };

// const rollbackUploadedDocuments = async (uploadedDocuments = []) => {
//   await Promise.all(
//     uploadedDocuments.map(async (document) => {
//       try {
//         if (document?.s3_path) {
//           await deleteFromS3(document.s3_path);
//         }
//       } catch (error) {
//         console.error("Bulk upload document rollback failed:", error);
//       }
//     }),
//   );
// };

// const uploadMatchedDocuments = async ({
//   documentReferences,
//   fileIndex,
//   tenderNumber,
// }) => {
//   const missingReferences = [];
//   const resolvedFiles = [];

//   documentReferences.forEach((reference) => {
//     const resolved = resolveDocumentReference(reference, fileIndex);

//     if (resolved.error || !resolved.file) {
//       missingReferences.push(
//         resolved.error || `Unable to resolve ${reference}`,
//       );
//       return;
//     }

//     resolvedFiles.push({
//       reference,
//       ...resolved.file,
//     });
//   });

//   if (missingReferences.length > 0) {
//     return {
//       success: false,
//       uploadedDocuments: [],
//       missingReferences,
//     };
//   }

//   const uploadedDocuments = [];

//   try {
//     for (const fileInfo of resolvedFiles) {
//       const file = await createServerFileObject(fileInfo.absolutePath);
//       const uploaded = await uploadToS3(
//         file,
//         `tender_documents/tender_BulkUpload/${sanitizeFileName(tenderNumber)}`,
//         true,
//       );

//       uploadedDocuments.push({
//         type: "uploaded_document",
//         title: fileInfo.reference,
//         original_url: null,
//         s3_path: uploaded.url,
//         uploaded_at: new Date(),
//       });
//     }

//     return {
//       success: true,
//       uploadedDocuments,
//       missingReferences: [],
//     };
//   } catch (error) {
//     await rollbackUploadedDocuments(uploadedDocuments);

//     return {
//       success: false,
//       uploadedDocuments: [],
//       missingReferences: [
//         error.message || "Unable to upload matched documents",
//       ],
//     };
//   }
// };

// const ensureBulkUploadColumns = async () => {
//   await queryWithRetry(
//     `CREATE TABLE IF NOT EXISTS ${TABLE_LIST.BULK_FILES_LIST} (
//       id SERIAL PRIMARY KEY,
//       file_name VARCHAR NULL,
//       total_records INT DEFAULT 0 NULL,
//       success_records INT DEFAULT 0 NULL,
//       failed_records INT DEFAULT 0 NULL,
//       status INT DEFAULT 0 NULL,
//       last_processed_on TIMESTAMP NULL,
//       inserted_date TIMESTAMP NULL,
//       inserted_by VARCHAR NULL
//     )`,
//   );

//   await queryWithRetry(
//     `ALTER TABLE ${TABLE_LIST.BULK_FILES_LIST}
//       ADD COLUMN IF NOT EXISTS excel_file_path TEXT NULL,
//       ADD COLUMN IF NOT EXISTS zip_file_path TEXT NULL,
//       ADD COLUMN IF NOT EXISTS failure_details_path TEXT NULL,
//       ADD COLUMN IF NOT EXISTS upload_summary JSON NULL,
//       ADD COLUMN IF NOT EXISTS failure_details JSON NULL,
//       ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NULL`,
//   );
// };

// const createBulkUploadLog = async ({
//   fileName,
//   insertedBy,
//   excelFilePath,
//   zipFilePath,
// }) => {
//   await ensureBulkUploadColumns();

//   const rows = await queryWithRetry(
//     `INSERT INTO ${TABLE_LIST.BULK_FILES_LIST}
//       (file_name, total_records, success_records, failed_records, status, inserted_date, inserted_by, last_processed_on, excel_file_path, zip_file_path, failure_details_path, upload_summary, failure_details, updated_at)
//      VALUES ($1, 0, 0, 0, 0, NOW(), $2, NOW(), $3, $4, $5, $6::json, $7::json, NOW())
//      RETURNING id, inserted_date`,
//     [
//       fileName,
//       insertedBy,
//       excelFilePath,
//       zipFilePath,
//       null,
//       JSON.stringify({ stage: "queued", currentProcessedCount: 0 }),
//       JSON.stringify([]),
//     ],
//   );

//   return {
//     id: rows[0]?.id || null,
//     insertedDate: rows[0]?.inserted_date || null,
//   };
// };

// const getBulkUploadStatusCode = ({ insertedCount, failedCount, stage }) => {
//   if (["queued", "processing"].includes(String(stage || ""))) {
//     return BULK_UPLOAD_STATUS.PROCESSING;
//   }

//   if (insertedCount > 0 && failedCount === 0) {
//     return BULK_UPLOAD_STATUS.SUCCESS;
//   }

//   if (insertedCount > 0 && failedCount > 0) {
//     return BULK_UPLOAD_STATUS.PARTIAL_SUCCESS;
//   }

//   return BULK_UPLOAD_STATUS.FAILED;
// };

// const updateBulkUploadLog = async ({ logId, summary }) => {
//   if (!logId) {
//     return;
//   }

//   await queryWithRetry(
//     `UPDATE ${TABLE_LIST.BULK_FILES_LIST}
//         SET total_records = $2,
//             success_records = $3,
//             failed_records = $4,
//             status = $5,
//             last_processed_on = NOW(),
//             upload_summary = $6::json,
//             failure_details = $7::json,
//             failure_details_path = $8,
//             updated_at = NOW()
//       WHERE id = $1`,
//     [
//       logId,
//       summary.totalReceivedCount,
//       summary.insertedCount,
//       summary.failedCount,
//       getBulkUploadStatusCode(summary),
//       JSON.stringify({
//         processedBy: summary.processedBy,
//         userEmail: summary.userEmail,
//         stage: summary.stage,
//         currentProcessedCount: summary.currentProcessedCount,
//         lastProcessedRow: summary.lastProcessedRow,
//         totalReceivedCount: summary.totalReceivedCount,
//         matchedDocumentCount: summary.matchedDocumentCount,
//         missingDocumentCount: summary.missingDocumentCount,
//         excelServerPath: summary.excelServerPath,
//         zipServerPath: summary.zipServerPath,
//         failedRowsExcelPath: summary.failedRowsExcelPath,
//         successRows: summary.successRows || [],
//       }),
//       JSON.stringify(summary.failedRows || []),
//       summary.failedRowsExcelPath || null,
//     ],
//   );
// };

// const getBulkUploadLogById = async (logId) => {
//   const rows = await queryWithRetry(
//     `SELECT
//       id,
//       file_name,
//       total_records,
//       success_records,
//       failed_records,
//       status,
//       inserted_date,
//       inserted_by,
//       excel_file_path,
//       zip_file_path,
//       failure_details_path,
//       upload_summary,
//       failure_details
//     FROM ${TABLE_LIST.BULK_FILES_LIST}
//     WHERE id = $1
//     LIMIT 1`,
//     [logId],
//   );

//   return rows[0] || null;
// };

// const getPendingBulkUploadLogs = async () => {
//   const rows = await queryWithRetry(
//     `SELECT
//       id,
//       file_name,
//       inserted_by,
//       inserted_date,
//       excel_file_path,
//       zip_file_path,
//       upload_summary,
//       failure_details
//     FROM ${TABLE_LIST.BULK_FILES_LIST}
//     WHERE status = $1
//     ORDER BY inserted_date ASC, id ASC`,
//     [BULK_UPLOAD_STATUS.PROCESSING],
//   );

//   return rows;
// };

// const getProcessedRowSet = ({ successRows = [], failedRows = [] }) => {
//   const processedRows = new Set();

//   [...successRows, ...failedRows].forEach((item) => {
//     const rowNumber = Number(item?.row || 0);

//     if (rowNumber > 0) {
//       processedRows.add(rowNumber);
//     }
//   });

//   return processedRows;
// };

// const buildSummaryFromLogRow = (row) => {
//   const uploadSummary = parseJsonValue(row?.upload_summary, {});
//   const failedRows = parseJsonValue(row?.failure_details, []);
//   const successRows = Array.isArray(uploadSummary?.successRows)
//     ? uploadSummary.successRows
//     : [];

//   return {
//     ...createEmptySummary(),
//     processedBy: row?.inserted_by || uploadSummary?.processedBy || "",
//     userEmail: uploadSummary?.userEmail || "",
//     stage: uploadSummary?.stage || "queued",
//     insertedCount: Number(row?.success_records || successRows.length || 0),
//     failedCount: Number(row?.failed_records || failedRows.length || 0),
//     totalReceivedCount: Number(
//       uploadSummary?.totalReceivedCount || row?.total_records || 0,
//     ),
//     currentProcessedCount: Number(
//       uploadSummary?.currentProcessedCount ||
//         successRows.length + failedRows.length,
//     ),
//     lastProcessedRow: Number(uploadSummary?.lastProcessedRow || 0),
//     matchedDocumentCount: Number(uploadSummary?.matchedDocumentCount || 0),
//     missingDocumentCount: Number(uploadSummary?.missingDocumentCount || 0),
//     excelServerPath:
//       row?.excel_file_path || uploadSummary?.excelServerPath || "",
//     zipServerPath: row?.zip_file_path || uploadSummary?.zipServerPath || "",
//     failedRowsExcelPath:
//       row?.failure_details_path || uploadSummary?.failedRowsExcelPath || "",
//     successRows,
//     failedRows: Array.isArray(failedRows) ? failedRows : [],
//   };
// };

// const findTenderCreatedAfterJobStart = async ({
//   tenderNumber,
//   userEmail,
//   jobInsertedDate,
// }) => {
//   if (!tenderNumber || !userEmail || !jobInsertedDate) {
//     return null;
//   }

//   const rows = await queryWithRetry(
//     `SELECT id
//      FROM ${TABLE_LIST.ADD_TENDER}
//      WHERE tender_number = $1
//        AND user_email = $2
//        AND created_at >= $3
//      ORDER BY created_at ASC
//      LIMIT 1`,
//     [tenderNumber, userEmail, jobInsertedDate],
//   );

//   return rows[0] || null;
// };

// const scheduleBulkUploadProcessing = (job) => {
//   if (!job?.logId || ACTIVE_BULK_UPLOAD_JOBS.has(job.logId)) {
//     return false;
//   }

//   ACTIVE_BULK_UPLOAD_JOBS.add(job.logId);

//   setTimeout(() => {
//     processTenderBulkUploadJob(job)
//       .catch((error) => {
//         console.error("Bulk upload background process failed:", error);
//       })
//       .finally(() => {
//         ACTIVE_BULK_UPLOAD_JOBS.delete(job.logId);
//       });
//   }, 0);

//   return true;
// };

// const processTenderBulkUploadJob = async ({
//   logId,
//   excelServerPath,
//   zipServerPath,
//   fileName,
//   processedBy,
//   userEmail,
//   jobInsertedDate,
// }) => {
//   let summary = createEmptySummary();
//   let extractedDir = "";

//   try {
//     const logRow = await getBulkUploadLogById(logId);

//     if (!logRow) {
//       return;
//     }

//     let XLSX;
//     try {
//       XLSX = await import("xlsx");
//     } catch (error) {
//       throw new Error("Excel processing library not installed");
//     }

//     const batchRootDir = path.join(BULK_UPLOAD_STORAGE_ROOT);
//     const failedRowsDir = path.join(batchRootDir, "failed");
//     extractedDir = path.join(batchRootDir, "extracted", randomUUID());
//     summary = buildSummaryFromLogRow(logRow);
//     summary.processedBy = processedBy || summary.processedBy;
//     summary.userEmail = userEmail || summary.userEmail;
//     summary.stage = "processing";
//     summary.excelServerPath = excelServerPath || summary.excelServerPath;
//     summary.zipServerPath = zipServerPath || summary.zipServerPath;

//     await updateBulkUploadLog({
//       logId,
//       summary,
//     });

//     await unzipArchive(summary.zipServerPath, extractedDir);

//     const buffer = await readFile(summary.excelServerPath);
//     const workbook = XLSX.read(buffer, {
//       type: "buffer",
//       cellDates: true,
//     });
//     const worksheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[worksheetName];
//     const rawRows = XLSX.utils.sheet_to_json(worksheet, {
//       defval: "",
//       raw: true,
//     });

//     summary.totalReceivedCount = rawRows.length;

//     if (!rawRows.length) {
//       summary.stage = "failed";

//       await updateBulkUploadLog({
//         logId,
//         summary,
//       });

//       return;
//     }

//     await updateBulkUploadLog({
//       logId,
//       summary,
//     });

//     const fileIndex = await indexExtractedFiles(extractedDir);
//     const successRows = Array.isArray(summary.successRows)
//       ? [...summary.successRows]
//       : [];
//     const failedRows = Array.isArray(summary.failedRows)
//       ? [...summary.failedRows]
//       : [];
//     const processedRows = getProcessedRowSet({
//       successRows,
//       failedRows,
//     });
//     let insertedCount = successRows.length;
//     let matchedDocumentCount = Number(summary.matchedDocumentCount || 0);
//     let missingDocumentCount = Number(summary.missingDocumentCount || 0);

//     for (const [index, rawRow] of rawRows.entries()) {
//       const rowNumber = index + 2;
//       if (processedRows.has(rowNumber)) {
//         continue;
//       }

//       const normalizedRow = normalizeRow(rawRow, XLSX);
//       const validationError = validateRow(normalizedRow);

//       summary.lastProcessedRow = rowNumber;

//       if (validationError) {
//         failedRows.push(
//           createRowFailureEntry({
//             rowNumber,
//             normalizedRow,
//             processedBy: summary.processedBy,
//             error: validationError,
//           }),
//         );
//       } else {
//         const documentReferences = getDocumentReferences(
//           normalizedRow.tender_documents_path,
//         );

//         const documentUploadResult = await uploadMatchedDocuments({
//           documentReferences,
//           fileIndex,
//           tenderNumber: normalizedRow.tender_number,
//         });

//         if (!documentUploadResult.success) {
//           missingDocumentCount += documentUploadResult.missingReferences.length;
//           failedRows.push(
//             createRowFailureEntry({
//               rowNumber,
//               normalizedRow,
//               processedBy: summary.processedBy,
//               error: documentUploadResult.missingReferences.join(", "),
//             }),
//           );
//         } else {
//           normalizedRow.tender_documents_path =
//             documentUploadResult.uploadedDocuments;

//           const result = await insertTenderUploadData(
//             buildTenderFormData(normalizedRow)
//           );

//           if (result?.success) {
//             insertedCount += 1;
//             matchedDocumentCount +=
//               documentUploadResult.uploadedDocuments.length;
//             successRows.push(
//               createRowSuccessEntry({
//                 rowNumber,
//                 normalizedRow,
//                 processedBy: summary.processedBy,
//                 documentCount: documentUploadResult.uploadedDocuments.length,
//               }),
//             );
//           } else {
//             const recoveredExistingTender =
//               result?.msg === messages.TENDER_NUMBER
//                 ? await findTenderCreatedAfterJobStart({
//                     tenderNumber: normalizedRow.tender_number,
//                     userEmail: summary.userEmail,
//                     jobInsertedDate: jobInsertedDate || logRow.inserted_date,
//                   })
//                 : null;

//             if (recoveredExistingTender) {
//               await rollbackUploadedDocuments(
//                 documentUploadResult.uploadedDocuments,
//               );

//               insertedCount += 1;
//               matchedDocumentCount +=
//                 documentUploadResult.uploadedDocuments.length;
//               successRows.push(
//                 createRowSuccessEntry({
//                   rowNumber,
//                   normalizedRow,
//                   processedBy: summary.processedBy,
//                   documentCount: documentUploadResult.uploadedDocuments.length,
//                   resumed: true,
//                 }),
//               );
//             } else {
//               await rollbackUploadedDocuments(
//                 documentUploadResult.uploadedDocuments,
//               );

//               failedRows.push(
//                 createRowFailureEntry({
//                   rowNumber,
//                   normalizedRow,
//                   processedBy: summary.processedBy,
//                   error:
//                     result?.msg ||
//                     result?.error ||
//                     result?.message ||
//                     messages.SERVER_ERROR,
//                 }),
//               );
//             }
//           }
//         }
//       }

//       processedRows.add(rowNumber);
//       summary.insertedCount = insertedCount;
//       summary.failedCount = failedRows.length;
//       summary.currentProcessedCount = processedRows.size;
//       summary.matchedDocumentCount = matchedDocumentCount;
//       summary.missingDocumentCount = missingDocumentCount;
//       summary.successRows = successRows;
//       summary.failedRows = failedRows;

//       await updateBulkUploadLog({
//         logId,
//         summary,
//       });
//     }

//     summary.stage =
//       insertedCount > 0
//         ? failedRows.length > 0
//           ? "partial_success"
//           : "completed"
//         : "failed";
//     summary.insertedCount = insertedCount;
//     summary.failedCount = failedRows.length;
//     summary.currentProcessedCount = processedRows.size;
//     summary.totalReceivedCount = rawRows.length;
//     summary.successRows = successRows;
//     summary.failedRows = failedRows;
//     summary.matchedDocumentCount = matchedDocumentCount;
//     summary.missingDocumentCount = missingDocumentCount;
//     summary.failedRowsExcelPath = await saveFailedRowsWorkbook({
//       XLSX,
//       failedRows,
//       destinationDir: failedRowsDir,
//       sourceFileName: fileName,
//     });

//     await updateBulkUploadLog({
//       logId,
//       summary,
//     });
//   } catch (error) {
//     console.error("Tender bulk upload error:", error);

//     summary.stage = "failed";
//     summary.failedRows = [
//       ...(Array.isArray(summary.failedRows) ? summary.failedRows : []),
//       createRowFailureEntry({
//         rowNumber: summary.lastProcessedRow || 0,
//         normalizedRow: {},
//         processedBy: summary.processedBy || processedBy || "",
//         error: error.message || messages.SERVER_ERROR,
//       }),
//     ];
//     summary.failedCount = summary.failedRows.length;
//     summary.currentProcessedCount = Math.max(
//       summary.currentProcessedCount,
//       summary.insertedCount + summary.failedCount,
//     );

//     await updateBulkUploadLog({
//       logId,
//       summary,
//     });
//   } finally {
//     await deleteDirectoryIfExists(extractedDir);
//   }
// };

// export async function resumePendingTenderBulkUploads() {
//   try {
//     await ensureBulkUploadColumns();

//     const pendingRows = await getPendingBulkUploadLogs();

//     pendingRows.forEach((row) => {
//       const uploadSummary = parseJsonValue(row.upload_summary, {});
//       const stage = String(uploadSummary?.stage || "queued");

//       if (!["queued", "processing"].includes(stage)) {
//         return;
//       }

//       scheduleBulkUploadProcessing({
//         logId: row.id,
//         excelServerPath: row.excel_file_path,
//         zipServerPath: row.zip_file_path,
//         fileName: row.file_name,
//         processedBy: row.inserted_by,
//         userEmail: uploadSummary?.userEmail || "",
//         jobInsertedDate: row.inserted_date,
//       });
//     });
//   } catch (error) {
//     console.error("resumePendingTenderBulkUploads:", error);
//   }
// }

// const schedulePendingBulkUploadRecovery = () => {
//   if (pendingRecoveryTimer) {
//     return;
//   }

//   pendingRecoveryTimer = setTimeout(() => {
//     pendingRecoveryTimer = null;
//     globalThis.__TENDER_BULK_UPLOAD_RECOVERY_TIMER__ = null;
//     resumePendingTenderBulkUploads().catch((error) => {
//       console.error("Scheduled bulk upload recovery failed:", error);
//     });
//   }, 0);

//   globalThis.__TENDER_BULK_UPLOAD_RECOVERY_TIMER__ = pendingRecoveryTimer;
// };

// export async function tenderBulkUpload(uploadFormData) {
//   try {
//     schedulePendingBulkUploadRecovery();

//     const file = uploadFormData.get("file");
//     const mediaFile = uploadFormData.get("mediaFile");

//     if (!file) {
//       return {
//         status: false,
//         message: "No file provided",
//       };
//     }

//     if (!mediaFile) {
//       return {
//         status: false,
//         message: "No ZIP file provided",
//       };
//     }

//     const session = await getServerSession(options);
//     const processedBy =
//       session?.user?.display_name ||
//       session?.user?.user_email ||
//       session?.user?.email;
//     const userEmail = session?.user?.user_email || session?.user?.email || "";
//     const batchRootDir = path.join(BULK_UPLOAD_STORAGE_ROOT);
//     const excelDir = path.join(batchRootDir, "excel");
//     const zipDir = path.join(batchRootDir, "zip");

//     const excelServerPath = await saveFileToServer(file, excelDir);
//     const zipServerPath = await saveFileToServer(mediaFile, zipDir);

//     const bulkUploadLog = await createBulkUploadLog({
//       fileName: file.name,
//       insertedBy: processedBy,
//       excelFilePath: excelServerPath,
//       zipFilePath: zipServerPath,
//     });

//     scheduleBulkUploadProcessing({
//       logId: bulkUploadLog.id,
//       excelServerPath,
//       zipServerPath,
//       fileName: file.name,
//       processedBy,
//       userEmail,
//       jobInsertedDate: bulkUploadLog.insertedDate,
//     });

//     return {
//       status: true,
//       message:
//         "Bulk upload started. Records are being processed in the background.",
//       data: {
//         id: bulkUploadLog.id,
//         processedBy,
//         excelServerPath,
//         zipServerPath,
//       },
//     };
//   } catch (error) {
//     console.error("Tender bulk upload error:", error);

//     return {
//       status: false,
//       message: error.message || messages.SERVER_ERROR,
//     };
//   }
// }

// export async function getTenderBulkUploadHistory() {
//   try {
//     schedulePendingBulkUploadRecovery();
//     await ensureBulkUploadColumns();

//     const session = await getServerSession(options);
//     const processedBy =
//       session?.user?.display_name ||
//       session?.user?.user_email ||
//       session?.user?.email;
//     const rows = await queryWithRetry(
//       `SELECT
//         id,
//         file_name,
//         total_records,
//         success_records,
//         failed_records,
//         status,
//         last_processed_on,
//         inserted_date,
//         inserted_by,
//         excel_file_path,
//         zip_file_path,
//         failure_details_path,
//         upload_summary,
//         failure_details
//       FROM ${TABLE_LIST.BULK_FILES_LIST}
//       WHERE inserted_by = $1
//       ORDER BY COALESCE(last_processed_on, inserted_date) DESC, id DESC`,
//       [processedBy],
//     );

//     const list = rows.map((row) => {
//       const uploadSummary = parseJsonValue(row.upload_summary, {});
//       const failureDetails = parseJsonValue(row.failure_details, []);

//       return {
//         id: row.id,
//         fileName: row.file_name,
//         totalRecords: Number(row.total_records || 0),
//         successRecords: Number(row.success_records || 0),
//         failedRecords: Number(row.failed_records || 0),
//         status: Number(row.status || 0),
//         statusLabel:
//           Number(row.status) === BULK_UPLOAD_STATUS.PROCESSING
//             ? uploadSummary?.stage === "queued"
//               ? "Queued"
//               : "Processing"
//             : Number(row.status) === BULK_UPLOAD_STATUS.SUCCESS
//               ? "Success"
//               : Number(row.status) === BULK_UPLOAD_STATUS.PARTIAL_SUCCESS
//                 ? "Partial Success"
//                 : "Failed",
//         stage: uploadSummary?.stage || "",
//         currentProcessedCount: Number(
//           uploadSummary?.currentProcessedCount || 0,
//         ),
//         lastProcessedRow: Number(uploadSummary?.lastProcessedRow || 0),
//         progressPercentage:
//           Number(uploadSummary?.totalReceivedCount || row.total_records || 0) >
//           0
//             ? Math.min(
//                 100,
//                 Math.round(
//                   (Number(uploadSummary?.currentProcessedCount || 0) /
//                     Number(
//                       uploadSummary?.totalReceivedCount ||
//                         row.total_records ||
//                         0,
//                     )) *
//                     100,
//                 ),
//               )
//             : 0,
//         processedBy: row.inserted_by || processedBy,
//         insertedDate: row.inserted_date || "",
//         lastProcessedOn: row.last_processed_on || "",
//         excelServerPath: row.excel_file_path || "",
//         zipServerPath: row.zip_file_path || "",
//         failedRowsExcelPath:
//           row.failure_details_path || uploadSummary?.failedRowsExcelPath || "",
//         matchedDocumentCount: Number(uploadSummary?.matchedDocumentCount || 0),
//         missingDocumentCount: Number(uploadSummary?.missingDocumentCount || 0),
//         successRows: Array.isArray(uploadSummary?.successRows)
//           ? uploadSummary.successRows
//           : [],
//         failedRows: Array.isArray(failureDetails) ? failureDetails : [],
//       };
//     });

//     return {
//       success: true,
//       data: list,
//     };
//   } catch (error) {
//     console.error("getTenderBulkUploadHistory:", error);
//     return {
//       success: false,
//       data: [],
//       message: error.message || messages.SERVER_ERROR,
//     };
//   }
// }

// export async function S3UploadData(uploadData) {
//   try {
//     const documents = uploadData.getAll("files");

//     if (!documents.length) {
//       return {
//         success: false,
//         msg: "No files selected",
//         data: [],
//       };
//     }

//     if (documents.length > 0) {
//       for (const file of documents) {
//         await uploadToS3(file, "tender_documents/tender_BulkUpload", true);
//       }
//     }

//     return {
//       success: true,
//       msg: "Files uploaded successfully",
//     };
//   } catch (error) {
//     console.error("S3UploadData:", error);
//     return {
//       success: false,
//       msg: error?.message || "Something went wrong",
//       data: [],
//     };
//   }
// }
