"use client";
import Link from "next/link";
import style from "@/css/common/notFound.module.scss";

export default function NotFoundPage() {
	return (
		<div className={style.nohead}>
			<div className={style.pagebg404}>
				<div className={style.bg404}>
					<div className={style.nopagebox}>
						<div className={style.textpage}>404</div>
						<div className={style.opps}>Oops!, Page Not Found</div>
						<div className={style.misstex}>
							This page is missing or you assembled the link incorrectly.
						</div>
						<Link
							href="/"
							className="commonBtn dark backdashboard"
						>
							Back To Dashboard
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
