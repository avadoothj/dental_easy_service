"use client";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";

export default function CustomSlider(props) {
	const settings = {
		dots: true,
		autoplay: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		...(props.settings ?? {}),
	};

	const children = props.children;
	delete props.children;

	return (
		<Slider
			{...settings}
			{...props}
		>
			{children}
		</Slider>
	);
}
