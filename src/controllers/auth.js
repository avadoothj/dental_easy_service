"use server";

import { db, dbRead } from "@/utils/lib/database";
import { executeQuery } from "@/utils/lib/database";
import moment from "moment-timezone";
import { TABLE_LIST } from "@/utils/lib/tablesList";
import { MESSAGES_LIST } from "@/utils/lib/messagesList";
import { DB_TIME_FORMAT } from "@/utils/lib/constants";
import { encryptPassword, decryptPassword, generateRandomString } from "@/utils/lib/functions";
import jwt from "jsonwebtoken";

export async function authenticateUser(loginId, password, ip = "", bypassUserId = null) {
	try {
		const params = [];

		let selectQuery = `
			SELECT 
				um.user_id,
				um.login_id,
				um.entity_type_id,
				um.role_id,
				um.user_name,
				um.mobile AS user_mobile,
				um.email AS user_email,
				um.user_block,
				rm.permissions
			FROM ${TABLE_LIST.USER_MASTER} um
			LEFT JOIN ${TABLE_LIST.ROLE_MASTER} rm 
				ON rm.role_id = um.role_id
			WHERE
		`;

		if (bypassUserId === null) {
			const originalPassword = decryptPassword(password);
			const encryptedPassword = encryptPassword(originalPassword);
			selectQuery += ` um.login_id = ? AND um.password = ? `;
			params.push(loginId);
			params.push(encryptedPassword);
		} else {
			selectQuery += ` um.user_id = ? `;

			params.push(bypassUserId);
		}

		const result = await executeQuery(selectQuery, params);

		if (result.length === 0) {
			return {
				success: false,
				msg: MESSAGES_LIST.INVALID_USER_ID_OR_PASSWORD,
			};
		}

		const user = result[0];

		if (user.user_block == 1) {
			return {
				success: false,
				msg: MESSAGES_LIST.ACCESS_FORBIDDEN,
			};
		}

		let isPrimaryUser = 0;

		// CHECK PRIMARY USER
		// if ([3, 7].includes(user.entity_type_id)) {
		// 	let getPrimaryUserQuery = `
		// 		SELECT user_id
		// 		FROM ${TABLE_LIST.USER_MASTER}
		// 		WHERE entity_id = ?
		// 		AND entity_type_id = 3
		// 		ORDER BY user_id
		// 		LIMIT 1
		// 	`;

		// 	const primaryUserResult = await executeQuery(getPrimaryUserQuery, [user.entity_id]);

		// 	isPrimaryUser =
		// 		primaryUserResult.length > 0 && primaryUserResult[0].user_id == user.user_id
		// 			? 1
		// 			: 0;
		// }

		// const activationType = user.category_items.includes("activation-through-email-id")
		// 	? "email"
		// 	: "mobile";

		const userData = {
			login_id: user.login_id,
			user_type: user.entity_type,
			oper_cat_id: user.entity_type_id,
			entity_id: user.entity_id,
			oper_id: user.entity_id,
			oper_code: user.entity_code,
			oper_name: user.entity_name,
			display_name: user.user_name,
			user_id: user.user_id,
			zone_id: user.zone_id,
			state_id: user.state_id,
			role_id: user.role_id,
			// activation_type: activationType,
			primary_user: isPrimaryUser,
			user_mobile: user.user_mobile,
			user_email: user.user_email,
			identifier: generateRandomString(),
		};

		// if ([3, 5, 7].includes(user.entity_type_id)) {
		// 	userData.isp_id = user.isp_id || 0;
		// 	userData.super_isp_id = user.super_isp_id || 0;
		// } else if ([8, 9, 10].includes(user.entity_type_id)) {
		// 	userData.distributor_id = user.distributor_id || 0;
		// 	userData.super_distributor_id = user.super_distributor_id || 0;
		// }

		if (bypassUserId !== null) {
			userData.account_takeover = true;
		}

		const token = jwt.sign(
			{
				exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2,
				data: userData,
			},
			process.env.JWT_SECRET,
			{
				algorithm: "HS512",
			},
		);

		// UPDATE LAST LOGIN
		if (bypassUserId === null) {
			const updateQuery = `
				UPDATE ${TABLE_LIST.USER_MASTER}
				SET
					last_login_ip = ?,
					last_login = ?
				WHERE user_id = ?
			`;

			await executeQuery(updateQuery, [ip, moment().format(DB_TIME_FORMAT), user.user_id]);
		}

		// MENUS
		const allowedLinks = [];

		console.log("user.permissions :", user.permissions);
		JSON.parse(user.permissions).forEach((x) => {
			x.forEach((y) => {
				if (y.menus?.length > 0) {
					y.menus.forEach((z) => {
						allowedLinks.push(z.link);
					});
				} else {
					allowedLinks.push(y.link);
				}
			});
		});

		console.log("allowedLinks :", allowedLinks);
		// NON ADMIN ACCESS
		if (user.entity_type !== "INTERNAL" && user.entity_type !== "REGIONAL_HEAD") {
			allowedLinks.push("/createUpdateInternalUser");
			allowedLinks.push("/stakeholderAddEdit");
		}

		return {
			success: true,
			message: "success",
			token,
			menus: allowedLinks,
		};
	} catch (error) {
		console.error("authenticateUser error:", error);

		return {
			success: false,
			msg: "Something went wrong",
			error: error.message,
		};
	}
}
