import { redirect } from "next/navigation";
import { options } from "@/nextAuth/options";
import { getServerSession } from "next-auth/next";
import LoginAsUserWrapper from "@/components/loginAsUser/wrapper";

export default async function LoginAsUser() {
	const session = await getServerSession(options);
	const response = { success: true };

	if (session != null) {
		if (session.user.accountTakeover) {
			redirect("/");
		} else {
			response.success = false;
			response.msg =
				"You are already log in in this window, open given link in new browser/private window";
		}
	}

	return (
		<div className="contentWrapper contentWrapperPreAuth">
			<main className="mainbox px-4 py-4">
				<LoginAsUserWrapper response={response} />
			</main>
		</div>
	);
}
