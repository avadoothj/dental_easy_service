import { cookies } from "next/headers";
import requestIp from "request-ip";
import CredentialsProvider from "next-auth/providers/credentials";
import { callPostApiNoSession } from "@/utils/service";
import apiList from "@/utils/apiList";
import { errorLogger, getConstant } from "@/utils/utils";
import { roleTypesList } from "@/utils/masterData";
import { authenticateUser } from "@/controllers/auth";
import { verifyTokenForLoginAsUser } from "@/controllers/loginAsUser";

export const options = {
	secret: process.env.NEXTAUTH_SECRET,
	providers: [
		CredentialsProvider({
			name: "Credentials",
			id: "credentials",
			credentials: {
				username: { label: "Username", type: "text", placeholder: "username" },
				password: { label: "Password", type: "password" },
			},
			authorize: async (credentials, req) => {
				console.log("credentials.password :", credentials.password);
				try {
					let response = {};

					if (credentials.token) {
						// loginAsUser: fully migrated (no backend call)
						const clientIp = req ? requestIp.getClientIp(req) : "";
						response = await verifyTokenForLoginAsUser({
							token: credentials.token,
							ip: clientIp,
						});
					} else {
						// Use migrated authenticateUser function directly
						const clientIp = req ? requestIp.getClientIp(req) || "" : "";
						response = await authenticateUser(
							credentials.username,
							credentials.password,
							clientIp,
							null,
						);
					}
					if (response.success) {
						const userInfo = require("jsonwebtoken").verify(
							response.token,
							process.env.JWT_SECRET,
							{ algorithms: ["HS512"] },
						);

						let userType = userInfo.data.user_type;
						if (userInfo.data.user_type == "ADMIN") {
							userType = "internal";
						}

						const temp = userInfo.data.display_name.toUpperCase().split(" ", 2);
						let imageText = temp[0].charAt(0);
						if (temp.length > 1) imageText += temp[1].charAt(0);

						let displayUserType = "";
						roleTypesList
							.filter((x) => x.id == userInfo.data.oper_cat_id)
							.map((x) => {
								displayUserType = x.label;
							});

						const user = {
							imageText: imageText,
							user_type: userType,
							display_user_type: displayUserType,
							activation_type: userInfo.data.activation_type,
							display_name: userInfo.data.display_name,
							oper_name: userInfo.data.oper_name,
							login_id: userInfo.data.login_id,
							oper_id: userInfo.data.oper_id,
							super_isp_id: userInfo.data.super_isp_id,
							user_id: userInfo.data.user_id,
							zone_id: userInfo.data.zone_id,
							role_id: userInfo.data.role_id,
							user_email: userInfo.data.user_email,
							user_mobile: userInfo.data.user_mobile,
							state_id: userInfo.data.state_id,
							primary_user: userInfo.data.primary_user,
							identifier: userInfo.data.identifier,
							menus: "",
							allowedLinks: response.menus,
							token: response.token,
							email: "",
							image: "",
						};

						if (userInfo.data.account_takeover == true && response.requester_login_id) {
							user.accountTakeover = response.requester_login_id;
						}
						return user;
					}
					return { error: response.msg };
				} catch (error) {
					errorLogger(error.msg ?? error.message);
					return { error: "Something went wrong" };
				}
			},
		}),
	],
	session: {
		maxAge: 60 * 60 * 1, // 1 hour
		strategy: "jwt",
	},
	jwt: {
		maxAge: 60 * 60 * 1, // 1 hour
		encryption: true,
	},
	callbacks: {
		signIn: async ({ user }) => {
			if (user?.error && user.error != "CredentialsSignin") {
				throw new Error(user?.error);
			}
			return true;
		},
		jwt: async ({ token, user }) => {
			if (user) {
				token.user = user;
			}
			return token;
		},
		session: async ({ session, token }) => {
			if (token.user) {
				session.user = token.user;
			}
			return session;
		},
	},
	pages: {
		signIn: "/login",
		error: "/auth/error",
	},
};
