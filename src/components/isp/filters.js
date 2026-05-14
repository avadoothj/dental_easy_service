import SearchFilter from "./searchFilter";
import SearchFilterMobile from "./searchFilterMobile";
import { getIspCategories } from "@/controllers/common";

export default async function IspFilters({ userType, user }) {
	const categories = await getIspCategories();

	const categoryList = [{ id: "all", label: "All" }];
	categories.map((x) => {
		categoryList.push({ id: x.cat_id, label: x.name });
	});

	return (
		<>
			<SearchFilter
				categoryList={categoryList}
				userType={userType}
				user={user}
			/>
			<SearchFilterMobile
				categoryList={categoryList}
				userType={userType}
				user={user}
			/>
		</>
	);
}
