import { Suspense } from "react";
import { redirect } from "next/navigation";
import { checkPermission } from "@/controllers/permission";
import RoleList from "@/components/roles/list";
import SearchPanel from "@/components/roles/searchPanel";
import SearchPanelMobile from "@/components/roles/searchPanelMobile";
import RoleHeading from "@/components/roles/header";
import RoleHeaderLoading from "@/components/roles/loading/header";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

export const metadata = {
	title: "Roles",
};

export default async function Roles() {
    const session = await getServerSession(options);
	const isAllow = await checkPermission("/roles");
	if (!isAllow) redirect("/");

	return (
		<>
			<Suspense fallback={<RoleHeaderLoading />}>
				<RoleHeading />
			</Suspense>
			<SearchPanel />
			<SearchPanelMobile />
			<RoleList user={session.user} />
		</>
	);
}
