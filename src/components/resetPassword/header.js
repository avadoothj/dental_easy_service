import { options } from "@/app/api/auth/[...nextauth]/options";
import { getResetPassCount } from "@/controllers/resetPassword";
import { formatNumber } from "@/utils/utils";
import { getServerSession } from "next-auth";

export default async function ResetPassHeading() {
  const session = await getServerSession(options);
  const resetPassCount = await getResetPassCount(session);

  return (
    <div className="commonHeading">
      <h1>
        Reset Password <span>({formatNumber(resetPassCount.count)})</span>
      </h1>
    </div>
  );
}
