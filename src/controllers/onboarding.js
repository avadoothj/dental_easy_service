"use server";

import { getServerSession } from "next-auth";
import { generateRandomString, encryptPassword } from "@/utils/lib/functions";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { queryGenerator } from "@/utils/lib/queryGenerator";
import { db, dbRead, executeQuery } from "@/utils/lib/database";
import { TABLE_LIST } from "@/utils/lib/tablesList";
import { MESSAGES_LIST } from "@/utils/lib/messagesList";
import { uploadFile } from "@/utils/upload";

const DEFAULT_SUPER_ADMIN_ROLE = 1;

export async function getOnboardingById(onboardingId) {
	try {
		const onboardingQuery = `
			SELECT 
				o.id,
				o.field_engineer_id,
				o.current_step,
				o.status,
				o.completion_percentage
			FROM onboardings o
			WHERE o.id = ?
		`;

		const onboardingResult = await executeQuery(onboardingQuery, [onboardingId]);

		if (!onboardingResult.length) {
			return null;
		}

		const onboarding = onboardingResult[0];

		const personalQuery = `
			SELECT 
				id,
				full_name,
				phone,
				alternate_phone,
				email,
				dob,
				gender
			FROM field_engineers
			WHERE id = ?
		`;

		const addressQuery = `
			SELECT
				address_type,
				address_line_1,
				address_line_2,
				country,
				state,
				city,
				postal_code
			FROM engineer_addresses
			WHERE field_engineer_id = ?
		`;

		const documentQuery = `
			SELECT
				passport_photo,
				identity_proof,
				address_proof
			FROM engineer_documents
			WHERE field_engineer_id = ?
		`;

		const personalResult = await executeQuery(personalQuery, [onboarding.field_engineer_id]);

		const addressResult = await executeQuery(addressQuery, [onboarding.field_engineer_id]);

		const documentResult = await executeQuery(documentQuery, [onboarding.field_engineer_id]);

		const permanentAddress = addressResult.find((item) => item.address_type === "permanent");

		const currentAddress = addressResult.find((item) => item.address_type === "current");

		return {
			onboarding,
			personal: personalResult[0] || null,
			addresses: {
				permanent: permanentAddress || null,
				current: currentAddress || null,
			},
			documents: documentResult[0] || null,
		};
	} catch (error) {
		console.error("getOnboardingDetailsById error:", error);
		throw error;
	}
}

export async function getOnboardingCount() {
	try {
		let countQuery = `
			SELECT COUNT(1) AS count
			FROM onboardings 
		`;

		const result = await executeQuery(countQuery, []);

		return {
			count: result[0]?.count ?? 0,
		};
	} catch (error) {
		console.error("getOnboardingCount:", error);

		return {
			count: 0,
		};
	}
}

// export async function addPersonalFieldEngineer(formData) {
// 	console.log("formData :", formData);
// 	const session = await getServerSession(options);
// 	const user_id = session?.user?.user_id || null;

// 	const {
// 		name,
// 		phone,
// 		altPhone,
// 		dob,
// 		gender,
// 		email,
// 		permanentAddress1,
// 		permanentAddress2,
// 		permanentCountry,
// 		permanentState,
// 		permanentCity,
// 		permanentPostalCode,
// 		currentAddress1,
// 		currentAddress2,
// 		currentCountry,
// 		currentState,
// 		currentCity,
// 		currentPostalCode,
// 		isAddressSame,
// 	} = formData;

// 	try {
// 		const fieldEngineerPayload = {
// 			full_name: name,
// 			phone: phone,
// 			alternate_phone: altPhone,
// 			email: email,
// 			dob: dob,
// 			gender: gender,
// 		};

// 		const insertQuery = queryGenerator.generateInsertQuery(
// 			fieldEngineerPayload,
// 			TABLE_LIST.FIELDENGINEER,
// 			"user_id",
// 		);

// 		const result = await executeQuery(insertQuery);
// 		const fieldEngineerAddressPayload = {
// 			field_engineer_id: result.insertId,
// 			address_type: isAddressSame ? "permanent" : "current",
// 			address_line_1: isAddressSame ? permanentAddress1 : currentAddress1,
// 			address_line_2: isAddressSame ? permanentAddress2 : currentAddress2,
// 			country: isAddressSame ? permanentCountry : currentCountry,
// 			state: isAddressSame ? permanentState : currentState,
// 			city: isAddressSame ? permanentCity : currentCity,
// 			postal_code: isAddressSame ? permanentPostalCode : currentPostalCode,
// 		};
// 		const insertQuery1 = queryGenerator.generateInsertQuery(
// 			fieldEngineerAddressPayload,
// 			TABLE_LIST.ONBOARDING_ADDRESS,
// 			"user_id",
// 		);
// 		const result1 = await executeQuery(insertQuery1);

