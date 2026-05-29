"use client";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { addTeamValidation } from "@/utils/formValidation";
import { AppContext } from "@/contextProvider";
import { getConstant } from "@/utils/utils";
import { iInfoIcon } from "@/utils/imagesPicker";
import CustomImage from "@/common/customImage";
import SimpleTooltip from "@/common/simpleTooltip";
import style from "@/css/team/team.module.scss";
import messages from "@/utils/messages";
import { useRouter } from "next/navigation";
import Permissions from "@/components/team/permissions";
import CommonModal from "@/common/commonModal";
import SelectMultiSearch from "@/common/selectMultiSearch";
import { getRolesForTeams } from "@/controllers/role";
import { editOperatorTeam } from "@/controllers/operators";

export default function EditTeam({ operator, teamMember, handleViewAction }) {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm();

	const router = useRouter();
	const { showAlert, user } = useContext(AppContext);

	const inputMaxLength = getConstant("INPUT_MAXLENGTH");
	const loginMaxLength = getConstant("MAXLENGTH_LOGIN_ID");

	const defaultFormData = {
		role: teamMember.role_id,
		login_id: teamMember.login_id,
		display_name: teamMember.name,
		mobile: teamMember.mobile,
		email: teamMember.email,
		user_id: teamMember.user_id,
		oper_id: operator.oper_id,
		user_block: teamMember.user_block,
		oper_cat_id: operator.oper_cat_id,
	};

	const formValidation = {
		role: register("role", addTeamValidation.role),
		display_name: register("display_name", addTeamValidation.display_name),
		mobile: register("mobile", addTeamValidation.mobile),
		email: register("email", addTeamValidation.email),
	};

	const [formData, setFormData] = useState(defaultFormData);
	const [isLoading, setIsLoading] = useState(false);
	const [permission, setPermission] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [roleName, setRoleName] = useState("");
	const [roleList, setRoleList] = useState([]);
	const [dataEdited, setDataEdited] = useState(false);

	const getRoleList = async () => {
		const role = await getRolesForTeams(operator.oper_cat_id);
		setRoleList(role.data);
		reset();
	};

	useEffect(() => {
		getRoleList();
	}, []);

	useEffect(() => {
		if (formData.role !== "" && roleList.length > 0) {
			const filteredRole = roleList.find((x) => x.role_id == formData.role);

			if (filteredRole) {
				setPermission(filteredRole.permissions);
				setRoleName(filteredRole.name);
			}
		}
	}, [formData.role, roleList]);

	/* useEffect(() => {
		document.body.className += " hamburgerHide";
		return () => {
			document.body.className = document.body.className.replace("hamburgerHide", "");
		};
	}, []); */

	const updateSelectedForm = (key, value) => {
		let temp = { ...formData };
		temp[key] = value;
		setFormData(temp);
		setDataEdited(true);
	};

	const handleToggleClick = () => {
		setShowModal(!showModal);
	};

	const handleFormSubmit = async () => {
		setIsLoading(true);
		const response = await editOperatorTeam(formData);

		if (response.success) {
			showAlert(messages.USER_UPDATE_SUCCESS, 1);
			handleViewAction();
		} else {
			setIsLoading(false);
			showAlert(response.msg);
		}
	};

	return (
		<>
			<form onSubmit={handleSubmit(handleFormSubmit)}>
				<div className={style.addmember}>
					<div className={style.memtoppanel}>
						<div className={style.sechead}>User Details</div>
						<div className={style.brdtop}>
							<div className={style.detlcol}>
								<label>Role</label>
								<div className={style.customselect}>
									<select
										{...formValidation.role}
										name="role"
										id="role"
										value={formData.role}
										onChange={(e) => {
											formValidation.role.onChange(e);
											updateSelectedForm("role", parseInt(e.target.value));
										}}
									>
										<option
											value=""
											disabled
										>
											Select Type
										</option>
										{roleList.map((x, i) => (
											<option
												key={i}
												value={x.role_id}
											>
												{x.name}
											</option>
										))}
									</select>
									{errors?.role && (
										<span className={style.logerror}>
											{errors.role?.message}
										</span>
									)}
								</div>
								{permission.length > 0 && (
									<>
										{/* <SimpleTooltip text="Permissions"> */}
										<span
											className={style.infoicn}
											title="Permissions"
											onClick={(e) => setShowModal(!showModal)}
										>
											<CustomImage
												src={iInfoIcon}
												alt="info"
												width="22"
												height="22"
											/>
										</span>
										{/* </SimpleTooltip> */}
									</>
								)}
							</div>
							<div className={style.detlcol}>
								<label>Username / User ID</label>
								<div className="setsubr">{teamMember.login_id}</div>
							</div>
							<div className={style.detlcol}>
								<label>Display Name</label>
								<div className={style.inptrel}>
									<input
										{...formValidation.display_name}
										type="text"
										name="display_name"
										id="display_name"
										placeholder="Enter Display Name"
										value={formData.display_name}
										onChange={(e) => {
											formValidation.display_name.onChange(e);
											updateSelectedForm("display_name", e.target.value);
										}}
										maxLength={inputMaxLength}
									/>
									{errors?.display_name && (
										<span className={style.logerror}>
											{errors.display_name?.message}
										</span>
									)}
								</div>
							</div>
							{/* {user?.user_type != "operator" && (
								<SelectMultiSearch
									data={operatorList}
									id="oper_selection"
									placeholder="Operators"
									noOptionsText="No operators found"
									// callback={setSelectedOperators}
								/>
							)} */}
						</div>
					</div>
					<div className={style.memtoppanel}>
						<div className={style.sechead}>Contact Details</div>
						<div className={style.brdbot}>
							<div className={style.detlcol}>
								<label>Email</label>
								<div className={style.inptrel}>
									<input
										{...formValidation.email}
										type="text"
										placeholder={"Enter Email ID"}
										name="email"
										id="email"
										value={formData.email}
										onChange={(e) => {
											formValidation.email.onChange(e);
											updateSelectedForm("email", e.target.value);
										}}
										maxLength={inputMaxLength}
									/>
									{errors?.email && (
										<span className={style.logerror}>
											{errors.email?.message}
										</span>
									)}
								</div>
							</div>
							<div className={style.detlcol}>
								<label>Contact Number</label>
								<div className={style.inptrel}>
									<input
										{...formValidation.mobile}
										type="text"
										placeholder={"Primary Mobile Number"}
										name="mobile"
										id="mobile"
										maxLength="10"
										value={formData.mobile}
										onChange={(e) => {
											formValidation.mobile.onChange(e);
											updateSelectedForm("mobile", e.target.value);
										}}
									/>
									{errors?.mobile && (
										<span className={style.logerror}>
											{errors.mobile?.message}
										</span>
									)}
								</div>
							</div>
						</div>
					</div>
					<div className={style.addbtn}>
						<button
							className="commonBtn borderBtn"
							onClick={handleViewAction}
						>
							Back
						</button>
						<button
							type="submit"
							className="commonBtn dark"
							disabled={isLoading || !dataEdited}
						>
							{isLoading ? getConstant("LOADING_TEXT") : "Save"}
						</button>
					</div>
				</div>
			</form>
			<CommonModal
				show={showModal}
				handleClose={handleToggleClick}
				className="setpricemodel"
				bodyClassName="setpricepad"
				animation={false}
			>
				<Permissions
					permission={permission}
					role={roleName}
					handleClose={handleToggleClick}
				/>
			</CommonModal>
		</>
	);
}
