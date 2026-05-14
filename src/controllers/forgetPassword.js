"use server";
import apiList from "@/utils/apiList";
import { callPostApiNoSession } from "@/utils/service";

export async function checkUsernameAndSendOtp(formData) {
	return new Promise((resolve, reject) => {
		callPostApiNoSession(apiList.forgetPassword.checkAndSendOtp, {
			login_id: formData.username.trim(),
		})
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function verifyOtp(formData) {
	return new Promise((resolve, reject) => {
		callPostApiNoSession(apiList.forgetPassword.verifyOtp, {
			login_id: formData.username.trim(),
			otp: formData.otp,
		})
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

export async function setNewPassword(formData) {
	return new Promise((resolve, reject) => {
		callPostApiNoSession(apiList.forgetPassword.setNewPassword, {
			login_id: formData.username.trim(),
			password: formData.password,
			token: formData.token,
		})
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}