// 		const onboardingPayload = {
// 			field_engineer_id: result.insertId,
// 			current_step: "personal_information",
// 			status: "in_progress",
// 		};

// 		const insertQuery3 = queryGenerator.generateInsertQuery(
// 			onboardingPayload,
// 			TABLE_LIST.ONBOARDING,
// 			"user_id",
// 		);
// 		const result3 = await executeQuery(insertQuery3);

// 		console.log("result :", result3);

// 		if (result.insertId) {
// 			return {
// 				success: true,
// 				msg: `New User created`,
// 				onboardingId: result3.insertId,
// 				fieldEngineerId: result.insertId,
// 			};
// 		}
// 		return {
// 			success: false,
// 			msg: `New User creation failed`,
// 		};
// 	} catch (error) {
// 		console.error("new user create error::", error);
// 		return { error: error.message };
// 	}
// }

//personal field engineer
export async function addPersonalFieldEngineer(formData) {
	const session = await getServerSession(options);

	const user_id = session?.user?.user_id || null;

	const {
		onboardingId,
		fieldEngineerId,

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
			phone,
			alternate_phone: altPhone,
			email,
			dob,
			gender,
		};

		// ==================================================
		// UPDATE FLOW
		// ==================================================

		if (onboardingId && fieldEngineerId) {
			// UPDATE FIELD ENGINEER

			const updateFieldEngineerQuery = queryGenerator.generateUpdateQuery(
				fieldEngineerPayload,
				{
					id: fieldEngineerId,
				},
				TABLE_LIST.FIELDENGINEER,
			);

			await executeQuery(updateFieldEngineerQuery);

			// =========================
			// PERMANENT ADDRESS
			// =========================

			const permanentAddressPayload = {
				address_line_1: permanentAddress1,

				address_line_2: permanentAddress2,

				country: permanentCountry,

				state: permanentState,

				city: permanentCity,

				postal_code: permanentPostalCode,

				is_address_same: isAddressSame,
			};

			const updatePermanentAddressQuery = queryGenerator.generateUpdateQuery(
				permanentAddressPayload,
				{
					field_engineer_id: fieldEngineerId,
					address_type: "permanent",
				},
				TABLE_LIST.ONBOARDING_ADDRESS,
			);

			await executeQuery(updatePermanentAddressQuery);

			// =========================
			// CURRENT ADDRESS
			// =========================

			const currentAddressPayload = {
				address_line_1: isAddressSame ? permanentAddress1 : currentAddress1,

				address_line_2: isAddressSame ? permanentAddress2 : currentAddress2,

				country: isAddressSame ? permanentCountry : currentCountry,

				state: isAddressSame ? permanentState : currentState,

				city: isAddressSame ? permanentCity : currentCity,

				postal_code: isAddressSame ? permanentPostalCode : currentPostalCode,
				is_address_same: isAddressSame,
			};

			const updateCurrentAddressQuery = queryGenerator.generateUpdateQuery(
				currentAddressPayload,
				{
					field_engineer_id: fieldEngineerId,
					address_type: "current",
				},
				TABLE_LIST.ONBOARDING_ADDRESS,
			);

			await executeQuery(updateCurrentAddressQuery);

			return {
				success: true,

				msg: "User updated successfully",

				onboardingId,

				fieldEngineerId,
			};
		}

		// ==================================================
		// CREATE FLOW
		// ==================================================

		// CREATE FIELD ENGINEER

		const insertFieldEngineerQuery = queryGenerator.generateInsertQuery(
			fieldEngineerPayload,

			TABLE_LIST.FIELDENGINEER,

			"user_id",
		);

		const fieldEngineerResult = await executeQuery(insertFieldEngineerQuery);

		const newFieldEngineerId = fieldEngineerResult.insertId;

		// =========================
		// PERMANENT ADDRESS
		// =========================

		const permanentAddressPayload = {
			field_engineer_id: newFieldEngineerId,

			address_type: "permanent",

			address_line_1: permanentAddress1,

			address_line_2: permanentAddress2,

			country: permanentCountry,

			state: permanentState,

			city: permanentCity,

			postal_code: permanentPostalCode,
			is_address_same: isAddressSame,
		};

		const insertPermanentAddressQuery = queryGenerator.generateInsertQuery(
			permanentAddressPayload,

			TABLE_LIST.ONBOARDING_ADDRESS,

			"user_id",
		);

		await executeQuery(insertPermanentAddressQuery);

		// =========================
		// CURRENT ADDRESS
		// =========================

		const currentAddressPayload = {
			field_engineer_id: newFieldEngineerId,

			address_type: "current",

			address_line_1: isAddressSame ? permanentAddress1 : currentAddress1,

			address_line_2: isAddressSame ? permanentAddress2 : currentAddress2,

			country: isAddressSame ? permanentCountry : currentCountry,

			state: isAddressSame ? permanentState : currentState,

			city: isAddressSame ? permanentCity : currentCity,

			postal_code: isAddressSame ? permanentPostalCode : currentPostalCode,
			is_address_same: isAddressSame,
		};

		const insertCurrentAddressQuery = queryGenerator.generateInsertQuery(
			currentAddressPayload,

			TABLE_LIST.ONBOARDING_ADDRESS,

			"user_id",
		);

		await executeQuery(insertCurrentAddressQuery);

		// =========================
		// CREATE ONBOARDING
		// =========================

		const onboardingPayload = {
			field_engineer_id: newFieldEngineerId,

			current_step: "document_verification",

			status: "in_progress",
		};

		const insertOnboardingQuery = queryGenerator.generateInsertQuery(
			onboardingPayload,

			TABLE_LIST.ONBOARDING,

			"user_id",
		);

		const onboardingResult = await executeQuery(insertOnboardingQuery);

		return {
			success: true,

			msg: "New User created",

			onboardingId: onboardingResult.insertId,

			fieldEngineerId: newFieldEngineerId,
		};
	} catch (error) {
		console.error("new user create error::", error);

		return {
			success: false,
			error: error.message,
		};
	}
}

