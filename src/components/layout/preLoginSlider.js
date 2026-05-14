import CustomImage from "@/common/customImage";
import CustomSlider from "@/common/customSlider";
import { loginPageSliderImg } from "@/utils/masterData";

export default function PreLoginSlider() {
	const settings = {
		dots: true,
		autoplay: true,
		fade: true,
		arrows: false,
		infinite: true,
		autoplaySpeed: 7000,
		pauseOnHover: false,
		slidesToShow: 1,
		slidesToScroll: 1,
	};

	return (
		<CustomSlider
			className="loginslider"
			settings={settings}
		>
			{loginPageSliderImg.map((item, index) => (
				<div key={index}>
					<div className="slideImg">
						<CustomImage
							alt={`slider ${index}`}
							src={item.img}
							width="390"
							height="390"
						/>
					</div>
					<div className="slidetxt">{item.desc}</div>
				</div>
			))}
		</CustomSlider>
	);
}
