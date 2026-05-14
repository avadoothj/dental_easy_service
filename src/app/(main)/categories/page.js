import { Suspense } from "react";
import { redirect } from "next/navigation";
import { checkPermission } from "@/controllers/permission";
import SearchPanel from "@/components/categories/searchPanel";
import SearchPanelMobile from "@/components/categories/searchPanelMobile";
import CategoryHeaderLoading from "@/components/categories/loading/header";
import CategoryHeading from "@/components/categories/header";
import CategoryList from "@/components/categories/list";

export const metadata = {
	title: "Category Management",
};

export default async function Categories() {
	const isAllow = await checkPermission("/categories");
	if (!isAllow) redirect("/");

	return (
		<>
			<Suspense fallback={<CategoryHeaderLoading />}>
				<CategoryHeading />
			</Suspense>
			<SearchPanel />
			<SearchPanelMobile />
			<CategoryList />
		</>
	);
}
