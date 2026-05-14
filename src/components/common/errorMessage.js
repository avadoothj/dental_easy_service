import CustomImage from "@/common/customImage";
import { errorIconNew } from "@/utils/imagesPicker";

export default function ErrorMessage({ message }) {
	return (
		<>
			{message && (
				<div className="showerror">
					<CustomImage
						src={errorIconNew}
						alt="error"
						width="12"
						height="12"
					/>
					&nbsp;{message}
				</div>
			)}
		</>
	);
}
