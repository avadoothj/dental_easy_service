export default function QualificationStep({}) {
	return (
		<>
			<div
				className="tab-pane fade pt-0"
				id="nav-contact"
				role="tabpanel"
				aria-labelledby="nav-contact-tab"
			>
				<div className="card">
					<div className="cardHeader">
						<h3 className="card-title">Qualification & Technical Skill</h3>
					</div>
					<div className="card-body p-0">
						<div className="row">
							<div className="col-md-4">
								<div className="form-group">
									<label className="form-label">
										Qualification<sup>*</sup>
									</label>
									<select
										className="form-select"
										id="select_box"
									>
										<option>Select Qualification</option>
										<option value="1">Biomedical</option>
										<option value="2">Mechanical Electrical</option>
										<option value="3">Dental equipment technology</option>
										<option
											id="#otherSelect"
											value="other"
										>
											Others
										</option>
									</select>
								</div>
							</div>
							<div className="col-md-4 moreInfoShow hide">
								<div className="form-group">
									<label className="form-label">
										Education<sup>*</sup>
									</label>
									<input
										type="email"
										className="form-control"
										id="exampleInputEmail1"
										placeholder="Enter your education"
										aria-describedby="emailHelp"
									/>
								</div>
							</div>
							<div className="col-md-4">
								<div className="form-group">
									<label className="form-label">
										Year Of experience<sup>*</sup>
									</label>
									<input
										type="email"
										className="form-control"
										id="exampleInputEmail1"
										placeholder="Enter year of experience"
										aria-describedby="emailHelp"
									/>
								</div>
							</div>
							<div className="col-md-4">
								<div className="form-group">
									<label className="form-label">
										Specific equipment experties<sup>*</sup>
									</label>
									<select className="form-select">
										<option>Select equipment experties</option>
										<option value="1">
											Dental chairs and delivery systems
										</option>
										<option value="2">Air compressors and vacuum pumps</option>
										<option value="4">
											High-speed and low-speed handpieces
										</option>
										<option value="5">Electric handpiece motors</option>
										<option value="6">LED curing lights</option>
										<option value="7">Dental operating microscopes</option>
										<option value="8">Portable dental units</option>
									</select>
								</div>
							</div>
							<div className="col-md-4">
								<div className="form-group">
									<label className="form-label">
										Technician Type<sup>*</sup>
									</label>
									<select className="form-select">
										<option>Select Technician Type</option>
										<option value="1">ABC</option>
										<option value="2">XYZ</option>
										<option value="4">PQR</option>
									</select>
								</div>
							</div>
							<div className="col-md-4">
								<div className="form-group">
									<label className="form-label">
										Upload training Certificates{" "}
									</label>
									<input
										type="file"
										className="form-control"
										id="exampleInputEmail1"
										placeholder="Enter your year of experience"
										aria-describedby="emailHelp"
									/>
								</div>
							</div>
							<div className="col-md-4">
								<div className="form-group">
									<label className="form-label">Special Certifications </label>
									<input
										type="file"
										className="form-control"
										id="exampleInputEmail1"
										placeholder="Enter year of experience"
										aria-describedby="emailHelp"
									/>
								</div>
							</div>
							{/* <!-- <div className="col-md-4">
                                                <div className="form-group">
                                                    <label className="form-label">Serviceable Area (km) <sup>*</sup></label>
                                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder="Enter serviceable area in KM" aria-describedby="emailHelp">
                                                
                                                </div>
                                            </div> --> */}
						</div>
						{/* <hr> */}
						<div className="row">
							<div className="col-md-12">
								<h6 className="mt-1 small-title mb-0">Services coverage</h6>
								<span className="smalllighttext mb-3">
									Define the technician’s working locations and how far they can
									travel for service requests.
								</span>
							</div>
							<div className="col-md-6">
								<div className="form-group">
									<label className="form-label">
										Select City<sup>*</sup>
									</label>
									<select
										id="choices-multiple-remove-button"
										className="form-control"
										placeholder="Select City"
										multiple
									>
										<option
											value="Mumbai"
											// onClick="filterSelection('Author')"
										>
											Mumbai
										</option>
										<option value="Pune">Pune</option>
										<option value="Nagpur">Nagpur</option>
										<option value="Thane">Thane</option>
										<option value="Nashik">Nashik</option>
										<option value="Kalyan-Dombivli">Kalyan-Dombivli</option>
										<option value="Vasai-Virar">Vasai-Virar</option>
										<option value="Navi Mumbai">Navi Mumbai</option>
										<option value="Solapur">Solapur</option>
										<option value="Amravati">Amravati</option>
										<option value="Kolhapur">Kolhapur</option>
										<option value="Sangli">Sangli</option>
										<option value="Nanded">Nanded </option>
									</select>
								</div>
							</div>
							<div className="col-md-6">
								<div className="form-group">
									<label className="form-label">
										Select Area<sup>*</sup>
									</label>
									<select
										id="choices-multiple-remove-button"
										className="form-control"
										placeholder="Select Area"
										multiple
									>
										<option
											value="Mumbai"
											// onclick="filterSelection('Author')"
										>
											Bandra
										</option>
										<option value="Pune">Andheri</option>
										<option value="Nagpur">Borivali</option>
										<option value="Thane">Colaba</option>
										<option value="Nashik">Nashik</option>
										<option value="Kalyan-Dombivli">Kalyan-Dombivli</option>
										<option value="Vasai-Virar">Vasai-Virar</option>
										<option value="Navi Mumbai">Navi Mumbai</option>
										<option value="Solapur">Solapur</option>
										<option value="Amravati">Amravati</option>
										<option value="Kolhapur">Kolhapur</option>
										<option value="Sangli">Sangli</option>
										<option value="Nanded">Nanded </option>
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