export async function savePeronalDraft(payload) {
	const {
		onboardingId,
		fieldEngineerId,

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
	} = payload;

	try {
		const fieldEngineerPayload = {
			full_name: name,
			phone,
			alternate_phone: altPhone,
			email,
			dob,
			gender,
		};

		// ==================================================
		// UPDATE FLOW
		// ==================================================

		if (onboardingId && fieldEngineerId) {
			// UPDATE FIELD ENGINEER
			const updateFieldEngineerQuery = queryGenerator.generateUpdateQuery(
				fieldEngineerPayload,
				{ id: fieldEngineerId },
				TABLE_LIST.FIELDENGINEER,
			);

			await executeQuery(updateFieldEngineerQuery);

			// =========================
			// PERMANENT ADDRESS
			// =========================

			const permanentAddressPayload = {
				address_line_1: permanentAddress1,

				address_line_2: permanentAddress2,

				country: permanentCountry,

				state: permanentState,

				city: permanentCity,

				postal_code: permanentPostalCode,

				is_address_same: isAddressSame,
			};

			const updatePermanentAddressQuery = queryGenerator.generateUpdateQuery(
				permanentAddressPayload,

				{ field_engineer_id: fieldEngineerId, address_type: "permanent" },
				TABLE_LIST.ONBOARDING_ADDRESS,
			);

			await executeQuery(updatePermanentAddressQuery);

			// =========================
			// CURRENT ADDRESS
			// =========================

			const currentAddressPayload = {
				address_line_1: isAddressSame ? permanentAddress1 : currentAddress1,

				address_line_2: isAddressSame ? permanentAddress2 : currentAddress2,

				country: isAddressSame ? permanentCountry : currentCountry,

				state: isAddressSame ? permanentState : currentState,

				city: isAddressSame ? permanentCity : currentCity,

				postal_code: isAddressSame ? permanentPostalCode : currentPostalCode,
				is_address_same: isAddressSame,
			};

			const updateCurrentAddressQuery = queryGenerator.generateUpdateQuery(
				currentAddressPayload,

				{ field_engineer_id: fieldEngineerId, address_type: "current" },
				TABLE_LIST.ONBOARDING_ADDRESS,
			);

			await executeQuery(updateCurrentAddressQuery);

			return {
				success: true,

				msg: "User Draft updated successfully",

				onboardingId,

				fieldEngineerId,
			};
		}

		// ==================================================
		// CREATE FLOW
		// ==================================================

		// CREATE FIELD ENGINEER

		const insertFieldEngineerQuery = queryGenerator.generateInsertQuery(
			fieldEngineerPayload,

			TABLE_LIST.FIELDENGINEER,

			"user_id",
		);

		const fieldEngineerResult = await executeQuery(insertFieldEngineerQuery);

		const newFieldEngineerId = fieldEngineerResult.insertId;

		// =========================
		// PERMANENT ADDRESS
		// =========================

		const permanentAddressPayload = {
			field_engineer_id: newFieldEngineerId,

			address_type: "permanent",

			address_line_1: permanentAddress1,

			address_line_2: permanentAddress2,

			country: permanentCountry,

			state: permanentState,

			city: permanentCity,

			postal_code: permanentPostalCode,
			is_address_same: isAddressSame,
		};

		const insertPermanentAddressQuery = queryGenerator.generateInsertQuery(
			permanentAddressPayload,

			TABLE_LIST.ONBOARDING_ADDRESS,

			"user_id",
		);

		await executeQuery(insertPermanentAddressQuery);

		// =========================
		// CURRENT ADDRESS
		// =========================

		const currentAddressPayload = {
			field_engineer_id: newFieldEngineerId,

			address_type: "current",

			address_line_1: isAddressSame ? permanentAddress1 : currentAddress1,

			address_line_2: isAddressSame ? permanentAddress2 : currentAddress2,

			country: isAddressSame ? permanentCountry : currentCountry,

			state: isAddressSame ? permanentState : currentState,

			city: isAddressSame ? permanentCity : currentCity,

			postal_code: isAddressSame ? permanentPostalCode : currentPostalCode,
			is_address_same: isAddressSame,
		};

		const insertCurrentAddressQuery = queryGenerator.generateInsertQuery(
			currentAddressPayload,

			TABLE_LIST.ONBOARDING_ADDRESS,

			"user_id",
		);

		await executeQuery(insertCurrentAddressQuery);

		const onboardingPayload = {
			field_engineer_id: newFieldEngineerId,

			current_step: "personal_information",

			status: "in_progress",
		};

		const insertOnboardingQuery = queryGenerator.generateInsertQuery(
			onboardingPayload,

			TABLE_LIST.ONBOARDING,

			"user_id",
		);

		const onboardingResult = await executeQuery(insertOnboardingQuery);

		return {
			success: true,

			msg: "New User Draft created",

			onboardingId: onboardingResult.insertId,

			fieldEngineerId: newFieldEngineerId,
		};
	} catch (error) {
		console.error("new user draft create error::", error);

		return {
			success: false,
			error: error.message,
		};
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

export async function addDocumentFieldEngineer(formData, fieldEngineerId) {
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

			const result = await executeQuery(query, [
				fieldEngineerId,
				doc.type,
				doc.file.fileName,
				doc.file.filePath,
				doc.file.fileSize,
				doc.file.mimeType,
			]);
		}
		await executeQuery(
			`
	UPDATE onboardings
	SET current_step = 'qualification_skills'
	WHERE field_engineer_id = ?
	`,
			[fieldEngineerId],
		);
		return {
			success: true,
			message: "Documents uploaded successfully",
			documents: {
				passport_photo: passportUpload,

				identity_proof: identityUpload,

				address_proof: addressUpload,
			},
		};
	} catch (error) {
		console.error("Error uploading documents:", error);
		return {
			success: false,
			error: "Failed to upload documents",
		};
	}
}

