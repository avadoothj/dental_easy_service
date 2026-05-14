import apiList from "@/utils/apiList";
import { callGetApiNoSession } from "@/utils/service";

export function getHealthChecked() {
	return new Promise((resolve, reject) => {
		callGetApiNoSession(apiList.api.getHealthChecked, {})
			.then(function (response) {
				if (response.success) {
					resolve({ success: true, health_chk: response.data });
				} else {
					resolve({ success: false, msg: response.msg });
				}
			})
			.catch(function (error) {
				reject(error);
			});
	});
}
