import apiList from "@/utils/apiList";
import messages from "@/utils/messages";
import { callPostApiNoSession } from "@/utils/service";

export function accountAutomation(request) {
	return new Promise((resolve, reject) => {
		const api_token = request.api_token;
		const type = request.type;
		const admin_name = request.admin_name;
		const name = request.name;
		const isp_code = request.isp_code;
		const isp_cat = request.isp_cat;
		const address = request.address;
		const phone1 = request.contact1;
		const email1 = request.email1;
		const femail1 = request.femail1;
		const femail2 = request.femail2 ? request.femail2 : "";
		const bemail1 = request.bemail1;
		const bemail2 = request.bemail2 ? request.bemail2 : "";
		const limit_1 = request.balance_limit;
		const user_name = request.user_name;
		const login_id = request.login_id;
		const user_phoneno = request.user_phoneno;
		const user_email = request.user_email;
		const inserted_by = request.ins_by;

		let oper_cat_id;
		let login_type;

		if (!api_token || api_token == "") {
			resolve({ success: false, msg: messages.API_TOKEN_NOT_PROVIDED });
			return false;
		}

		if (!admin_name || admin_name == "") {
			resolve({ success: false, msg: messages.ADMIN_NAME_NOT_PROVIDED });
			return false;
		}

		if (!isp_code || isp_code == "") {
			resolve({ success: false, msg: messages.ISP_CODE_NOT_PROVIDED });
			return false;
		}

		if (!address || address == "") {
			resolve({ success: false, msg: messages.ADDRESS_NOT_PROVIDED });
			return false;
		}

		if (!phone1 || phone1 === "") {
			resolve({ success: false, msg: messages.PHONE_NOT_PROVIDED });
			return false;
		}

		if (/^[9876][0-9]{8}$/.test(phone1)) {
			resolve({ success: false, msg: messages.INVALID_PHONE_FORMAT });
			return false;
		}

		if (!email1 || email1 == "") {
			resolve({ success: false, msg: messages.REQUIRED_EMAIL_ID });
			return false;
		}

		if (!type) {
			resolve({ success: false, msg: messages.STAKEHOLDER_TYPE_NOT_PROVIDED });
			return false;
		} else if (type == "") {
			resolve({ success: false, msg: messages.INVALID_STAKEHOLDER_TYPE_ });
			return false;
		} else if (type == "Operator") {
			login_type = "EXECUTIVE";
			oper_cat_id = 5;
			if (!name || name == "") {
				resolve({ success: false, msg: messages.OPERATOR_NAME_NOT_PROVIDED });
				return false;
			}
		} else if (type == "ISP") {
			login_type = "PRIMARY";
			oper_cat_id = 3;

			if (!name || name == "") {
				resolve({ success: false, msg: messages.ISP_NAME_NOT_PROVIDED });
				return false;
			}

			if (!isp_cat || isp_cat == "") {
				resolve({ success: false, msg: messages.ISP_CAT_NOT_PROVIDED });
				return false;
			}

			if (!femail1 || femail1 == "") {
				resolve({ success: false, msg: messages.FINANCE_EMAIL_NOT_PROVIDED });
				return false;
			}
			if (!bemail1 || bemail1 == "") {
				resolve({ success: false, msg: messages.BUSINESS_EMAIL_NOT_PROVIDED });
				return false;
			}
			if (!limit_1 || limit_1 == "") {
				resolve({ success: false, msg: messages.CRITICAL_BALANCE_NOT_PROVIDED });
				return false;
			}
		} else if (type == "SUPER_ISP") {
			login_type = "PRIMARY";
			oper_cat_id = 7;

			if (!name || name == "") {
				resolve({ success: false, msg: messages.SUPER_ISP_NAME_NOT_PROVIDED });
				return false;
			}

			if (!isp_cat || isp_cat == "") {
				resolve({ success: false, msg: messages.ISP_CAT_NOT_PROVIDED });
				return false;
			}

			if (!femail1 || femail1 == "") {
				resolve({ success: false, msg: messages.FINANCE_EMAIL_NOT_PROVIDED });
				return false;
			}
			if (!bemail1 || bemail1 == "") {
				resolve({ success: false, msg: messages.BUSINESS_EMAIL_NOT_PROVIDED });
				return false;
			}
			if (!limit_1 || limit_1 == "") {
				resolve({ success: false, msg: messages.CRITICAL_BALANCE_NOT_PROVIDED });
				return false;
			}
		}

		if (!user_name || user_name == "") {
			resolve({ success: false, msg: messages.USER_NAME_NOT_PROVIDED });
			return false;
		}

		if (!login_id || login_id == "") {
			resolve({ success: false, msg: messages.LOGIN_ID_NOT_PROVIDED });
			return false;
		}

		if (!user_phoneno || user_phoneno == "") {
			resolve({ success: false, msg: messages.USER_PHONE_NO_NOT_PROVIDED });
			return false;
		}

		if (/^[9876][0-9]{8}$/.test(user_phoneno)) {
			resolve({ success: false, msg: messages.INVALID_USER_PHONE_NO });
			return false;
		}

		if (!user_email || user_email == "") {
			resolve({ success: false, msg: messages.USER_EMAIL_NOT_PROVIDED });
			return false;
		}

		let payload = {
			address: address,
			// code: type == "ISP" ? isp_code : "",
			contact1: phone1,
			// das_id: type == "ISP" ? 0 : parseInt(1),
			email1: email1,
			email: user_email,
			login_id: login_id,
			login_type: login_type,
			mob_no: user_phoneno,
			mso_id: admin_name && admin_name !== "" ? admin_name : 0,
			inserted_by: inserted_by,
			name: name,
			oper_cat_id: parseInt(oper_cat_id),
			password: "",
			token: api_token,
			// type: type == "ISP" ? "distributor" : "lco",
			user_name: user_name,

			// isp
			bemail1: bemail1,
			bemail2: bemail2,
			femail1: femail1,
			femail2: femail2,
			isp_cat: isp_cat,
			limit1: limit_1,

			// lco
			isp_code: isp_code,
		};

		let apiEndpoint;

		if (type === "SUPER_ISP") {
			apiEndpoint = apiList.api.superIspAccountAutomation;
		} else if (type === "ISP") {
			apiEndpoint = apiList.api.ispAccountAutomation;
		} else {
			apiEndpoint = apiList.api.operatorAccountAutomation;
		}

		callPostApiNoSession(apiEndpoint, payload)
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}
