export default function RatingStep({}) {
	return (
		<>
			<div
				className="tab-pane fade pt-0"
				id="nav-rating"
				role="tabpanel"
				aria-labelledby="nav-rating-tab"
			>
				<div className="card">
					<div className="cardHeader">
						<h3 className="card-title">Rating</h3>
					</div>
					<div className="rating-bx">
						{/* <!-- <span className="rating"><img src="images/rating-images.png"/></span> --> */}

						<h5 className="mb-0">
							Technical Skills <span className="light-text">(4.0)</span>
						</h5>
						<div className="star-rating">
							<input
								type="radio"
								id="5-stars"
								name="rating"
								value="5"
								disabled
							/>
							<label
								htmlFor="5-stars"
								className="star"
							>
								&#9733;
							</label>
							<input
								type="radio"
								id="4-stars"
								name="rating"
								value="4"
								checked
								disabled
							/>
							<label
								htmlFor="4-stars"
								className="star"
							>
								&#9733;
							</label>
							<input
								type="radio"
								id="3-stars"
								name="rating"
								value="3"
								disabled
							/>
							<label
								htmlFor="3-stars"
								className="star"
							>
								&#9733;
							</label>
							<input
								type="radio"
								id="2-stars"
								name="rating"
								value="2"
								disabled
							/>
							<label
								htmlFor="2-stars"
								className="star"
							>
								&#9733;
							</label>
							<input
								type="radio"
								id="1-star"
								name="rating"
								value="1"
								disabled
							/>
							<label
								htmlFor="1-star"
								className="star"
							>
								&#9733;
							</label>
						</div>

						<h5 className="mt-4 mb-0">
							Qualification Skills <span className="light-text">(3.0)</span>
						</h5>
						<div className="star-rating">
							<input
								type="radio"
								id="10-stars"
								name="rating1"
								value="10"
								disabled
							/>
							<label
								htmlFor="10-stars"
								className="star"
							>
								&#9733;
							</label>
							<input
								type="radio"
								id="9-stars"
								name="rating1"
								value="9"
								disabled
							/>
							<label
								htmlFor="9-stars"
								className="star"
							>
								&#9733;
							</label>
							<input
								type="radio"
								id="8-stars"
								name="rating1"
								value="8"
								checked
								disabled
							/>
							<label
								htmlFor="8-stars"
								className="star"
							>
								&#9733;
							</label>
							<input
								type="radio"
								id="7-stars"
								name="rating1"
								value="7"
								disabled
							/>
							<label
								htmlFor="7-stars"
								className="star"
							>
								&#9733;
							</label>
							<input
								type="radio"
								id="6-star"
								name="rating1"
								value="6"
								disabled
							/>
							<label
								htmlFor="6-star"
								className="star"
							>
								&#9733;
							</label>
						</div>

						<h5 className="mt-4 mb-0">
							Customer Reviews <span className="light-text">(4.0)</span>
						</h5>
						<div className="star-rating">
							<input
								type="radio"
								id="15-stars"
								name="rating2"
								value="15"
								disabled
							/>
							<label
								htmlFor="15-stars"
								className="star"
							>
								&#9733;
							</label>
							<input
								type="radio"
								id="14-stars"
								name="rating2"
								value="14"
								disabled
							/>
							<label
								htmlFor="14-stars"
								className="star"
							>
								&#9733;
							</label>
							<input
								type="radio"
								id="13-stars"
								name="rating2"
								value="13"
								checked
								disabled
							/>
							<label
								htmlFor="13-stars"
								className="star"
							>
								&#9733;
							</label>
							<input
								type="radio"
								id="12-stars"
								name="rating2"
								value="12"
								disabled
							/>
							<label
								htmlFor="12-stars"
								className="star"
							>
								&#9733;
							</label>
							<input
								type="radio"
								id="11-star"
								name="rating2"
								value="11"
								disabled
							/>
							<label
								htmlFor="11-star"
								className="star"
							>
								&#9733;
							</label>
						</div>
					</div>
					<div className="form-group mt-2 mb-0">
						<label className="form-label">Can you tell us more?</label>
						<textarea
							type="email"
							className="form-control"
							id="exampleInputEmail1"
							placeholder="Add feedback"
						></textarea>
					</div>
				</div>
				
			</div>
		</>
	);
}
