"use client";
import { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import style from "@/css/common/searchPanel.module.scss";

export default function CustomDropdown(props) {
	const options = {
		id: null,
		className: null,
		showCheckbox: false,
		showLabel: true,
		defaultSelected: null,
		callback: () => {},
		...props,
	};

	const dropdownOptions = {
		id: options.id,
		className: options.className,
	};

	const [selected, setSelected] = useState(options.defaultSelected ?? options.data[0].id);
	const [displayLabel, setDisplayLabel] = useState("");

	useEffect(() => {
		setDisplayLabel(options.data.filter((x) => x.id == selected)[0].label);
	}, [selected]);

	const handleSelect = (eventKey) => {
		const selected = options.data.filter((x) => x.id == eventKey)[0];
		setSelected(selected ? selected.id : null);
		options.callback(selected ? selected.id : null);
	};

	return (
		<>
			{options.showLabel && <div className={style.drphead}>{options.dropdownLabel}</div>}

			<Dropdown onSelect={handleSelect}>
				<Dropdown.Toggle {...dropdownOptions}>
					{displayLabel}
					<span className="arrow"></span>
				</Dropdown.Toggle>
				<Dropdown.Menu>
					{options.data &&
						options.data.map((x, i) => (
							<Dropdown.Item
								key={i}
								eventKey={x.id}
							>
								{options.showCheckbox ? (
									<label className={style.crwrapper}>
										<span>{x.label}</span>
										<input
											name={
												"radio_" + options.id.replace(/[^a-zA-Z0-9 ]/g, "")
											}
											type="radio"
											checked={selected == x.id ? true : false}
											readOnly={true}
										/>
										<div className={style.crinput}></div>
									</label>
								) : (
									x.label
								)}
							</Dropdown.Item>
						))}
				</Dropdown.Menu>
			</Dropdown>
		</>
	);
}
