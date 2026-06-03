"use server";
import { getServerSession } from "next-auth";
import apiList from "@/utils/apiList";
import { callGetApi, callPostApi } from "@/utils/service";
import { revalidatePath } from "next/cache";
import { options } from "@/nextAuth/options";
import { generateTokenForLoginAsUser } from "@/controllers/loginAsUser";
import { encryptPassword } from "@/utils/lib/functions";
import { TABLE_LIST } from "@/utils/lib/tablesList";
import { db, dbRead, executeQuery } from "@/utils/lib/database";
import { MESSAGES_LIST } from "@/utils/lib/messagesList";
import moment from "moment-timezone";
import { saveLog } from "@/utils/logger";

export async function checkPasswordExpiry() {
	return new Promise((resolve, reject) => {
		callGetApi(apiList.profile.checkPasswordExpiry, {})
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function checkBalance() {
	return new Promise((resolve, reject) => {
		getServerSession(options)
			.then(function (session) {
				if (
					session &&
					session.user.user_type != "internal" &&
					session.user.user_type != "retailer" &&
					session.user.user_type != "regional head"
				) {
					callGetApi(apiList.profile.checkBalance)
						.then(function (response) {
							resolve(response);
						})
						.catch(function (error) {
							reject(error);
						});
				} else {
					resolve({ success: false });
				}
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getAutoRenewalStatus() {
	return new Promise((resolve, reject) => {
		resolve({ success: false });
		/* getServerSession(options)
			.then(function (session) {
				if (session.user.user_type != "internal") {
					callGetApi(apiList.profile.checkBalance)
						.then(function (response) {
							resolve(response);
						})
						.catch(function (error) {
							reject(error);
						});
				} else {
					resolve({ success: false });
				}
			})
			.catch(function (error) {
				reject(error);
			}); */
	});
}

export async function setForcePassword(formData) {
	return new Promise((resolve, reject) => {
		callPostApi(apiList.profile.setForcePassword, {
			password: formData.password,
		})
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function setChangePassword(formData) {
	try {
		const session = await getServerSession(options);
		const { user } = session;

		const userId = user.user_id;

		const encryptedPassword = encryptPassword(formData.password);
		const encryptedCurrentPassword = encryptPassword(formData.current_password);

		const matchCurrentPasswordQuery = `
      select password 
      from ${TABLE_LIST.USER_MASTER} 
      where password = ? and user_id = ?
    `;

		const result = await executeQuery(matchCurrentPasswordQuery, [
			encryptedCurrentPassword,
			userId,
		]);

		console.log("result :", result);

		if (result.length === 0) {
			return {
				success: false,
				msg: MESSAGES_LIST.CURRENT_PASSWORD_NOT_MATCH,
			};
		}

		const validationQuery = `
      select password 
      from ${TABLE_LIST.USER_PASSWORD_LOGS} 
      where user_id = ? 
      order by id desc 
      limit 3
    `;

		const results = await executeQuery(validationQuery, [userId]);
		console.log("results validate :", results);

		let passwordCheck = true;

		for (let i = 0; i < results.length; i++) {
			if (encryptedPassword === results[i].encrypted_password) {
				passwordCheck = false;
				break;
			}
		}

		if (!passwordCheck) {
			return {
				success: false,
				msg: MESSAGES_LIST.NOT_ALLOW_TO_SET_PASSWORD,
			};
		}

		const updateUserQuery = `
      update ${TABLE_LIST.USER_MASTER} 
      set password = ?, 
          last_password_change = ?, 
          auto_logout_date = now(), 
          auto_logout_identifier = ?
      where user_id = ?
    `;

		await executeQuery(updateUserQuery, [encryptedPassword, moment(), user.identifier, userId]);

		const insertPasswordLogQuery = `
      insert into ${TABLE_LIST.USER_PASSWORD_LOGS} 
      (user_id, password, inserted_date) 
        VALUES (?, ?, ?)
    `;

		await executeQuery(insertPasswordLogQuery, [userId, encryptedPassword, moment()]);

		// saveLog({
		// 	module: "change_password",
		// 	source: "web",
		// 	action: "edit",
		// 	user_id: userId,
		// 	item_id: userId,
		// 	payload: "",
		// });

		return {
			success: true,
			msg: MESSAGES_LIST.PASSWORD_CHANGE_SUCCESS,
		};
	} catch (error) {
		console.error("setChangePassword: " + error.message);
		return { success: false, msg: error.message };
	}
}

export async function getProfileData() {
	return new Promise((resolve, reject) => {
		getServerSession(options).then((session) => {
			if (session) {
				callGetApi(apiList.profile.getProfileData, {})
					.then(function (response) {
						resolve({
							user: session.user,
							profile: response.success ? response.data : response,
						});
					})
					.catch(function (error) {
						reject(error);
					});
			} else {
				resolve({ user: null });
			}
		});
	});
}



export async function editUserProfile(formData) {
	return new Promise((resolve, reject) => {
		callPostApi(apiList.profile.updateProfile, {
			user_name: formData.display_name,
			email: formData.email,
			mobile: formData.mobile,
		})
			.then(function (response) {
				if (response.success) {
					revalidatePath("/profile");
				}
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function sendTokenOnMail() {
	return new Promise((resolve, reject) => {
		callGetApi(apiList.profile.sendTokenOnMail)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function regenerateToken() {
	return new Promise((resolve, reject) => {
		callGetApi(apiList.profile.regenerateToken)
			.then(function (response) {
				if (response.success) {
					revalidatePath("/profile");
				}
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function downloadMyApiToken() {
	return new Promise((resolve, reject) => {
		Promise.all([callGetApi(apiList.profile.downloadApiToken), getServerSession(options)])
			.then(function (apiResponse) {
				const response = apiResponse[0];
				const session = apiResponse[1];

				if (response.success) {
					response.downloadPath = `${
						process.env.BACKEND_DOMAIN + response.filePath
					}?token=${session.user.token}`;
				}
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function checkAutoRenewalStatus() {
	return new Promise((resolve, reject) => {
		getServerSession(options)
			.then(function (session) {
				if (session.user.user_type == "isp" || session.user.user_type == "super isp") {
					callPostApi(apiList.profile.checkAutoRenew)
						.then(function (response) {
							resolve(response);
						})
						.catch(function (error) {
							reject(error);
						});
				} else {
					resolve({ success: false });
				}
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function checkUserSession() {
	return new Promise((resolve, reject) => {
		getServerSession(options)
			.then(function (session) {
				if (session?.user) {
					callGetApi(apiList.profile.checkSession)
						.then(function (response) {
							resolve({ success: true });
						})
						.catch(function (error) {
							resolve({ success: false });
						});
				} else {
					resolve({ success: false });
				}
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function getUserMenuData() {
	return new Promise((resolve, reject) => {
		callGetApi(apiList.profile.getMenu)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				resolve({ success: false });
			});
	});
}

export async function getTokenForLoginAsUser(payload) {
	return new Promise((resolve, reject) => {
		getServerSession(options).then((session) => {
			if (session?.user && session?.user?.allowedLinks.indexOf("/loginAsUser") >= 0) {
				generateTokenForLoginAsUser(payload)
					.then((response) => {
						if (response.success) {
							response.url =
								process.env.FRONTEND_DOMAIN + "loginAsUser?t=" + response.token;
							delete response.token;
						}
						resolve(response);
					})
					.catch((error) => reject(error));
			} else {
				resolve({ success: false, msg: messages.UNAUTHORIZED_ACCESS });
			}
		});
	});
}

export async function getTickerBanner() {
	return new Promise((resolve, reject) => {
		callGetApi(apiList.profile.getTickerBanner)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				resolve({ success: false });
			});
	});
}

export async function checkUpcomingExpiry() {
	return new Promise((resolve, reject) => {
		getServerSession(options)
			.then(function (session) {
				if (session.user.user_type == "isp" || session.user.user_type == "operator") {
					callGetApi(apiList.profile.checkUpcomingExpiry)
						.then(function (response) {
							resolve(response);
						})
						.catch(function (error) {
							reject(error);
						});
				} else {
					resolve({ success: false });
				}
			})
			.catch(function (error) {
				reject(error);
			});
	});
}
