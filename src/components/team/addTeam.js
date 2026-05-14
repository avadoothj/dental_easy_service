"use client";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { addTeamValidation } from "@/utils/formValidation";
import { AppContext } from "@/contextProvider";
import { getConstant } from "@/utils/utils";
import { iInfoIcon } from "@/utils/imagesPicker";
import CustomImage from "@/common/customImage";
import style from "@/css/team/team.module.scss";
import { addTeam } from "@/controllers/team";
import messages from "@/utils/messages";
import { useRouter } from "next/navigation";
import Permissions from "./permissions";
import CommonModal from "@/common/commonModal";
import Link from "next/link";
import { roleTypesList } from "@/utils/masterData";

export default function AddTeam({ role }) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	console.log("role :", role);
	const router = useRouter();
	const { showAlert } = useContext(AppContext);

	const inputMaxLength = getConstant("INPUT_MAXLENGTH");
	const loginMaxLength = getConstant("MAXLENGTH_LOGIN_ID");

	const defaultFormData = {
		roleType: "",
		role: "",
		login_id: "",
		display_name: "",
		mobile: "",
		email: "",
	};

	const formValidation = {
		roleType: register("roleType", addTeamValidation.roleType),
		role: register("role", addTeamValidation.role),
		login_id: register("login_id", addTeamValidation.login_id),
		display_name: register("display_name", addTeamValidation.display_name),
		mobile: register("mobile", addTeamValidation.mobile),
		email: register("email", addTeamValidation.email),
	};

	const [formData, setFormData] = useState(defaultFormData);
	const [isLoading, setIsLoading] = useState(false);
	const [permission, setPermission] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [roleName, setRoleName] = useState("");
	const [dataEdited, setDataEdited] = useState(false);

	const filteredRoles = formData.roleType
		? role.filter((x) => x.entity_type == formData.roleType)
		: [];

	useEffect(() => {
		if (formData.role !== "") {
			const selectedRole = role.find((x) => x.role_id == formData.role);
			setPermission(selectedRole?.permissions || []);
			setRoleName(selectedRole?.name || "");
		}
	}, [formData.role, role]);

	useEffect(() => {
		setFormData((prev) => ({
			...prev,
			role: "",
		}));
	}, [formData.roleType]);

	useEffect(() => {
		document.body.className += " hamburgerHide";
		return () => {
			document.body.className = document.body.className.replace("hamburgerHide", "");
		};
	}, []);

	const updateSelectedForm = (key, value) => {
		setFormData((prev) => ({
			...prev,
			[key]: value,
		}));
		setDataEdited(true);
	};

	const handleToggleClick = () => {
		setShowModal(!showModal);
	};

	const handleFormSubmit = async () => {
		setIsLoading(true);
    console.log('formData :', formData);
		const response = await addTeam(formData);
  console.log('response :', response);

		if (response.success) {
			showAlert(messages.USER_ADD_SUCCESS, 1);
			router.push("/team");
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
								<label>Role Type</label>
								<div className={style.customselect}>
									<select
										{...formValidation.roleType}
										name="roleType"
										id="roleType"
										defaultValue=""
										onChange={(e) => {
											formValidation.roleType.onChange(e);
											updateSelectedForm("roleType", e.target.value);
										}}
									>
										<option
											value=""
											disabled
										>
											Select Type
										</option>
										{roleTypesList.map((x) => (
											<option
												key={x.id}
												value={x.id}
											>
												{x.label}
											</option>
										))}
									</select>
									{errors?.roleType && (
										<span className={style.logerror}>
											{errors.roleType?.message}
										</span>
									)}
								</div>
							</div>

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
											updateSelectedForm("role", e.target.value);
										}}
									>
										<option
											value=""
											disabled
										>
											Select Role
										</option>
										{filteredRoles.map((x, i) => (
											<option
												key={i}
												value={x.role_id}
											>
												{x.role_name}
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
									<span
										className={style.infoicn}
										title="Permissions"
										onClick={handleToggleClick}
									>
										<CustomImage
											src={iInfoIcon}
											alt="info"
											width="22"
											height="22"
										/>
									</span>
								)}
							</div>

							<div className={style.detlcol}>
								<label>Username / User ID</label>
								<div className={style.inptrel}>
									<input
										{...formValidation.login_id}
										type="text"
										name="login_id"
										id="login_id"
										placeholder="Enter Username / User ID"
										onChange={(e) => {
											formValidation.login_id.onChange(e);
											updateSelectedForm("login_id", e.target.value);
										}}
										maxLength={loginMaxLength}
									/>
									{errors?.login_id && (
										<span className={style.logerror}>
											{errors.login_id?.message}
										</span>
									)}
								</div>
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
										placeholder="Enter Email ID"
										name="email"
										id="email"
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
										placeholder="Primary Mobile Number"
										name="mobile"
										id="mobile"
										maxLength="10"
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
						<Link
							href="/team"
							className="commonBtn borderBtn"
						>
							Back
						</Link>
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
