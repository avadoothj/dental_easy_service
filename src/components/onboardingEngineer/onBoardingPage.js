"use client";

import { useRouter } from "next/navigation";

export default function OnBoardingPage() {
	const router = useRouter();
	const handleAddTechnician = async () => {
		try {
			const res = await fetch("/api/onboarding/start", {
				method: "POST",
			});

			const data = await res.json();

			if (!data.success) {
				throw new Error("Onboarding creation failed");
			}

			router.push(`/onboarding/add/${data.onboardingId}/personal`);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
				<div className="card">
					<div className="cardHeader">
						<h3 className="card-title">Onboarding Technicians</h3>
						<button
							onClick={handleAddTechnician}
							className="btn btnPrimary add"
						>
							Add New
						</button>
					</div>
					<div className="filterwrap">
						<h6>Filter</h6>
						<form>
							<ul>
								<li>
									<div className="form-group d-flex align-items-center">
										<input
											className="form-control"
											placeholder="Search Here..."
										/>
										<i className="search"></i>
									</div>
								</li>
								<li>
									<select
										className="form-select"
										aria-label="Default select example"
									>
										<option>Select Status</option>
										<option value="1">Active</option>
										<option value="2">Draft</option>
									</select>
								</li>
							</ul>
						</form>
					</div>{" "}
					<div className="card-table">
						<table>
							<thead>
								<tr>
									<th>
										Name
										<div className="form-group d-flex align-items-center mb-0">
											<input
												className="form-control"
												placeholder="Search Here..."
											/>
											<i className="search"></i>
										</div>
									</th>
									<th>
										Contact Number
										<div className="form-group d-flex align-items-center mb-0">
											<input
												className="form-control"
												placeholder="Search Here..."
											/>
											<i className="search"></i>
										</div>
									</th>
									<th>
										Email Id
										<div className="form-group d-flex align-items-center mb-0">
											<input
												className="form-control"
												placeholder="Search Here..."
											/>
											<i className="search"></i>
										</div>
									</th>

									<th>
										Status
										<select className="form-select">
											<option>Select Status</option>
											<option value="1">Online</option>
											<option value="2">Busy</option>
											<option value="3">Offline</option>
										</select>
									</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>Ramesh Kumar</td>
									<td>+91 9867 767 575</td>
									<td>rameshkumar@gmail.com</td>

									<td>
										<span className="success">Completed</span>
									</td>
									<td>
										<div className="action">
											<a
												href="new-onboarding.html"
												className="edit"
												data-bs-toggle="tooltip"
												data-bs-placement="top"
												title="Edit"
											></a>
										</div>
									</td>
								</tr>
								<tr>
									<td>Dinesh Sharma</td>
									<td>+91 9867 767 789</td>
									<td>dineshsharma@gmail.com</td>

									<td>
										<span className="warning">Draft</span>
									</td>
									<td>
										<div className="action">
											<a
												href="new-onboarding.html"
												className="edit"
												data-bs-toggle="tooltip"
												data-bs-placement="top"
												title="Edit"
											></a>
										</div>
									</td>
								</tr>
								<tr>
									<td>Ramesh Kumar</td>
									<td>+91 9867 767 575</td>
									<td>rameshkumar@gmail.com</td>

									<td>
										<span className="success">Completed</span>
									</td>
									<td>
										<div className="action">
											<a
												href="new-onboarding.html"
												className="edit"
												data-bs-toggle="tooltip"
												data-bs-placement="top"
												title="Edit"
											></a>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<nav aria-label="navigation example">
						<ul className="pagination d-flex justify-content-center">
							<li className="page-item">
								<button
									className="page-link"
									disabled
								>
									&lt;
								</button>
							</li>
							<li className="page-item active">
								<button
									className="page-link"
									href="#"
								>
									1
								</button>
							</li>
							<li className="page-item">
								<button
									className="page-link"
									href="#"
								>
									2
								</button>
							</li>
							<li className="page-item">
								<button
									className="page-link"
									href="#"
								>
									..
								</button>
							</li>
							<li className="page-item">
								<a
									className="page-link"
									href="#"
								>
									9
								</a>
							</li>
							<li className="page-item">
								<a
									className="page-link"
									href="#"
								>
									10
								</a>
							</li>
							<li className="page-item">
								<a
									className="page-link"
									href="#"
								>
									&gt;
								</a>
							</li>
						</ul>
					</nav>
				</div>
		</>
	);
}
