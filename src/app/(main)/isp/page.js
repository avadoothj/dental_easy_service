import { Suspense } from "react";
import { redirect } from "next/navigation";
import { checkPermission } from "@/controllers/permission";
import IspList from "@/components/isp/list";
import IspHeading from "@/components/isp/header";
import IspHeadingLoading from "@/components/isp/loading/header";
import SearchFilterLoading from "@/components/isp/loading/filters";
import IspFilters from "@/components/isp/filters";
import { getServerSession } from "next-auth/next";
import { options } from "@/nextAuth/options";

export const metadata = {
	title: "ISPs",
};

export default async function Isp() {
	const isAllow = await checkPermission("/isp");
	if (!isAllow) redirect("/");

	const [session] = await Promise.all([getServerSession(options)]);
	const userType = session?.user?.user_type;

	return (
		<>
			<Suspense fallback={<IspHeadingLoading />}>
				<IspHeading />
			</Suspense>
			<Suspense fallback={<SearchFilterLoading />}>
				<IspFilters
					userType={userType}
					user={session?.user}
				/>
			</Suspense>
			<IspList />
		</>
	);
}
