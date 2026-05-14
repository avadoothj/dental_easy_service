"use client";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { AppContext } from "@/contextProvider";
import style from "@/css/category/category.module.scss";
import { categoryValidation } from "@/utils/formValidation";
import { editCategory } from "@/controllers/category";
import messages from "@/utils/messages";
import { getConstant, toPascalCase } from "@/utils/utils";
import Link from "next/link";

export default function EditCategory({ catDetails, initialActivityList }) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const inputMaxLength = getConstant("INPUT_MAXLENGTH");

	const formValidation = {
		category_name: register("category_name", categoryValidation.category_name),
	};

	const defaultFormData = {
		cat_id: catDetails.cat_id,
		category_name: catDetails.name,
		mids: catDetails.activities,
	};

	const router = useRouter();
	const { showAlert } = useContext(AppContext);
	const [formData, setFormData] = useState(defaultFormData);
	const [activityList, setActivityList] = useState([]);
	const [formUpdate, setFormUpdate] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const modifiedActivityList = () => {
		const updatedActivityList = initialActivityList.map((item) => ({
			...item,
			checked: catDetails?.activities?.includes(item.activity_id),
		}));
		setActivityList(updatedActivityList);
	};

	useEffect(() => {
		document.body.className += " hamburgerHide";
		return () => {
			document.body.className = document.body.className.replace("hamburgerHide", "");
		};
	}, []);

	useEffect(() => {
		modifiedActivityList();
	}, [initialActivityList]);

	const updateSelectedForm = (key, value) => {
		setFormData((prevFormData) => ({ ...prevFormData, [key]: value }));
		setFormUpdate(true);
	};

	const handleCheckboxChange = (activity_id) => {
		const updatedActivityList = activityList.map((activity) => {
			if (activity.activity_id === activity_id) {
				return { ...activity, checked: !activity.checked };
			}
			return activity;
		});
		setActivityList(updatedActivityList);
	};

	const collectCheckedIds = (items) => {
		let ids = [];
		items.forEach((item) => {
			if (item.checked) {
				ids.push(item.activity_id);
			}
		});
		return ids;
	};

	const backToListing = () => {
		router.push("/categories");
	};

	const handleFormSubmit = async () => {
		const checkedIds = collectCheckedIds(activityList);

		const payload = {
			cat_id: catDetails.cat_id,
			category_name: formData.category_name,
			mids: checkedIds,
		};

		setIsLoading(true);
		const response = await editCategory(payload);
		setIsLoading(false);

		if (response.success) {
			showAlert(messages.CATEGORY_UPDATED, 1);
			router.push("/categories");
		} else {
			showAlert(response.msg);
		}
	};

	return (
		<>
			<form onSubmit={handleSubmit(handleFormSubmit)}>
				<div className={style.addNewCategory}>
					<h2>Category Details</h2>

					<div className={style.row}>
						<div className={style.col}>Category Name</div>
						<div className={style.col}>
							<input
								{...formValidation.category_name}
								onChange={(e) => {
									formValidation.category_name.onChange(e);
									updateSelectedForm("category_name", e.target.value);
								}}
								type="text"
								className={style.catName}
								placeholder="Enter Category Name"
								maxLength={inputMaxLength}
								value={formData.category_name}
							/>
							<span className={style.errorMsg}>{errors.category_name?.message}</span>
						</div>
					</div>
					<div className={style.row}>
						<div className={style.col}>
							Features<span>Optional</span>
						</div>
						<div className={style.col}>
							<ul className={style.features}>
								{activityList.map((item, idx) => (
									<li key={idx}>
										<label className={style.checkboxWrap}>
											{toPascalCase(item.name)}
											<input
												type="checkbox"
												checked={item.checked}
												onChange={() => {
													handleCheckboxChange(item.activity_id);
													setFormUpdate(true);
												}}
											/>
											<span className={style.checkmark}></span>
										</label>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
				<div className={style.btnWrapper}>
					<Link
						href="/categories"
						className="commonBtn borderBtn"
					>
						Back
					</Link>

					<button
						type="submit"
						className="commonBtn dark"
						disabled={isLoading || !formUpdate}
					>
						{isLoading ? getConstant("LOADING_TEXT") : "Update"}
					</button>
				</div>
			</form>
		</>
	);
}
