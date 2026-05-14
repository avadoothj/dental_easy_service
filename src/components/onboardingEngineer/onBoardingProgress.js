"use client";
import { useState } from "react";
export default function OnboardingProgress({ steps, currentIndex, completedSteps, currentStep }) {

	return (
		<>
			<div
				className="nav nav-tabs"
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
							disabled
						>
							<span className="outer-round">
								<span className="count">
									{completedSteps.includes(step.id) ? (
										<img
											src="data:image/svg+xml,%3Csvg width='16px' height='16px' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='24' height='24' fill='green'/%3E%3Cg id='Interface / Check'%3E%3Cpath d='M6 12L10.2426 16.2426L18.727 7.75732' stroke='%23fff' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/g%3E%3C/svg%3E"
											alt="completed"
										/>
									) : (
										index + 1
									)}
								</span>
							</span>
							{step.label}
						</button>
					);
				})}
			</div>
		</>
	);
}
