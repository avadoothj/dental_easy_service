"use client";
import { useState } from "react";
import { handleStepChange } from "../../controllers/onboarding";
import commonStyle from "@/css/common/common.module.scss";
import { useRouter } from "next/navigation";
export default function OnboardingProgress({
	steps,
	currentIndex,
	completedSteps,
	currentStep,
	onboardingData,
	  onStepChange,
}) {
	const router = useRouter();
	const handleClick = async (step) => {

		const changeStep = await handleStepChange(step, onboardingData?.onboardingId);
		if (changeStep.success) {
			onStepChange(step.id);
		}
	};

	return (
		<>
			<div
				className={commonStyle.tabWrapper + " " + "nav nav-tabs"}
				id="nav-tab"
				role="tablist"
			>
				{steps.map((step, index) => {
					return (
						<button
							key={step.id}
							type="button"
							className={`nav-link ${currentStep === step.id ? "active" : ""} `}
							aria-selected={currentStep === step.id}
							onClick={() => handleClick(step)}
						>
							<span className={commonStyle.count}>
								{completedSteps.includes(step.id) ? (
									<span className={commonStyle.filled}></span>
								) : (
									index + 1
								)}
							</span>
							{step.label}
						</button>
					);
				})}
			</div>
		</>
	);
}
