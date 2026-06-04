"use client";

import { Accordion } from "react-bootstrap";
import style from "@/css/subscribers/subscribers.module.scss";
import commonStyle from "@/css/common/common.module.scss";

import { useContext, useEffect, useState } from "react";
import { getOnboardingDataById } from "@/controllers/onboarding";



export default function DetailPageWrapper({ onboardingData }) {
	return (
		<>
			<div className="contentCopy">
				{/* Personal Information */}
				{onboardingData?.personalData && (
					<Accordion
						defaultActiveKey="0"
						className={commonStyle.accordion}
					>
						<Accordion.Item
							eventKey="0">
							<Accordion.Header>
								Personal Information
							</Accordion.Header>
							<Accordion.Body className={commonStyle.subscriberAccordionBody}>
								<div className={style.Detailsinner}>
									<div className="row">
										<div className="col-md-3">
											<div className="form-group">
												<label className="form-label">
													Name <sup>*</sup>
												</label>
												<div>
													{
														onboardingData?.personalData
															?.full_name
													}
												</div>
											</div>
										</div>
										<div className="col-md-3">
											<div className="form-group">
												<label className="form-label">
													Phone No.<sup>*</sup>
												</label>
												<div>
													{onboardingData?.personalData?.phone || "—"}
												</div>
											</div>
										</div>
										<div className="col-md-3">
											<div className="form-group">
												<label className="form-label">
													Alternative Phone No.
												</label>
												<div>
													{onboardingData?.personalData?.alternate_phone || "—"}

												</div>
											</div>
										</div>
										<div className="col-md-3">
											<div className="form-group">
												<label className="form-label">
													Email Id<sup>*</sup>
												</label>
												<div>
													{
														onboardingData?.personalData
															?.email
													}
												</div>
											</div>
										</div>

										<div className="col-md-3">
											<div className="form-group mb-0">
												<label className="form-label">
													Date Of Birth<sup>*</sup>
												</label>
												<div>
													{new Date(
														onboardingData?.personalData
															?.dob,
													).toLocaleDateString("en-IN")}
												</div>
											</div>
										</div>
										<div className="col-md-3">
											<div className="form-group mb-0">
												<label className="form-label">
													{" "}
													Gender<sup>*</sup>
												</label>
												<div>
													{
														onboardingData?.personalData
															?.gender
													}
												</div>
											</div>
										</div>
									</div>
									<h3 className={commonStyle.mediumHeading + " " + "mt-3"}>Permanent Address</h3>
									<div className="row">
										<div className="col-md-6">
											<div className="form-group">
												<label className="form-label">
													Address Line 1 <sup>*</sup>
												</label>
												<div>
													{
														onboardingData?.personalData
															?.addresses?.permanent
															?.address_line_1
													}
												</div>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group">
												<label className="form-label">
													Address Line 2{" "}
													<span className="light-text">
														(Optional)
													</span>
												</label>
												<div>
													{
														onboardingData?.personalData
															?.addresses?.permanent
															?.address_line_2
													}
												</div>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group">
												<label className="form-label">
													Country
												</label>
												<div>
													{
														onboardingData?.personalData
															?.addresses?.permanent
															?.country
													}
												</div>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group">
												<label className="form-label">
													State <sup>*</sup>
												</label>
												<div>
													{
														onboardingData?.personalData
															?.addresses?.permanent
															?.state
													}
												</div>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group">
												<label className="form-label">
													City <sup>*</sup>
												</label>
												<div>
													{
														onboardingData?.personalData
															?.addresses?.permanent?.city
													}
												</div>
											</div>
										</div>

										<div className="col-md-6">
											<div className="form-group mb-0">
												<label className="form-label">
													Postal / ZIP Code <sup>*</sup>
												</label>
												<div>
													{
														onboardingData?.personalData
															?.addresses?.permanent
															?.postal_code
													}
												</div>
											</div>
										</div>
									</div>
									<h3 className={commonStyle.mediumHeading + " " + "mt-3"}>Current Address </h3>
									<div className="row">
										<div className="col-md-6">
											<div className="form-group">
												<label className="form-label">
													Address Line 1
												</label>
												<div>
													{
														onboardingData?.personalData
															?.addresses?.current
															?.address_line_1
													}
												</div>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group">
												<label className="form-label">
													Address Line 2{" "}
													<span className="light-text">
														(Optional)
													</span>
												</label>
												<div>
													{
														onboardingData?.personalData
															?.addresses?.current
															?.address_line_2
													}
												</div>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group">
												<label className="form-label">
													Country
												</label>
												<div>
													{
														onboardingData?.personalData
															?.addresses?.current
															?.country
													}
												</div>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group">
												<label className="form-label">
													State
												</label>
												<div>
													{
														onboardingData?.personalData
															?.addresses?.current?.state
													}
												</div>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group">
												<label className="form-label">
													City
												</label>
												<div>
													{
														onboardingData?.personalData
															?.addresses?.current?.city
													}
												</div>
											</div>
										</div>

										<div className="col-md-6">
											<div className="form-group">
												<label className="form-label">
													Postal / ZIP Code
												</label>
												<div>
													{
														onboardingData?.personalData
															?.addresses?.current
															?.postal_code
													}
												</div>
											</div>
										</div>
									</div>
									{
										onboardingData?.personalData
											?.full_name
									}
								</div>
							</Accordion.Body>
						</Accordion.Item>
					</Accordion>
				)}

				{/* Document Verification */}

				{onboardingData?.documentData && (
					<Accordion
						defaultActiveKey="1"
						className={commonStyle.accordion}
					>
						<Accordion.Item
							eventKey="0">
							<Accordion.Header>
								Document Verification{" "}
							</Accordion.Header>
							<Accordion.Body className={style.subscriberAccordionBody}>
								<div className={commonStyle.documentViewWrapper}>
									<ul>
										<li>
											<img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg1zOymBRc16NauTlarhkCn07Ifp7CShiOKG9Bev7abQVWxY-KMlVfqVuSM1HvBBHw6VrIjJiZjruThKzHphr1yYcsf77Ahi-degcX9TTJpm1X6HAga_n1lYxB5Cj4ZI5NR_tlhM1-m0awW/s1600/chandrakanth+009+%25281%2529.jpg" />
											<span className={commonStyle.name}>Proof of Identity</span>
										</li>
										<li>
											<img src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/9a21c953622711.593ad088f2616.jpg" />
											<span className={commonStyle.name}>Proof of Address</span>
										</li>
									</ul>
								</div>
							</Accordion.Body>
						</Accordion.Item>
					</Accordion>
				)}

				{/* Qualification & Tech Skill */}

				{onboardingData?.qualificationData && (
					<Accordion className={commonStyle.accordion}
						defaultActiveKey="1">
						<Accordion.Item eventKey="0">
							<Accordion.Header>
								Qualification & Tech Skill
							</Accordion.Header>
							<Accordion.Body className={style.subscriberAccordionBody}>
								<div className={style.Detailsinner}>
									<div className="row">
										<div className="col-md-4">
											<div className="form-group">
												<label className="form-label">
													Qualification
												</label>
												<div>
													{
														onboardingData?.qualificationData
															?.qualification
													}
												</div>
											</div>
										</div>

										<div className="col-md-4">
											<div className="form-group">
												<label className="form-label">
													Year Of experience
												</label>
												<div>
													{
														onboardingData?.qualificationData
															?.experience
													}
												</div>
											</div>
										</div>

										<div className="col-md-4">
											<div className="form-group">
												<label className="form-label">
													Specific equipment experties
												</label>
												<div>
													{
														onboardingData?.qualificationData
															?.specific_equipment_expertise
													}
												</div>
											</div>
										</div>
										<div className="col-md-4">
											<div className="form-group">
												<label className="form-label">
													Technician Type
												</label>
												<div>
													{
														onboardingData?.qualificationData
															?.technician_type
													}
												</div>
											</div>
										</div>

										<div className="col-md-4">
											<div className="form-group">
												<label className="form-label">
													Upload training Certificates{" "}
												</label>
												<div>
													{
														onboardingData?.qualificationData
															?.training_certificate_file_name
													}
												</div>
											</div>
										</div>

										<div className="col-md-4">
											<div className="form-group">
												<label className="form-label">
													Special Certifications{" "}
												</label>
												<div>
													{
														onboardingData?.qualificationData
															?.special_certificate_file_name
													}
												</div>
											</div>
										</div>
										<div className="row">
											<div className="col-md-12">
												<h6 className="mt-1 small-title mb-0">
													Services coverage
												</h6>
												<span className="smalllighttext mb-3">
													Define the technician’s working locations
													and how far they can travel for service
													requests.
												</span>
											</div>

											<div className="col-md-6">
												<div className="form-group">
													<label className="form-label">
														Select City<sup>*</sup>
													</label>
													<div>
														{
															onboardingData?.qualificationData
																?.services_coverage_city
														}
													</div>
												</div>
											</div>
											<div className="col-md-6">
												<div className="form-group">
													<label className="form-label">
														Select Area<sup>*</sup>
													</label>
													<div>
														{
															onboardingData?.qualificationData
																?.services_coverage_area
														}
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</Accordion.Body>
						</Accordion.Item>
					</Accordion>
				)}

				{/* user creation */}

				{onboardingData?.userCreationData && (
					<Accordion
						defaultActiveKey="1"
						className={commonStyle.accordion}
					>
						<Accordion.Item
							eventKey="0">
							<Accordion.Header>
								User Creation
							</Accordion.Header>
							<Accordion.Body className={style.subscriberAccordionBody}>
								<div className={style.Detailsinner}>
									<h3 className={commonStyle.mediumHeading}>User Creation</h3>
									<div className="row">
										{/* USERNAME */}

										<div className="col-md-4">
											<div className="form-group mb-0">
												<label className="form-label">
													User Name
													<sup>*</sup>
												</label>

												<div>
													{
														onboardingData?.userCreationData
															?.username
													}
												</div>
											</div>
										</div>

										{/* PASSWORD */}

										{/* <div className="col-md-4">
									<div className="form-group mb-0">
										<label className="form-label">
											Password
											<sup>*</sup>
										</label>
										<div>
											
										</div>
									</div>
								</div> */}

										{/* SERVICE HEAD */}

										<div className="col-md-4">
											<div className="form-group mb-0">
												<label className="form-label">
													Assign Service Head
													<sup>*</sup>
												</label>

												<div>
													{
														onboardingData?.userCreationData
															?.assign_service_head
													}
												</div>
											</div>
										</div>
									</div>
								</div>
							</Accordion.Body>
						</Accordion.Item>
					</Accordion>
				)}

				{/* bank details */}

				{onboardingData?.bankData && (
					<Accordion
						defaultActiveKey="1"
						className={commonStyle.accordion}
					>
						<Accordion.Item
							eventKey="0">
							<Accordion.Header>
								Bank Details
							</Accordion.Header>
							<Accordion.Body >
								<div className={style.Detailsinner}>
									<div className="row">
										{/* BANK NAME */}

										<div className="col-md-4">
											<div className="form-group">
												<label className="form-label">
													Bank Name
													<sup>*</sup>
												</label>
												<div>
													{onboardingData?.bankData?.bank_name}
												</div>
											</div>
										</div>

										{/* ACCOUNT HOLDER */}

										<div className="col-md-4">
											<div className="form-group">
												<label className="form-label">
													Account Holder Name
													<sup>*</sup>
												</label>
												<div>
													{
														onboardingData?.bankData
															?.account_holder_name
													}
												</div>
											</div>
										</div>

										{/* ACCOUNT TYPE */}

										<div className="col-md-4">
											<div className="form-group">
												<label className="form-label">
													Account Type
													<sup>*</sup>
												</label>
												<div>
													{onboardingData?.bankData?.account_type}
												</div>
											</div>
										</div>

										{/* ACCOUNT NUMBER */}

										<div className="col-md-4">
											<div className="form-group">
												<label className="form-label">
													Account Number
													<sup>*</sup>
												</label>
												<div>
													{
														onboardingData?.bankData
															?.account_number
													}
												</div>
											</div>
										</div>

										{/* IFSC */}

										<div className="col-md-4">
											<div className="form-group">
												<label className="form-label">
													IFSC Code
													<sup>*</sup>
												</label>
												<div>
													{onboardingData?.bankData?.ifsc_code}
												</div>
											</div>
										</div>

										{/* BRANCH */}

										<div className="col-md-4">
											<div className="form-group">
												<label className="form-label">
													Branch Name
													<sup>*</sup>
												</label>
												<div>
													{onboardingData?.bankData?.branch_name}
												</div>
											</div>
										</div>
									</div>
								</div>
							</Accordion.Body>
						</Accordion.Item>
					</Accordion>
				)}

				{/* Benefits */}

				{onboardingData?.benefitData && (
					<Accordion
						defaultActiveKey="1"
						className={commonStyle.accordion}
					>
						<Accordion.Item
							eventKey="0">
							<Accordion.Header>
								Benefits
							</Accordion.Header>
							<Accordion.Body className={style.subscriberAccordionBody}>
								<div className={style.Detailsinner}>
									<span className="smalllighttext">
										Select the benefits the company will provide to the
										technician
									</span>

									<div className="row align-items-end">
										{/* INSURANCE PLAN */}

										<div className="col-md-6">
											<div className="form-group">
												<label className="form-label">
													Insurance Plan
												</label>
												<div>
													{
														onboardingData?.benefitData
															?.insurance_plan
													}
												</div>
											</div>
										</div>

										{/* INSURANCE TYPE */}

										<div className="col-md-6">
											<div className="form-group">
												<label className="form-label">
													Type of Insurance
												</label>
												<div>
													{
														onboardingData?.benefitData
															?.insurance_type
													}
												</div>
											</div>
										</div>

										{/* COVERAGE */}

										<div className="col-md-6">
											<div className="form-group">
												<label className="form-label">
													Coverage Amount
												</label>
												<div>
													{
														onboardingData?.benefitData
															?.coverage_amount
													}
												</div>
											</div>
										</div>

										{/* POLICY */}

										<div className="col-md-6">
											<div className="form-group">
												<label className="form-label">
													Policy Number
												</label>
												<div>
													{onboardingData?.benefitData?.policy_number}
												</div>
											</div>
										</div>
									</div>
									
									<h3 className={commonStyle.mediumHeading}>Family Details</h3>
									<ul className="member-list">
									{onboardingData?.benefitData?.family_members?.map(
										(memberDetails, index) => (
											<li key={index} className="border-top py-2">
												<div className="d-flex flex-grow-1 gap-3">
													{/* NAME */}

													<div className="form-group flex-grow-1 mb-0">
														<label className="form-label">
															Full Name
														</label>
														<div>
															{memberDetails?.fullName}
														</div>
													</div>

													{/* RELATIONSHIP */}

													<div className="form-group flex-grow-1 mb-0">
														<label className="form-label">
															Relationship
														</label>
														<div>
															{
																memberDetails?.relationship
															}
														</div>
													</div>

													{/* AGE */}

													<div className="form-group flex-grow-1 mb-0">
														<label className="form-label">
															Age
														</label>
														<div>{memberDetails?.age}</div>
													</div>
												</div>
											</li>
										),
									)}
								</ul>
								</div>
							</Accordion.Body>
						</Accordion.Item>
					</Accordion>
				)}

				{/* rating */}

				{onboardingData?.ratingData && (
					<Accordion
						defaultActiveKey="1"
						className={commonStyle.accordion}
					>
						<Accordion.Item
							eventKey="0">
							<Accordion.Header>
								Rating
							</Accordion.Header>
							<Accordion.Body className={style.subscriberAccordionBody}>
								<div className={style.Detailsinner}>
									<h3 className={commonStyle.mediumHeading}>Rating</h3>
									<div className="rating-bx">
										{/* TECHNICAL */}

										<h5 className="mb-0">
											Technical Skills{" "}
											<span className="light-text">
												({onboardingData?.ratingData?.technical_skills}
												.0)
											</span>
										</h5>

										{renderStars(
											onboardingData?.ratingData?.technical_skills,
										)}

										{/* QUALIFICATION */}

										<h5 className="mt-4 mb-0">
											Qualification Skills{" "}
											<span className="light-text">
												(
												{
													onboardingData?.ratingData
														?.qualification_skills
												}
												.0)
											</span>
										</h5>

										{renderStars(
											onboardingData?.ratingData?.qualification_skills,
										)}

										{/* CUSTOMER */}

										<h5 className="mt-4 mb-0">
											Customer Reviews{" "}
											<span className="light-text">
												({onboardingData?.ratingData?.customer_reviews}
												.0)
											</span>
										</h5>

										{renderStars(
											onboardingData?.ratingData?.customer_reviews,
										)}
									</div>
									<div className="form-group mt-4 mb-0">
										<label className="form-label">
											Can you tell us more?
										</label>
										<div>{onboardingData?.ratingData?.feedback}</div>
									</div>
								</div>
							</Accordion.Body>
						</Accordion.Item>
					</Accordion>
				)}
			</div>
		</>
	);
}

const renderStars = (value) => {
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
				>
					★
				</span>
			))}
		</div>
	);
};
