import CreateForm from "@/components/projectCreation/createForm";
import { redirect } from "next/navigation";
import { checkPermission } from "@/controllers/permission";

export const metadata = {
  title: "Add Project",
};
export default async function AddProjectPage() {
  const isAllow = await checkPermission("/project-list");
  if (!isAllow) redirect("/");
  return (
    <>
      <div className="commonHeading">
        <h1>Add Project</h1>
      </div>
      <CreateForm />
    </>
  );
}
