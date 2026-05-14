"use strict";

exports.config = {
	app_name: [process.env.NEW_RELIC_APP_NAME], // Change this to your app name
	license_key: process.env.NEW_RELIC_LICENSE_KEY, // Store key in .env
	logging: {
		level: "info", // Can be 'trace', 'debug', 'info', 'warn', 'error', 'fatal'
	},
	application_logging: {
		enabled: true,
		forwarding: {
			enabled: true, // Forward logs to New Relic
		},
	},
	distributed_tracing: {
		enabled: true, // Enables tracing for performance monitoring
	},
	browser_monitoring: {
		enable: true, // Enables Real User Monitoring (RUM)
	},
	transaction_tracer: {
		enabled: true, // Tracks long-running transactions
	},
	error_collector: {
		enabled: true, // Captures errors
	},
};
