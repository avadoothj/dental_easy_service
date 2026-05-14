import CustomImage from "@/common/customImage";
import { errorIconYellow } from "@/utils/imagesPicker";

export default function SuccessPopup({ message, handleClose }) {
	return (
		<>
			<div className="headerterms">Success</div>
			<span className="erricnpass">
				<CustomImage
					src={errorIconYellow}
					alt="success"
					width="20"
					height="20"
				/>
			</span>
			<span>{message}</span>
			<div className="chpassbtn">
				<button
					className="commonBtn dark loginbtn"
					onClick={handleClose}
				>
					Ok
				</button>
			</div>
		</>
	);
}
