import React from "react";
import commonStyle from "@/css/common/common.module.scss";
import CustomImage from "../common/customImage";
import { iInfoIcon } from "@/utils/imagesPicker";

export default function Permissions({ permission, role, handleClose }) {
	const permissions = JSON.parse(permission);
	return (
		<div>
			<div className="setsubheader">
				<span>
					<CustomImage
						src={iInfoIcon}
						alt="Select Role"
						height="22"
						width="22"
					/>
					&nbsp;Role Rights
				</span>
				<span
					className="closesetsub"
					onClick={handleClose}
				></span>
			</div>
			<div className={commonStyle.rolbg}>
				<div className={commonStyle.roheadtext}>{role}</div>
				<ul className={commonStyle.rolebox}>
					{permissions.map((y) =>
						y.map((mainItem, i) => (
							<li key={i}>
								<span></span>
								{mainItem.name}
								{mainItem.menus.length > 0 && (
									<div className={commonStyle.btmbton}>
										{mainItem.menus.map((menuItem, i) => (
											<button key={i}>{menuItem.name}</button>
										))}
									</div>
								)}
							</li>
						))
					)}
				</ul>
			</div>
		</div>
	);
}
