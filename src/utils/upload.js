import fs from "fs";
import path from "path";

export async function uploadFile(file, folder = "engineer-documents") {
	try {
		if (!file) return null;

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		const uploadDir = path.join(process.cwd(), "src", "uploads", folder);

		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true });
		}

		const fileExtension = file.name.split(".").pop();
		const uniqueFileName = `${Date.now()}-${Math.random()
			.toString(36)
			.slice(2)}.${fileExtension}`;

		const filePath = path.join(uploadDir, uniqueFileName);

		fs.writeFileSync(filePath, buffer);

		return {
			fileName: uniqueFileName,
			originalName: file.name,
			filePath: `/src/uploads/${folder}/${uniqueFileName}`,
			fileSize: file.size,
			mimeType: file.type,
		};
	} catch (error) {
		console.error("uploadFile error:", error);
		throw error;
	}
}
