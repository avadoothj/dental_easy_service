import { redirect } from "next/navigation";
import { checkPermission } from "@/controllers/permission";
import DetailsPageHeader from "@/components/isp/details/detailsPageHeader";
import DetailsWrapper from "@/components/isp/details/detailsWrapper";
import { getStateList } from "@/controllers/common";
import { getIspDetails } from "@/controllers/isp";
import { getServerSession } from "next-auth/next";
import { getSuperIspList } from "@/controllers/superIsp";

import { options } from "@/nextAuth/options";
export const metadata = {
	title: "ISP Details",
};

export default async function IspDetails({ params }) {
	const isAllow = await checkPermission("/isp");
	if (!isAllow) redirect("/");

	const { id } = params;
	const [ispResponse, stateList, session, isAllowBalancePage, superIspList] = await Promise.all([
		getIspDetails(id),
		getStateList(),
		getServerSession(options),
		checkPermission("/ispWallet"),
		getSuperIspList(),
	]);

	if (!ispResponse.success) {
		redirect("/isp");
	}

	return (
		<DetailsPageHeader isp={ispResponse.data}>
			<DetailsWrapper
				isp={ispResponse.data}
				user={session.user}
				stateList={stateList}
				isAllowBalancePage={isAllowBalancePage}
				superIspList={superIspList}
			/>
		</DetailsPageHeader>
	);
}
