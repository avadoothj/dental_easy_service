"use client";
// import { useContext, useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { addTeamValidation } from "@/utils/formValidation";
// import { AppContext } from "@/contextProvider";
// import { getConstant } from "@/utils/utils";
// import { iInfoIcon } from "@/utils/imagesPicker";
// import CustomImage from "@/common/customImage";
// import style from "@/css/team/team.module.scss";
// import { editTeam } from "@/controllers/team";
// import messages from "@/utils/messages";
// import { useRouter } from "next/navigation";
// import Permissions from "./permissions";
// import CommonModal from "@/common/commonModal";
// import Link from "next/link";
// import { roleTypesList } from "@/utils/masterData";

// export default function EditTeam({ user, role }) {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const router = useRouter();
//   const { showAlert } = useContext(AppContext);

//   const [formUpdate, setFormUpdate] = useState(false);
//   const [showModal, setShowModal] = useState(false);

//   const defaultFormData = {
//     roleType: user.role_type,
//     role_name: user.role_name,
//     user_id: user.user_id,
//     role: user.role_id,
//     login_id: user.login_id,
//     display_name: user.name,
//     mobile: user.mobile,
//     email: user.email,
//     user_block: user.user_block,
//   };

//   const formValidation = {
//     role: register("role", addTeamValidation.role),
//     display_name: register("display_name", addTeamValidation.display_name),
//     mobile: register("mobile", addTeamValidation.mobile),
//     email: register("email", addTeamValidation.email),
//   };

//   const [formData, setFormData] = useState(defaultFormData);
//   const [isLoading, setIsLoading] = useState(false);
//   const [permission, setPermission] = useState("");
//   const [roleName, setRoleName] = useState("");

//   useEffect(() => {
//     document.body.className += " hamburgerHide";
//     return () => {
//       document.body.className = document.body.className.replace(
//         "hamburgerHide",
//         "",
//       );
//     };
//   }, []);

//   const filteredRoles = role.filter(
//     (x) => String(x.entity_type) === String(formData.roleType),
//   );

//   useEffect(() => {
//     const selectedRole = role.find(
//       (x) => String(x.role_id) === String(formData.role),
//     );
//     setPermission(selectedRole?.permissions);
//     setRoleName(selectedRole?.name);
//   }, [formData.role, role]);

//   const updateSelectedForm = (key, value) => {
//     let temp = { ...formData };
//     temp[key] = value;
//     setFormUpdate(true);
//     setFormData(temp);
//   };

//   const handleToggleClick = () => {
//     setShowModal(!showModal);
//   };

//   const handleFormSubmit = async () => {
//     setIsLoading(true);
//     const response = await editTeam(formData);

//     if (response.success) {
//       showAlert(messages.USER_UPDATE_SUCCESS, 1);
//       router.push("/team");
//     } else {
//       setIsLoading(false);
//       showAlert(response.msg);
//     }
//   };

//   const inputMaxLength = getConstant("INPUT_MAXLENGTH");

//   const roleTypeLabel =
//     roleTypesList.find((x) => String(x.id) === String(formData.roleType))
//       ?.label || "-";

//   return (
//     <>
//       <form onSubmit={handleSubmit(handleFormSubmit)}>
//         <div className={style.addmember}>
//           <div className={style.memtoppanel}>
//             <div className={style.sechead}>User Details</div>
//             <div className={style.brdtop}>
//               <div className={style.detlcol}>
//                 <label>Role Type</label>
//                 <div className="setsubr">{roleTypeLabel}</div>
//               </div>

//               <div className={style.detlcol}>
//                 <label>Role</label>
//                 <div className={style.customselect}>
//                   <select
//                     {...formValidation.role}
//                     name="role"
//                     id="role"
//                     value={formData.role}
//                     onChange={(e) => {
//                       formValidation.role.onChange(e);
//                       updateSelectedForm("role", e.target.value);
//                     }}
//                   >
//                     <option value="" disabled>
//                       Select
//                     </option>
//                     {filteredRoles.map((x, i) => (
//                       <option key={i} value={x.role_id}>
//                         {x.role_name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <span
//                   className={style.infoicn}
//                   title="Permissions"
//                   onClick={handleToggleClick}
//                 >
//                   <CustomImage
//                     src={iInfoIcon}
//                     alt="info"
//                     width="22"
//                     height="22"
//                   />
//                 </span>
//               </div>

//               <div className={style.detlcol}>
//                 <label>Username / User ID</label>
//                 <div className="setsubr">{user.login_id}</div>
//               </div>

//               <div className={style.detlcol}>
//                 <label>Display Name</label>
//                 <div className={style.inptrel}>
//                   <input
//                     {...formValidation.display_name}
//                     type="text"
//                     name="display_name"
//                     id="display_name"
//                     placeholder="Enter Display Name"
//                     value={formData.display_name}
//                     onChange={(e) => {
//                       formValidation.display_name.onChange(e);
//                       updateSelectedForm("display_name", e.target.value);
//                     }}
//                     maxLength={inputMaxLength}
//                   />
//                   {errors?.display_name && (
//                     <span className={style.logerror}>
//                       {errors.display_name?.message}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className={style.memtoppanel}>
//             <div className={style.sechead}>Contact Details</div>
//             <div className={style.brdbot}>
//               <div className={style.detlcol}>
//                 <label>Email</label>
//                 <div className={style.inptrel}>
//                   <input
//                     {...formValidation.email}
//                     type="text"
//                     placeholder="Enter Email ID"
//                     name="email"
//                     id="email"
//                     value={formData.email}
//                     onChange={(e) => {
//                       formValidation.email.onChange(e);
//                       updateSelectedForm("email", e.target.value);
//                     }}
//                     maxLength={inputMaxLength}
//                   />
//                   {errors?.email && (
//                     <span className={style.logerror}>
//                       {errors.email?.message}
//                     </span>
//                   )}
//                 </div>
//               </div>

