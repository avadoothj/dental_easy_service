import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function SimpleTooltip(props) {
	const options = {
		placement: "bottom",
		text: "",
		...props,
	};

	delete options.children;

	return (
		<OverlayTrigger
			{...options}
			overlay={<Tooltip id="custom-tooltip">{options.text}</Tooltip>}
		>
			{props.children}
		</OverlayTrigger>
	);
}
