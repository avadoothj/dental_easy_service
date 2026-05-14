"use client";
import { useEffect, useState } from "react";
import CustomImage from "@/common/customImage";
import { scrollToTopImage } from "@/utils/imagesPicker";
import { usePathname } from "next/navigation";
import { allowForScrollTop } from "@/utils/masterData";

export default function scrollToTop() {
	const pathname = usePathname();

	const [isVisible, setIsVisible] = useState(false);
	const [isAllowOnPage, setIsAllowOnPage] = useState(false);

	// Function to scroll to the top of the page
	const scrollWindow = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	// Listen to scroll events to determine when to show the button
	useEffect(() => {
		const toggleVisibility = () => {
			if (window.pageYOffset > 150) {
				// Adjust this value as needed
				setIsVisible(true);
			} else {
				setIsVisible(false);
			}
		};

		window.addEventListener("scroll", toggleVisibility);

		return () => {
			window.removeEventListener("scroll", toggleVisibility);
		};
	}, []);

	useEffect(() => {
		setIsAllowOnPage(allowForScrollTop.includes(pathname) ? true : false);
	}, [pathname]);

	return (
		<>
			{isAllowOnPage && isVisible && (
				<button
					onClick={scrollWindow}
					className="scroll-to-top-button"
				>
					<CustomImage
						src={scrollToTopImage}
						alt="scroll"
						width="52"
						height="52"
					/>
				</button>
			)}
		</>
	);
}
