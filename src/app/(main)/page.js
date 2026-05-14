import DefaultDashboard from "@/components/dashboard/default";

export const metadata = {
	title: "Dashboard",
};

export default async function Home() {
	return (
		<>
			<div className="commonHeading">
				<h1>Dashboard</h1>
			</div>
			<DefaultDashboard />
		</>
	);
}
