"use server";

import { generateRandomString, encryptPassword } from "@/utils/lib/functions";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { queryGenerator } from "@/utils/lib/queryGenerator";
import { TABLE_LIST } from "@/utils/lib/tablesList";
import { db, dbRead, executeQuery } from "@/utils/lib/database";
import { saveLog } from "@/utils/logger";
import { sendUserMail } from "@/utils/sendUserMail";
import { MESSAGES_LIST } from "@/utils/lib/messagesList";
import moment from "moment-timezone";
import { DB_TIME_FORMAT } from "@/utils/lib/constants";

const DEFAULT_SUPER_ADMIN_ROLE = 1;

export async function getTeamList(filters) {
	try {
		const queryParams = [];
		let paramIndex = 1;

		const sortBy = filters?.sort;
		const perPage = filters?.per_page || 10;
		const pageNo = filters?.page_no || 1;
		const offset = pageNo * perPage - perPage;

		let resetPassListQuery = `
       SELECT 
         u.user_id,
         u.login_id,
         u.user_name,
         u.inserted_date,
         u.email,
         u.mobile,
         u.last_login,
         u.user_block,
         r.role_name
       FROM ${TABLE_LIST.USER_MASTER} u
       LEFT JOIN ${TABLE_LIST.ROLE_MASTER} r
         ON u.role_id = r.role_id
       WHERE  u.role_id != ${DEFAULT_SUPER_ADMIN_ROLE}
     `;

		if (filters?.search) {
			resetPassListQuery += `
         AND (
           u.user_name ILIKE $${paramIndex} 
           OR u.login_id ILIKE $${paramIndex}
           OR r.role_name ILIKE $${paramIndex}
         )
       `;
			queryParams.push(`%${filters.search}%`);
			paramIndex++;
		}

		switch (sortBy) {
			case "name_desc":
				resetPassListQuery += ` ORDER BY TRIM(u.user_name) DESC`;
				break;
			case "name_asc":
				resetPassListQuery += ` ORDER BY TRIM(u.user_name) ASC`;
				break;
			case "created_asc":
				resetPassListQuery += ` ORDER BY u.inserted_date ASC`;
				break;
			case "created_desc":
			default:
				resetPassListQuery += ` ORDER BY u.inserted_date DESC`;
				break;
		}

		resetPassListQuery += ` LIMIT ${perPage} OFFSET ${offset}`;

		const result = await executeQuery(resetPassListQuery, queryParams);

		const list = result.map((x) => ({
			...x,
			is_primary: false,
		}));

		return { success: true, list };
	} catch (error) {
		console.error("getTeamList:", error);
		return { success: false, msg: error.message };
	}
}

