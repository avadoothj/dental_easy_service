import moment from "moment-timezone";
moment.tz.setDefault("Asia/Kolkata");

export const currentDate = () => {
	return moment().format("YYYY-MM-DD");
};

export const currentDateTime = () => {
	return moment().format("YYYY-MM-DD HH:mm:ss");
};

export const convertDate = (date, type = 1) => {
	if (type == 1) {
		return moment(date).format("DD/MM/YYYY");
	} else if (type == 2) {
		return moment(date).format("DD/MM/YYYY hh:mm A");
	} else if (type == 3) {
		return moment(date).format("YYYY-MM-DD");
	} else if (type == 4) {
		return moment(date).format("YYYY-MM-DD HH:mm:ss");
	} else if (type == 5) {
		return moment(date, "DD-MM-YYYY").format("YYYY-MM-DD");
	} else {
		return "-";
	}
};

export const addNoOfDays = (date, noOfDays) => {
	return moment(date).add(noOfDays, "days").format("YYYY-MM-DD");
};

export const subtractNoOfDays = (date, noOfDays) => {
	return moment(date).subtract(noOfDays, "days").format("YYYY-MM-DD");
};

export const getDateDifference = (checkDate) => {
	return moment(checkDate).diff(moment().format("YYYY-MM-DD"), "days");
};

export const getDateDifferenceTwoDates = (startDate, endDate) => {
	return moment(endDate).diff(moment(startDate).format("YYYY-MM-DD"), "days");
};

export const currentMonthFirstDate = () => {
	return moment().startOf("month").format("YYYY-MM-DD");
};

export const currentMonthLastDate = () => {
	return moment().endOf("month").format("YYYY-MM-DD");
};
