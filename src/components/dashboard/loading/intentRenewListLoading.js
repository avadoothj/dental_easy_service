import loadingStyle from "@/css/common/loading.module.scss";
import style from "@/css/common/dashboard.module.scss";
import { Accordion } from "react-bootstrap";

export default function IntentRenewListLoading({ noOfItems = 4 }) {
	let data = [];
	for (let i = 0; i < noOfItems; i++) data.push(i);

	return (
		<>
			<Accordion
				defaultActiveKey="0"
				className={style.dashAccordion}
			>
				{data.map((date, i) => (
					<Accordion.Item className={style.dashAccordionItem} key={i}>
						<Accordion.Header className={style.dashAccordionHeader}>
							<div className={style.headerInner}>
								<div className={style.dateWrap}>
									<div className={style.dateBox}>
										<div className={`${style.col} ${loadingStyle.loading}`}>
											loading loading loading
										</div>
									</div>
								</div>
							</div>
						</Accordion.Header>
					</Accordion.Item>
				))}
			</Accordion>
		</>
	);
}
