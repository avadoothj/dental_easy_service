"use client";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Accordion from "react-bootstrap/Accordion";
import style from "@/css/profile/myProfile.module.scss";
import CustomImage from "@/common/customImage";
import commonStyle from "@/css/common/common.module.scss";
import {
	changePasswordSettingIcon,
	operatorIcon,
	apiDetailsIcon,
	userIcon,
	teamIcon,
} from "@/utils/imagesPicker";
import Highlight from "./highlight";
import EditProfile from "./editProfile";
import CommonModal from "@/common/commonModal";
import ChangePassword from "./changePassword";
import SuccessPopup from "@/components/common/successPopup";
import { formatDate, getConstant } from "@/utils/utils";
import SimpleTooltip from "@/common/simpleTooltip";
import { useSearchParams } from "next/navigation";
import { downloadMyApiToken, regenerateToken, sendTokenOnMail } from "@/controllers/profile";
import messages from "@/utils/messages";
import { AppContext } from "@/contextProvider";

export default function MyProfile({ user, profileData, userMenu }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { showAlert, handleUserLogout } = useContext(AppContext);

	if (user.user_type == "regional head") {
		user.display_user_type = "Region";
	}

	const [showEditForm, setShowEditForm] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [showSuccessPop, setShowSuccessPop] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoading1, setIsLoading1] = useState(false);
	const [isLoading2, setIsLoading2] = useState(false);
	const [isLoading3, setIsLoading3] = useState(false);

	let teamMenuObj = null;
	JSON.parse(userMenu).map((x) => {
		x.filter((y) => y.link == "/team").map((y, i) => {
			teamMenuObj = y;
		});
	});

	useEffect(() => {
		const tempUrl = window.location.href.split("#");

		if (tempUrl.length > 1 && tempUrl[1] != "") {
			const interval = setInterval(() => {
				if (typeof jQuery != "undefined") {
					clearInterval(interval);
					if (
						jQuery("#" + tempUrl[1])
							.children()
							.children()
							.hasClass("collapsed")
					) {
						jQuery("#" + tempUrl[1])
							.children()
							.children()
							.trigger("click");
					}
				}
			}, 200);
		}
	}, [searchParams]);

	const handleLogoutClick = (e) => {
		e.preventDefault();
		setIsLoading(!isLoading);
		handleUserLogout();
	};

	const downloadApiToken = async () => {
		if (!isLoading1) {
			setIsLoading1(true);
			const response = await downloadMyApiToken();
			setIsLoading1(false);

			if (response.success) {
				window.open(response.downloadPath, "_blank");
			} else {
				showAlert(response.msg);
			}
		}
	};

	const sendTokenOverEmail = async () => {
		if (!isLoading2) {
			setIsLoading2(true);
			const response = await sendTokenOnMail();
			setIsLoading2(false);

			if (response.success) {
				showAlert(messages.TOKEN_SENT_VIA_MAIL, 1);
			} else {
				showAlert(response.msg);
			}
		}
	};

	const regenerateApiToken = async () => {
		if (!isLoading3) {
			setIsLoading3(true);
			const response = await regenerateToken();
			setIsLoading3(false);

			if (response.success) {
				showAlert(messages.TOKEN_REGENERATE_SUCCESS, 1);
			} else {
				showAlert(response.msg);
			}
		}
	};

	const handleToggleFormClick = () => {
		setShowEditForm(!showEditForm);
	};

	const handleTogglePasswordClick = () => {
		setShowModal(!showModal);
	};

	const handlePasswordSuccess = () => {
		setShowModal(false);
		handleToggleSuccessModal();
	};

	const handleToggleSuccessModal = () => {
		setShowSuccessPop(!showSuccessPop);
	};

	const redirectToTeams = () => {
		router.push(teamMenuObj.link);
	};

	return (
		<>
			<div className="commonHeading">
				<h1>My Profile</h1>
			</div>
			<div className={style.myProfileModal}>
				<div className={style.main}>
					<div className={style.operatorWrap}>
						<Highlight user={user} />
					</div>
					<Accordion
						defaultActiveKey="0"
						className={style["profileAccordion"]}
					>
						<Accordion.Item
							eventKey="0"
							className={style["profileAccordionItem"]}
							id="operatorDetails"
						>
							<Accordion.Header className={style["profileAccordionHeader"]}>
								<CustomImage
									alt="operator details"
									src={operatorIcon}
									className={style.accordionIcon}
									width="25"
									height="25"
								/>
								{user.display_user_type} Details
							</Accordion.Header>
							<Accordion.Body className={style["profileAccordionBody"]}>
								<div className={style.detailBox}>
									{/* <h3>Primary Details</h3> */}
									<div className={style.detailRow}>
										{user.user_type != "internal" &&
											user.user_type != "regional head" && (
												<div className={style.detailcol}>
													<label>{user.display_user_type} Code</label>
													<div className={style.detailText}>
														{profileData.oper_code}
													</div>
												</div>
											)}
										<div className={style.detailcol}>
											<label>{user.display_user_type} Name</label>
											<div className={style.detailText}>
												{profileData.oper_name}
											</div>
										</div>
										<div className={style.detailcol}>
											<label>Mobile</label>
											<div className={style.detailText}>
												{profileData.oper_mobile}
											</div>
										</div>
										{/* {user.user_type == "isp" && (
											<div className={style.detailcol}>
												<label>Critical Balance Limit</label>
												<div className={style.detailText}>
													{formatPrice(profileData.balance_limit)}
												</div>
											</div>
										)} */}
									</div>
								</div>
								<div className={style.detailBox}>
									{/* <h3>Optional Details</h3> */}
									<div className={style.detailRow2}>
										<div className={style.detailcol}>
											<label>Email ID</label>
											<SimpleTooltip text={profileData.oper_email}>
												<div className={style.detailText}>
													{profileData.oper_email}
												</div>
											</SimpleTooltip>
										</div>
										<div className={style.detailcol}>
											<label>Address</label>
											<div className={style.detailText}>
												{profileData.address}
											</div>
										</div>
										{user.user_type != "regional head" && (
											<>
												<div className={style.detailcol}>
													<label>State</label>
													<div className={style.detailText}>
														{profileData.state}
													</div>
												</div>
												<div className={style.detailcol}>
													<label>District</label>
													<div className={style.detailText}>
														{profileData.district}
													</div>
												</div>
												<div className={style.detailcol}>
													<label>City</label>
													<div className={style.detailText}>
														{profileData.city}
													</div>
												</div>
												<div className={style.detailcol}>
													<label>Zone</label>
													<div className={style.detailText}>
														{profileData.zone}
													</div>
												</div>
											</>
										)}
									</div>
								</div>
							</Accordion.Body>
						</Accordion.Item>

						<Accordion.Item
							eventKey="1"
							className={style["profileAccordionItem"]}
							id="userDetails"
						>
							<Accordion.Header className={style["profileAccordionHeader"]}>
								<CustomImage
									alt="user details"
									src={userIcon}
									className={style.accordionIcon}
									width="25"
									height="25"
								/>
								My Details
							</Accordion.Header>
							<Accordion.Body className={style["profileAccordionBody"]}>
								<div className={style.detailBox}>
									{/* <h3>Primary Details</h3> */}
									{showEditForm ? (
										<EditProfile
											profileData={profileData}
											handleToggleClick={handleToggleFormClick}
										/>
									) : (
										<>
											<div className={style.detailRow1}>
												<div className={`${style.detailcol}`}>
													<label>Display Name</label>
													<SimpleTooltip text={profileData.display_name}>
														<div className={style.detailText}>
															{profileData.display_name}
														</div>
													</SimpleTooltip>
												</div>
												<div className={`${style.detailcol}`}>
													<label>Username/ID</label>
													<SimpleTooltip text={profileData.username}>
														<div className={style.detailText}>
															{profileData.username}
														</div>
													</SimpleTooltip>
												</div>
												<div className={style.detailcol}>
													<label>Last Active</label>
													<div className={style.detailText}>
														{formatDate(profileData.last_login, 2)}
													</div>
												</div>

												<div className={`${style.detailcol}`}>
													<label>Mobile Number</label>
													<div className={style.detailText}>
														{profileData.user_mobile}
													</div>
												</div>
												<div className={style.detailcol}>
													<label>User Role</label>
													<SimpleTooltip text={profileData.role}>
														<div className={style.detailText}>
															{profileData.role}
														</div>
													</SimpleTooltip>
												</div>
												<div className={style.detailcol}>
													<label>Added On</label>
													<div className={style.detailText}>
														{formatDate(profileData.added_on)}
													</div>
												</div>

												<div className={`${style.detailcol}`}>
													<label>Email ID</label>

													<SimpleTooltip text={profileData.user_email}>
														<div className={style.detailText}>
															{profileData.user_email}
														</div>
													</SimpleTooltip>
												</div>
											</div>
											<div className={style.editDetailWrap}>
												<a
													href="#"
													onClick={(e) => {
														e.preventDefault();
														handleToggleFormClick();
													}}
												>
													Edit Details
												</a>
											</div>
										</>
									)}
								</div>
							</Accordion.Body>
						</Accordion.Item>

						{user.primary_user == 1 && (
							<Accordion.Item
								eventKey="2"
								className={style["profileAccordionItem"]}
								id="apiDetails"
							>
								<Accordion.Header className={style["profileAccordionHeader"]}>
									<CustomImage
										alt="api details"
										src={apiDetailsIcon}
										className={style.accordionIcon}
										width="25"
										height="25"
									/>
									API Details
								</Accordion.Header>
								<Accordion.Body className={style["profileAccordionBody"]}>
									<div className={style.detailBox}>
										<div className={style.apidetails}>
											<div className={style.apiindv}>
												<div className={style.token}>
													Token : {profileData.token}
												</div>
												<a
													href="/download-api-token"
													target="_blank"
												>
													{isLoading1
														? getConstant("LOADING_TEXT")
														: "Download"}
												</a>
											</div>
											<div className={style.btnWrapper}>
												<button
													className="commonBtn borderBtn"
													onClick={sendTokenOverEmail}
													disabled={
														isLoading1 || isLoading2 || isLoading3
													}
												>
													{isLoading2
														? getConstant("LOADING_TEXT")
														: "Send on Email"}
												</button>
												<button
													className="commonBtn dark"
													onClick={regenerateApiToken}
													disabled={
														isLoading1 || isLoading2 || isLoading3
													}
												>
													{isLoading3
														? getConstant("LOADING_TEXT")
														: "Regenerate"}
												</button>
											</div>
										</div>
									</div>
								</Accordion.Body>
							</Accordion.Item>
						)}

						{/* <Accordion.Item
							eventKey="2"
							className={`${style.profileAccordionItem} ${style.settingsWrapper}`}
						>
							<Accordion.Header className={style["profileAccordionHeader"]}>
								<CustomImage
									alt="Change Password"
									src={changePasswordSettingIcon}
									width="25"
									height="25"
									className={style.accordionIcon}
								/>
								Settings
							</Accordion.Header>
							<Accordion.Body className={style["profileAccordionBody"]}>
								<div
									className={style.changePass}
									onClick={handleTogglePasswordClick}
								>
									Change Password
								</div>
							</Accordion.Body>
						</Accordion.Item> */}
					</Accordion>

					{teamMenuObj !== null && (
						<div
							className={style.teamLink}
							onClick={redirectToTeams}
						>
							<CustomImage
								alt="team"
								src={teamIcon}
								width="25"
								height="25"
								className={style.accordionIcon}
							/>
							{teamMenuObj.name}
						</div>
					)}
					<div
						className={style.changePass}
						onClick={handleTogglePasswordClick}
					>
						<CustomImage
							alt="Change Password"
							src={changePasswordSettingIcon}
							width="25"
							height="25"
							className={style.accordionIcon}
						/>
						Change Password
					</div>
					<button
						className={commonStyle.commonBtn}
						disabled={isLoading}
						onClick={(e) => handleLogoutClick(e)}
					>
						{isLoading ? "Logging out..." : "Logout"}
					</button>
				</div>
			</div>
			<CommonModal
				show={showModal}
				handleClose={handleTogglePasswordClick}
				className="updatePass"
				centered={true}
			>
				<ChangePassword
					postSuccess={handlePasswordSuccess}
					handleClose={handleTogglePasswordClick}
				/>
			</CommonModal>
			<CommonModal
				show={showSuccessPop}
				handleClose={handleToggleSuccessModal}
				className="termspop"
				centered={true}
			>
				<SuccessPopup
					message={messages.PASSWORD_CHANGE_SUCCESS}
					handleClose={handleToggleSuccessModal}
				/>
			</CommonModal>
		</>
	);
}
