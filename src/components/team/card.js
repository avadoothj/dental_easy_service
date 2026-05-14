import { useState, useContext } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { useRouter } from "next/navigation";
import copy from "clipboard-copy";
import style from "@/css/team/team.module.scss";
import CustomImage from "@/common/customImage";
import { threeDotsIcon } from "@/utils/imagesPicker";
import { formatDate, getConstant } from "@/utils/utils";
import SimpleTooltip from "@/common/simpleTooltip";
import { editUserStatus } from "@/controllers/team";
import { AppContext } from "@/contextProvider";
import messages from "@/utils/messages";
import ConfirmationPopup from "@/components/layout/confirmationPopup";
import { getTokenForLoginAsUser } from "@/controllers/profile";

export default function Card({ item, reloadData }) {
	console.log("item :", item);
	const router = useRouter();
	const { showAlert, user } = useContext(AppContext);

	let activeStatus = "Active";
	if (item.permanent_block == 1) {
		activeStatus = "Permanent Blocked";
	} else if (item.user_block == 1) {
		activeStatus = "Blocked";
	}

	const [isLoading, setIsLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [showPermanentBlockModal, setShowPermanentBlockModal] = useState(false);

	const handleClose = () => {
		setShowModal(!showModal);
	};

	const togglePermanentBlockModal = () => {
		setShowPermanentBlockModal(!showPermanentBlockModal);
	};

	const userConfirmAction = async () => {
		const payload = {
			user_id: item.user_id,
			action: item.user_block == 1 ? 1 : 0,
		};

		setIsLoading(true);
		const response = await editUserStatus(payload);

		if (response.success) {
			handleClose();
			reloadData();
			showAlert(messages.USER_STATUS_UPDATE_SUCCESS, 1);
		} else {
			setIsLoading(false);
			showAlert(response.msg);
		}
	};

	const permanentBlockConfirmAction = async () => {
		const payload = {
			user_id: item.user_id,
			action: -1,
		};

		setIsLoading(true);
		const response = await editUserStatus(payload);

		if (response.success) {
			handleClose();
			reloadData();
			showAlert(messages.USER_PERMANENT_BLOCK_SUCCESS, 1);
		} else {
			setIsLoading(false);
			showAlert(response.msg);
		}
	};

	const handleLoginAsUserClick = async () => {
		const payload = { user_id: item.user_id };

		setIsLoading(true);
		const response = await getTokenForLoginAsUser(payload);

		if (response.success) {
			await copy(response.url);
			showAlert(messages.LOGIN_AS_USER_SUCCESS, 1);
		} else {
			setIsLoading(false);
			showAlert(response.msg);
		}
	};

	const redirectToEdit = () => {
		router.push(`/onboarding-engineer/edit/${item.user_id}`);
	};

	const confirmChangeSubStatus = () => {
		setShowModal(!showModal);
	};

	return (
		<>
			<div
				className={`${style.inbox} ${
					item.permanent_block == 1 ? `${style.cblocked}` : ""
				} `}
			>
				{user?.allowedLinks.indexOf("/createUpdateInternalUser") >= 0 &&
					item.permanent_block != 1 && (
						<div className="threedotpop">
							<Dropdown>
								<Dropdown.Toggle className="threedot">
									<span>&#x2026;</span>
								</Dropdown.Toggle>
								<Dropdown.Menu>
									<Dropdown.Item onClick={(e) => redirectToEdit()}>
										Edit
									</Dropdown.Item>
									{user?.user_id != item.user_id && (
										<Dropdown.Item onClick={(e) => confirmChangeSubStatus()}>
											{item.user_block == 1 ? "Activate" : "Block"}
										</Dropdown.Item>
									)}
									{user?.user_id != item.user_id &&
										user?.role_id == getConstant("SUPER_ADMIN_ROLE_ID") && (
											<Dropdown.Item
												onClick={(e) => togglePermanentBlockModal()}
											>
												Permanent Block
											</Dropdown.Item>
										)}
									{user?.user_id != item.user_id &&
										item.role_id != getConstant("SUPER_ADMIN_ROLE_ID") &&
										user?.allowedLinks.indexOf("/loginAsUser") >= 0 && (
											<Dropdown.Item
												onClick={(e) => handleLoginAsUserClick()}
											>
												Login as User
											</Dropdown.Item>
										)}
								</Dropdown.Menu>
							</Dropdown>
						</div>
					)}

				{item.is_primary && (
					<div className={`title ${style.title}`}>
						<div className="icon">
							<div className={style.lablename}>Primary</div>
						</div>
					</div>
				)}

				<div className={style.tname}>
					<SimpleTooltip text={item.name}>
						<div className={style.tnamelft}>{item.user_name}</div>
					</SimpleTooltip>
					{user?.allowedLinks.indexOf("/createUpdateInternalUser") >= 0 &&
						item.permanent_block != 1 && (
							<div className={style.gridthreedot}>
								<CustomImage
									src={threeDotsIcon}
									alt="dots"
									width="25"
									height="25"
								/>
							</div>
						)}
				</div>
				<div className={style.topname}>
					<div className={style.topnamesec}>
						<p className={style.tptxt}>User Role</p>
						<p className={style.btmtxt}>
							<SimpleTooltip text={item.role_name}>
								<span>{item.role_name}</span>
							</SimpleTooltip>
						</p>
					</div>
					<div className={style.topnamesec}>
						<p className={style.tptxt}>Username</p>
						<p className={style.btmtxt}>
							<SimpleTooltip text={item.login_id}>
								<span>{item.login_id}</span>
							</SimpleTooltip>
						</p>
					</div>
				</div>
				<div className={style.topname}>
					<div className={style.topnamesec}>
						<p className={style.tptxt}>Email</p>
						<p className={style.btmtxt}>{item.email}</p>
					</div>
					<div className={style.topnamesec}>
						<p className={style.tptxt}>Mobile</p>
						<p className={style.btmtxt}>{item.mobile}</p>
					</div>
				</div>
				<div className={style.btmname}>
					<div className={style.topnamesec}>
						<p className={style.tptxt}>Last Activity</p>
						<p className={style.btmtxt}>{formatDate(item.last_login, 2)}</p>
					</div>
					<div className={style.topnamesec}>
						<p className={style.tptxt}>Status</p>
						<p
							className={`${style.btmtxt} ${
								activeStatus == "Active" ? `${style.avtive}` : `${style.blocked}`
							} `}
						>
							<span>.</span> {activeStatus}
						</p>
					</div>
				</div>
			</div>
			<ConfirmationPopup
				show={showModal}
				message={`This action will ${
					item.user_block == 1 ? "activate" : "block"
				} this user ${item.name}?`}
				isLoading={isLoading}
				handleClose={handleClose}
				confirmAction={userConfirmAction}
			/>
			<ConfirmationPopup
				show={showPermanentBlockModal}
				message={`This action will permanently block this user ${item.name}?`}
				isLoading={isLoading}
				handleClose={togglePermanentBlockModal}
				confirmAction={permanentBlockConfirmAction}
			/>
		</>
	);
}
