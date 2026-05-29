import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { options } from "@/nextAuth/options";

import { checkPermission } from "@/controllers/permission";

import CustomImage from "@/common/customImage";

import {
	webBackArrowIcon,
	mobileBackArrowIcon,
} from "@/utils/imagesPicker";

import { getRolesForTeams } from "@/controllers/role";

import AddOnboardingPageWrapper from "@/components/onboardingEngineer/addEngineer";

export const metadata = {
	title: "Add Onboarding Engineer",
};

export default async function AddPage() {
	const isAllow = await checkPermission(
		"/onboarding-engineer",
	);

	if (!isAllow) redirect("/");

	const session =
		await getServerSession(options);

	if (
		session.user.allowedLinks.indexOf(
			"/createUpdateInternalUser",
		) == -1
	) {
		redirect("/");
	}

	const role = await getRolesForTeams();

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
							src={
								mobileBackArrowIcon
							}
							className="mweb"
							width="9"
							height="15"
						/>
					</Link>

					<h1>
						Add OnBoarding Engineer
					</h1>
				</div>
			</div>

			<AddOnboardingPageWrapper
				mode="create"
				// role={role.data}
			/>
		</>
	);
}