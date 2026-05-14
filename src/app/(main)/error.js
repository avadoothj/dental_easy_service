"use client";
import style from "@/css/common/notFound.module.scss";

export default function ErrorBoundary() {
	const handleReload = () => {
		window.location.reload();
	};

	return (
		<div className={style.noheadNoMargin}>
			<div className={style.pagebgerror}>
				<div className={style.bg404}>
					<div className={style.nopagebox}>
						<div className={style.opps}>Oops! Something Went Wrong</div>
						<div className={style.misstex}>
							Something went wrong on our end while processing your request. Please
							refresh the page or try again in a moment.
						</div>
						<button
							onClick={handleReload}
							className="commonBtn dark backdashboard"
						>
							Try Again
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
