import pgp from "pg-promise";
import { EventEmitter } from "events";
import mysql from "mysql2/promise";

const globalForDb = globalThis;

if (!globalForDb.__dbEventEmitterConfigured) {
	EventEmitter.defaultMaxListeners = Math.max(EventEmitter.defaultMaxListeners, 50);
	globalForDb.__dbEventEmitterConfigured = true;
}

const DB_RETRYABLE_CODES = new Set([
	"ECONNRESET",
	"ECONNREFUSED",
	"ETIMEDOUT",
	"57P01",
	"57P02",
	"57P03",
]);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const createPgpInstance = () =>
	pgp({
		capSQL: true,
		error(err, e) {
			console.error("Database: " + (err.message || err));
			if (e?.cn) console.error("Connection related error: " + e.cn);
		},
		connect(client) {
			if (typeof client.setMaxListeners === "function") {
				client.setMaxListeners(50);
			}

			if (typeof client?.connection?.setMaxListeners === "function") {
				client.connection.setMaxListeners(50);
			}
		},
	});

const configureTypeParsers = (pgpInstance) => {
	[1082, 1083, 1114, 1184, 1182, 1266].forEach((type) => {
		pgpInstance.pg.types.setTypeParser(type, (value) => value);
	});
};

const pool = mysql.createPool({
	host: process.env.MYSQL_HOST,
	port: process.env.MYSQL_PORT,
	database: process.env.MYSQL_DATABASE,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	timezone: "+05:30",

	waitForConnections: true,
	connectionLimit: 20,
	queueLimit: 0,
});

export async function executeQuery(query, values = []) {
	try {
		const [rows] = await pool.execute(query, values);

		return rows;
	} catch (error) {
		console.error("executeQuery Error:", error);

		throw error;
	}
}

// const ensurePgpInstance = () => {
// 	if (!globalForDb.__pgpInstance) {
// 		globalForDb.__pgpInstance = createPgpInstance();
// 		configureTypeParsers(globalForDb.__pgpInstance);
// 	}

// 	return globalForDb.__pgpInstance;
// };

// const createDbInstance = () => ensurePgpInstance()(getDbConfig());

// const getDbInstance = () => {
// 	if (!globalForDb.__dbInstance) {
// 		globalForDb.__dbInstance = createDbInstance();
// 	}

// 	return globalForDb.__dbInstance;
// };

// const resetDbInstance = async () => {
// 	if (globalForDb.__dbInstance?.$pool) {
// 		try {
// 			await globalForDb.__dbInstance.$pool.end();
// 		} catch (error) {
// 			console.error("Database pool reset error:", error.message || error);
// 		}
// 	}

// 	globalForDb.__dbInstance = createDbInstance();
// 	return globalForDb.__dbInstance;
// };

// const isRetryableDbError = (error) => {
// 	const message = String(error?.message || error || "");
// 	return (
// 		DB_RETRYABLE_CODES.has(error?.code) ||
// 		message.includes("ECONNRESET") ||
// 		message.includes("Connection terminated unexpectedly") ||
// 		message.includes("Connection terminated") ||
// 		message.includes("read ECONNRESET")
// 	);
// };

// export const queryWithRetry = async (query, values, maxRetries = 1) => {
// 	let attempt = 0;

// 	while (true) {
// 		try {
// 			return await getDbInstance().query(query, values);
// 		} catch (error) {
// 			if (attempt >= maxRetries || !isRetryableDbError(error)) {
// 				throw error;
// 			}

// 			attempt += 1;
// 			await resetDbInstance();
// 			await sleep(300 * attempt);
// 		}
// 	}
// };

// export const db = new Proxy(
// 	{},
// 	{
// 		get(_target, property) {
// 			const instance = getDbInstance();
// 			const value = instance[property];

// 			return typeof value === "function" ? value.bind(instance) : value;
// 		},
// 	},
// );

// export const dbRead = db;

// const database = mysql({
// 	config: {
// 		host: process.env.MYSQL_HOST,
// 		port: process.env.MYSQL_PORT,
// 		database: process.env.MYSQL_DATABASE,
// 		user: process.env.MYSQL_USER,
// 		password: process.env.MYSQL_PASSWORD,
// 		timezone: "IST",
// 	},
// });

// export default function executeQuery(query, values = []) {
// 	return new Promise((resolve, reject) => {
// 		try {
// 			database.query(query, values).then((results) => {
// 				database.end();
// 				resolve(JSON.parse(JSON.stringify(results)));
// 			});
// 		} catch (error) {
// 			console.log(error);
// 			resolve([]);
// 		}
// 	});
// }
