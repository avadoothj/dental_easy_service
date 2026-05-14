import { formatPrice, getConstant, stringReplace } from "@/utils/utils";
import { validateTextPattern, validationNumberOnlyWithDecimal } from "./patterns";
import messages from "@/utils/messages";

export const addBalance = {
	amount: {
		required: messages.REQUIRED_BALANCE_AMOUNT,
		validate: (value) => {
			const numericValue = parseFloat(value.toString().replaceAll(",", ""));
			if (isNaN(numericValue)) return messages.INVALID_AMOUNT;
			if (numericValue < getConstant("MIN_ADD_BALANCE")) {
				return stringReplace(messages.MIN_ADD_BALANCE, {
					"{VALUE}": formatPrice(getConstant("MIN_ADD_BALANCE")),
				});
			}
			return true;
		},
		/* pattern: { value: /^[\d,]*\.?\d*$/, message: messages.INVALID_AMOUNT },
		min: {
			value: getConstant("MIN_ADD_BALANCE"),
			message: stringReplace(messages.MIN_ADD_BALANCE, {
				"{VALUE}": formatPrice(getConstant("MIN_ADD_BALANCE")),
			}),
		}, */
	},
	remark: {
		pattern: {
			value: validateTextPattern(),
			message: messages.INVALID_TEXT_FORMAT,
		},
	},
};

export const addBalanceIsp = {
	amount: {
		required: messages.REQUIRED_BALANCE_AMOUNT,
		pattern: { value: validationNumberOnlyWithDecimal(), message: messages.INVALID_AMOUNT },
		min: {
			value: 1,
			message: stringReplace(messages.MIN_ISP_CREDIT_DEBIT_BALANCE, {
				"{VALUE}": formatPrice(1),
			}),
		},
	},
	remark: {
		pattern: {
			value: validateTextPattern(),
			message: messages.INVALID_TEXT_FORMAT,
		},
	},
};
