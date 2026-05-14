import { getServerSession } from "next-auth/next";
import { options } from "@/nextAuth/options";
import { getCouponListCount } from "@/controllers/coupon";
import { formatNumber } from "@/utils/utils";

export default async function CouponHeading() {

	const [session] = await Promise.all([getServerSession(options)]);
	const response = await getCouponListCount();

	return (
		<div className="commonHeading">
			<h1>Coupon List <span>({formatNumber(response.count)})</span></h1>
		</div>
	);
}
