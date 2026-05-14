"use client";
import { useEffect, useState } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

export default function MultiSelect(props) {
	const options = {
		id: null,
		className: null,
		showLabels: false,
		defaultSelected: [],
		callback: () => {},
		...props,
	};

	const dropdownOptions = {
		id: options.id,
		className: options.className,
	};

	const temp = [];
	options.data.map((x, i) => {
		temp.push({
			...x,
			checked: options.defaultSelected.indexOf(x.id) >= 0 ? true : false,
		});
	});

	const [data, setData] = useState(temp);
	const [selectedIds, setSelectedIds] = useState([]);
	const [selectedlabel, setSelectedlabel] = useState("");

	useEffect(() => {
		setSelectedIds(data.filter((x) => x.checked == true).map((x) => x.id));
		setSelectedlabel(
			data
				.filter((x) => x.checked == true)
				.map((x) => x.label)
				.join(",")
		);
	}, [data]);

	const handleSelect = (event) => {
		const list = [...data];

		list.map((x, i) => {
			if (event.target.value.indexOf(x.id) >= 0) {
				list[i].checked = !list[i].checked;
			}
			return true;
		});

		setData(list);
		options.callback(list.filter((x) => x.checked == true).map((x) => x.id));
	};

	const removeSelected = (item) => {
		const list = [...data];

		list.map((x, i) => {
			if (x.id == item.id) {
				list[i].checked = false;
			}
			return true;
		});

		setData(list);
		options.callback(list.filter((x) => x.checked == true).map((x) => x.id));
	};

	return (
		<>
			{data.filter((x) => x.checked == true).length > 0 && (
				<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
					{data
						.filter((x) => x.checked == true)
						.map((x, i) => (
							<span
								key={i}
								style={{
									backgroundColor: "#bebfc9",
									borderRadius: "10px",
									padding: "5px",
								}}
							>
								<span>{x.label}</span>
								&nbsp;&nbsp;
								<a
									href="#"
									onClick={(e) => {
										e.preventDefault();
										removeSelected(x);
									}}
								>
									x
								</a>
							</span>
						))}
				</Box>
			)}

			<Select
				multiple
				{...dropdownOptions}
				onChange={handleSelect}
				value={selectedlabel.split(",")}
				renderValue={(selected) => selected.join(", ")}
			>
				{data.map((x, i) => (
					<MenuItem
						key={i}
						value={x.id}
					>
						<Checkbox checked={selectedIds.indexOf(x.id) > -1} />
						<ListItemText primary={x.label} />
					</MenuItem>
				))}
			</Select>
		</>
	);
}
