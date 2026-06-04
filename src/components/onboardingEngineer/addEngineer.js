"use client";

import { useState, useEffect } from "react";

import PersonalStep from "@/components/onboardingEngineer/steps/personalSteps";

import DocumentStep from "@/components/onboardingEngineer/steps/documentSteps";
import QualificationStep from "@/components/onboardingEngineer/steps/qualificationSteps";
import UserCreationStep from "@/components/onboardingEngineer/steps/userCreationSteps";
import BankDetailStep from "@/components/onboardingEngineer/steps/BankDetailSteps";
import BenefitStep from "@/components/onboardingEngineer/steps/BenefitSteps";
import RatingStep from "@/components/onboardingEngineer/steps/RatingSteps";

import OnboardingProgress from "../onboardingEngineer/onBoardingProgress";

import { getOnboardingDataById } from "@/controllers/onboarding";

const STEPS = [
	{
		id: "personal_information",
		label: "Personal Information",
	},

	{
		id: "document_verification",
		label: "Document Verification",
	},

	{
		id: "qualification_skills",
		label: "Qualification & Tech Skill",
	},

	{
		id: "user_creation",
		label: "User Creation",
	},

	{
		id: "bank_details",
		label: "Bank Details",
	},

	{
		id: "benefits",
		label: "Benefits",
	},

	{
		id: "rating",
		label: "Rating",
	},
];

export default function AddOnboardingPageWrapper({ mode, onboardingId }) {
	const [currentStep, setCurrentStep] = useState("personal_information");

	const [isLoading, setIsLoading] = useState(true);

	const [onboardingData, setOnboardingData] = useState({
		onboardingId: null,

		fieldEngineerId: null,

		personalData: null,

		documentData: null,

		qualificationData: null,

		userCreationData: null,

		bankData: null,

		benefitData: null,

		ratingData: null,
	});

	const isEditMode = mode === "edit";

	const completedSteps = [];

	if (onboardingData.personalData) completedSteps.push("personal_information");

	if (onboardingData.documentData) completedSteps.push("document_verification");

	if (onboardingData.qualificationData) completedSteps.push("qualification_skills");

	if (onboardingData.userCreationData) completedSteps.push("user_creation");

	if (onboardingData.bankData) completedSteps.push("bank_details");

	if (onboardingData.benefitData) completedSteps.push("benefits");

	if (onboardingData.ratingData) completedSteps.push("rating");

	useEffect(() => {
		const fetchData = async () => {
			if (mode !== "edit" || !onboardingId) {
				setIsLoading(false);
				return;
			}

			try {
				const response = await getOnboardingDataById(onboardingId);

				if (response?.success) {
					setOnboardingData({
						onboardingId: response.data.onboarding.id,

						fieldEngineerId: response.data.onboarding.field_engineer_id,

						personalData: response.data.personal || null,

						documentData: response.data.documents || null,

						qualificationData: response.data.qualification || null,

						userCreationData: response.data.userCreation || null,

						bankData: response.data.bank || null,

						benefitData: response.data.benefits || null,

						ratingData: response.data.rating || null,
					});

					setCurrentStep(response.data.onboarding.current_step || "personal_information");
				}
			} catch (error) {
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [mode, onboardingId]);

	const handleStepChange = (nextStep, payload = {}) => {
		setOnboardingData((prev) => ({
			...prev,
			...payload,
		}));

		setCurrentStep(nextStep);
	};

	const handlePrevious = () => {
		const currentIndex = STEPS.findIndex((step) => step.id === currentStep);

		if (currentIndex > 0) {
			setCurrentStep(STEPS[currentIndex - 1].id);
		}
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="container-fluid">
			<div className="tab-content">
				<div className="card tab-listing mb-10">
					<nav className="management-tabs">
						<OnboardingProgress
							steps={STEPS}
							currentStep={currentStep}
							completedSteps={completedSteps}
							  onStepChange={setCurrentStep}
							onboardingData={onboardingData}
						/>
					</nav>
				</div>

				{currentStep === "personal_information" && (
					<PersonalStep
						isEditMode={isEditMode}
						onboardingData={onboardingData}
						setOnboardingData={setOnboardingData}
						onNext={(payload) => handleStepChange("document_verification", payload)}
					/>
				)}

				{currentStep === "document_verification" && (
					<DocumentStep
						isEditMode={isEditMode}
						onboardingData={onboardingData}
						onBack={handlePrevious}
						onNext={(payload) => handleStepChange("qualification_skills", payload)}
					/>
				)}
				{currentStep === "qualification_skills" && (
					<QualificationStep
						isEditMode={isEditMode}
						onboardingData={onboardingData}
						onBack={handlePrevious}
						onNext={(payload) => handleStepChange("user_creation", payload)}
					/>
				)}
				{currentStep === "user_creation" && (
					<UserCreationStep
						isEditMode={isEditMode}
						onboardingData={onboardingData}
						onBack={handlePrevious}
						onNext={(payload) => handleStepChange("bank_details", payload)}
					/>
				)}
				{currentStep === "bank_details" && (
					<BankDetailStep
						isEditMode={isEditMode}
						onboardingData={onboardingData}
						onBack={handlePrevious}
						onNext={(payload) => handleStepChange("benefits", payload)}
					/>
				)}
				{currentStep === "benefits" && (
					<BenefitStep
						isEditMode={isEditMode}
						onboardingData={onboardingData}
						onBack={handlePrevious}
						onNext={(payload) => handleStepChange("rating", payload)}
					/>
				)}
				{currentStep === "rating" && (
					<RatingStep
						isEditMode={isEditMode}
						onboardingData={onboardingData}
						onBack={handlePrevious}
						onNext={(payload) => handleStepChange("rating", payload)}
					/>
				)}
			</div>
		</div>
	);
}
