"use server";

import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { queryGenerator } from "@/utils/lib/queryGenerator";
import { db, dbRead, executeQuery } from "@/utils/lib/database";
import { TABLE_LIST } from "@/utils/lib/tablesList";
import { MESSAGES_LIST } from "@/utils/lib/messagesList";
import { uploadFile } from "@/utils/upload";

const DEFAULT_SUPER_ADMIN_ROLE = 1;

export async function addPersonalFieldEngineer(formData) {
	console.log("formData :", formData);
	const session = await getServerSession(options);
	const user_id = session?.user?.user_id || null;

	const {
		name,
		phone,
		altPhone,
		dob,
		gender,
		email,
		permanentAddress1,
		permanentAddress2,
		permanentCountry,
		permanentState,
		permanentCity,
		permanentPostalCode,
		currentAddress1,
		currentAddress2,
		currentCountry,
		currentState,
		currentCity,
		currentPostalCode,
		isAddressSame,
	} = formData;

	try {
		const fieldEngineerPayload = {
			full_name: name,
			phone: phone,
			alternate_phone: altPhone,
			email: email,
			dob: dob,
			gender: gender,
		};

		const insertQuery = queryGenerator.generateInsertQuery(
			fieldEngineerPayload,
			TABLE_LIST.FIELDENGINEER,
			"user_id",
		);

		const result = await executeQuery(insertQuery);
		const fieldEngineerAddressPayload = {
			field_engineer_id: result.insertId,
			address_type: isAddressSame ? "permanent" : "current",
			address_line_1: isAddressSame ? permanentAddress1 : currentAddress1,
			address_line_2: isAddressSame ? permanentAddress2 : currentAddress2,
			country: isAddressSame ? permanentCountry : currentCountry,
			state: isAddressSame ? permanentState : currentState,
			city: isAddressSame ? permanentCity : currentCity,
			postal_code: isAddressSame ? permanentPostalCode : currentPostalCode,
		};
		const insertQuery1 = queryGenerator.generateInsertQuery(
			fieldEngineerAddressPayload,
			TABLE_LIST.ONBOARDING_ADDRESS,
			"user_id",
		);
		const result1 = await executeQuery(insertQuery1);

		const onboardingPayload = {
			field_engineer_id: result.insertId,
			current_step: "personal_information",
			status: "in_progress",
		};

		const insertQuery3 = queryGenerator.generateInsertQuery(
			onboardingPayload,
			TABLE_LIST.ONBOARDING,
			"user_id",
		);
		const result3 = await executeQuery(insertQuery3);

		console.log("result :", result3);

		return;
		if (result.insertId) {
			return {
				success: true,
				msg: `New User created`,
			};
		}
		return {
			success: false,
			msg: `New User creation failed`,
		};
	} catch (error) {
		console.error("new user create error::", error);
		return { error: error.message };
	}
}

export async function getFieldEngineerList(filters) {
	try {
		const queryParams = [];
		let paramIndex = 1;

		const sortBy = filters?.sort;
		const perPage = filters?.per_page || 10;
		const pageNo = filters?.page_no || 1;
		const offset = pageNo * perPage - perPage;

		let resetPassListQuery = `
       SELECT 
	  	 u.id,
         u.full_name,
         u.email,
         u.phone,
         u.dob,
         u.gender,
         r.current_step,
         r.status
       FROM ${TABLE_LIST.FIELDENGINEER} u
       LEFT JOIN ${TABLE_LIST.ONBOARDING} r
         ON u.id = r.field_engineer_id
       WHERE  1=1
     `;

		// 	if (filters?.search) {
		// 		resetPassListQuery += `
		//      AND (
		//        u.user_name ILIKE $${paramIndex}
		//        OR u.login_id ILIKE $${paramIndex}
		//        OR r.role_name ILIKE $${paramIndex}
		//      )
		//    `;
		// 		queryParams.push(`%${filters.search}%`);
		// 		paramIndex++;
		// 	}

		// 	switch (sortBy) {
		// 		case "name_desc":
		// 			resetPassListQuery += ` ORDER BY TRIM(u.user_name) DESC`;
		// 			break;
		// 		case "name_asc":
		// 			resetPassListQuery += ` ORDER BY TRIM(u.user_name) ASC`;
		// 			break;
		// 		case "created_asc":
		// 			resetPassListQuery += ` ORDER BY u.inserted_date ASC`;
		// 			break;
		// 		case "created_desc":
		// 		default:
		// 			resetPassListQuery += ` ORDER BY u.inserted_date DESC`;
		// 			break;
		// 	}

		// 	resetPassListQuery += ` LIMIT ${perPage} OFFSET ${offset}`;

		const result = await executeQuery(resetPassListQuery, queryParams);
		console.log("result :", result);

		const list = result.map((x) => ({
			...x,
			is_primary: false,
		}));

		return { success: true, list };
	} catch (error) {
		console.error("getFieldEngineerList:", error);
		return { success: false, msg: error.message };
	}
}

