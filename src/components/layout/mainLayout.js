import Script from "next/script";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getServerSession } from "next-auth/next";
import { options } from "@/nextAuth/options";
import Sidebar from "@/components/layout/sidebar";
import CommonHeader from "@/components/layout/header";
import ToastComponent from "./toastComponent";
import AppContext from "@/contextProvider";
import SessionProvider from "@/sessionProvider";
import { getUserMenuData } from "@/controllers/permission";

export default async function MainLayout({ children }) {
	const [session] = await Promise.all([getServerSession(options)]);

	if (!session) {
		const headersList = headers();

		// Try multiple methods to detect the last accessed URL
		let lastUrl = null;

		// Method 1: Try to get from referer header (the page user was on or came from)
		const referer = headersList.get("referer");
		if (referer) {
			try {
				const refererUrl = new URL(referer);
				const host = headersList.get("host");

				// Check if referer is from the same origin
				const refererHost = refererUrl.host.replace(/:\d+$/, ""); // Remove port if present
				const currentHost = host?.replace(/:\d+$/, "");

				if (
					currentHost &&
					(refererHost === currentHost || refererUrl.hostname === currentHost)
				) {
					lastUrl = refererUrl.pathname + refererUrl.search;
				}
			} catch (e) {
				// If referer is not a full URL, try to use it as pathname
				if (referer.startsWith("/")) {
					lastUrl = referer;
				}
			}
		}

		// Only add redirect parameter if we have a valid URL and it's not login or home
		if (lastUrl && lastUrl !== "/" && lastUrl !== "/login" && !lastUrl.startsWith("/login")) {
			const redirectUrl = `/login?redirect=${encodeURIComponent(lastUrl)}`;
			redirect(redirectUrl);
		} else {
			redirect("/login");
		}
	}

	const [userMenu] = await Promise.all([
		// checkPasswordExpiry(),
		getUserMenuData(),
	]);

	return (
		<SessionProvider>
			<AppContext>
				<Sidebar
					user={session.user}
					userMenu={userMenu}
				/>
				<div className="contentWrapper">
					<CommonHeader
						user={session.user}
						userMenu={userMenu}
					/>
					<main className="mainbox px-4 py-4">{children}</main>
				</div>
				{/* <AccountActions
					terms={terms}
					password={password}
				/> */}
				<ToastComponent />
				<Script src="/js/jquery-3.7.1.min.js" />
			</AppContext>
		</SessionProvider>
	);
}