export async function saveDocumentDraft(formData, fieldEngineerId) {
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

			const result = await executeQuery(query, [
				fieldEngineerId,
				doc.type,
				doc.file.fileName,
				doc.file.filePath,
				doc.file.fileSize,
				doc.file.mimeType,
			]);
		}

		return {
			success: true,
			message: "Documents Draft uploaded successfully",
			documents: {
				passport_photo: passportUpload,

				identity_proof: identityUpload,

				address_proof: addressUpload,
			},
		};
	} catch (error) {
		console.error("Error Draft uploading documents:", error);
		return {
			success: false,
			error: "Failed to Draft upload documents",
		};
	}
}

export async function getOnboardingDataById(onboardingId) {
	try {
		const onboardingRows = await executeQuery(
			`
      SELECT 
        o.id,
        o.field_engineer_id,
        o.current_step,
        o.status
      FROM onboardings o
      WHERE o.field_engineer_id = ?
      LIMIT 1
      `,
			[onboardingId],
		);

		if (!onboardingRows.length) {
			return {
				success: false,
				message: "Onboarding not found",
			};
		}

		const onboarding = onboardingRows[0];

		const personalRows = await executeQuery(
			`
			SELECT 
			id,
			full_name,
			phone,
			alternate_phone,
			email,
			dob,
			gender
      FROM field_engineers
      WHERE id = ?
      LIMIT 1
      `,
			[onboarding.field_engineer_id],
		);

		const addressRows = await executeQuery(
			`
      SELECT
        id,
        address_type,
        address_line_1,
        address_line_2,
        country,
        state,
        city,
        postal_code
      FROM engineer_addresses
      WHERE field_engineer_id = ?
      `,
			[onboarding.field_engineer_id],
		);

		const documentRows = await executeQuery(
			`
			SELECT
			id,
        document_type,
        file_name,
        file_path,
		verification_status
		FROM engineer_documents
      WHERE field_engineer_id = ?
      `,
			[onboarding.field_engineer_id],
		);

		const qualificationRows = await executeQuery(
			`
			SELECT
			id,
        qualification,
        experience,
        specific_equipment_expertise,
        technician_type,
        services_coverage_city,
        services_coverage_area,
        training_certificate_file_name,
        training_certificate_file_path,
        special_certificate_file_name,
        special_certificate_file_path
      FROM engineer_qualifications
      WHERE field_engineer_id = ?
      `,
			[onboarding.field_engineer_id],
		);

		const userCreationRows = await executeQuery(
			` SELECT
		username,
		assign_service_head
      FROM engineer_user_creation
      WHERE field_engineer_id = ?`,
			[onboarding.field_engineer_id],
		);

		const bankDetailRows = await executeQuery(
			` SELECT
			id,
		bank_name,
		account_holder_name,
		account_type,
		account_number,
		ifsc_code,
		branch_name
      FROM engineer_bank_details
      WHERE field_engineer_id = ?`,
			[onboarding.field_engineer_id],
		);
		const benefitRows = await executeQuery(
			` SELECT
			id,
		insurance_plan,
		insurance_type,
		coverage_amount,
		policy_number,
		family_members
      FROM engineer_benefits
      WHERE field_engineer_id = ?`,
			[onboarding.field_engineer_id],
		);

		const ratingRows = await executeQuery(
			` SELECT
			id,
		technical_skills,
		qualification_skills,
		customer_reviews,
		feedback
      FROM engineer_ratings
      WHERE field_engineer_id = ?`,
			[onboarding.field_engineer_id],
		);

		const permanentAddress =
			addressRows.find((item) => item.address_type === "permanent") || null;

		const currentAddress = addressRows.find((item) => item.address_type === "current") || null;

		return {
			success: true,
			data: {
				onboarding,
				personal:
					{
						...personalRows[0],
						addresses: { permanent: permanentAddress, current: currentAddress },
					} || null,
				addresses: {
					permanent: permanentAddress,
					current: currentAddress,
				},
				documents: documentRows || null,
				qualification: qualificationRows[0] || null,
				userCreation: userCreationRows[0] || null,
				bank: bankDetailRows[0] || null,
				benefits: benefitRows[0] || null,
				rating: ratingRows[0] || null,
			},
		};
	} catch (error) {
		console.error("getOnboardingById error:", error);

		return {
			success: false,
			message: "Failed to fetch onboarding",
			error: error.message,
		};
	}
}

