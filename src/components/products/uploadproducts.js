"use client";
import { useEffect, useRef, useState } from "react";
import style from "@/css/isp/isp.module.scss";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import commonStyle from "@/css/common/common.module.scss";
import { handleProductUpload } from "@/controllers/productUpload";

export default function ProductUpload() {
	const {
		register,
		handleSubmit,
		watch,
		reset,
		formState: { errors, isSubmitting },
	} = useForm({
		mode: "onChange",
		defaultValues: {
			productExcel: null,
		},
	});

	const onSubmit = async (data) => {
		const formData = new FormData();

		formData.append("productExcel", data.productExcel[0]);

		const response = await handleProductUpload(formData);
	};

	const productExcel = watch("productExcel");

	return (
		<div className={style.teamgridbox}>
			<div className={style.innergrid}>
				<div className={commonStyle.documentLabel}>
					<label className="form-label">
						Upload Product Excel File<sup>*</sup>
					</label>
					{/* <small>Please upload the product Excel file.</small> */}
				</div>

				<Form onSubmit={handleSubmit(onSubmit)}>
					<div className={commonStyle.documentCopy}>
						<label className={commonStyle.fileUpload}>
							<input
								type="file"
								className="form-control"
								accept=".xlsx,.xls"
								{...register("productExcel", {
									required: "Product Excel file is required",
								})}
							/>
							<span className="title">
								Click to <a href="#!">browse</a> local files
							</span>
							<small>Supported formats: XLSX, XLS</small>
						</label>
						{/* <div className={commonStyle.fileName}>
									{passportPhoto?.[0]?.name ||
										existingFiles?.passportPhoto?.fileName ||
										"No file uploaded"}
								</div> */}
						<div className="d-flex align-items-center gap-2">
							<div className="upload-files-names">
								<div className="d-flex gap-1">
									<span className="files"></span>
									<div className="d-flex align-items-center gap-2">
										<span className="file-name">
											{productExcel?.[0]?.name || "No file uploaded"}
										</span>
									</div>
								</div>
								<span className="close"></span>
							</div>
						</div>
					</div>
					<button className={style.uploadbtn}>Upload</button>
				</Form>
			</div>
		</div>
	);
}
