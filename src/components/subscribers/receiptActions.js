"use client";
import style from "@/css/subscribers/receipt.module.scss";

export default function ReceiptActions() {
	return (
		<div className={style.btnWrapper}>
			<button
				className="commonBtn borderBtn"
				onClick={() => {
					window.close();
				}}
			>
				Cancel
			</button>
			<button
				className="commonBtn dark"
				onClick={() => {
					window.print();
				}}
			>
				Print
			</button>
		</div>
	);
}
