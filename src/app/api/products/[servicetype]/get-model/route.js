import csv from "csvtojson";
import path from "path";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

let products = null;

async function getProducts() {
	if (products) return products;

	const filePath = path.join(
		process.cwd(),
		"public",
		"serviceList",
		"Services & AMC List - Products.csv",
	);

	products = await csv().fromFile(filePath);

	return products;
}

//add header Auth in post code
export async function POST(req, { params }) {
	try {
		const authHeader = req.headers.get("authorization");

		if (!authHeader?.startsWith("Bearer ")) {
			return NextResponse.json(
				{
					success: false,
					message: "Unauthorized",
				},
				{ status: 401 },
			);
		}

		const token = authHeader.split(" ")[1];

		let decoded;
		try {
			decoded = jwt.verify(token, process.env.JWT_SECRET);
		} catch (error) {
			return NextResponse.json(
				{
					success: false,
					message: error.message,
				},
				{ status: 401 },
			);
		}
		const { servicetype } = params;
		const { type, brand } = await req.json();
		const products = await getProducts();

		// No type => return all types
		if (!type) {
			return NextResponse.json({
				success: true,
				message: "Provide Type name in the request body",
			});
		}
		if (!brand) {
			return NextResponse.json({
				success: true,
				message: "Provide Brand name in the request body",
			});
		}

		// Type + Brand provided => return models
		const models = [
			...new Set(
				products
					.filter((p) => p.type === type && p.brand === brand)
					.map((p) => p.model_name),
			),
		];

		return NextResponse.json({
			success: true,
			data: models,
		});
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				message: error.message,
			},
			{ status: 500 },
		);
	}
}
