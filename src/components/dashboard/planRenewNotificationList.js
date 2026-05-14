import React, { useEffect, useContext, useState } from "react";
import style from "@/css/common/dashboard.module.scss";
import { Accordion } from "react-bootstrap";
import ConfirmationPopup from "@/components/layout/confirmationPopup";
import { AppContext } from "@/contextProvider";
import { formatDate, arrayUnique } from "@/utils/utils";
import { cancelIntent, cancelAutoRenewalRequest } from "@/controllers/dashboard";
import moment from "moment-timezone";
import messages from "@/utils/messages";
import { getRenewalIntentList, getAutoRenewalIntentList } from "@/controllers/dashboard";
import { getDateDifference } from "@/utils/dateHelper";
import IntentRenewListLoading from "./loading/intentRenewListLoading";
import CustomImage from "../common/customImage";
import { addSubscriberImage } from "@/utils/imagesPicker";
import Link from "next/link";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";

export default function PlanRenewNotificationList() {
	const [showCancelIntentModal, setShowCancelIntentModal] = useState(false);
	const [showAutoCancelIntentModal, setAutoShowCancelIntentModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [autoTabClick, setAutoTabClick] = useState(false);
	const [subId, setSubId] = useState(0);
	const { showAlert } = useContext(AppContext);
	const [renewalIntentList, setRenewalIntentList] = useState([]);
	const [autoRenewalIntentList, setAutoRenewalIntentList] = useState([]);
	const [uniqueDateList, setUniqueDateList] = useState([]);
	const [autoUniqueDateList, setAutoUniqueDateList] = useState([]);

	useEffect(() => {
		fetchRenewalData();
	}, []);

	const handleAutoTab = () => {
		if (autoTabClick == false) {
			fetchAutoData();
			setAutoTabClick(true);
		}
	};

	const fetchRenewalData = async () => {
		setIsLoading(true);
		const response = await getRenewalIntentList();
		setIsLoading(false);

		if (response.success) {
			setRenewalIntentList(response.list);
			setUniqueDateList(
				arrayUnique(response.list.map((item) => formatDate(item.inserted_date)))
			);
		}
	};

	const fetchAutoData = async () => {
		setIsLoading(true);
		const response2 = await getAutoRenewalIntentList();
		setIsLoading(false);

		if (response2.success) {
			setAutoRenewalIntentList(response2.list);
			setAutoUniqueDateList(
				arrayUnique(response2.list.map((item) => formatDate(item.inserted_date)))
			);
		}
	};

	const toggleCancelModal = (subId) => {
		setSubId(subId);
		setShowCancelIntentModal(!showCancelIntentModal);
	};

	const toggleAutoCancelModal = (subId) => {
		setSubId(subId);
		setAutoShowCancelIntentModal(!showAutoCancelIntentModal);
	};

	const [showNotification1, SetShowNotification1] = useState(false);
	const notificationClose1 = () => SetShowNotification1(false);
	const notificationShow1 = () => SetShowNotification1(true);

	const handleConfirmAction = async () => {
		setIsLoading(true);
		const response = await cancelIntent(subId);
		setIsLoading(false);

		if (response.success) {
			showAlert(messages.RENEW_INTENT_DECLINE_SUCCESS, 1);
			setShowCancelIntentModal(!showCancelIntentModal);
			fetchRenewalData();
		} else {
			showAlert(response.msg);
		}
	};

	const handleAutoConfirmAction = async () => {
		setIsLoading(true);
		const response = await cancelAutoRenewalRequest(subId);
		setIsLoading(false);

		if (response.success) {
			showAlert(messages.AUTO_RENEW_REQUEST_DECLINE_SUCCESS, 1);
			setAutoShowCancelIntentModal(!showAutoCancelIntentModal);
			fetchAutoData();
		} else {
			showAlert(response.msg);
		}
	};

	return (
		<>
			<Tab.Container defaultActiveKey="TabOne">
				<Nav>
					<Nav.Item>
						<Nav.Link eventKey="TabOne">Plan Renewal</Nav.Link>
					</Nav.Item>
					<Nav.Item>
						<Nav.Link
							eventKey="TabTwo"
							onClick={handleAutoTab}
						>
							Auto Renewal Setting
						</Nav.Link>
					</Nav.Item>
				</Nav>
				<Tab.Content>
					<Tab.Pane eventKey="TabOne">
						{isLoading ? (
							<IntentRenewListLoading />
						) : uniqueDateList.length > 0 ? (
							<Accordion
								defaultActiveKey="0"
								className={style.dashAccordion}
							>
								{uniqueDateList.map((date, i) => (
									<Accordion.Item
										key={i}
										eventKey={i - 1}
										className={style.dashAccordionItem}
									>
										<Accordion.Header className={style.dashAccordionHeader}>
											<div className={style.headerInner}>
												<div className={style.dateWrap}>
													<div className={style.dateBox}>
														<span>Date</span>
														<span>{date}</span>
													</div>
													<div className={style.count}>
														{
															renewalIntentList.filter(
																(item) =>
																	formatDate(
																		item.inserted_date
																	) == date
															).length
														}
													</div>
												</div>
												{getDateDifference(moment(date, "DD-MM-YYYY")) <
													0 && (
													<div className={style.pendingText}>
														Pending Past &nbsp;
														{Math.abs(
															getDateDifference(
																moment(date, "DD-MM-YYYY")
															)
														)}
														&nbsp; Days
													</div>
												)}
											</div>
										</Accordion.Header>
										<Accordion.Body className={style.dashAccordionBody}>
											<div className={style.resultListWrap}>
												<ul>
													{renewalIntentList
														.filter(
															(item) =>
																formatDate(item.inserted_date) ==
																date
														)
														.map((user, i) => (
															<li
																key={i}
																className={style.active}
															>
																<div className={style.contentBox}>
																	<div className={style.col}>
																		Name
																	</div>
																	<div className={style.col}>
																		<b>
																			{user.sub_name ?? "---"}
																		</b>
																	</div>
																	<div className={style.col}>
																		Email ID
																	</div>
																	<div className={style.col}>
																		<b>{user.email ?? "---"}</b>
																	</div>
																	<div className={style.col}>
																		Contact No
																	</div>
																	<div className={style.col}>
																		<b>
																			{user.mobile ?? "---"}
																		</b>
																	</div>
																</div>
																<div className={style.buttonWrap}>
																	<a
																		onClick={() =>
																			toggleCancelModal(
																				user.sub_id
																			)
																		}
																		className={style.btn1}
																	>
																		Cancel intent
																	</a>
																	<Link
																		href={
																			"/subscribers/details/" +
																			user.sub_id +
																			"#plans"
																		}
																		target="_blank"
																		className={style.btn2}
																	>
																		Select Plan
																	</Link>
																</div>
															</li>
														))}
												</ul>
											</div>
										</Accordion.Body>
									</Accordion.Item>
								))}
							</Accordion>
						) : (
							<div className={style.noRenewals}>
								<CustomImage
									alt="no data"
									src={addSubscriberImage}
								/>
								<h5>{messages.NO_RECORDS_FOUND}</h5>
							</div>
						)}
					</Tab.Pane>

					<Tab.Pane eventKey="TabTwo">
						{isLoading ? (
							<IntentRenewListLoading />
						) : autoUniqueDateList.length > 0 ? (
							<Accordion
								defaultActiveKey="1"
								className={style.dashAccordion}
							>
								{autoUniqueDateList.map((date, i) => (
									<Accordion.Item
										key={i}
										eventKey={i - 1}
										className={style.dashAccordionItem}
									>
										<Accordion.Header className={style.dashAccordionHeader}>
											<div className={style.headerInner}>
												<div className={style.dateWrap}>
													<div className={style.dateBox}>
														<span>Date</span>
														<span>{date}</span>
													</div>
													<div className={style.count}>
														{
															autoRenewalIntentList.filter(
																(item) =>
																	formatDate(
																		item.inserted_date
																	) == date
															).length
														}
													</div>
												</div>
												{getDateDifference(moment(date, "DD-MM-YYYY")) <
													0 && (
													<div className={style.pendingText}>
														Pending Past &nbsp;
														{Math.abs(
															getDateDifference(
																moment(date, "DD-MM-YYYY")
															)
														)}
														&nbsp; Days
													</div>
												)}
											</div>
										</Accordion.Header>
										<Accordion.Body className={style.dashAccordionBody}>
											<div className={style.resultListWrap}>
												<ul>
													{autoRenewalIntentList
														.filter(
															(item) =>
																formatDate(item.inserted_date) ==
																date
														)
														.map((user, i) => (
															<li
																key={i}
																className={style.active}
															>
																<div className={style.contentBox}>
																	<div className={style.col}>
																		Name
																	</div>
																	<div className={style.col}>
																		<b>
																			{user.sub_name ?? "---"}
																		</b>
																	</div>
																	<div className={style.col}>
																		Email ID
																	</div>
																	<div className={style.col}>
																		<b>{user.email ?? "---"}</b>
																	</div>
																	<div className={style.col}>
																		Contact No
																	</div>
																	<div className={style.col}>
																		<b>
																			{user.mobile ?? "---"}
																		</b>
																	</div>
																	<div className={style.col}>
																		Action
																	</div>
																	<div className={style.col}>
																		<b>
																			{user.action == 1
																				? "Enable"
																				: "Disable"}
																		</b>
																	</div>
																</div>
																<div className={style.buttonWrap}>
																	<a
																		onClick={() =>
																			toggleAutoCancelModal(
																				user.sub_id
																			)
																		}
																		className={style.btn1}
																	>
																		Cancel intent
																	</a>
																	<div
																		className={
																			style.innerBtnWrap
																		}
																	>
																		<Link
																			href={
																				"/subscribers/details/" +
																				user.sub_id +
																				"#plans"
																			}
																			target="_blank"
																			className={style.btn2}
																		>
																			{user.status ==
																			"DIS"
																				? "Activate Plan"
																				: "Change Status"}
																		</Link>
																	</div>
																</div>
															</li>
														))}
												</ul>
											</div>
										</Accordion.Body>
									</Accordion.Item>
								))}
							</Accordion>
						) : (
							<div className={style.noRenewals}>
								<CustomImage
									alt="no data"
									src={addSubscriberImage}
								/>
								<h5>{messages.NO_RECORDS_FOUND}</h5>
							</div>
						)}
					</Tab.Pane>
				</Tab.Content>
			</Tab.Container>

			<ConfirmationPopup
				show={showCancelIntentModal}
				message={`You want to cancel intent`}
				isLoading={isLoading}
				handleClose={toggleCancelModal}
				confirmAction={handleConfirmAction}
			/>
			<ConfirmationPopup
				show={showAutoCancelIntentModal}
				message={`You want to cancel auto renewal request`}
				isLoading={isLoading}
				handleClose={toggleAutoCancelModal}
				confirmAction={handleAutoConfirmAction}
			/>
		</>
	);
}
