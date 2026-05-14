"use client";
import { useState } from "react";
import StepOne from "./stepOne";
import StepTwo from "./stepTwo";
import StepThree from "./stepThree";
import SuccessPage from "./successPage";

export default function ForgetPasswordWrapper() {
	const [currentStep, setCurrentStep] = useState(1);
	const [username, setUsername] = useState("");
	const [displayMessage, setDisplayMessage] = useState("");
	const [verificationToken, setVerificationToken] = useState("");

	const nextStep = () => {
		setCurrentStep((value) => {
			return ++value;
		});
	};

	const prevStep = () => {
		setCurrentStep((value) => {
			return --value;
		});
	};

	return (
		<>
			{currentStep == 1 && (
				<StepOne
					nextStep={nextStep}
					setUsername={setUsername}
					setDisplayMessage={setDisplayMessage}
				/>
			)}
			{currentStep == 2 && (
				<StepTwo
					nextStep={nextStep}
					prevStep={prevStep}
					username={username}
					setVerificationToken={setVerificationToken}
					displayMessage={displayMessage}
				/>
			)}
			{currentStep == 3 && (
				<StepThree
					nextStep={nextStep}
					username={username}
					verificationToken={verificationToken}
				/>
			)}
			{currentStep == 4 && <SuccessPage username={username} />}
		</>
	);
}
