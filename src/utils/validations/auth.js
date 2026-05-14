import messages from "@/utils/messages";
import { validatePassword } from "./patterns";

export const loginValidation = {
	username: { required: messages.REQUIRED_USERNAME },
	password: { required: messages.REQUIRED_PASSWORD },
};

export const forgetPasswordStepOne = {
	username: { required: messages.REQUIRED_USERNAME },
};

export const forgetPasswordStepTwo = {
	otp: { required: messages.REQUIRED_OTP },
};

export const forgetPasswordStepThree = {
	new_password: {
		required: messages.REQUIRED_PASSWORD,
		pattern: { value: validatePassword(), message: messages.PASSWORD_FORMAT },
	},
	confirm_password: { required: messages.REQUIRED_CONFIRM_PASSWORD },
};
