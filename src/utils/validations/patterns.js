export const validationForFullName = () => {
	return /^(?!\s*$)[a-zA-Z'\s]+$/i;
};

export const validationNumberOnly = () => {
	return /^[0-9]+$/i;
};

export const validationSubscriberName = () => {
	return /^(?!\s*$)[a-zA-Z0-9 @*_\/#&'-]+$/i;
};

export const validationExpiry = () => {
	return /^(?:[1-9]|[1-9][0-9]|[1-2][0-9][0-9]|3[0-5][0-9]|36[0-5])$/i;
};

export const validationAlphaNum = () => {
	return /^[a-zA-Z0-9]+$/i;
};

export const validateEmailPattern = () => {
	return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
};

export const validationMobilePattern = () => {
	return /^(?!0{10})[0-9]{10}$/i;
};

export const validationNumberOnlyWithDecimal = () => {
	return /^[0-9.,]+$/i;
};

export const validatePassword = () => {
	return /^(?=.*\d)(?=.*[!@#$%^&*()_+}{\]\[\=\-~`|\\"':;?/>.<,\]\[\^])(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{8,16}$/;
};

export const validateUsername = () => {
	return /^[A-Za-z0-9 _\.-]+$/i;
};

export const validateLoginId = () => {
	return /^[A-Za-z0-9_\.-]+$/i;
};

export const validateTextPattern = () => {
	return /^[^<>]*$/;
};

export const validatePercentage = () => {
	return /^(100(\.0{1,2})?|\d{0,2}(\.\d{1,2})?)$/;
};
