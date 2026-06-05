"use server";

import * as XLSX from "xlsx";
export async function handleProductUpload(formData) {
	try {
		const file = formData.get("productExcel");
		const buffer = Buffer.from(await file.arrayBuffer());

		const workbook = XLSX.read(buffer, { type: "buffer" });

		const sheetName = workbook.SheetNames[0];
		const sheet = workbook.Sheets[sheetName];

		const rows = XLSX.utils.sheet_to_json(sheet);
            


	} catch (error) {
		console.error("handleProductUpload error:", error);
		return { success: false };
	}
}

{/*

    // 24+104+30=158-365=113
    
    DB Schema ProductMaster 
    id
    service_type
    
    type
    brand
    model_name
    
    */}

