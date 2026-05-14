"use client";

import { useState, useEffect } from "react";
import PersonalStep from "@/components/onboardingEngineer/steps/personalSteps";
import DocumentStep from "./steps/documentSteps";
import QualificationStep from "./steps/qualificationSteps";
import UserCreationStep from "./steps/userCreationSteps";
import BankDetailStep from "./steps/BankDetailSteps";
import BenefitStep from "./steps/BenefitSteps";
import RatingStep from "./steps/RatingSteps";
import OnboardingProgress from "../onboardingEngineer/onBoardingProgress";

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

const INITIAL_STATE = {
	fieldEngineerId: null,
	currentStep: "personal",
	personalData: {},
	documentData: {},
	qualificationData: {},
	userData: {},
	bankData: {},
	benefitsData: {},
	ratingData: {},
};

export default function AddOnboardingPageWrapper() {
	const [onboardingData, setOnboardingData] = useState(INITIAL_STATE);
	const [completedSteps, setCompletedSteps] = useState([]);
	const [isValid, setIsValid] = useState(false);

	// restore after refresh
	useEffect(() => {
		const savedData = localStorage.getItem("onboardingData");
		const savedSteps = localStorage.getItem("completedSteps");

		if (savedData) {
			setOnboardingData(JSON.parse(savedData));
		}

		if (savedSteps) {
			setCompletedSteps(JSON.parse(savedSteps));
		}
	}, []);

	// persist
	useEffect(() => {
		localStorage.setItem(
			"onboardingData",
			JSON.stringify(onboardingData)
		);

		localStorage.setItem(
			"completedSteps",
			JSON.stringify(completedSteps)
		);
	}, [onboardingData, completedSteps]);

	const currentStep = onboardingData.currentStep;

	const currentIndex = STEPS.findIndex(
		(step) => step.id === currentStep
	);

	const CurrentStepComponent = STEP_COMPONENTS[currentStep];

	const goNext = (stepPayload = {}) => {
		if (currentIndex < STEPS.length - 1) {
			const nextStep = STEPS[currentIndex + 1].id;

			setOnboardingData((prev) => ({
				...prev,
				...stepPayload,
				currentStep: nextStep,
			}));

			if (!completedSteps.includes(currentStep)) {
				setCompletedSteps((prev) => [...prev, currentStep]);
			}

			setIsValid(false);
		}
	};

	const goBack = () => {
		if (currentIndex > 0) {
			const prevStep = STEPS[currentIndex - 1].id;

			setOnboardingData((prev) => ({
				...prev,
				currentStep: prevStep,
			}));
		}
	};

	const resetOnboarding = () => {
		setOnboardingData(INITIAL_STATE);
		setCompletedSteps([]);
		localStorage.removeItem("onboardingData");
		localStorage.removeItem("completedSteps");
	};

	useEffect(() => {
		document.body.className += " hamburgerHide";

		return () => {
			document.body.className =
				document.body.className.replace("hamburgerHide", "");
		};
	}, []);

	return (
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
					onboardingData={onboardingData}
					setOnboardingData={setOnboardingData}
					onValidityChange={setIsValid}
					onNext={goNext}
					onBack={goBack}
					resetOnboarding={resetOnboarding}
					disableNext={!isValid}
					isFirst={currentIndex === 0}
					isLast={currentIndex === STEPS.length - 1}
				/>
			</div>
		</div>
	);
}