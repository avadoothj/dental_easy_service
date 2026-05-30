import Link from "next/link";

import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import { options } from "@/nextAuth/options";

import { checkPermission } from "@/controllers/permission";

import CustomImage from "@/common/customImage";

import { webBackArrowIcon, mobileBackArrowIcon } from "@/utils/imagesPicker";

import { getRolesForTeams } from "@/controllers/role";

import DetailPageWrapper from "@/components/onboardingEngineer/detailpage";
import { getOnboardingDataById } from "@/controllers/onboarding";

export const metadata = {
	title: "Edit Onboarding Engineer",
};

export default async function DetailPage({ params }) {
	const isAllow = await checkPermission("/onboarding-engineer");

	if (!isAllow) redirect("/");

	const session = await getServerSession(options);

	if (session.user.allowedLinks.indexOf("/createUpdateInternalUser") == -1) {
		redirect("/");
	}

	const role = await getRolesForTeams();
	console.log("Number(params.id) :", Number(params.id));
	const response = await getOnboardingDataById(Number(params.id));

	const onboardingData = {
		personalData: response.data.personal || null,

		documentData: response.data.documents || null,

		qualificationData: response.data.qualification || null,

		userCreationData: response.data.userCreation || null,

		bankData: response.data.bank || null,

		benefitData: response.data.benefits || null,

		ratingData: response.data.rating || null,
	};

	return (
		<>
			<div className="commonBackHeading">
				<div className="headingWrap">
					<Link href="/onboarding-engineer">
						<CustomImage
							src={webBackArrowIcon}
							className="web"
							width="20"
							height="18"
						/>

						<CustomImage
							src={mobileBackArrowIcon}
							className="mweb"
							width="9"
							height="15"
						/>
					</Link>

					<h1>Preview</h1>
				</div>
			</div>
			<DetailPageWrapper onboardingData={onboardingData} />
		</>
	);
}
