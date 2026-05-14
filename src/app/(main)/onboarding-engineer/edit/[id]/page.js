import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { options } from "@/nextAuth/options";
import { checkPermission } from "@/controllers/permission";
import CustomImage from "@/common/customImage";
import { webBackArrowIcon, mobileBackArrowIcon } from "@/utils/imagesPicker";
import { getFieldEngineer } from "@/controllers/onboarding";
import EditOnboardingPageWrapper from "@/components/onboardingEngineer/editTeam";
import { getRolesForTeams } from "@/controllers/role";

export const metadata = {
	title: "Edit Team",
};

export default async function EditTeamPage({ params }) {
	const { id } = params;

	const isAllow = await checkPermission("/onboarding-engineer");
 console.log('isAllow :', isAllow);
	if (!isAllow) redirect("/");

	const session = await getServerSession(options);

	// if (session.user.allowedLinks.indexOf("/createUpdateInternalUser") == -1) {
	// 	redirect("/");
	// }

	const [teamResponse, role] = await Promise.all([getFieldEngineer(id), getRolesForTeams()]);

	if (!teamResponse.success) {
		redirect("/onboarding-engineer");
	}

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
					<h1>Edit Team Member</h1>
					<div className="subscriberName">
						<span>{teamResponse.data.full_name}</span>
					</div>
				</div>
			</div>

			<EditOnboardingPageWrapper
				user={teamResponse.data}
				role={role.data}
			/>
		</>
	);
}
