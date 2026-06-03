import { redirect } from "next/navigation";
import { checkPermission } from "@/controllers/permission";
import { getStateList, getIspCategories } from "@/controllers/common";
import style from "@/css/isp/isp.module.scss";
import DetailsPageHeader from "@/components/isp/details/detailsPageHeader";
import AddIspForm from "@/components/isp/details/addForm";
import { getSuperIspList } from "@/controllers/superIsp";
import { getServerSession } from "next-auth/next";
import { options } from "@/nextAuth/options";

export const metadata = {
	title: "Add New ISP",
};

export default async function Isp() {
	// const isAllow = await checkPermission("/isp");
	const isAllow = true;
	if (!isAllow) redirect("/");

	const category = null;
	const superIspList = null;
	const session = null;

	const stateList = await getStateList();
	return (
		<DetailsPageHeader>
			<ul className={style.tabs}>
				<li className={style.active}>Details</li>
				<li>Team</li>
			</ul>
			<AddIspForm
				stateList={stateList}
				category={category}
				superIspList={superIspList}
			/>
		</DetailsPageHeader>
	);
}
