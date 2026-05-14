export default function BenefitStep({}) {
	return (
		<>
			<div
				className="tab-pane fade pt-0"
				id="nav-benefits"
				role="tabpanel"
				aria-labelledby="nav-benefits-tab"
			>
				<div className="card mb-10">
					<div className="cardHeader">
						<h3 className="card-title">Benefits</h3>
					</div>
					<div className="card-body p-0">
						<span className="smalllighttext">
							Select the benefits the company will provide to the technician. Options
							include insurance and family coverage
						</span>
						<div className="row align-items-end">
							<div className="col-md-6">
								<div className="form-group">
									<label className="form-label">
										Select Insurance Plan Add Spouse, children, or parents under
										the same mediclaim plan{" "}
									</label>
									<select className="form-select">
										<option>Select Insurance Plan</option>
										<option value="1">Basic Health Insurance</option>
										<option value="2">Standard Health Insurance</option>
										<option value="3">Premium Health Insurance</option>
									</select>
								</div>
							</div>
							<div className="col-md-6">
								<div className="form-group">
									<label className="form-label">
										Type of Insurance<sup>*</sup>
									</label>
									<select className="form-select">
										<option>Select Type of Insurance</option>
										<option value="1">Accident Insurance</option>
										<option value="2">Life Insurance</option>
									</select>
								</div>
							</div>
							<div className="col-md-6">
								<div className="form-group mb-0">
									<label className="form-label">
										Coverage Amount<sup>*</sup>
									</label>
									<input
										type="email"
										className="form-control"
										id="exampleInputEmail1"
										placeholder="Enter Coverage Amount"
										aria-describedby="emailHelp"
									/>
								</div>
							</div>
							<div className="col-md-6">
								<div className="form-group mb-0">
									<label className="form-label">
										Policy Number<sup>*</sup>
									</label>
									<input
										type="email"
										className="form-control"
										id="exampleInputEmail1"
										placeholder="INS-2025-TECH-0001"
										aria-describedby="emailHelp"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="card">
					<div className="cardHeader">
						<h3 className="card-title">Family Details</h3>
						<a
							href="#"
							className="btn btnPrimary add"
						>
							Add New Member{" "}
						</a>
					</div>
					<div className="card-body p-0">
						<ul className="member-list">
							<li>
								<div className="d-flex flex-grow-1 gap-3">
									<div className="form-group flex-grow-1 mb-0">
										<label className="form-label">
											Full Name <sup>*</sup>
										</label>
										<input
											type="email"
											className="form-control"
											id="exampleInputEmail1"
											placeholder="Enter full name"
										/>
									</div>
									<div className="form-group flex-grow-1 mb-0">
										<label className="form-label">
											Relationship <sup>*</sup>
										</label>
										<select
											className="form-select"
											aria-label="Default select example"
										>
											<option>-- Select One --</option>
											<option value="1">Wife</option>
											<option value="2">Daughter</option>
											<option value="3">Son</option>
										</select>
									</div>
									<div className="form-group flex-grow-1 mb-0">
										<label className="form-label">
											Age <sup>*</sup>
										</label>
										<input
											type="email"
											className="form-control"
											id="exampleInputEmail1"
											placeholder="Enter age"
										/>
									</div>
								</div>
								<div>
									<button className="btn btn-danger">Remove</button>
								</div>
							</li>
							<li>
								<div className="d-flex flex-grow-1 gap-3">
									<div className="form-group flex-grow-1 mb-0">
										<label className="form-label">
											Full Name <sup>*</sup>
										</label>
										<input
											type="email"
											className="form-control"
											id="exampleInputEmail1"
											placeholder="Enter full name"
										/>
									</div>
									<div className="form-group flex-grow-1 mb-0">
										<label className="form-label">
											Relationship <sup>*</sup>
										</label>
										<select
											className="form-select"
											aria-label="Default select example"
										>
											<option>-- Select One --</option>
											<option value="1">Wife</option>
											<option value="2">Daughter</option>
											<option value="3">Son</option>
										</select>
									</div>
									<div className="form-group flex-grow-1 mb-0">
										<label className="form-label">
											Age <sup>*</sup>
										</label>
										<input
											type="email"
											className="form-control"
											id="exampleInputEmail1"
											placeholder="Enter age"
										/>
									</div>
								</div>
								<div>
									<btn className="btn btn-danger">Remove</btn>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</>
	);
}
