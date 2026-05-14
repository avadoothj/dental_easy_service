"use server";
import AWS from "aws-sdk";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// suppress warning migrate to V3 in console
require("aws-sdk/lib/maintenance_mode_message").suppress = true;

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
});

const S3_URI_PREFIX = "s3://tender-bharo-tender-documents/";
const S3_HTTPS_PREFIX =
  "https://tender-bharo-tender-documents.s3.ap-south-1.amazonaws.com/";
const S3_HTTPS_GLOBAL_PREFIX =
  "https://tender-bharo-tender-documents.s3.amazonaws.com/";
const S3_DELETE_BACKUP_FOLDER =
  process.env.S3_DELETE_BACKUP_FOLDER || "tender_documents/deleted_backup";

export const getS3KeyFromPath = (path = "") => {
  const normalizedPath = String(path || "").trim();

  if (!normalizedPath) {
    return "";
  }

  if (normalizedPath.startsWith(S3_URI_PREFIX)) {
    return normalizedPath.slice(S3_URI_PREFIX.length);
  }

  if (normalizedPath.startsWith(S3_HTTPS_PREFIX)) {
    return normalizedPath.slice(S3_HTTPS_PREFIX.length);
  }

  if (normalizedPath.startsWith(S3_HTTPS_GLOBAL_PREFIX)) {
    return normalizedPath.slice(S3_HTTPS_GLOBAL_PREFIX.length);
  }

  if (normalizedPath.startsWith("tender_documents/")) {
    return normalizedPath;
  }

  return "";
};

export const uploadToS3 = async (
  file,
  folder = "tender_documents/tender_manual_create",
  isMedia = false,
) => {
  const fileName = isMedia ? file.name : `${Date.now()}_${file.name}`;

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${folder}/${fileName}`,
    Body: Buffer.from(await file.arrayBuffer()),
    ContentType: file.type,
  };

  const upload = await s3.upload(params).promise();
  const getS3Url = (path) => {
    if (!path) return "#";

    const bucketUrl = S3_URI_PREFIX;

    if (path.startsWith(S3_HTTPS_PREFIX)) {
      return path.replace(S3_HTTPS_PREFIX, bucketUrl);
    }

    if (path.startsWith("tender_documents")) {
      return bucketUrl + path;
    }

    return path;
  };

  return {
    url: getS3Url(upload.Location),
    key: upload.Key,
  };
};

export const deleteFromS3 = async (path) => {
  const key = getS3KeyFromPath(path);

  if (!key) {
    return {
      success: false,
      skipped: true,
      reason: "Invalid S3 path",
    };
  }

  await s3
    .deleteObject({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    })
    .promise();

  return {
    success: true,
    key,
  };
};

export const backupAndDeleteFromS3 = async (path) => {
  const key = getS3KeyFromPath(path);

  if (!key) {
    return {
      success: false,
      skipped: true,
      reason: "Invalid S3 path",
    };
  }

  const fileName = key.split("/").pop();
  const backupKey = `${S3_DELETE_BACKUP_FOLDER}/${Date.now()}_${fileName}`;

  await s3
    .copyObject({
      Bucket: process.env.S3_BUCKET_NAME,
      CopySource: encodeURI(`${process.env.S3_BUCKET_NAME}/${key}`),
      Key: backupKey,
    })
    .promise();

  await deleteFromS3(key);

  try {
    await s3
      .headObject({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
      })
      .promise();

    throw new Error(`Original object still exists after delete: ${key}`);
  } catch (error) {
    if (
      error?.code !== "NotFound" &&
      error?.statusCode !== 404 &&
      error?.name !== "NotFound"
    ) {
      throw error;
    }
  }

  return {
    success: true,
    key,
    backupKey,
  };
};

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});
function parseS3Path(s3Path) {
  const DEFAULT_BUCKET = "tender-bharo-tender-documents";

  if (s3Path.startsWith("s3://")) {
    const path = s3Path.replace("s3://", "");
    const [bucket, ...keyParts] = path.split("/");
    return { bucket, key: keyParts.join("/") };
  }

  return { bucket: DEFAULT_BUCKET, key: s3Path };
}
function getContentTypeFromKey(key) {
  const ext = key.split(".").pop()?.toLowerCase();

  const map = {
    pdf: "application/pdf",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    svg: "image/svg+xml",
  };

  return map[ext] || "application/octet-stream";
}
export async function generatePresignedUrl(path, isPreview = false) {
  try {
    if (!path) return null;

    const { bucket, key } = parseS3Path(path);
    const fileName = key.split("/").pop();
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
     ResponseContentDisposition: isPreview
        ? "inline"
        : `attachment; filename="${fileName}"`,

      ResponseContentType: getContentTypeFromKey(key),
    });

    const url = await getSignedUrl(s3Client, command, {
      expiresIn: 300,
    });
    return url;
  } catch (error) {
    console.error("❌ S3 ERROR:", error?.message || error);
    throw error;
  }
}