"use server";

import moment from "moment-timezone";
import { getServerSession } from "next-auth/next";
import { options } from "@/nextAuth/options";
import { db } from "@/utils/lib/database";
import { TABLE_LIST } from "@/utils/lib/tablesList";
import { MESSAGES_LIST } from "@/utils/lib/messagesList";
import { DB_TIME_FORMAT } from "@/utils/lib/constants";
import { generateRandomString } from "@/utils/lib/functions";
import { queryGenerator } from "@/utils/lib/queryGenerator";
import { authenticateUser } from "@/controllers/auth";
import { getConstant } from "@/utils/utils";

export async function generateTokenForLoginAsUser(payload) {
	return new Promise((resolve, reject) => {
		getServerSession(options)
			.then(async (session) => {
				if (!session?.user) {
					resolve({ success: false, msg: MESSAGES_LIST.NOT_ALLOWED_TO_PERFORM_ACTION });
					return;
				}

				// In FE session this is normalized to lowercase ("internal")
				if (session.user.user_type !== "internal") {
					resolve({ success: false, msg: MESSAGES_LIST.NOT_ALLOWED_TO_PERFORM_ACTION });
					return;
				}

				const query = `select role_id from ${TABLE_LIST.ROLE_MASTER} where role_id = $1 and permissions like '%/loginAsUser%'`;

				db.query(query, [session.user.role_id])
					.then((result1) => {
						if (result1.length === 0) {
							resolve({
								success: false,
								msg: MESSAGES_LIST.NOT_ALLOWED_TO_PERFORM_ACTION,
							});
							return;
						}

						const superAdminRoleId = getConstant("SUPER_ADMIN_ROLE_ID") || 1;
						const query2 = `select user_id from ${TABLE_LIST.USER_MASTER} where user_id = $1 and role_id != $2 and user_block = 0`;

						db.query(query2, [payload.user_id, superAdminRoleId])
							.then((result2) => {
								if (result2.length === 0) {
									resolve({
										success: false,
										msg: MESSAGES_LIST.NOT_ALLOWED_TO_PERFORM_ACTION,
									});
									return;
								}

								const token = generateRandomString(32);

								db.query(
									queryGenerator.generateInsertQuery(
										{
											requester_user_id: session.user.user_id,
											takeover_user_id: payload.user_id,
											token,
											inserted_date: moment().format(DB_TIME_FORMAT),
											expires_on: moment().add(2, "minutes").format(DB_TIME_FORMAT),
										},
										TABLE_LIST.LOGIN_AS_USER
									)
								)
									.then(() => resolve({ success: true, token }))
									.catch((error) => reject("insertQuery: " + error));
							})
							.catch((error) => reject("loginAsUser: " + error));
					})
					.catch((error) => reject("loginAsUser: " + error));
			})
			.catch((error) => reject("loginAsUser session: " + error));
	});
}

export async function verifyTokenForLoginAsUser(payload) {
	return new Promise((resolve, reject) => {
		let query = `select id, takeover_user_id, requester_user_id, ud1.login_id as requester_login_id, ud2.login_id as takeover_login_id `;
		query += `from ${TABLE_LIST.LOGIN_AS_USER} lau `;
		query += `left join ${TABLE_LIST.USER_MASTER} ud1 on lau.requester_user_id = ud1.user_id `;
		query += `left join ${TABLE_LIST.USER_MASTER} ud2 on lau.takeover_user_id = ud2.user_id `;
		query += `where lau.token = $1 and lau.expires_on > $2 and lau.used_on is null`;

		db.query(query, [payload.token, moment().format(DB_TIME_FORMAT)])
			.then((result1) => {
				if (result1.length === 0) {
					resolve({ success: false, msg: MESSAGES_LIST.INVALID_TOKEN });
					return;
				}

				authenticateUser("", "", payload.ip || "", result1[0].takeover_user_id).then(
					(userResponse) => {
						if (userResponse.success) {
							db.none(
								queryGenerator.generateUpdateQuery(
									{
										ip_address: payload.ip,
										used_on: moment().format(DB_TIME_FORMAT),
									},
									{ id: result1[0].id },
									TABLE_LIST.LOGIN_AS_USER
								)
							).catch((error) => {
								reject("loginAsUser updateQuery: " + error);
							});

							resolve({
								success: true,
								msg: "Allow to start session",
								token: userResponse.token,
								menus: userResponse.menus,
								requester_login_id: result1[0].requester_login_id,
							});
						} else {
							resolve({ success: false, msg: userResponse.msg });
						}
					}
				);
			})
			.catch((error) => reject("loginAsUser: " + error));
	});
}


