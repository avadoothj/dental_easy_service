import { defaultPlaceHolder } from "@/utils/imagesPicker";
import Image from "next/image";

export default function CustomImage(props) {
	// Added below code to fix the image height width issue
	const fixForImageRatio = {
		style: { height: "auto" },
	};

	const options = {
		alt: "OTTplay",
		loading: "lazy",
		optimize: "true",
		quality: 100,
		ratio: "true",
		...props,
	};

	if (typeof options.ratio !== "undefined" && options.ratio == "true") {
		Object.keys(fixForImageRatio).map((key) => {
			options[key] = fixForImageRatio[key];
			return true
		});
	}

	if (typeof options.alt == "undefined" || options.alt == "" || options.alt == null) {
		options.alt = "OTTplay";
	}

	if (typeof options.src == "undefined" || options.src == "" || options.src == null) {
		options.src = defaultPlaceHolder;
		delete options.style;
	}

	/* To fix the below warning from console
	 * Only plain objects can be passed to Client Components from Server Components
	 */
	options.src = JSON.parse(JSON.stringify(options.src));

	return (
		<Image
			alt=""
			{...options}
		/>
	);
}
