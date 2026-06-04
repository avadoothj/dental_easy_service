import { Suspense } from "react";
import { redirect } from "next/navigation";
import { checkPermission } from "@/controllers/permission";
import style from "@/css/team/team.module.scss";
import TeamList from "@/components/onboardingEngineer/list";
import SearchFilter from "@/components/onboardingEngineer/searchFilter";
import SearchFilterMobile from "@/components/onboardingEngineer/searchFilterMobile";
import TeamHeading from "@/components/onboardingEngineer/header";
import TeamHeaderLoading from "@/components/onboardingEngineer/loading/header";

export const metadata = {
	title: "Onboarding Engineer",
};

export default async function OnboardingEngineer() {
	const isAllow = await checkPermission("/onboarding-engineer");
	if (!isAllow) redirect("/");

	return (
		<>
			<Suspense fallback={<TeamHeaderLoading />}>
				<TeamHeading />
			</Suspense>
			<div className="contentCopy">
				<SearchFilter />
				<SearchFilterMobile />
				<TeamList />
			</div>
		</>
	);
}
