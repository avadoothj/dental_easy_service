import React from "react";
import { checkPermission } from "@/controllers/permission";
import { redirect } from "next/navigation";
import SenderList from "@/components/sender/senderList";

export const metadata = {
  title: "Sender List",
};

export default async function SenderPage() {
  const isAllow = await checkPermission("/senders");
  if (!isAllow) redirect("/");

  return (
    <>
      <div className="commonHeading">
        <h1>Sender List</h1>
      </div>
      <SenderList />
    </>
  );
}
