"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getConstant, encryptPassword } from "@/utils/utils";
import { loginValidation } from "@/utils/formValidation";
import style from "@/css/auth/login.module.scss";
import ErrorMessage from "@/common/errorMessage";
import commonStyle from "@/css/common/common.module.scss";
import sidebarData from "@/utils/sidebarData";
import Link from "next/link";
import loginStyle from "@/css/auth/login.module.scss";


export default function LoginForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const router = useRouter();
	const inputMaxLength = getConstant("MAXLENGTH_NAME");

	const defaultFormData = {
		username: "",
		password: "",
	};

	const formValidation = {
		username: register("username", loginValidation.username),
		password: register("password", loginValidation.password),
	};

	const [formData, setFormData] = useState(defaultFormData);
	const [isLoading, setIsLoading] = useState(false);
	const [authError, setAuthError] = useState("");
	const [searchParams, setSearchParams] = useState("/");
	const [showPassword, setShowPassword] = useState(false);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		setSearchParams(params);

		for (let i = 0; i < getConstant("USER_MENU_KEY_LENGTH"); i++) {
			localStorage.removeItem("user_menu_" + i);
		}
	}, []);

	const updateSelectedForm = (key, value) => {
		let temp = { ...formData };
		temp[key] = value;
		setFormData(temp);
	};

	const handleFormSubmit = async () => {
		console.log("formData :", formData);
		setAuthError("");
		setIsLoading(true);

		const response = await signIn("credentials", {
			username: formData.username.trim(),
			password: encryptPassword(formData.password),
			redirect: false,
		});

		if (response.error) {
			setAuthError(response.error);
			setIsLoading(false);
		} else {
			// Redirect preference:
			// 1) explicit ?redirect=...
			// 2) first allowed sidebar link (or "/")
			const redirectTo = searchParams.get("redirect");
			if (redirectTo) {
				router.push(redirectTo);
				router.refresh();
				return;
			}

			try {
				const session = await getSession();
				const allowedLinks = session?.user?.allowedLinks || [];

				const flattenSidebarLinks = () => {
					const links = [];
					sidebarData.forEach((section) => {
						section.forEach((item) => {
							if (item?.link) links.push(item.link);
							(item.menus || []).forEach((child) => {
								if (child?.link) links.push(child.link);
							});
						});
					});
					return links;
				};

				const orderedLinks = flattenSidebarLinks();
				console.log("orderedLinks :", orderedLinks);
				const firstAllowed = allowedLinks.includes("/")
					? "/"
					: orderedLinks.find((l) => allowedLinks.includes(l));

				router.push(firstAllowed || "/");
			} catch (e) {
				router.push("/");
			}
			router.refresh();
		}
	};

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)}>
			<span className={loginStyle.logo}></span>
			<h3 className="text-center">Sign In</h3>
			<p className="text-center">Please sign in to continue to the admin panel.</p>
			<ErrorMessage message={authError} />

			<div className="form-group">
				<label className="form-label">Email Address</label>
				<input
					{...formValidation.username}
					onChange={(e) => {
						formValidation.username.onChange(e);
						updateSelectedForm("username", e.target.value);
					}}
					className="form-control"
					type="text"
					name="username"
					id="username"
					placeholder="Enter your email"
					readOnly={isLoading}
					value={formData.username}
					maxLength={inputMaxLength}
					/>
				{errors?.username && (
					<span className={commonStyle.logerror}>{errors.username?.message}</span>
				)}
			</div>
			<div className="form-group position-relative">
				<label className="form-label">Password</label>
				<input
					{...formValidation.password}
					onChange={(e) => {
						formValidation.password.onChange(e);
						updateSelectedForm("password", e.target.value);
					}}
					className="form-control"
					type={showPassword ? "text" : "password"}
					name="password"
					id="password"
					placeholder="Enter your password"
					readOnly={isLoading}
					value={formData.password}
					maxLength={inputMaxLength}
				/>
				<span
					onClick={() => setShowPassword(!showPassword)}
					className={showPassword ? commonStyle.eyeclose : commonStyle.eyeopen}
				></span>
				{errors?.password && (
					<span className={commonStyle.logerror}>{errors.password?.message}</span>
				)}
			</div>
			<div className="d-flex justify-content-between align-items-center">
				<button
					type="submit"
					className={commonStyle.commonBtn}
					disabled={isLoading}
				>
					{isLoading ? getConstant("LOADING_TEXT") : "Sign In"}
				</button>
				<Link
					href="/forgetPassword">
					Forgot Password?
				</Link>
			</div>
		</form>
	);
}
