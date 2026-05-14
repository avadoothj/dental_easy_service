import React from "react";
import Modification from "../../../components/tenderModification/modification";
import { checkPermission } from "@/controllers/permission";
import { redirect } from "next/navigation";
export const metadata = {
  title: "Tender Modification",
};
export default async function Page() {
  const isAllow = await checkPermission("/tender-modification");
  if (!isAllow) redirect("/");
  return (
    <>
      <div className="commonHeading">
        <h1>Tender Modification</h1>
      </div>
      <Modification />
    </>
  );
}