//Qualification Skills
export async function addQualificationFieldEngineer(formData) {
	try {
		const onboardingId = formData.get("onboardingId");

		const fieldEngineerId = formData.get("fieldEngineerId");

		const qualification = formData.get("qualification");

		const experience = formData.get("experience");

		const specificEquipmentExpertise = formData.get("specificEquipmentExpertise");

		const technicianType = formData.get("technicianType");

		const servicesCoveragecity = formData.get("servicesCoveragecity");

		const servicesCoveragearea = formData.get("servicesCoveragearea");

		// =====================================
		// FILES
		// =====================================

		const uploadtrainingCertificates = formData.get("uploadtrainingCertificates");

		const specialCertifications = formData.get("specialCertifications");

		let uploadtrainingCertificatesUpload = null;

		let specialCertificationsUpload = null;

		if (uploadtrainingCertificates) {
			uploadtrainingCertificatesUpload = await uploadFile(
				uploadtrainingCertificates,

				"qualification-certificates",
			);
		}

		if (specialCertifications) {
			specialCertificationsUpload = await uploadFile(
				specialCertifications,

				"qualification-certificates",
			);
		}

		// =====================================
		// CHECK EXISTING
		// =====================================

		const existingRows = await executeQuery(
			`
				SELECT id
				FROM engineer_qualifications
				WHERE field_engineer_id = ?
				LIMIT 1
				`,
			[fieldEngineerId],
		);

		const qualificationPayload = {
			field_engineer_id: fieldEngineerId,

			qualification,

			experience,

			specific_equipment_expertise: specificEquipmentExpertise,

			technician_type: technicianType,

			services_coverage_city: servicesCoveragecity,

			services_coverage_area: servicesCoveragearea,

			training_certificate_file_name: uploadtrainingCertificatesUpload?.fileName || null,

			training_certificate_file_path: uploadtrainingCertificatesUpload?.filePath || null,

			special_certificate_file_name: specialCertificationsUpload?.fileName || null,

			special_certificate_file_path: specialCertificationsUpload?.filePath || null,
		};

		// =====================================
		// UPDATE FLOW
		// =====================================

		if (existingRows.length) {
			const updateQuery = queryGenerator.generateUpdateQuery(
				qualificationPayload,

				TABLE_LIST.ENGINEER_QUALIFICATIONS,

				`field_engineer_id=${fieldEngineerId}`,

				"user_id",
			);

			await executeQuery(updateQuery);
		}

		// =====================================
		// CREATE FLOW
		// =====================================
		else {
			const insertQuery = queryGenerator.generateInsertQuery(
				qualificationPayload,

				TABLE_LIST.ENGINEER_QUALIFICATIONS,

				"user_id",
			);

			await executeQuery(insertQuery);
		}

		// =====================================
		// UPDATE STEP
		// =====================================

		await executeQuery(
			`
			UPDATE onboardings
			SET current_step = 'user_creation'
			WHERE id = ?
			`,
			[onboardingId],
		);

		return {
			success: true,

			message: "Qualification saved successfully",

			data: qualificationPayload,
		};
	} catch (error) {
		console.error("addQualificationFieldEngineer error:", error);

		return {
			success: false,

			error: error.message,
		};
	}
}

