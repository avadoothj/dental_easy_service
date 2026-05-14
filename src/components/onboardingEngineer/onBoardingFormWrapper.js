export default function OnBoardingFormWrapper({
	onNext,
	onBack,
	disableNext,
	isFirst,
	isLast,
}) {
	return (
		<>
			<div className="btn-wrap d-flex justify-content-end">
				<button
					className="btn btnOutline"
					id="personalinfo"
				>
					Save as Draft
				</button>
				<button
					className="btn btnOutline"
					id="personalinfo"
				>
					Preview
				</button>
				<button className="btn btn-fill" onClick={onNext}>Save & Next</button>
			</div>
		</>
	);
}
