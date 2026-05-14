"use client";
import { signOut, useSession } from "next-auth/react";
import { createContext, useEffect, useState } from "react";
import { eraseCookie, getConstant, getCookie, setCookie } from "@/utils/utils";
import { checkUserSession, getUserMenuData } from "./controllers/profile";

export const AppContext = createContext(null);

const Context = ({ children }) => {
	const { data: session, status } = useSession();

	let retryAttempted = false;
	const userMenuKey = "user_menu_";

	const [user, setUser] = useState(null);
	const [userMenu, setUserMenu] = useState(null);
	const [toastConfig, setToastConfig] = useState(false);
	const [toastQueue, setToastQueue] = useState([]);

	useEffect(() => {
		const alertInfo = getCookie("show_alert");

		if (alertInfo !== null && alertInfo != "") {
			const temp = JSON.parse(alertInfo);
			showAlert(temp.message, temp.type);
			eraseCookie("show_alert");
		}
	}, []);

	useEffect(() => {
		if (session === null || status == "unauthenticated") window.location.reload();

		if (session?.user) {
			const user = session.user;
			delete user.token;
			delete user.menus;
			setUser(user);

			if (
				window.amplitude !== undefined &&
				(window.amplitude.getUserId() === undefined ||
					window.amplitude.getUserId() != user.login_id)
			) {
				window.amplitude.setUserId(user.login_id);
			}
		}
	}, [session]);

	const getUserMenu = async () => {
		const response = await getUserMenuData();

		if (response.success) {
			let count = 0;
			const cookieLength = 2000;

			for (let i = 0; i < getConstant("USER_MENU_KEY_LENGTH"); i++) {
				localStorage.removeItem(userMenuKey + i);
			}

			for (let i = 0; i < response.menus.length; i += cookieLength) {
				localStorage.setItem(
					userMenuKey + count++,
					response.menus.slice(i, i + cookieLength),
				);
			}

			generateUserMenu();
		}
	};

	const generateUserMenu = () => {
		let userMenu = "";
		for (let i = 0; i < getConstant("USER_MENU_KEY_LENGTH"); i++) {
			const temp = localStorage.getItem(userMenuKey + i);

			if (temp === null) continue;
			userMenu += decodeURIComponent(temp);
		}

		try {
			JSON.parse(userMenu);
			setUserMenu(userMenu);
		} catch (error) {
			if (!retryAttempted) {
				getUserMenu();
				retryAttempted = true;
			}
			console.log("Unable to parse menu json");
		}
	};

	const handleUserLogout = (redirect = false) => {
		try {
			if (window.fcWidget) {
				window.fcWidget.destroy();
				window.fcWidget.user.clear();
			}
		} catch (error) {
			console.error("fcWidget", error.message || error);
		}

		for (let i = 0; i < getConstant("USER_MENU_KEY_LENGTH"); i++) {
			localStorage.removeItem(userMenuKey + i);
		}

		let callbackUrl = "/login";

		if (redirect && window.location.pathname != "/") {
			callbackUrl += "?redirect=" + window.location.pathname;

			if (window.location.search != "") {
				callbackUrl += encodeURIComponent(window.location.search);
			}
		}

		eraseCookie("activation_status");
		eraseCookie("balance_alert");
		eraseCookie("ticker_heading");
		eraseCookie("banner_alert");
		eraseCookie("password_alert");
		signOut({ callbackUrl, redirect: true });
	};

	const setAlertMessage = (message, type = 2) => {
		setCookie(
			"show_alert",
			JSON.stringify({
				message,
				type,
			}),
			1,
		);
	};

	/* 1 = Success (Default)
	 * 2 = Fail
	 * 3 = Warning
	 */
	const showAlert = (message, type = 2) => {
		const typeMaster = {
			1: { type: 1, heading: "Success" },
			2: { type: 2, heading: "Oops!" },
			3: { type: 3, heading: "Info" },
		};

		if (typeMaster[type] != undefined) {
			const toastId = Date.now() + Math.random(); // Generate unique ID
			const newToast = {
				id: toastId,
				message,
				data: typeMaster[type],
			};

			setToastQueue((prev) => [...prev, newToast]);

			// Auto-remove toast after 7 seconds
			setTimeout(() => {
				removeToast(toastId);
			}, 7000);
		}
	};

	const removeToast = (toastId) => {
		setToastQueue((prev) => prev.filter((toast) => toast.id !== toastId));
	};

	const context = {
		// User
		user,
		userMenu,
		handleUserLogout,

		// Toast message
		toastConfig,
		toastQueue,
		showAlert,
		removeToast,
		setAlertMessage,
	};

	return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
};

export default Context;
