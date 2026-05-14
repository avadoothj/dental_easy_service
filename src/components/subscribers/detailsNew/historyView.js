"use client";
import { useState } from "react";
import { Accordion } from "react-bootstrap";
import style from "@/css/subscribers/subscribers.module.scss";
import { formatDate, showPlanDuration, formatPrice } from "@/utils/utils";
import CustomImage from "@/common/customImage";
import { addSubscriberImage } from "@/utils/imagesPicker";
import PageView from "../loading/pageView";

export default function HistoryView({ plan1History, plan2History }) {
	const [isLoading, setIsLoading] = useState(false);

	return (
		<Accordion
			defaultActiveKey="0"
			className={style.subscriberAccordion}
		>
			<Accordion.Item
				eventKey="0"
				className={style.subscriberAccordionItem}
			>
				<Accordion.Header className={style.subscriberAccordionHeader}>
					Plan 1 History
				</Accordion.Header>
				<Accordion.Body className={style.subscriberAccordionBody}>
					{isLoading ? (
						<PageView />
					) : plan1History.length > 0 ? (
						<div className={style.main}>
							<div className={style.historyTableOutter}>
								<ul className={style.historyTable}>
									{plan1History.map((item, i) => (
										<li key={i}>
											<h4 className={style.tableHeading}>
												<i className={i == 0 ? style.active : ""}></i>
												{item.action}
												<span>{formatDate(item.inserted_date, 2)}</span>
												{item.plan_type_during_cancellation ==
													"advance" && (
													<span className={style.advanceLabel}>
														Advance Plan
													</span>
												)}
											</h4>
											<div className={style.tableData}>
												<div className={style.tableDataCol}>
													<div>Pack</div>
													<div>
														<b>{item.bouquet_name}</b>
													</div>
												</div>
												<div className={style.tableDataCol}>
													<div>Start Date</div>
													<div>
														<b>{formatDate(item.start_date)}</b>
													</div>
												</div>
												<div className={style.tableDataCol}>
													<div>End Date</div>
													<div>
														<b>{formatDate(item.end_date)}</b>
													</div>
												</div>
												<div className={style.tableDataCol}>
													<div>Duration</div>
													<div>
														<b>{showPlanDuration(item)}</b>
													</div>
												</div>
												<div className={style.tableDataCol}>
													<div>Subscriber Price</div>
													<div>
														<b>{formatPrice(item.mrp)}</b>
													</div>
												</div>
												<div className={style.tableDataCol}>
													<div>Action Taken By</div>
													<div>
														<b>{item.action_taken_by}</b>
													</div>
												</div>
											</div>
										</li>
									))}
								</ul>
							</div>
						</div>
					) : (
						<div className={style.SubscriberHistory}>
							<div className={style.main}>
								<div className={style.nohistry}>
									<div className={style.historyImg}>
										<CustomImage
											src={addSubscriberImage}
											alt="no history"
											width="280"
											height="227"
										/>
									</div>
									<h1>No History Yet!</h1>
									<p>Please activate plan to view history</p>
								</div>
							</div>
						</div>
					)}
				</Accordion.Body>
			</Accordion.Item>

			<Accordion.Item
				eventKey="1"
				className={style.subscriberAccordionItem}
			>
				<Accordion.Header className={style.subscriberAccordionHeader}>
					Plan 2 History
				</Accordion.Header>
				<Accordion.Body className={style.subscriberAccordionBody}>
					{isLoading ? (
						<PageView />
					) : plan2History.length > 0 ? (
						<div className={style.main}>
							<div className={style.historyTableOutter}>
								<ul className={style.historyTable}>
									{plan2History.map((item, i) => (
										<li key={i}>
											<h4 className={style.tableHeading}>
												<i className={i == 0 ? style.active : ""}></i>
												{item.action}
												<span>{formatDate(item.inserted_date, 2)}</span>
												{item.plan_type_during_cancellation ==
													"advance" && (
													<span className={style.advanceLabel}>
														Advance Plan
													</span>
												)}
											</h4>
											<div className={style.tableData}>
												<div className={style.tableDataCol}>
													<div>Pack</div>
													<div>
														<b>{item.bouquet_name}</b>
													</div>
												</div>
												<div className={style.tableDataCol}>
													<div>Start Date</div>
													<div>
														<b>{formatDate(item.start_date)}</b>
													</div>
												</div>
												<div className={style.tableDataCol}>
													<div>End Date</div>
													<div>
														<b>{formatDate(item.end_date)}</b>
													</div>
												</div>
												<div className={style.tableDataCol}>
													<div>Duration</div>
													<div>
														<b>{showPlanDuration(item)}</b>
													</div>
												</div>
												<div className={style.tableDataCol}>
													<div>Subscriber Price</div>
													<div>
														<b>{formatPrice(item.mrp)}</b>
													</div>
												</div>
												<div className={style.tableDataCol}>
													<div>Action Taken By</div>
													<div>
														<b>{item.action_taken_by}</b>
													</div>
												</div>
											</div>
										</li>
									))}
								</ul>
							</div>
						</div>
					) : (
						<div className={style.SubscriberHistory}>
							<div className={style.main}>
								<div className={style.nohistry}>
									<div className={style.historyImg}>
										<CustomImage
											src={addSubscriberImage}
											alt="no history"
											width="280"
											height="227"
										/>
									</div>
									<h1>No History Yet!</h1>
									<p>Please activate plan to view history</p>
								</div>
							</div>
						</div>
					)}
				</Accordion.Body>
			</Accordion.Item>
		</Accordion>
	);
}
