import { Suspense } from "react";
import { redirect } from "next/navigation";
import { checkPermission } from "@/controllers/permission";
import SearchPanel from "@/components/resetPassword/searchPanel";
import SearchPanelMobile from "@/components/resetPassword/searchPanelMobile";
import ResetPassHeaderLoading from "@/components/resetPassword/loading/header";
import ResetPassHeading from "@/components/resetPassword/header";
import ResetPasswordList from "@/components/resetPassword/list";

export const metadata = {
	title: "Reset Password",
};

export default async function ResetPassword() {
	const isAllow = await checkPermission("/resetPassword");
	if (!isAllow) redirect("/");

	return (
		<>
			<Suspense fallback={<ResetPassHeaderLoading />}>
				<ResetPassHeading />
			</Suspense>
			<SearchPanel />
			<SearchPanelMobile />
			<ResetPasswordList />
		</>
	);
}
