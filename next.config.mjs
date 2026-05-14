// Conditionally load New Relic only when enabled
if (process.env.NEW_RELIC_ENABLE == "true") {
	await import("newrelic");
}
/** @type {import('next').NextConfig} */

const nextConfig = {
	distDir: "build",
	reactStrictMode: false,
	poweredByHeader: false,
	optimizeFonts: false,
	// experimental: {
	// 	instrumentationHook: true,
	// },
	images: {
		minimumCacheTTL: 31536000,
		remotePatterns: [
			{ protocol: "https", hostname: "images.indianexpress.com", pathname: "**" },
			{ protocol: "https", hostname: "images.ottplay.com", pathname: "**" },
			{ protocol: "https", hostname: "img.youtube.com", pathname: "**" },
		],
	},
	/* webpack: (config, { isServer }) => {
		if (!isServer) {
			// Customize the client-side Webpack configuration
			config.optimization.splitChunks = false; // This prevents code-splitting, compiling everything at once
			config.optimization.runtimeChunk = false;
		}
		return config;
	}, */
	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
					{
						key: "X-XSS-Protection",
						value: "1; mode=block;",
					},
					{
						key: "Strict-Transport-Security",
						value: "max-age=31536000; includeSubDomains;",
					},
				],
			},
		];
	},
	async rewrites() {
		return [
			// Internal
			{
				source: "/api/internal/subscriber/details",
				destination: "/api/internal/subscriberDetails",
			},

			// V4.0 (For CMS/Node)
			{
				source: "/api/v4.0/subscriber/renewalIntent",
				destination: "/api/v4_0/createRenewalIntent",
			},
			{
				source: "/api/v4.0/subscriber/autoRenewStatusChangeRequest",
				destination: "/api/v4_0/createAutoRenewStatusChangeRequest",
			},
			{
				source: "/api/v4.0/subscriber/updateCmsPlanStatus",
				destination: "/api/v4_0/updateCmsPlanStatus",
			},
			{
				source: "/api/v4.0/coupon/updateRedeemStatus",
				destination: "/api/v4_0/updateRedeemStatus",
			},

			// V4.0 (For partners)
			{
				source: "/api/v4.0/claim",
				destination: "/api/v4_0/claim",
			},
			{
				source: "/api/v4.0/subscriber/action",
				destination: "/api/v4_0/subscriberAction",
			},
			{
				source: "/api/v4.0/subscriber/details",
				destination: "/api/v4_0/subscriberDetails",
			},
			{
				source: "/api/v4.0/subscriber/cancelPlan",
				destination: "/api/v4_0/subscriberCancelPlan",
			},
			{
				source: "/api/v4.0/partner/plansList",
				destination: "/api/v4_0/plansList",
			},
			{
				source: "/api/v4.0/partner/ispBalance",
				destination: "/api/v4_0/ispBalance",
			},
			{
				source: "/api/v4.0/partner/operatorBalance",
				destination: "/api/v4_0/operatorBalance",
			},
			{
				source: "/api/v4.0/subscriber/renewalRequests",
				destination: "/api/v4_0/renewalRequests",
			},
			{
				source: "/api/v4.0/subscriber/updateRenewalRequest",
				destination: "/api/v4_0/updateRenewalRequest",
			},
			{
				source: "/api/v4.0/subscriber/autoRenewStatusChangeRequests",
				destination: "/api/v4_0/autoRenewStatusChangeRequests",
			},
			{
				source: "/api/v4.0/subscriber/updateAutoRenewRequest",
				destination: "/api/v4_0/updateAutoRenewRequest",
			},
			{
				source: "/api/v4.0/queue/checkRequestStatus",
				destination: "/api/v4_0/checkQueueRequestStatus",
			},

			// V2 & V3 API's
			{
				source: "/api/operator/balance",
				destination: "/api/v3/getOperatorBalance",
			},
			{
				source: "/api/isp/balance",
				destination: "/api/v3/getIspBalance",
			},
			{
				source: "/api/operator/active-plan",
				destination: "/api/v3/getActivePlans",
			},
			{
				source: "/api/subscriber/details",
				destination: "/api/v3/getSubscriberDetails",
			},
			{
				source: "/api/cancelSubscriberPlan",
				destination: "/api/v3/cancelSubscriberPlan",
			},
			{
				source: "/api/subscriber/add",
				destination: "/api/v3/createNewSubscriber",
			},
			{
				source: "/api/future-activate",
				destination: "/api/v3/futurePlanActivation",
			},
			{
				source: "/api/activity",
				destination: "/api/v3/subscriberPackActivityApi",
			},
			{
				source: "/api/subscriber/activate",
				destination: "/api/v3/subscriberActivationApi",
			},
			{
				source: "/api/account_automation",
				destination: "/api/v3/accountAutomationApi",
			},

			// Payment Gateway redirect
			{
				source: "/s2s_isp",
				destination: "/api/processPayment/omniwareS2s",
			},
			{
				source: "/s2s_dist_juspay",
				destination: "/api/processPayment/juspayS2s",
			},

			// robots.txt file
			{
				source: "/robots.txt",
				destination: "/api/robots",
			},
		];
	},
};

export default nextConfig;