export async function getFieldEngineer(fieldEngineerId) {
	try {
		let query = `
      SELECT 
       field_engineer.id,
	   onboarding.current_step,
	   onboarding.status
      FROM ${TABLE_LIST.FIELDENGINEER} as field_engineer
	  LEFT JOIN ${TABLE_LIST.ONBOARDING} as onboarding
	  ON field_engineer.id = onboarding.field_engineer_id
      WHERE field_engineer.id = ?
       `;

		const result = await executeQuery(query, [fieldEngineerId]);

		if (!result.length) {
			return {
				success: false,
				data: MESSAGES_LIST.INVALID_ID_PROVIDED,
			};
		}

		let fullData = { ...result[0] };

		if (result[0].status === "in_progress" && result[0].current_step) {
			const stepData = await getUserDataByCurrentStep(
				result[0].current_step,
				fieldEngineerId,
			);

			fullData = {
				...fullData,
				...stepData,
			};
		}

		return {
			success: true,
			data: fullData,
		};
	} catch (error) {
		console.error("get field engineer by id error::", error);
		return {
			success: false,
			error: error.message,
		};
	}
}

export async function getUserDataByCurrentStep(current_step, fieldEngineerId) {
	console.log("current_step :", current_step);
	if (current_step == "personal_information") {
		let query = `
				SELECT 
				field_engineer.id,
				field_engineer.full_name,
				field_engineer.phone,
				field_engineer.alternate_phone,
				field_engineer.email,
				field_engineer.dob,
				field_engineer.gender,
				permanent_address.address_type,
				permanent_address.address_line_1,
				permanent_address.address_line_2,
				permanent_address.country,
				permanent_address.state,
				permanent_address.city,
				permanent_address.postal_code,
				current_address.address_type,
				current_address.address_line_1,
				current_address.address_line_2,		
				current_address.country,
				current_address.state,
				current_address.city,
				current_address.postal_code
				FROM ${TABLE_LIST.FIELDENGINEER} as field_engineer
				LEFT JOIN ${TABLE_LIST.ONBOARDING_ADDRESS} AS permanent_address
		ON field_engineer.id = permanent_address.field_engineer_id
		AND permanent_address.address_type = 'permanent'

	LEFT JOIN ${TABLE_LIST.ONBOARDING_ADDRESS} AS current_address
		ON field_engineer.id = current_address.field_engineer_id
		AND current_address.address_type = 'current'
				WHERE field_engineer.id = ?
		`;
		const result = await executeQuery(query, [fieldEngineerId]);
		return result.length > 0 ? result[0] : {};
	} else if (current_step == "document_verification") {
	} else if (current_step == "qualification_skills") {
	} else if (current_step == "user_creation") {
	} else if (current_step == "bank_details") {
	} else if (current_step == "benefits") {
	} else if (current_step == "rating") {
	} else if (current_step == "rating") {
	}
}

// Document Field Engineer

export async function addDocumentFieldEngineer(formData) {
	console.log("formData :", formData);
	try {
		const passportPhoto = formData.get("passportPhoto");
		const identityProof = formData.get("identityProof");
		const addressProof = formData.get("addressProof");

		const passportUpload = await uploadFile(passportPhoto);
		const identityUpload = await uploadFile(identityProof);
		const addressUpload = await uploadFile(addressProof);

		const documents = [
			{
				type: "passport_photo",
				file: passportUpload,
			},
			{
				type: "identity_proof",
				file: identityUpload,
			},
			{
				type: "address_proof",
				file: addressUpload,
			},
		];

		console.log("documents :", documents);
		for (const doc of documents) {
			if (!doc.file) continue;

			const query = `
				INSERT INTO ${TABLE_LIST.ENGINEER_DOCUMENTS}
				(
					field_engineer_id,
					document_type,
					file_name,
					file_path,
					file_size,
					mime_type
				)
				VALUES (?, ?, ?, ?, ?, ?)
				ON DUPLICATE KEY UPDATE
					file_name = VALUES(file_name),
					file_path = VALUES(file_path),
					file_size = VALUES(file_size),
					mime_type = VALUES(mime_type),
					updated_at = CURRENT_TIMESTAMP
			`;

			const result = await db.query(query, [
				fieldEngineerId,
				doc.type,
				doc.file.fileName,
				doc.file.filePath,
				doc.file.fileSize,
				doc.file.mimeType,
			]);
			console.log("result :", result);
		}

		return {
			success: true,
			message: "Documents uploaded successfully",
		};
	} catch (error) {}
}