export async function savequalificationDraft(formData) {
	try {
		const fieldEngineerId = formData.get("fieldEngineerId");

		const qualification = formData.get("qualification");

		const experience = formData.get("experience");

		const specificEquipmentExpertise = formData.get("specificEquipmentExpertise");

		const technicianType = formData.get("technicianType");

		const servicesCoveragecity = formData.get("servicesCoveragecity");

		const servicesCoveragearea = formData.get("servicesCoveragearea");

		// =====================================
		// FILES
		// =====================================

		const uploadtrainingCertificates = formData.get("uploadtrainingCertificates");

		const specialCertifications = formData.get("specialCertifications");

		let uploadtrainingCertificatesUpload = null;

		let specialCertificationsUpload = null;

		if (uploadtrainingCertificates) {
			uploadtrainingCertificatesUpload = await uploadFile(
				uploadtrainingCertificates,

				"qualification-certificates",
			);
		}

		if (specialCertifications) {
			specialCertificationsUpload = await uploadFile(
				specialCertifications,

				"qualification-certificates",
			);
		}

		// =====================================
		// CHECK EXISTING
		// =====================================

		const existingRows = await executeQuery(
			`
				SELECT id
				FROM engineer_qualifications
				WHERE field_engineer_id = ?
				LIMIT 1
				`,
			[fieldEngineerId],
		);

		const qualificationPayload = {
			field_engineer_id: fieldEngineerId,

			qualification,

			experience,

			specific_equipment_expertise: specificEquipmentExpertise,

			technician_type: technicianType,

			services_coverage_city: servicesCoveragecity,

			services_coverage_area: servicesCoveragearea,

			training_certificate_file_name: uploadtrainingCertificatesUpload?.fileName || null,

			training_certificate_file_path: uploadtrainingCertificatesUpload?.filePath || null,

			special_certificate_file_name: specialCertificationsUpload?.fileName || null,

			special_certificate_file_path: specialCertificationsUpload?.filePath || null,
		};

		// =====================================
		// UPDATE FLOW
		// =====================================

		if (existingRows.length) {
			const updateQuery = queryGenerator.generateUpdateQuery(
				qualificationPayload,

				TABLE_LIST.ENGINEER_QUALIFICATIONS,

				`field_engineer_id=${fieldEngineerId}`,

				"user_id",
			);

			await executeQuery(updateQuery);
		}

		// =====================================
		// CREATE FLOW
		// =====================================
		else {
			const insertQuery = queryGenerator.generateInsertQuery(
				qualificationPayload,

				TABLE_LIST.ENGINEER_QUALIFICATIONS,

				"user_id",
			);

			await executeQuery(insertQuery);
		}

		return {
			success: true,

			message: "Qualification saved successfully",

			data: qualificationPayload,
		};
	} catch (error) {
		console.error("addQualificationFieldEngineer error:", error);

		return {
			success: false,

			error: error.message,
		};
	}
}

