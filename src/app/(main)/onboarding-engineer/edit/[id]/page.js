import Link from "next/link";

import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import { options } from "@/nextAuth/options";

import { checkPermission } from "@/controllers/permission";

import CustomImage from "@/common/customImage";

import { webBackArrowIcon, mobileBackArrowIcon } from "@/utils/imagesPicker";

import { getRolesForTeams } from "@/controllers/role";

import AddOnboardingPageWrapper from "@/components/onboardingEngineer/addEngineer";

export const metadata = {
	title: "Edit Onboarding Engineer",
};

export default async function EditPage({ params }) {
	const isAllow = await checkPermission("/onboarding-engineer");

	if (!isAllow) redirect("/");

	const session = await getServerSession(options);

	if (session.user.allowedLinks.indexOf("/createUpdateInternalUser") == -1) {
		redirect("/");
	}

	const role = await getRolesForTeams();
	console.log("Number(params.id) :", Number(params.id));

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

					<h1>Edit OnBoarding Engineer</h1>
				</div>
			</div>

			<AddOnboardingPageWrapper
				mode="edit"
				onboardingId={Number(params.id)}
				role={role.data}
			/>
		</>
	);
}
