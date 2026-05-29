"use client";
import { useContext } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import style from "@/css/plan/plancard.module.scss";
import OttDetails from "@/components/plans/ottDetails";
import { editPlanPrice } from "@/utils/imagesPicker";
import CustomImage from "@/common/customImage";
import { formatPrice, getPlanDuration } from "@/utils/utils";
import copy from "clipboard-copy";
import { AppContext } from "@/contextProvider";
import { copyIcon } from "@/utils/imagesPicker";
import SimpleTooltip from "../common/simpleTooltip";
import messages from "@/utils/messages";

export default function Card({ item, togglePriceModal, setItem }) {
	const { showAlert, user } = useContext(AppContext);

	const handleSetPriceClick = () => {
		if (item.plan_status == 0) return false;
		setItem(item);
		togglePriceModal();
	};

	const handleCopyClick = async (textToCopy) => {
		try {
			await copy(textToCopy);
			showAlert("Copied!", 1);
		} catch (error) {
			console.error("Failed to copy text to clipboard", error);
		}
	};

	const renderCard = () => (
		<div className={`${style.planCard} ${item.plan_status == 0 ? style.disabled : ""}`}>
			{item.plan_status == 1 && (
				<div className="threedotpop">
					<Dropdown>
						<Dropdown.Toggle
							className="threedot"
							id="dropdown-basic"
						>
							<span>&#x2026;</span>
						</Dropdown.Toggle>
						<Dropdown.Menu>
							<Dropdown.Item onClick={() => handleCopyClick(item.bouquet_name)}>
								Copy Plan Name&nbsp;
								<span className={style.copyicn}>
									<CustomImage
										src={copyIcon}
										alt="copy"
										width="14"
										height="14"
									/>
								</span>
							</Dropdown.Item>
							<Dropdown.Item onClick={() => handleCopyClick(item.bouquet_code)}>
								Copy Plan Code&nbsp;
								<span className={style.copyicn}>
									<CustomImage
										src={copyIcon}
										alt="copy"
										width="14"
										height="14"
									/>
								</span>
							</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</div>
			)}
			<h2>{item.bouquet_name}</h2>
			<p>
				Plan Code:<span>{item.bouquet_code}</span>
			</p>
			<hr className={style.line1} />
			<h3>{getPlanDuration(item)}</h3>
			<OttDetails ottList={item.channels} />
			<hr className={style.line2} />
			<div className={style.priceWrapper}>
				<div className={style.yourPrice}>
					Your Price<span>{formatPrice(item.your_price)}</span>
				</div>
				{item.subscriber_price == null ? (
					(item.price_set_count && item.price_set_count == 0) ||
					user.user_type == "operator" ? (
						<div
							className={style.setsubPrice}
							onClick={handleSetPriceClick}
						>
							Set&nbsp;
							{user.user_type == "super isp"
								? "ISP"
								: user.user_type == "isp"
								? "Operator"
								: "Subscriber"}
							&nbsp;Price
						</div>
					) : (
						<div
							className={style.changeOptPrice}
							onClick={handleSetPriceClick}
						>
							Change / Set&nbsp;
							{user.user_type == "super isp" ? "ISP" : "Op."}
							&nbsp;Price
						</div>
					)
				) : (
					<div className={style.subsCriberPrice}>
						<div className={style.text}>
							Subscriber Price&nbsp;
							<span>{formatPrice(item.subscriber_price)}</span>
						</div>
						<button
							className={style.editBtn}
							onClick={handleSetPriceClick}
						>
							<CustomImage
								src={editPlanPrice}
								alt="edit"
							/>
						</button>
					</div>
				)}
			</div>
			{item.price_set_count > 0 && (
				<div className={style.priceSetOpt}>
					Price is set for{" "}
					<span>
						{item.price_set_count}{" "}
						{user.user_type == "super isp" ? "ISP(s)" : "Operator(s)"}
					</span>
				</div>
			)}
			{item.replace_bouquet_id != null && (
				<>
					<hr className={style.line2} />
					<div className={style.replaceDiv}>
						<strong>
							Replaced with -&nbsp;
							<span className="statusRed">{item.replace_bouquet_name}</span>
						</strong>
						<span>
							Plan Code:&nbsp;
							<span className="statusRed">{item.replace_bouquet_code}</span>
						</span>
					</div>
				</>
			)}
		</div>
	);

	return (
		<>
			{item.plan_status == 0 ? (
				<SimpleTooltip text={messages.PLAN_NO_LONGER_EXISTS}>{renderCard()}</SimpleTooltip>
			) : (
				renderCard()
			)}
		</>
	);
}