//User Creation

export async function addUserCreationFieldEngineer(payload) {
	try {
		("payload :", payload);

		const { onboardingId, fieldEngineerId, username, password, assignServiceHead } = payload;

		// =====================================
		// CHECK USER EXISTENCE
		// =====================================
		const userExisting = await executeQuery(
			`
			SELECT user_id
			FROM user_master
			WHERE login_id = ?
			LIMIT 1
			`,
			[username],
		);

		if (userExisting.length) {
			return {
				success: false,
				message: "Username already exists",
			};
		}
		const personalInfo = await executeQuery(
			`
			SELECT full_name, phone, alternate_phone, email, dob, gender
			FROM field_engineers
			WHERE id = ?
			LIMIT 1
			`,
			[fieldEngineerId],
		);

		const encryptedPassword = encryptPassword(password);
		const formattedDob = personalInfo?.[0]?.dob
			? new Date(personalInfo[0].dob).toISOString().split("T")[0]
			: null;

		const userCreationPayload = {
			login_id: username,
			user_name: username,
			password: encryptedPassword,
			mobile: personalInfo[0].phone,
			email: personalInfo[0].email,
			role_id: 4,
		};

		const insertQuery = queryGenerator.generateInsertQuery(
			userCreationPayload,
			TABLE_LIST.USER_MASTER,
			"user_id",
		);
		await executeQuery(insertQuery);

		// =====================================
		// CHECK EXISTING
		// =====================================

		const existingRows = await executeQuery(
			`
				SELECT id
				FROM engineer_user_creation
				WHERE field_engineer_id = ?
				LIMIT 1
				`,
			[fieldEngineerId],
		);

		const userPayload = {
			field_engineer_id: fieldEngineerId,
			username,
			assign_service_head: assignServiceHead,
		};

		// =====================================
		// UPDATE FLOW
		// =====================================

		if (existingRows.length) {
			const updateQuery = queryGenerator.generateUpdateQuery(
				userPayload,
				TABLE_LIST.ENGINEER_USER_CREATION,
				`field_engineer_id=${fieldEngineerId}`,
				"user_id",
			);

			await executeQuery(updateQuery);
		}

		// =====================================
		// CREATE FLOW
		// =====================================
		else {
			const insertQuery = queryGenerator.generateInsertQuery(
				userPayload,
				TABLE_LIST.ENGINEER_USER_CREATION,
				"user_id",
			);

			await executeQuery(insertQuery);
		}

		// =====================================
		// UPDATE STEP
		// =====================================

		await executeQuery(
			`
			UPDATE onboardings
			SET current_step = 'bank_details'
			WHERE id = ?
			`,
			[onboardingId],
		);

		return {
			success: true,
			message: "User creation saved successfully",
			data: userPayload,
		};
	} catch (error) {
		console.error("addUserCreationFieldEngineer error:", error);

		return {
			success: false,

			error: error.message,
		};
	}
}

//Bank Details

export async function addBankDetailFieldEngineer(payload) {
	try {
		const {
			onboardingId,
			fieldEngineerId,
			bankName,
			accountHolderName,
			accountType,
			accountNumber,
			ifscCode,
			branchName,
		} = payload;

		const existingRows = await executeQuery(
			`
				SELECT id
				FROM engineer_bank_details
				WHERE field_engineer_id = ?
				LIMIT 1
				`,
			[fieldEngineerId],
		);

		const bankPayload = {
			field_engineer_id: fieldEngineerId,

			bank_name: bankName,

			account_holder_name: accountHolderName,

			account_type: accountType,

			account_number: accountNumber,

			ifsc_code: ifscCode,

			branch_name: branchName,
		};

		// UPDATE

		if (existingRows.length) {
			const updateQuery = queryGenerator.generateUpdateQuery(
				bankPayload,

				TABLE_LIST.ENGINEER_BANK_DETAILS,

				`field_engineer_id=${fieldEngineerId}`,

				"user_id",
			);

			await executeQuery(updateQuery);
		}

		// CREATE
		else {
			const insertQuery = queryGenerator.generateInsertQuery(
				bankPayload,

				TABLE_LIST.ENGINEER_BANK_DETAILS,

				"user_id",
			);

			await executeQuery(insertQuery);
		}

		// UPDATE STEP

		await executeQuery(
			`
			UPDATE onboardings
			SET current_step = 'benefits'
			WHERE id = ?
			`,
			[onboardingId],
		);

		return {
			success: true,
			message: "Bank details saved successfully",
			data: bankPayload,
		};
	} catch (error) {
		console.error("addBankDetailFieldEngineer error:", error);

		return {
			success: false,

			error: error.message,
		};
	}
}

