export async function GET() {
	let robotsTxt = "";

	if (process.env.FRONTEND_DOMAIN && process.env.FRONTEND_DOMAIN.includes("bundlr.ottplay.com")) {
		// For production
		robotsTxt += "User-agent: *\n";
		robotsTxt += "Disallow: /api\n";
		robotsTxt += "Disallow: /s2s_isp\n";
		robotsTxt += "Disallow: /s2s_dist_juspay";
	} else {
		// For non-production
		robotsTxt += "User-agent: *\n";
		robotsTxt += "Disallow: /\n";
		robotsTxt += "Noindex: /\n";
		robotsTxt += "Nofollow: /";
	}

	return new Response(robotsTxt, { headers: { "Content-Type": "text/plain" } });
}
