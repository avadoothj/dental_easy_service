export default function UserCreationStep({}) {
	return (
		<>
			<div
				className="tab-pane fade pt-0"
				id="nav-user"
				role="tabpanel"
				aria-labelledby="nav-user-tab"
			>
				<div className="card">
					<div className="cardHeader">
						<h3 className="card-title">User Creation</h3>
					</div>
					<div className="card-body p-0">
						<div className="row mb-3">
							<div className="col-md-4">
								<div className="form-group">
									<label className="form-label">
										User Name<sup>*</sup>
									</label>
									<input
										type="email"
										className="form-control"
										id="exampleInputEmail1"
										placeholder="Enter user name"
										aria-describedby="emailHelp"
									/>
								</div>
							</div>
							<div className="col-md-4">
								<div className="form-group">
									<label className="form-label">
										Password<sup>*</sup>
									</label>

									<div className="password-wrap">
										<input
											type="password"
											className="form-control"
											id="exampleInputEmail1"
											placeholder="Enter your password"
											aria-describedby="emailHelp"
										/>
										<i className="toggle-password fa fa-fw fa-eye-slash"></i>
									</div>
									<span className="smalllighttext">
										Password should contain at least 8 characters, upper and
										lowercase letters, at least one number and at least one
										special character
									</span>
								</div>
							</div>

							<div className="col-md-4">
								<div className="form-group">
									<label className="form-label">
										Assign Service Head<sup>*</sup>
									</label>
									<select
										className="form-select js-select2"
										id="mySelect2"
									>
										<option>Select Service Head</option>
										<option value="1">Rajesh Kumar - Ghansoli</option>
										<option value="2">Pratik Tiwari - Vashi</option>
										<option value="3">Dinesh Sharma - Thane</option>
									</select>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
