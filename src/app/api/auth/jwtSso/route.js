import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { unstable_noStore as noStore } from "next/cache";
import { errorLogger, infoLogger } from "@/utils/utils";
import { options } from "@/nextAuth/options";
import messages from "@/utils/messages";

export async function GET(request) {
	noStore();
	try {
		// Get the query string from the URL
		const queryString = request.url.split("?")[1];
		if (!queryString) {
			throw new Error(messages.PG_NO_QUERY_PARAMS_FOUND);
		}

		// Parse the query string into an object
		const queryParams = require("querystring").parse(queryString);

		infoLogger("jwtSso", { ...queryParams });

		const session = await getServerSession(options);

		if (session === null) {
			cookies().set(
				"sso_response",
				JSON.stringify({ success: false, msg: "Please login to continue" })
			);

			const paymentUrl = new URL(process.env.FRONTEND_DOMAIN + "sso", request.url);
			return NextResponse.redirect(paymentUrl, 303);
		} else {
			const payload = {
				email: session.user.user_email,
				givenname: session.user.display_name,
				family_name: session.user.oper_name,
				nonce: queryParams.nonce,
				sub: session.user.user_id.toString(),
			};

			const filePath = "/rsa256.private.txt";
			const directory = require("path").join("./", "jwt");
			const jwtSsoPrivateKey = require("fs").readFileSync(directory + filePath, "utf8");

			const token = require("jsonwebtoken").sign(
				payload,
				{ key: jwtSsoPrivateKey.replace(/\\n/gm, "\n"), passphrase: "" },
				{ algorithm: "RS256" }
			);

			const params = {
				state: queryParams.state,
				id_token: token,
			};

			const redirectUrl =
				queryParams.redirect_uri +
				"?" +
				Object.keys(params)
					.map(function (k) {
						return k + "=" + params[k];
					})
					.join("&");

			return NextResponse.redirect(redirectUrl, 303);
		}
	} catch (error) {
		const message = typeof error == "object" ? error.message : error;

		cookies().set("sso_response", JSON.stringify({ success: false, msg: message }));
		errorLogger("jwtSso: " + message);

		const paymentUrl = new URL(process.env.FRONTEND_DOMAIN + "sso", request.url);
		return NextResponse.redirect(paymentUrl, 303);
	}
}
