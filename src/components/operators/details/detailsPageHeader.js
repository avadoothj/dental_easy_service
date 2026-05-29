"use client";
import { useEffect } from "react";
import Link from "next/link";
import CustomImage from "@/common/customImage";
import style from "@/css/operator/operator.module.scss";
import { webBackArrowIcon, mobileBackArrowIcon } from "@/utils/imagesPicker";

export default function DetailsPageHeader({ children, operator = null }) {
	/* useEffect(() => {
		document.body.className += " hamburgerHide";
		return () => {
			document.body.className = document.body.className.replace("hamburgerHide", "");
		};
	}, []); */

	return (
		<>
			<div className="commonBackHeading">
				<div className="headingWrap">
					<Link href="/operators">
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
					{operator ? (
						<>
							<h1>Operator Details</h1>
							<div className="subscriberName">
								<span>{operator.oper_name}</span>
							</div>
						</>
					) : (
						<h1>Add Operator</h1>
					)}
				</div>
			</div>
			<div
				className={style.OperatorDetails}
				id="headerWrapper"
			>
				{children}
			</div>
		</>
	);
}
