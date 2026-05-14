import TenderQcTable from "@/components/tenderQc/tenderQcTable";
import { checkPermission } from "@/controllers/permission";
import { redirect } from "next/navigation";
export const metadata = {
  title: "Tender QC",
};
export default async function TenderQc() {
  const isAllow = await checkPermission("/tender-qc");
  if (!isAllow) redirect("/");
  return (
    <>
      <div className="commonHeading">
        <h1>Tender QC</h1>
      </div>
      <TenderQcTable />
    </>
  );
}
