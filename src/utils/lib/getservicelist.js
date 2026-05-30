import csv from "csvtojson";
import path from "path";

let initialized = false;

const typeIndex = {};
const modelIndex = {};
export async function initializeProducts() {
	console.log("initialized :", initialized);
	if (initialized) return;

	const filePath = path.join(
		process.cwd(),
		"public",
		"serviceList",
		"Services & AMC List - Products.csv",
	);

	const products = await csv().fromFile(filePath);
	for (const row of products) {
		const type = row.type?.trim();
		const brand = row.brand?.trim();
		const model = row.model_name?.trim();

		if (!type || !brand) continue;

		// Type -> Brands
		if (!typeIndex[type]) {
			typeIndex[type] = new Set();
		}

		typeIndex[type].add(brand);

		// Type -> Brand -> Models
		if (!modelIndex[type]) {
			modelIndex[type] = {};
		}

		if (!modelIndex[type][brand]) {
			modelIndex[type][brand] = new Set();
		}

		if (model) {
			modelIndex[type][brand].add(model);
		}
	}

	initialized = true;
}

export async function getBrands(type) {
	await initializeProducts();

	return [...(typeIndex[type] || [])];
}

export async function getModels(type, brand) {
	await initializeProducts();

	return [...(modelIndex[type]?.[brand] || [])];
}

export async function getTypes() {
	await initializeProducts();

	return Object.keys(typeIndex);
}
