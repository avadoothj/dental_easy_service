"use client";
import { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import style from "@/css/coupon/coupon.module.scss";
import SelectMultiSearch from "@/components/common/selectMultiSearch";
import { addCouponValidation } from "@/utils/formValidation";
import { getRetailerList } from "@/controllers/retailer";
import { getDistributorPlans } from "@/controllers/distributors";
import { AppContext } from "@/contextProvider";
import messages from "@/utils/messages";
import CustomImage from "@/common/customImage";
import { addSubscriberImage } from "@/utils/imagesPicker";
import { formatNumber, getConstant } from "@/utils/utils";
import {
	assignCouponsToRetailer,
	getAvailableCoupons,
	getCouponListForAssign,
} from "@/controllers/coupon";

export default function AssignCouponWrapper({ user, distributorList }) {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm();

	const defaultFormData = {
		distributor_id: "",
		retailor_id: "",
		plan_id: "",
		coupons: 0,
	};

	const router = useRouter();
	const { showAlert } = useContext(AppContext);
	const inputMaxLength = getConstant("INPUT_MAXLENGTH");

	const [distributor_id, setDistributorId] = useState(null);
	const [retailor_id, setRetailerId] = useState(null);
	const [plan_id, setPlanId] = useState(null);
	const [dataEdited, setDataEdited] = useState(false);
	const [showList, setShowList] = useState(false);
	const [isLoading1, setIsLoading1] = useState(false);
	const [isLoading2, setIsLoading2] = useState(false);
	const [formData, setFormData] = useState(defaultFormData);
	const [keyword, setKeyword] = useState("");
	const [retailList, setRetailList] = useState([]);
	const [planList, setPlanList] = useState([]);
	const [planCouponCountList, setPlanCouponCountList] = useState([]);
	const [availCouponCount, setAvailCouponCount] = useState(null);
	const [totalAvailCouponCount, setTotalAvailCouponCount] = useState(null);
	const [availCouponList, setAvailCouponList] = useState([]);
	const [displayCouponList, setDisplayCouponList] = useState([]);
	const [selectedCouponCount, setSelectedCouponCount] = useState(0);
	const [selectedTotalCouponCount, setSelectedTotalCouponCount] = useState(0);
	const [couponsError, setCouponsError] = useState(null);
	const [globalCheckStatus, setGlobalCheckStatus] = useState(true);

	const formValidation = {
		retailor_id: register("retailor_id", addCouponValidation.retailor_id),
		plan_id: register("plan_id", addCouponValidation.plan_id),
		coupons: register("coupons", addCouponValidation.coupons_list),
	};

	if (user.user_type == "internal") {
		formValidation.distributor_id = register(
			"distributor_id",
			addCouponValidation.distributor_id
		);
	}

	useEffect(() => {
		document.body.className += " hamburgerHide";
		return () => {
			document.body.className = document.body.className.replace("hamburgerHide", "");
		};
	}, []);

	const updateSelectedForm = (key, value) => {
		let temp = { ...formData };
		temp[key] = value;
		setFormData(temp);
	};

	useEffect(() => {
		if (user.user_type != "internal") {
			planListData();
			retailerListData();
			getTotalCouponCount();
		}
	}, []);

	useEffect(() => {
		if (distributor_id) {
			updateSelectedForm("distributor_id", distributor_id);
			planListData();
			retailerListData();
			getTotalCouponCount();
			setDataEdited(true);
			setFormData({ ...formData, distributor_id: distributor_id });
			setValue("distributor_id", distributor_id, { shouldValidate: true });
		} else if (distributor_id == null) {
			if (dataEdited) {
				setValue("distributor_id", "", { shouldValidate: true });
			}
		}
	}, [distributor_id]);

	useEffect(() => {
		if (retailor_id) {
			updateSelectedForm("retailor_id", retailor_id);
			setDataEdited(true);
			setFormData({ ...formData, retailor_id: retailor_id });
			setValue("retailor_id", retailor_id, { shouldValidate: true });
		} else if (retailor_id == null) {
			if (dataEdited) {
				setValue("retailor_id", "", { shouldValidate: true });
			}
		}
	}, [retailor_id]);

	useEffect(() => {
		if (retailor_id) {
			setValue("retailor_id", retailor_id, { shouldValidate: true });
		}
	}, [retailList]);

	useEffect(() => {
		setCouponsError("");
		if (availCouponCount != null && availCouponCount < parseInt(formData.coupons)) {
			setCouponsError(messages.CHECK_AVAILABLE_COUPONS);
		}
	}, [formData.coupons]);

	useEffect(() => {
		if (plan_id != null) {
			setDataEdited(true);
			setFormData({ ...formData, plan_id: plan_id });
			setAvailCouponCount(
				planCouponCountList.find((plan) => plan.bouquet_id == plan_id)?.count ?? 0
			);
			updateSelectedForm("plan_id", plan_id);
			setValue("plan_id", plan_id, { shouldValidate: true });
		} else if (plan_id == null) {
			setAvailCouponCount(null);
			if (dataEdited) {
				setValue("plan_id", "", { shouldValidate: true });
			}
		}
	}, [plan_id]);

	useEffect(() => {
		if (plan_id) {
			setValue("plan_id", plan_id, { shouldValidate: true });
		}
	}, [planList]);

	useEffect(() => {
		filterCouponList();
		setSelectedCouponCount(availCouponList.filter((x) => x.checked == true).length);
	}, [availCouponList]);

	useEffect(() => {
		const checkKeyword = setTimeout(() => {
			filterCouponList();
		}, 500);

		return () => clearTimeout(checkKeyword);
	}, [keyword]);

	const filterCouponList = () => {
		if (keyword == "") {
			setDisplayCouponList(availCouponList);
		} else {
			const checkKeyword = keyword.toLowerCase();
			setDisplayCouponList(
				availCouponList.filter((x) =>
					x.coupon_serial_no.toLowerCase().includes(checkKeyword)
				)
			);
		}
	};

	const getTotalCouponCount = async () => {
		const distId = distributor_id ? distributor_id : user.oper_id;
		const response = await getAvailableCoupons({ dist_id: distId });

		if (response.success) {
			setPlanCouponCountList(response.list);
			setTotalAvailCouponCount(
				response.list.reduce((sum, item) => sum + Number(item.count), 0)
			);
		}
	};

	const retailerListData = async () => {
		const distId = distributor_id ? distributor_id : user.oper_id;
		const retailList = await getRetailerList({ distributor_id: distId });
		setRetailList(retailList);
	};

	const planListData = async () => {
		const distId = distributor_id ? distributor_id : user.oper_id;
		const list = await getDistributorPlans(distId);
		setPlanList(list);
		if (dataEdited) {
			setValue("plan_id", "", { shouldValidate: true });
		}
	};

	const handleMakeSelectionAction = async () => {
		const couponCount = parseInt(formData.coupons);

		if (availCouponCount == 0 || couponCount > availCouponCount || couponCount == 0) {
			showAlert(messages.CHECK_AVAILABLE_COUPONS);
			return false;
		}

		const payload = {
			oper_id: distributor_id ? distributor_id : user.oper_id,
			plan_id: plan_id,
			limit: couponCount,
		};

		setIsLoading1(true);
		const response = await getCouponListForAssign(payload);
		setIsLoading1(false);

		if (response.success) {
			const temp = [];
			response.list.map((x, i) => {
				temp.push({ ...x, sr_no: i + 1, checked: i < couponCount ? true : false });
			});

			setShowList(true);
			setAvailCouponList(temp);
			setSelectedTotalCouponCount(couponCount);
		}
	};

	const handleCheckboxChange = (coupon_id) => {
		setAvailCouponList(
			availCouponList.map((activity) => {
				if (activity.id === coupon_id) {
					return { ...activity, checked: !activity.checked };
				}
				return activity;
			})
		);
	};

	const handleGlobalCheckboxChange = () => {
		setGlobalCheckStatus(!globalCheckStatus);
		if (globalCheckStatus === false) {
			filterCouponList();
			setAvailCouponList(
				availCouponList.map((activity, i) => {
					return { ...activity, checked: i < selectedTotalCouponCount };
				})
			);
		} else {
			setAvailCouponList(
				availCouponList.map((activity) => {
					return { ...activity, checked: false };
				})
			);
		}
	};

	const handleAssignFormAction = async () => {
		const payload = {
			oper_id: distributor_id ? distributor_id : user.oper_id,
			retailor_id: formData.retailor_id,
			plan_id: formData.plan_id,
			coupons: availCouponList.filter((x) => x.checked == true).map((x) => x.id),
		};

		setIsLoading2(true);
		const response = await assignCouponsToRetailer(payload);
		setIsLoading2(false);

		if (response.success) {
			showAlert(messages.COUPON_ASSIGN_SUCCESS, 1);
			router.push("/coupons");
		} else {
			showAlert(response.msg);
		}
	};

	return (
		<>
			<div className={style.assignCouponHeader}>
				<h2>
					Total available coupon code for distribution&nbsp;
					<span>{formatNumber(totalAvailCouponCount)}</span>
				</h2>
				<div className={style.headerBtnWrap}>
					<div className={style.text}>
						Selected&nbsp;
						<span>
							<b>{formatNumber(selectedCouponCount)}</b>/
							{formatNumber(selectedTotalCouponCount) || 0}
						</span>
					</div>
					<button
						className="commonBtn dark"
						disabled={
							isLoading1 ||
							isLoading2 ||
							selectedCouponCount == 0 ||
							selectedCouponCount != selectedTotalCouponCount
						}
						onClick={handleAssignFormAction}
					>
						{isLoading2 ? getConstant("LOADING_TEXT") : "Confirm"}
					</button>
				</div>
			</div>
			<div className={style.assignCoupon}>
				<div className={style.inner}>
					<div className={style.assignCouponForm}>
						<form onSubmit={handleSubmit(handleMakeSelectionAction)}>
							{user.user_type == "internal" && (
								<div className={style.couponRow}>
									<label>Select Distributor</label>
									<div className={style.customselect2}>
										<SelectMultiSearch
											data={distributorList}
											defaultSelected={formData.distributor_id}
											id="distributor_id"
											name="distributor_id"
											placeholder="Select Distributor"
											noOptionsText="No Distributor found"
											callback={setDistributorId}
										/>
										{errors?.distributor_id && (
											<span className={style.error1}>
												{errors.distributor_id?.message}
											</span>
										)}
									</div>
								</div>
							)}
							<div className={style.couponRow}>
								<label>Select Retailer</label>
								<div className={style.customselect2}>
									<SelectMultiSearch
										data={retailList}
										defaultSelected={formData.retailor_id}
										id="retailor_id"
										name="retailor_id"
										placeholder="Select Retailer"
										noOptionsText="No Retailer found"
										callback={setRetailerId}
									/>
									{errors?.retailor_id && (
										<span className={style.error1}>
											{errors.retailor_id?.message}
										</span>
									)}
								</div>
							</div>
							<div className={style.couponRow}>
								<label className={style.mt5}>Select Coupon Plan</label>
								<div className={style.customselect2}>
									<SelectMultiSearch
										data={planList}
										defaultSelected={formData.plan_id}
										id="plan_id"
										name="plan_id"
										placeholder="Select Plan"
										noOptionsText="No Plan found"
										callback={setPlanId}
									/>
									{plan_id != null && availCouponCount != null && (
										<div
											className={`${style.amountText} ${
												style[availCouponCount > 0 ? "green" : "red"]
											}`}
										>
											*Available Coupons For This Plan&nbsp;
											<b>
												{availCouponCount > 0
													? formatNumber(availCouponCount)
													: 0}
											</b>
										</div>
									)}
									{errors?.plan_id && (
										<span className={style.error1}>
											{errors.plan_id?.message}
										</span>
									)}
								</div>
							</div>
							<div className={style.couponRow}>
								<label className={style.mt5}>No of Coupons To Assign</label>
								<div className={style.inputsWrap}>
									<input
										{...formValidation.coupons}
										type="text"
										onChange={(e) => {
											formValidation.coupons.onChange(e);
											updateSelectedForm("coupons", e.target.value);
											setDataEdited(true);
										}}
										id="coupons"
										name="coupons"
										placeholder="Enter Value"
										value={formData.coupons}
										maxLength={4}
									/>
									{errors?.coupons && (
										<span className={style.error1}>
											{errors.coupons?.message}
										</span>
									)}
									{couponsError && (
										<span className={style.error1}>{couponsError}</span>
									)}
								</div>
							</div>
							<div className={style.formBtnWrap}>
								<button
									disabled={isLoading1 || isLoading2 || !availCouponCount > 0}
								>
									{isLoading1 ? getConstant("LOADING_TEXT") : "Make Selection"}
								</button>
							</div>
						</form>
					</div>
				</div>
				<div className={style.inner}>
					{showList ? (
						<div className={style.couponDetails}>
							<div className={style.searchboxmob}>
								{keyword.length == 0 && (
									<button className={style.btnsearch}>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className={style.svgiconsearchmob}
											viewBox="0 0 16 16"
										>
											<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
										</svg>
									</button>
								)}
								<input
									type="text"
									value={keyword}
									className={style.inputsearch}
									placeholder="Search"
									onChange={(e) => setKeyword(e.target.value)}
									maxLength={inputMaxLength}
								/>
								{keyword.length > 0 && (
									<div
										className={style.closeBtn}
										onClick={() => setKeyword("")}
									></div>
								)}
							</div>
							<div className={style.header}>
								<div className={style.col}>
									<label className={style.checkboxCol}>
										<input
											type="checkbox"
											checked={globalCheckStatus}
											onChange={() => {
												handleGlobalCheckboxChange();
											}}
										/>
										<span className={style.checkmark}></span>
									</label>
								</div>
								<div className={style.col}>SL NO</div>
								<div className={style.col}>Coupon Codes</div>
								<div className={style.searchbox}>
									<div className={style.custominput}>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className={style.svgiconsearch}
											viewBox="0 0 16 16"
										>
											<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
										</svg>
										<input
											type="text"
											placeholder="Search Coupon"
											className={style.inputtext}
											value={keyword}
											onChange={(e) => setKeyword(e.target.value)}
											maxLength={inputMaxLength}
										/>
										{keyword.length > 0 && (
											<div
												className={style.closeBtn}
												onClick={() => setKeyword("")}
											></div>
										)}
									</div>
								</div>
							</div>
							<div className={style.main}>
								{displayCouponList.length > 0 ? (
									<>
										{displayCouponList.map((x, i) => (
											<div
												key={i}
												className={style.row}
											>
												<div className={style.col}>
													<label className={style.checkboxCol}>
														<input
															type="checkbox"
															checked={x.checked}
															onChange={() => {
																handleCheckboxChange(x.id);
															}}
														/>
														<span className={style.checkmark}></span>
													</label>
												</div>
												<div className={style.col}>{x.sr_no}</div>
												<div className={style.col}>
													<a
														href="#"
														onClick={(e) => e.preventDefault()}
													>
														{x.coupon_serial_no}
													</a>
												</div>
											</div>
										))}
									</>
								) : (
									<div className={style.noResult}>
										<div className={style.imgWrap}>
											<CustomImage
												src={addSubscriberImage}
												alt="no data"
												width="336"
												height="272"
											/>
										</div>
										<h3>No coupons found to match the current criteria</h3>
									</div>
								)}
							</div>
						</div>
					) : (
						<div className={style.noResultWrap}>
							<div className={style.noResultImg}>
								<CustomImage
									src={addSubscriberImage}
									alt="no data"
									width="336"
									height="272"
								/>
							</div>
							<h3>
								Assign the retailer and required information to check or select you
								coupon codes
							</h3>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
