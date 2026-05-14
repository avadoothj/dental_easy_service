import { formatPrice, getConstant, stringReplace } from "@/utils/utils";
import { validateTextPattern, validationNumberOnly } from "./patterns";
import messages from "@/utils/messages";

export const addOperatorBalance = {
	amount: {
		required: messages.REQUIRED_BALANCE_AMOUNT,
		pattern: { value: validationNumberOnly(), message: messages.INVALID_AMOUNT },
		min: {
			value: getConstant("MIN_ADD_BALANCE_OPERATOR_WALLET"),
			message: stringReplace(messages.MIN_ADD_BALANCE_OPERATOR_WALLET, {
				"{VALUE}": formatPrice(getConstant("MIN_ADD_BALANCE_OPERATOR_WALLET") - 1),
			}),
		},
	},
	chequeNo: {
		required: stringReplace(messages.REQUIRED_EDITABLE, {
			"{VALUE}": "cheque number",
		}),
		pattern: { value: validationNumberOnly(), message: messages.INVALID_CHEQUE_NO },
	},
	bankName: {
		required: stringReplace(messages.REQUIRED_EDITABLE, {
			"{VALUE}": "bank name",
		}),
	},
	referenceNo: {
		required: stringReplace(messages.REQUIRED_EDITABLE, {
			"{VALUE}": "Reference Number",
		}),
		pattern: {
			value: validateTextPattern(),
			message: messages.INVALID_TEXT_FORMAT,
		},
	},
	chequeDate: {
		required: messages.REQUIRED_DATE,
	},
	remark: {
		pattern: {
			value: validateTextPattern(),
			message: messages.INVALID_TEXT_FORMAT,
		},
	},
};
