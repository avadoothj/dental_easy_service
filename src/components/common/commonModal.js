"use client";
import React from "react";
import { Modal } from "react-bootstrap";

export default function CommonModal({
	show,
	handleClose = () => {},
	className = "",
	bodyClassName = "",
	modalSize = "",
	centered = false,
	animation = true,
	children,
}) {
	return (
		<Modal
			show={show}
			onHide={handleClose}
			centered={centered}
			className={className}
			animation={animation}
			size={modalSize}
			backdrop="static"
			keyboard={false}
		>
			<Modal.Body className={bodyClassName}>{children}</Modal.Body>
		</Modal>
	);
}
