"use client";
import { useState } from "react";
import Form from "react-bootstrap/Form";

export default function SimpleSelect(props) {
	const options = {
		id: null,
		className: null,
		defaultSelected: null,
		callback: () => {},
		...props,
	};

	const dropdownOptions = {
		id: options.id,
		className: options.className,
	};

	const [selected, setSelected] = useState(
		options.defaultSelected === null ? options.data[0].id : options.defaultSelected.id
	);

	const handleSelect = (data) => {
		const selected = options.data.filter((x) => x.id == data.target.value)[0];
		setSelected(selected.id);
		options.callback(selected);
	};

	return (
		<Form.Select
			{...dropdownOptions}
			onChange={handleSelect}
			value={selected}
		>
			{options.data &&
				options.data.map((x, i) => (
					<option
						key={i}
						value={x.id}
						disabled={x.disabled && x.disabled === true ? true : false}
					>
						{x.label}
					</option>
				))}
		</Form.Select>
	);
}
