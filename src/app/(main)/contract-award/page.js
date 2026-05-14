import React from "react";
import { checkPermission } from "@/controllers/permission";
import { redirect } from "next/navigation";
import ContractPage from "@/components/contractaward/ContractPage";

export const metadata = {
  title: "Contract Award",
};

export default async function ContractAward() {
  const isAllow = await checkPermission("/contract-award");
  if (!isAllow) {
    redirect("/");
  }

  return (
    <>
      <div className="commonHeading">
        <h1>Contract Award</h1>
      </div>
      <ContractPage />
    </>
  );
}
