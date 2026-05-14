import message from "@/utils/messages";
import { validateEmailPattern, validationMobilePattern } from "./patterns";

export const personalStepValidation = {
	name: {
		required: message.REQUIREDNAME,
	},
	phone: {
		required: message.REQUIREDPHONE,
		pattern: {
			value: validationMobilePattern(),
			message: message.INVALIDPHONE,
		},
	},
	altPhone: {
		required: message.REQUIREDALTPHONE,
		pattern: {
			value: validationMobilePattern(),
			message: message.INVALIDPHONE,
		},
	},
	email: {
		required: message.REQUIREDEMAIL,
		pattern: {
			value: validateEmailPattern(),
			message: message.INVALIDEMAIL,
		},
	},
	dob: {
		required: message.REQUIREDDOB,
	},
	gender: {
		required: message.REQUIREDGENDER,
	},
	permanentAddress1: {
		required: message.REQUIREDADDRESS1,
	},
	permanentState: {
		required: message.REQUIREDSTATE,
	},
	permanentCity: {
		required: message.REQUIREDCITY,
	},
	permanentPostalCode: {
		required: message.REQUIREDPOSTALCODE,
	},
	currentAddress1: {
		required: message.REQUIREDADDRESS1,
	},
	currentState: {
		required: message.REQUIREDSTATE,
	},
	currentCity: {
		required: message.REQUIREDCITY,
	},
	currentPostalCode: {
		required: message.REQUIREDPOSTALCODE,
	},
};
