"use client";
import { useForm } from "react-hook-form";
import commonStyle from "@/css/common/common.module.scss";
import { useEffect } from "react";
import Form from "react-bootstrap/Form";
import { addRatingFieldEngineer } from "@/controllers/onboarding";
import { useRouter } from "next/navigation";

export default function RatingStep({ onboardingData, onNext, onBack }) {
	const router = useRouter();
	console.log("onboardingData :", onboardingData);
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		reset,
		formState: { errors, isSubmitting },
	} = useForm({
		mode: "onChange",

		defaultValues: {
			technicalSkills: 0,
			qualificationSkills: 0,
			customerReviews: 0,
			feedback: "",
		},
	});

	const technicalSkills = watch("technicalSkills");

	const qualificationSkills = watch("qualificationSkills");

	const customerReviews = watch("customerReviews");

	const onSubmit = async (data) => {
		console.log("data :", data);

		const payload = {
			...data,
			onboardingId: onboardingData?.onboardingId,
			fieldEngineerId: onboardingData?.fieldEngineerId,
		};

		const response = await addRatingFieldEngineer(payload);

		if (response.success) {

			const fieldEngineerId = response.data.field_engineer_id;
			router.replace(`/onboarding-engineer/detail/${fieldEngineerId}`);

			onNext({
				ratingData: response.data,
			});
		}
	};

	const renderStars = (field, value) => {
		return (
			<div className="d-flex gap-2 mt-2">
				{[1, 2, 3, 4, 5].map((star) => (
					<span
						key={star}
						style={{
							fontSize: "28px",

							cursor: "pointer",

							color: star <= value ? "#ffc107" : "#d3d3d3",
						}}
						onClick={() => setValue(field, star)}
					>
						★
					</span>
				))}
			</div>
		);
	};

	useEffect(() => {
		if (!onboardingData?.ratingData) return;
		const rating = onboardingData.ratingData;
		reset({
			technicalSkills: rating.technical_skills || 0,
			qualificationSkills: rating.qualification_skills || 0,
			customerReviews: rating.customer_reviews || 0,
			feedback: rating.feedback || "",
		});
	}, [onboardingData, reset]);

	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
			<h3 className={commonStyle.mediumHeading}>Rating</h3>
			<div className="rating-bx">
			{/* TECHNICAL */}

			<h5 className="mb-0">
				Technical Skills{" "}
				<span className="light-text">
					({technicalSkills}
					.0)
				</span>
			</h5>

			{renderStars("technicalSkills", technicalSkills)}

			{/* QUALIFICATION */}

			<h5 className="mt-4 mb-0">
				Qualification Skills{" "}
				<span className="light-text">
					({qualificationSkills}
					.0)
				</span>
			</h5>

			{renderStars("qualificationSkills", qualificationSkills)}

			{/* CUSTOMER */}

			<h5 className="mt-4 mb-0">
				Customer Reviews{" "}
				<span className="light-text">
					({customerReviews}
					.0)
				</span>
			</h5>

			{renderStars("customerReviews", customerReviews)}
		</div>
		<div className="form-group mt-4 mb-0">
			<label className="form-label">Can you tell us more?</label>

			<textarea
				className="form-control"
				rows={4}
				placeholder="Add feedback"
				{...register("feedback")}
			></textarea>
		</div>

		<div className={commonStyle.footerButton}>
			<div className={commonStyle.right}>
				<button
					type="button"
					className={commonStyle.commonBtn + " " + commonStyle.link}
					onClick={onBack}
				>
					Back
				</button>

				<button
					type="submit"
					className={commonStyle.commonBtn + " " + commonStyle.fill}
				>
					Complete
				</button>
			</div>
		</div>
	</Form>
	);
}
