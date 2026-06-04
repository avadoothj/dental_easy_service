"use client";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import tagStyle from "@/css/common/checkboxesTag.module.scss";
import { Chip } from "@mui/material";

export default function SelectMultiSearch(props) {
	const options = {
		id: null,
		className: null,
		limitTags: 5,
		placeholder: "",
		showCheckboxes: false,
		showAllOption: false,
		showLabels: false,
		multiple: false,
		search: false,
		renderTags: true,
		callback: () => {},
		...props,
	};

	options.defaultSelected = options.multiple
		? (props.defaultSelected ?? [])
		: (props.defaultSelected ?? -1);

	if (!options.multiple && options.defaultSelected) {
		options.defaultSelected = [options.defaultSelected];
	}

	const defaultStyle = {
		"&": { width: "100%" },
		"@media (max-width:600px)": { width: "100%" },
		"& .MuiAutocomplete-inputRoot": {
			background: "#f5f9fc",
			borderRadius: "6px",
			padding: "8.95px",
		},
		"& .MuiInputLabel-root": { display: "none" },
		"& fieldset": { top: 0, borderColor: "#DCE1EF" },
		"& legend": { display: "none" },
		"& .MuiOutlinedInput-root .MuiAutocomplete-input": {
			padding: "1px",
			border: "0",
			fontSize: "14px",
			"@media (max-width:600px)": { fontSize: "16px" },
		},
	};

	const processDataList = () => {
		const mainData = [];
		let defaultSelected = [];

		if (options.multiple && options.showAllOption) {
			mainData.push({ id: "all", label: "All", checked: false });
		}

		options.data.forEach((x) => {
			mainData.push({
				...x,
				checked: options.defaultSelected.indexOf(x.id) >= 0,
			});
		});

		if (options.multiple) {
			const allIdIndex = mainData.map((x) => x.id);
			options.defaultSelected.map((x) => {
				if (allIdIndex.indexOf(x) >= 0) {
					defaultSelected.push(mainData[allIdIndex.indexOf(x)]);
				}
			});
		} else {
			const selectedObj = mainData.find((x) => x.id == (options.defaultSelected[0] ?? -1));
			defaultSelected = selectedObj || null;
		}

		return { mainData, defaultSelected };
	};

	const { mainData, defaultSelected } = processDataList();
	const [data, setData] = useState(mainData);
	const [isChangedByUser, setIsChangedByUser] = useState(false);
	const [selectedOptions, setSelectedOptions] = useState(defaultSelected);

	const dropdownOptions = {
		id: options.id,
		fullWidth: true,
		value: selectedOptions,
		multiple: options.multiple,
		noOptionsText: options.noOptionsText,
		disableCloseOnSelect: options.multiple,
		limitTags: parseInt(options.limitTags),
		className: options.className,
		sx: { ...defaultStyle, ...options.style },
	};

	if (options.renderTags) {
		dropdownOptions.renderTags = (value, getTagProps) =>
			value
				.filter((x) => x.id != "all")
				.map((option, index) => (
					<Chip
						key={index}
						variant="outlined"
						label={option.label}
						size="small"
						{...getTagProps({ index })}
					/>
				));
	} else {
		dropdownOptions.renderTags = () => {};
	}

	useEffect(() => {
		const { mainData, defaultSelected } = processDataList();
		setData(mainData);
		setSelectedOptions(defaultSelected);
	}, [props.data]);

	useEffect(() => {
		if (options.multiple) {
			setSelectedOptions(data.filter((x) => x.checked));
			if (isChangedByUser) {
				options.callback(
					data.filter((x) => x.checked == true && x.id != "all").map((x) => x.id),
				);
			}
		} else {
			setSelectedOptions(data.filter((x) => x.checked)[0]);
			if (isChangedByUser) {
				const temp = data.filter((x) => x.checked == true).map((x) => x.id);
				options.callback(temp.length > 0 ? temp[0] : null);
			}
		}
	}, [data]);

	const handleSelect = (event, newValue) => {
		const list = [...data];
		const clickedId = event?.currentTarget?.getAttribute("value");

		if (clickedId === "all") {
			const allItem = list.find((x) => x.id === "all");
			const willBeChecked = !allItem.checked;
			list.forEach((x) => {
				x.checked = willBeChecked;
			});
		} else {
			const selectedIds = options.multiple ? newValue.map((x) => x.id) : [newValue?.id];

			list.forEach((x) => {
				if (x.id !== "all") {
					x.checked = selectedIds.includes(x.id);
				}
			});

			const allItem = list.find((x) => x.id === "all");
			if (allItem) {
				const nonAllOptions = list.filter((x) => x.id !== "all");
				allItem.checked = nonAllOptions.length > 0 && nonAllOptions.every((x) => x.checked);
			}
		}

		setData(list);
		setIsChangedByUser(true);
	};

	const removeSelected = (item) => {
		const list = [...data];
		list.forEach((x) => {
			if (x.id == item.id) x.checked = false;
		});

		const allItem = list.find((x) => x.id === "all");
		if (allItem) {
			const nonAllOptions = list.filter((x) => x.id !== "all");
			allItem.checked = nonAllOptions.every((x) => x.checked);
		}

		setData(list);
		setIsChangedByUser(true);
	};

	return (
		<>
			{options.showLabels &&
				data.filter((x) => x.checked == true && x.id != "all").length > 0 && (
					<ul className={tagStyle.multiSelectList}>
						{data
							.filter((x) => x.checked == true && x.id != "all")
							.map((x, i) => (
								<li key={i}>
									{x.label}
									<span
										className={tagStyle.closeBtn}
										onClick={(e) => {
											e.preventDefault();
											removeSelected(x);
										}}
									></span>
								</li>
							))}
					</ul>
				)}

			<Autocomplete
				{...dropdownOptions}
				options={data}
				onChange={(event, newValue) => handleSelect(event, newValue)}
				getOptionLabel={(option) => option.label || ""}
				renderOption={(props, option, { selected }) => {
					const { key, ...optionProps } = props;
					return (
						<li
							{...optionProps}
							key={key}
							value={option.id}
						>
							{options.showCheckboxes && (
								<Checkbox
									style={{ marginRight: 8 }}
									checked={selected}
								/>
							)}
							{option.label}
						</li>
					);
				}}
				renderInput={(params) => (
					<TextField
						{...params}
						placeholder={options.placeholder}
					/>
				)}
			/>
		</>
	);
}
