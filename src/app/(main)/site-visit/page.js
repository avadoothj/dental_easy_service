import { options } from "@/nextAuth/options";
import { getAllRecordCount } from "@/controllers/api/web-page-watcher/addLink";
import SiteVisitDashboard from "@/components/webPageWatcher/siteVisitDashboard";
import SiteVisitHeading from "@/components/webPageWatcher/siteVisitHeading";
import { getServerSession } from "next-auth";
import { checkPermission } from "@/controllers/permission";
import { redirect } from "next/navigation";
// import { startSiteVisitCron } from "@/controllers/api/web-page-watcher/siteVisitCron";
// import TestButton from "@/components/webPageWatcher/testButton";

// async function testAction() {
//   'use server';
//   await startSiteVisitCron();
// }

export const metadata = {
  title: "Site Visit",
};

export default async function SiteVisit() {
  const isAllow = await checkPermission("/site-visit");
  if (!isAllow) redirect("/");
  const [session, counts] = await Promise.all([
    getServerSession(options),
    getAllRecordCount(),
  ]);

  return (
    <>
      <SiteVisitHeading counts={counts} />
      {/* <TestButton action={testAction} /> */}
      <SiteVisitDashboard user={session.user} />
    </>
  );
}
