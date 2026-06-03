import PreLoginSlider from "./preLoginSlider";
import style from "@/css/auth/login.module.scss";
import { bundlrLogo2 } from "@/utils/imagesPicker";
import CustomImage from "@/components/common/customImage";

export default async function AuthLayout({ children }) {
	return (
		<div className={style.logouter}>
			<div className={style.logleft}>
				<div className={style.collw}>
					<PreLoginSlider />
				</div>
			</div>
			<div className={style.logright}>
				<div className={style.colrw}>
					<div className={style.ottlogo}>
						<CustomImage
							src={bundlrLogo2}
							alt="sdfsdfsdfs Logo"
							width="185"
							height="47"
						/>
					</div>
					{children}
				</div>
				{/* <div className={style.powerby}>
					<div className={style.powr}>Powered by</div>
					<div>HT Labs</div>
				</div> */}
			</div>
		</div>
	);
}