export async function addTeam(formData) {
	const session = await getServerSession(options);
	const user_id = session?.user?.user_id || null;

	const { role, login_id, display_name, roleType, mobile, email } = formData;
	const password = generateRandomString(10);
	const encryptedPassword = encryptPassword(password);

	try {
		const payload = {
			role_id: role,
			login_id: login_id,
			user_name: display_name,
			mobile: mobile,
			email: email,
			entity_type_id: roleType,
			password: encryptedPassword,
		};

		const insertQuery = queryGenerator.generateInsertQuery(
			payload,
			TABLE_LIST.USER_MASTER,
			"user_id",
		);

		const result = await executeQuery(insertQuery);
		console.log("result :", result);

		if (result.insertId) {
			// await sendUserMail({
			//   email,
			//   type: "A",
			//   value: password,
			//   stakeHolder: login_id,
			// });
			// saveLog({
			// 	module: "user",
			// 	action: "add",
			// 	item_id: result.user_id,
			// 	user_id,
			// 	payload: payload,
			// });
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

export async function getTeam(teamId) {
	console.log("teamId :", teamId);
	try {
		let query = `
      SELECT 
       user_id,
       user_name AS name,
       login_id,
       user_block,
       permanent_block,
       role_id,
       entity_type_id AS role_type,
       role_name,
       mobile,
       email,
       inserted_date,
       last_login
      FROM ${TABLE_LIST.USER_MASTER} 
      WHERE user_id = ?
       `;

		const result = await executeQuery(query, [teamId]);
		console.log("result :", result);

		if (result.length > 0) {
			return {
				success: true,
				data: result[0],
			};
		}

		return {
			success: false,
			data: MESSAGES_LIST.INVALID_ID_PROVIDED,
		};
	} catch (error) {
		console.error("get team by id error::", error);
		return {
			success: false,
			error: error.message,
		};
	}
}

export async function editTeam(formData) {
	const session = await getServerSession(options);
	const user_id = session?.user?.user_id || null;

	const {
		user_id: edit_user_id,
		role,
		login_id,
		display_name,
		roleType,
		mobile,
		email,
	} = formData;

	try {
		const selectQuery = `
      SELECT role_id, login_id, user_name, mobile, email, permanent_block, user_block
      FROM ${TABLE_LIST.USER_MASTER}
      WHERE user_id = $1
    `;

		const previousResult = await dbRead.query(selectQuery, [edit_user_id]);
		const previousData = previousResult[0];

		const updatePayload = {
			user_name: display_name,
			mobile,
			email,
			entity_type_id: roleType,
			role_id: role,
			updated_date: moment().format(DB_TIME_FORMAT),
			updated_by: user_id,
		};

		const updateQuery = queryGenerator.generateUpdateQuery(
			updatePayload,
			{ user_id: edit_user_id },
			TABLE_LIST.USER_MASTER,
		);

		await db.none(updateQuery);

		const roleUpdateQuery = `
      UPDATE ${TABLE_LIST.USER_MASTER}
      SET role_name = (
        SELECT role_name 
        FROM ${TABLE_LIST.ROLE_MASTER} 
        WHERE role_id = $2
      )
      WHERE user_id = $1
    `;

		await db.none(roleUpdateQuery, [edit_user_id, role]);

		saveLog({
			module: "user",
			action: "edit",
			item_id: edit_user_id,
			user_id,
			payload: updatePayload,
			previous: previousData,
		});

		return {
			success: true,
			msg: "User updated successfully",
		};
	} catch (error) {
		console.error("user update error::", error);
		return {
			success: false,
			msg: "User update failed",
			error: error.message,
		};
	}
}

export async function getCount() {
	try {
		const params = [];

		let countQuery = `select count(1) as count `;
		countQuery += `from ${TABLE_LIST.USER_MASTER} ud `;
		countQuery += `where user_block = 0 and role_id != ${DEFAULT_SUPER_ADMIN_ROLE} `;

		const result = await executeQuery(countQuery, params);
		console.log("result in getCount :", result[0]?.count);

		return {
			count: result[0]?.count ?? 0,
		};
	} catch (error) {
		console.error("resetPassCountQuery:", error);

		return {
			count: 0,
		};
	}
}

export async function editUserStatus(payload) {
	const session = await getServerSession(options);
	const userData = session?.user || null;

	try {
		const userCheckQuery = `
      SELECT user_id 
      FROM ${TABLE_LIST.USER_MASTER} 
      WHERE user_id = $1
    `;

		const result = await dbRead.query(userCheckQuery, [payload.user_id]);

		if (result.length === 0) {
			return { success: false, msg: MESSAGES_LIST.INVALID_ID_PROVIDED };
		}

		const action = payload.action == 1 ? 0 : 1;

		const updateQuery = `
      UPDATE ${TABLE_LIST.USER_MASTER}
      SET user_block = $1
      WHERE user_id = $2
    `;

		await db.none(updateQuery, [action, payload.user_id]);

		saveLog({
			module: "team",
			action: payload.action == 1 ? "activate" : "block",
			user_id: userData?.user_id,
			item_id: payload.user_id,
			payload: payload,
		});

		return { success: true };
	} catch (error) {
		throw new Error("updateUserStatus: " + error.message);
	}
}
