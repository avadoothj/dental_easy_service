import { Suspense } from "react";
import { redirect } from "next/navigation";
import { checkPermission } from "@/controllers/permission";
import style from "@/css/team/team.module.scss";
import TeamList from "@/components/team/list";
import SearchFilter from "@/components/team/searchFilter";
import SearchFilterMobile from "@/components/team/searchFilterMobile";
import TeamHeading from "@/components/team/header";
import TeamHeaderLoading from "@/components/team/loading/header";

export const metadata = {
	title: "Team",
};

export default async function Team() {
	const isAllow = await checkPermission("/team");
	if (!isAllow) redirect("/");

	return (
		<>
			<Suspense fallback={<TeamHeaderLoading />}>
				<TeamHeading />
			</Suspense>
			<SearchFilter />
			<SearchFilterMobile />

			<TeamList />
		</>
	);
}
