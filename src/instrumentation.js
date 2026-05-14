export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { initSiteVisitCronScheduler } =
      await import("@/utils/cron/siteVisitCronScheduler");

    const { initCampaignCronScheduler } =
      await import("@/utils/cron/campaignCronScheduler");

    const { resumePendingTenderBulkUploads } =
      await import("@/controllers/tenderBulkUpload");

    // initSiteVisitCronScheduler();
    // resumePendingTenderBulkUploads();
    // initCampaignCronScheduler();
  }
}
