import React, { useEffect, useState } from "react";
import PlanRenewNotificationList from "./planRenewNotificationList";
import { arrayUnique, formatDate } from "@/utils/utils";
export default function planRenewNotificationModal({ toggleViewSubscriber, list, uniqueDateList }) {
	return (
		<>
			<div className="setsubheader">
				<span>Plan Renewing Notification</span>
				<span
					className="closesetsub"
					onClick={toggleViewSubscriber}
				></span>
			</div>
			<PlanRenewNotificationList
				list={list}
				uniqueDates={uniqueDateList}
			/>
		</>
	);
}
