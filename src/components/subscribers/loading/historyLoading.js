"use client";
import { Accordion } from "react-bootstrap";
import style from "@/css/subscribers/subscribers.module.scss";
import loadingStyle from "@/css/common/loading.module.scss";

export default function HistoryLoading({ noOfItems }) {
	let data = [];
	for (let i = 0; i < noOfItems; i++) data.push(i);
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
					<div className={style.main}>
						<div className={style.historyTableOutter}>
							<ul className={style.historyTable}>
								{data.map((item, i) => (
									<li key={i}>
										<h4
											className={`${style.tableHeading} ${loadingStyle.loading}`}
										>
											<i className={i == 0 ? style.active : ""}></i>
											<span></span>
										</h4>
										<div className={style.tableData}>
											<div
												className={`${style.tableDataCol} ${loadingStyle.loading}`}
											>
												<div
													className={`${style.tableDataCol} ${loadingStyle.loading}`}
												></div>
												<div
													className={`${style.tableDataCol} ${loadingStyle.loading}`}
												></div>
											</div>
											<div
												className={`${style.tableDataCol} ${loadingStyle.loading}`}
											>
												<div
													className={`${style.tableDataCol} ${loadingStyle.loading}`}
												>
													Loading
												</div>
												<div
													className={`${style.tableDataCol} ${loadingStyle.loading}`}
												></div>
											</div>
											<div
												className={`${style.tableDataCol} ${loadingStyle.loading}`}
											>
												<div
													className={`${style.tableDataCol} ${loadingStyle.loading}`}
												>
													Loading
												</div>
												<div
													className={`${style.tableDataCol} ${loadingStyle.loading}`}
												></div>
											</div>
											<div
												className={`${style.tableDataCol} ${loadingStyle.loading}`}
											>
												<div
													className={`${style.tableDataCol} ${loadingStyle.loading}`}
												>
													Loading
												</div>
												<div
													className={`${style.tableDataCol} ${loadingStyle.loading}`}
												></div>
											</div>
											<div
												className={`${style.tableDataCol} ${loadingStyle.loading}`}
											>
												<div
													className={`${style.tableDataCol} ${loadingStyle.loading}`}
												>
													Loading
												</div>
												<div
													className={`${style.tableDataCol} ${loadingStyle.loading}`}
												></div>
											</div>
											<div
												className={`${style.tableDataCol} ${loadingStyle.loading}`}
											>
												<div
													className={`${style.tableDataCol} ${loadingStyle.loading}`}
												>
													Loading
												</div>
												<div
													className={`${style.tableDataCol} ${loadingStyle.loading}`}
												></div>
											</div>
										</div>
									</li>
								))}
							</ul>
						</div>
					</div>
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
					<div className={style.main}>
						<div className={style.historyTableOutter}>
							<ul className={style.historyTable}>
								{data.map((item, i) => (
									<li key={i}>
										<h4
											className={`${style.tableHeading} ${loadingStyle.loading}`}
										>
											<i className={i == 0 ? style.active : ""}></i>
											<span></span>
										</h4>
										<div className={style.tableData}>
											<div
												className={`${style.tableDataCol} ${loadingStyle.loading}`}
											>
												<div
													className={`${style.tableDataCol} ${loadingStyle.loading}`}
												></div>
												<div
													className={`${style.tableDataCol} ${loadingStyle.loading}`}
												></div>
											</div>
											<div
												className={`${style.tableDataCol} ${loadingStyle.loading}`}
											>
												<div
													className={`${style.tableDataCol} ${loadingStyle.loading}`}
												>
													Loading
												</div>
												<div
													className={`${style.tableDataCol} ${loadingStyle.loading}`}
												></div>
											</div>
											<div
												className={`${style.tableDataCol} ${loadingStyle.loading}`}
											>
												<div
													className={`${style.tableDataCol} ${loadingStyle.loading}`}
												>
													Loading
												</div>
												<div
													className={`${style.tableDataCol} ${loadingStyle.loading}`}
												></div>
											</div>
											<div
												className={`${style.tableDataCol} ${loadingStyle.loading}`}
											>
												<div
													className={`${style.tableDataCol} ${loadingStyle.loading}`}
												>
													Loading
												</div>
												<div
													className={`${style.tableDataCol} ${loadingStyle.loading}`}
												></div>
											</div>
											<div
												className={`${style.tableDataCol} ${loadingStyle.loading}`}
											>
												<div
													className={`${style.tableDataCol} ${loadingStyle.loading}`}
												>
													Loading
												</div>
												<div
													className={`${style.tableDataCol} ${loadingStyle.loading}`}
												></div>
											</div>
											<div
												className={`${style.tableDataCol} ${loadingStyle.loading}`}
											>
												<div
													className={`${style.tableDataCol} ${loadingStyle.loading}`}
												>
													Loading
												</div>
												<div
													className={`${style.tableDataCol} ${loadingStyle.loading}`}
												></div>
											</div>
										</div>
									</li>
								))}
							</ul>
						</div>
					</div>
				</Accordion.Body>
			</Accordion.Item>
		</Accordion>
	);
}
