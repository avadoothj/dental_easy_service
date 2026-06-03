export default [
	[
		{
			menu_id: 1,
			section_id: 1,
			name: "Dashboard",
			link: "/",
			image: "/images/sidebar/dashboard.svg",
			on_sidebar: 1,
			menus: [],
		},
		{
			menu_id: 18,
			section_id: 1,
			name: "Teams",
			link: "/team",
			image: "",
			on_sidebar: 0,
			menus: [],
		},
	],
	[
		{
			menu_id: 13,
			section_id: 5,
			name: "ISP",
			link: "/isp",
			image: "/images/sidebar/plans.svg",
			on_sidebar: 1,
			menus: [
				{
					menu_id: 14,
					section_id: 0,
					name: "Stakeholder",
					link: "/isp",
					image: "",
					on_sidebar: 1,
					menus: [],
				},
			],
		},

		{
			menu_id: 19,
			section_id: 1,
			name: "Onboarding",
			link: "/onboarding-engineer",
			image: "/images/sidebar/dashboard.svg",
			on_sidebar: 1,
			menus: [],
		},
	],
];
