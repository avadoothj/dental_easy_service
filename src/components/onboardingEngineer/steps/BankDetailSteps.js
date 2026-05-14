export default function BankDetailStep({}) {
	return (
		<>
			<div
				className="tab-pane fade pt-0"
				id="nav-bank"
				role="tabpanel"
				aria-labelledby="nav-bank-tab"
			>
				<div className="card">
					<div className="cardHeader">
						<h3 className="card-title">Bank Details</h3>
					</div>
					<div className="card-body p-0">
						<div className="row mb-3">
							<div className="col-md-4">
								<div className="form-group">
									<label className="form-label">
										Bank Name<sup>*</sup>
									</label>
									<select className="form-select">
										<option>Select Bank</option>
										<option value="1">State Bank of India (SBI)</option>
										<option value="2">Bank of Baroda</option>
										<option value="3">Punjab National Bank</option>
										<option value="4">Canara Bank</option>
										<option value="5">Union Bank of India</option>
										<option value="6">Bank of India</option>
										<option value="7">Indian Bank</option>
										<option value="8">Central Bank of India</option>
										<option value="9">Indian Overseas Bank</option>
										<option value="10">Bank of Maharashtra</option>
									</select>
								</div>
							</div>
							<div className="col-md-4">
								<div className="form-group">
									<label className="form-label">
										Account Holder Name<sup>*</sup>
									</label>
									<input
										type="email"
										className="form-control"
										id="exampleInputEmail1"
										placeholder="Enter A/C name"
										aria-describedby="emailHelp"
									/>
								</div>
							</div>
							<div className="col-md-4">
								<div className="form-group">
									<label className="form-label">
										Account Type<sup>*</sup>
									</label>
									<select className="form-select">
										<option>Select Account</option>
										<option value="1">Savings Account</option>
										<option value="2">Current Account</option>
										<option value="3">Salary Account</option>
									</select>
								</div>
							</div>
							<div className="col-md-4">
								<div className="form-group">
									<label className="form-label">
										Account Number<sup>*</sup>
									</label>
									<input
										type="email"
										className="form-control"
										id="exampleInputEmail1"
										placeholder="Enter A/C number"
										aria-describedby="emailHelp"
									/>
								</div>
							</div>
							<div className="col-md-4">
								<div className="form-group">
									<label className="form-label">
										IFSC Code<sup>*</sup>
									</label>
									<input
										type="email"
										className="form-control"
										id="exampleInputEmail1"
										placeholder="Enter A/C name"
										aria-describedby="emailHelp"
									/>
								</div>
							</div>
							<div className="col-md-4">
								<div className="form-group">
									<label className="form-label">
										Branch Name<sup>*</sup>
									</label>
									<input
										type="email"
										className="form-control"
										id="exampleInputEmail1"
										placeholder="Enter branch name"
										aria-describedby="emailHelp"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
