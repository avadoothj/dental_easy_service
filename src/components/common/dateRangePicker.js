"use client";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useEffect, useRef, useState } from "react";
import moment from "moment-timezone";
import { DateRangePicker } from "react-date-range";
import { currentDate } from "@/utils/dateHelper";
import { formatDate } from "@/utils/utils";
import CustomImage from "@/common/customImage";
import "@/css/common/datepicker.css";
import { calenderIcon } from "@/utils/imagesPicker";
import { predefinedDateRanges } from "@/utils/masterData";

export default function CustomDateRangePicker(props) {
	const options = {
		className: null,
		callback: () => {},
		format: "DD/MM/YYYY",
		value: [currentDate(), currentDate()],
		months: 1,
		rightAlignment: false,
		direction: "horizontal",
		minDate: "2023-01-01",
		inputRanges: [],
		...props,
	};

	const calenderOptions = {
		months: options.months,
		direction: options.direction,
		inputRanges: options.inputRanges,
	};

	if (options.minDate) {
		calenderOptions.minDate = new Date(options.minDate);
	}

	if (options.maxDate) {
		calenderOptions.maxDate = new Date(options.maxDate);
	}

	const ref = useRef(null);
	const [open, setOpen] = useState(false);
	const [actionPerform, setActionPerform] = useState(false);

	const [selectedDates, setSelectedDates] = useState({
		startDate: formatDate(options.value[0], 3),
		endDate: formatDate(options.value[1], 3),
	});

	const [state, setState] = useState([
		{
			startDate: moment(options.value[0]).toDate(),
			endDate: moment(options.value[1]).toDate(),
			key: "selection",
		},
	]);

	const handleSelect = (ranges) => {
		const { selection } = ranges;
		setState([selection]);
		setActionPerform(true);
		setSelectedDates({
			startDate: formatDate(selection.startDate, 3),
			endDate: formatDate(selection.endDate, 3),
		});
	};

	useEffect(() => {
		const timeout = setTimeout(() => {
			if (actionPerform) {
				options.callback([selectedDates.startDate, selectedDates.endDate]);
			}
		}, 1000);

		return () => clearTimeout(timeout);
	}, [selectedDates]);

	const handleClickOutside = (event) => {
		if (ref.current && !ref.current.contains(event.target)) {
			setOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div
			className={`dashdatepicker ${options.rightAlignment ? "alignRight" : ""} ${
				options.dropUp && "dropUp"
			}`}
		>
			<span className="icncal">
				<CustomImage
					alt="calender"
					src={calenderIcon}
				/>
			</span>
			<input
				type="text"
				readOnly
				value={`${formatDate(state[0].startDate, 7)} - ${formatDate(state[0].endDate, 7)}`}
				onClick={() => setOpen(true)}
			/>
			{open && (
				<span ref={ref}>
					<DateRangePicker
						onChange={handleSelect}
						ranges={state}
						staticRanges={predefinedDateRanges.map((range) => ({
							label: range.label,
							range: range.range,
							isSelected: () => false, // optional to highlight selected range
						}))}
						{...calenderOptions}
					/>
				</span>
			)}
		</div>
	);
}
