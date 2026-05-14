import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { options } from "@/nextAuth/options";
import ForgetPasswordWrapper from "@/components/auth/forgetPassword/wrapper";

export const metadata = {
	title: "Forget Password",
};

export default async function ForgetPassword() {
	const session = await getServerSession(options);

	if (session) {
		redirect("/");
	}

	return <ForgetPasswordWrapper />;
}