//               <div className={style.detlcol}>
//                 <label>Contact Number</label>
//                 <div className={style.inptrel}>
//                   <input
//                     {...formValidation.mobile}
//                     type="text"
//                     placeholder="Primary Mobile Number"
//                     name="mobile"
//                     id="mobile"
//                     value={formData.mobile}
//                     onChange={(e) => {
//                       formValidation.mobile.onChange(e);
//                       updateSelectedForm("mobile", e.target.value);
//                     }}
//                     maxLength="10"
//                   />
//                   {errors?.mobile && (
//                     <span className={style.logerror}>
//                       {errors.mobile?.message}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className={style.addbtn}>
//             <Link href="/team" className="commonBtn borderBtn backdashboard">
//               Back
//             </Link>
//             <button
//               type="submit"
//               className="commonBtn dark backdashboard"
//               disabled={isLoading || !formUpdate}
//             >
//               {isLoading ? getConstant("LOADING_TEXT") : "Save"}
//             </button>
//           </div>
//         </div>
//       </form>

//       <CommonModal
//         show={showModal}
//         handleClose={handleToggleClick}
//         className="setpricemodel"
//         bodyClassName="setpricepad"
//         animation={false}
//       >
//         <Permissions
//           permission={permission}
//           role={roleName}
//           handleClose={handleToggleClick}
//         />
//       </CommonModal>
//     </>
//   );
// }

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PersonalStep from "@/components/onboardingEngineer/editsteps/editpersonalSteps";
import DocumentStep from "./steps/documentSteps";
import QualificationStep from "./steps/qualificationSteps";
import UserCreationStep from "./steps/userCreationSteps";
import BankDetailStep from "./steps/BankDetailSteps";
import BenefitStep from "./steps/BenefitSteps";
import RatingStep from "./steps/RatingSteps";
import OnboardingProgress from "../onboardingEngineer/onBoardingProgress";
import OnBoardingFormWrapper from "../onboardingEngineer/onBoardingFormWrapper";
const STEPS = [
	{ id: "personal", label: "Personal Information" },
	{ id: "documents", label: "Document Verification" },
	{ id: "qualification", label: "Qualification & Tech Skill" },
	{ id: "user", label: "User Creation" },
	{ id: "bank", label: "Bank Details" },
	{ id: "benefits", label: "Benefits" },
	{ id: "rating", label: "Rating" },
];

const STEP_COMPONENTS = {
	personal: PersonalStep,
	documents: DocumentStep,
	qualification: QualificationStep,
	user: UserCreationStep,
	bank: BankDetailStep,
	benefits: BenefitStep,
	rating: RatingStep,
};

export default function EditOnboardingPageWrapper({ user, role }) {
	const [currentStep, setCurrentStep] = useState("personal");
	const [completedSteps, setCompletedSteps] = useState([]);
	const [isValid, setIsValid] = useState(false);

	const router = useRouter();
	// useEffect(() => {
	// 	router.replace(`/onboarding-engineer/edit/${user.id}?step=${currentStep}`);
	// }, [currentStep, router]);

	const goNext = () => {
		const currentIndex = STEPS.findIndex((step) => step.id === currentStep);
		if (currentIndex < STEPS.length - 1) {
			const nextStep = STEPS[currentIndex + 1].id;
			setCurrentStep(nextStep);

			// mark current step as completed if not already
			if (!completedSteps.includes(currentStep)) {
				setCompletedSteps([...completedSteps, currentStep]);
			}

			// reset validation for next step
			setIsValid(false);
		}
	};

	const goBack = () => {};

	const currentIndex = STEPS.findIndex((step) => step.id === currentStep);
	const CurrentStepComponent = STEP_COMPONENTS[currentStep];

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	console.log("role :", role);

	const defaultFormData = {
		roleType: "",
		role: "",
		login_id: "",
		display_name: "",
		mobile: "",
		email: "",
	};

	const [formData, setFormData] = useState(defaultFormData);
	const [isLoading, setIsLoading] = useState(false);
	const [permission, setPermission] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [roleName, setRoleName] = useState("");
	const [dataEdited, setDataEdited] = useState(false);

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
		console.log("formData :", formData);
		const response = await addTeam(formData);
		console.log("response :", response);

		if (response.success) {
			// showAlert(messages.USER_ADD_SUCCESS, 1);
			router.push("/team");
		} else {
			setIsLoading(false);
			// showAlert(response.msg);
		}
	};

	return (
		<>
			<div className="container-fluid">
				<div
					className="tab-content"
					id="nav-tabContent"
				>
					<div className="card tab-listing mb-10">
						<nav className="management-tabs">
							<OnboardingProgress
								steps={STEPS}
								currentIndex={currentIndex}
								currentStep={currentStep}
								completedSteps={completedSteps}
							/>
						</nav>
					</div>

					<CurrentStepComponent
						currentStep={currentStep}
						userData={user}
						onValidityChange={setIsValid}
						onNext={goNext}
						onBack={goBack}
						disableNext={!isValid}
						isFirst={currentIndex === 0}
						isLast={currentIndex === STEPS.length - 1}
					/>
				</div>
			</div>
		</>
	);
}
