"use client";
import Link from "next/link";
import style from "@/css/common/notFound.module.scss";

export default function ErrorBoundary({ error }) {
	return (
		<div className={style.nohead}>
			<div className={style.pagebgerror}>
				<div className={style.bg404}>
					<div className={style.nopagebox}>
						<div className={style.opps}>Oops! Something Went Wrong</div>
						<div className={style.misstex}>
							Something went wrong on our end while processing your request. Please
							refresh the page or try again in a moment.
						</div>
						<Link
							href="/"
							className="commonBtn dark backdashboard"
						>
							Go Back
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
