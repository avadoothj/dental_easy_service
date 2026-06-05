import PreLoginSlider from "./preLoginSlider";
import loginStyle from "@/css/auth/login.module.scss";
import { bundlrLogo2 } from "@/utils/imagesPicker";
import CustomImage from "@/components/common/customImage";

export default async function AuthLayout({ children }) {
	return (
		<div className={loginStyle.loginWrapper}>
			{children}
		</div>
	);
}
