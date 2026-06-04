import MyProfile from "@/components/profile/myProfile";
import { getProfileData } from "@/controllers/profile";
import { getUserMenuData } from "@/controllers/permission";

export const metadata = {
	title: "My Profile",
};

export default async function Plans() {
	const [pageData, userMenu] = await Promise.all([getProfileData(), getUserMenuData()]);

	return (
		<MyProfile
			user={pageData.user}
			userMenu={userMenu}
			profileData={pageData.profile}
		/>
	);
}
