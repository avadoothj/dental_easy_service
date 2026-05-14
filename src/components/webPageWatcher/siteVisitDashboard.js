"use client";
import ListTable from "./listTable";

export default function SiteVisitDashboard({user }) {
  return (
      <ListTable
        userId={user.user_id}
      />
  );
}
