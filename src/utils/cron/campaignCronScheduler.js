import "server-only";
import moment from "moment-timezone";

const globalForCron = globalThis;

const CRON_ENABLED =
  String(process.env.CRON_ENABLED || "true").toLowerCase() === "true";

const CHECK_INTERVAL_MS = 60000;

const MAIL_GAP_MS = 30000;

async function executeCampaignCron() {
  try {
    const { runCampaignJobs } = await import("@/services/campaignService");
    await runCampaignJobs();
  } catch (error) {
    console.error("campaignCron failed:", error.message || error);
  }
}

export function initCampaignCronScheduler() {
  if (globalForCron.__campaignCronStarted) {
    console.log("campaignCron already initialized");
    return;
  }

  globalForCron.__campaignCronStarted = true;

  if (!CRON_ENABLED) {
    console.log("campaignCron disabled");
    return;
  }

  globalForCron.__campaignCronRunning =
    globalForCron.__campaignCronRunning || false;

  globalForCron.__lastMailSentAt = globalForCron.__lastMailSentAt || 0;

  const checkAndRun = async () => {
    if (globalForCron.__campaignCronRunning) return;

    const now = Date.now();

    if (now - globalForCron.__lastMailSentAt < MAIL_GAP_MS) {
      return;
    }

    globalForCron.__campaignCronRunning = true;

    try {
      await executeCampaignCron();

      globalForCron.__lastMailSentAt = Date.now();
    } catch (err) {
      console.error("campaignCron run error:", err);
    }

    globalForCron.__campaignCronRunning = false;
  };

  void checkAndRun();

  globalForCron.__campaignCronInterval = setInterval(() => {
    void checkAndRun();
  }, CHECK_INTERVAL_MS);

  console.log("✅ campaignCron started (check every 1min, 30s gap)");
}
