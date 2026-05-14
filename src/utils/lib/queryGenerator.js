import pgp from "pg-promise";

const pgpInstance = pgp({});

function generateUpdateQuery(updateParamsObj, conditonParamsObj, tableName) {
	var query = "UPDATE " + tableName + " SET ";
	for (var key in updateParamsObj) {
		if (updateParamsObj.hasOwnProperty(key)) {
			query += key.toLowerCase() + " = ${" + key + "},";
		}
	}
	query = query.substring(0, query.length - 1); //remove comma
	query = pgpInstance.as.format(query, updateParamsObj);
	query += " WHERE ";
	for (var key in conditonParamsObj) {
		if (conditonParamsObj.hasOwnProperty(key)) {
			query += key.toLowerCase() + " = ${" + key + "} and ";
		}
	}
	query = query.substring(0, query.length - 4); //remove end
	query += ";";
	query = pgpInstance.as.format(query, conditonParamsObj);
	return query;
}

// function generateInsertQuery(obj, tableName, returnField = "") {
// 	var query = "INSERT INTO " + tableName + " (${this~}) ";
// 	query += "VALUES (";
// 	for (var key in obj) {
// 		if (obj.hasOwnProperty(key)) {
// 			query += " ${" + key + "},";
// 		}
// 	}
// 	query = query.substring(0, query.length - 1); //to remove comma
// 	query += ")";
// 	query += returnField == "" ? "" : " RETURNING " + returnField;
// 	query += ";";
// 	query = pgpInstance.as.format(query, obj);
// 	return query;
// }
export function generateInsertQuery(obj, tableName) {
	const keys = Object.keys(obj);

	const columns = keys.join(", ");

	const values = keys
		.map((key) => {
			const value = obj[key];

			if (value === null || value === undefined) {
				return "NULL";
			}

			if (typeof value === "string") {
				return `'${value.replace(/'/g, "''")}'`;
			}

			if (typeof value === "boolean") {
				return value ? 1 : 0;
			}

			return value;
		})
		.join(", ");

	const query = `
		INSERT INTO ${tableName} (${columns})
		VALUES (${values});
	`;

	return query;
}
export const queryGenerator = {
	generateUpdateQuery,
	generateInsertQuery,
};
