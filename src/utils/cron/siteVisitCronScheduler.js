import "server-only";
import moment from "moment-timezone";

const globalForCron = globalThis;
const CRON_ENABLED = String(process.env.CRON_ENABLED || "true").toLowerCase() === "true";
const CRON_SCHEDULE = process.env.CRON_SCHEDULE || "0 14 * * *";
const CRON_TIMEZONE = process.env.CRON_TIMEZONE || "Asia/Kolkata";
const CHECK_INTERVAL_MS = 60 * 1000;

function parseDailyCron(cronExpression) {
	const parts = cronExpression.trim().split(/\s+/);

	if (parts.length !== 5) {
		throw new Error(`Unsupported CRON_SCHEDULE: ${cronExpression}`);
	}

	const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

	if (dayOfMonth !== "*" || month !== "*" || dayOfWeek !== "*") {
		throw new Error(`Only daily cron format is supported: ${cronExpression}`);
	}

	const parsedMinute = Number(minute);
	const parsedHour = Number(hour);

	if (
		Number.isNaN(parsedMinute) ||
		Number.isNaN(parsedHour) ||
		parsedMinute < 0 ||
		parsedMinute > 59 ||
		parsedHour < 0 ||
		parsedHour > 23
	) {
		throw new Error(`Invalid CRON_SCHEDULE: ${cronExpression}`);
	}

	return {
		hour: parsedHour,
		minute: parsedMinute,
	};
}

async function executeScheduledCron() {
	try {
		const { runSiteVisitCron } = await import(
			"@/controllers/api/web-page-watcher/siteVisitCron"
		);
		const response = await runSiteVisitCron();
		console.log("siteVisitCron:", response);
	} catch (error) {
		console.error("siteVisitCron failed:", error.message || error);
	}
}

export function initSiteVisitCronScheduler() {
	if (globalForCron.__siteVisitCronSchedulerStarted) {
		console.log("siteVisitCronScheduler already initialized");
		return;
	}

	globalForCron.__siteVisitCronSchedulerStarted = true;

	if (!CRON_ENABLED) {
		console.log("siteVisitCronScheduler disabled");
		return;
	}

	let schedule;
	try {
		schedule = parseDailyCron(CRON_SCHEDULE);
	} catch (error) {
		console.error(error.message || error);
		return;
	}

	globalForCron.__siteVisitCronLastRunKey = globalForCron.__siteVisitCronLastRunKey || "";

	const checkAndRun = async () => {
		const now = moment().tz(CRON_TIMEZONE);
		const currentRunKey = now.format("YYYY-MM-DD");
		const shouldRun = now.hour() === schedule.hour && now.minute() === schedule.minute;

		if (!shouldRun || globalForCron.__siteVisitCronLastRunKey === currentRunKey) {
			return;
		}

		globalForCron.__siteVisitCronLastRunKey = currentRunKey;
		console.log("siteVisitCronScheduler executing scheduled run");
		await executeScheduledCron();
	};

	void checkAndRun();
	globalForCron.__siteVisitCronInterval = setInterval(() => {
		void checkAndRun();
	}, CHECK_INTERVAL_MS);

	console.log(`siteVisitCronScheduler started at "${CRON_SCHEDULE}" (${CRON_TIMEZONE})`);
}
