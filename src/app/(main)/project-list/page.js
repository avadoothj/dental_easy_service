import ProjectListTable from "@/components/projectCreation/projectListTable";
import { checkPermission } from "@/controllers/permission";
import { redirect } from "next/navigation";
export const metadata = {
  title: "Project List",
};
export default async function ProjectListPage() {
  const isAllow = await checkPermission("/project-list");
  if (!isAllow) redirect("/");
  return (
    <>
      <div className="commonHeading">
        <h1>Project List</h1>
      </div>
      <ProjectListTable />
    </>
  );
}
