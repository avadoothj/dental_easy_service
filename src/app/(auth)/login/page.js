import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { options } from "@/nextAuth/options";
import Link from "next/link";
import LoginForm from "@/components/auth/loginForm";
import style from "@/css/auth/login.module.scss";

export const metadata = {
	title: "Login",
};

export default async function Login({ searchParams = {} }) {
	const session = await getServerSession(options);

	if (session) {
		const queryString = new URLSearchParams(searchParams).toString();
		redirect(queryString ? decodeURIComponent(queryString).replace("redirect=", "") : "/");
	}

	return (
		<>
			<LoginForm />
			<Link
				href="/forgetPassword"
				className={style.forgotpass}
			>
				Forgot Password?
			</Link>
		</>
	);
}
