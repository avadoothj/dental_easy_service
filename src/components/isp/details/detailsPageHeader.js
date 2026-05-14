"use client";
import Link from "next/link";
import CustomImage from "@/common/customImage";
import style from "@/css/isp/isp.module.scss";
import { webBackArrowIcon, mobileBackArrowIcon } from "@/utils/imagesPicker";

export default function DetailsPageHeader({ children, isp = null }) {
	return (
		<>
			<div className="commonBackHeading">
				<div className="headingWrap">
					<Link href="/isp">
						<CustomImage
							src={webBackArrowIcon}
							className="web"
							width="20"
							height="18"
						/>
						<CustomImage
							src={mobileBackArrowIcon}
							className="mweb"
							width="9"
							height="15"
						/>
					</Link>
					{isp ? (
						<>
							<h1>ISP Details</h1>
							<div className="subscriberName">
								<span>{isp.oper_name}</span>
							</div>
						</>
					) : (
						<h1>Add New ISP</h1>
					)}
				</div>
			</div>
			<div
				className={isp ? style.isprow + " " + style.addmember : style.addmember}
				id="headerWrapper"
			>
				{children}
			</div>
		</>
	);
}