//Benefits

export async function addBenefitFieldEngineer(payload) {
	try {
		const {
			onboardingId,
			fieldEngineerId,

			insurancePlan,
			insuranceType,
			coverageAmount,
			policyNumber,

			familyMembers,
		} = payload;

		// =====================================
		// CHECK EXISTING
		// =====================================

		const existingRows = await executeQuery(
			`
				SELECT id
				FROM engineer_benefits
				WHERE field_engineer_id = ?
				LIMIT 1
				`,
			[fieldEngineerId],
		);

		const benefitPayload = {
			field_engineer_id: fieldEngineerId,

			insurance_plan: insurancePlan,

			insurance_type: insuranceType,

			coverage_amount: coverageAmount,

			policy_number: policyNumber,

			family_members: JSON.stringify(familyMembers || []),
		};

		// UPDATE

		if (existingRows.length) {
			const updateQuery = queryGenerator.generateUpdateQuery(
				benefitPayload,

				TABLE_LIST.ENGINEER_BENEFITS,

				`field_engineer_id=${fieldEngineerId}`,

				"user_id",
			);

			await executeQuery(updateQuery);
		}

		// CREATE
		else {
			const insertQuery = queryGenerator.generateInsertQuery(
				benefitPayload,

				TABLE_LIST.ENGINEER_BENEFITS,

				"user_id",
			);

			await executeQuery(insertQuery);
		}

		// UPDATE STEP

		await executeQuery(
			`
			UPDATE onboardings
			SET current_step = 'rating'
			WHERE id = ?
			`,
			[onboardingId],
		);

		return {
			success: true,

			message: "Benefits saved successfully",

			data: benefitPayload,
		};
	} catch (error) {
		console.error("addBenefitFieldEngineer error:", error);

		return {
			success: false,

			error: error.message,
		};
	}
}

//Rating

export async function addRatingFieldEngineer(payload) {
	try {
		const {
			onboardingId,
			fieldEngineerId,

			technicalSkills,
			qualificationSkills,
			customerReviews,
			feedback,
		} = payload;

		const existingRows = await executeQuery(
			`
				SELECT id
				FROM engineer_ratings
				WHERE field_engineer_id = ?
				LIMIT 1
				`,
			[fieldEngineerId],
		);

		const ratingPayload = {
			field_engineer_id: fieldEngineerId,

			technical_skills: technicalSkills,

			qualification_skills: qualificationSkills,

			customer_reviews: customerReviews,

			feedback,
		};

		// UPDATE

		if (existingRows.length) {
			const updateQuery = queryGenerator.generateUpdateQuery(
				ratingPayload,
				{ field_engineer_id: fieldEngineerId },
				TABLE_LIST.ENGINEER_RATINGS,

				"user_id",
			);

			await executeQuery(updateQuery);
		}

		// CREATE
		else {
			const insertQuery = queryGenerator.generateInsertQuery(
				ratingPayload,

				TABLE_LIST.ENGINEER_RATINGS,

				"user_id",
			);

			await executeQuery(insertQuery);
		}

		return {
			success: true,

			message: "Rating saved successfully",

			data: ratingPayload,
		};
	} catch (error) {
		console.error("addRatingFieldEngineer error:", error);

		return {
			success: false,

			error: error.message,
		};
	}
}

export async function handleStepChange(step, onboardingId) {
	try {
		const repsonse = await executeQuery(
			`
			UPDATE onboardings
			SET current_step = ?
			WHERE id = ?
			`,
			[step.id, onboardingId],
		);

		return { success: true };
	} catch (error) {
		console.error("handleStepChange error:", error);
		return { success: false };
	}
}
