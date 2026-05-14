import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { options } from "@/nextAuth/options";
import { checkPermission } from "@/controllers/permission";
// import { getStateList } from "@/controllers/common";
import style from "@/css/subscribers/subscribers.module.scss";
import DetailsPageHeader from "@/components/subscribers/detailsNew/detailsPageHeader";
import AddSubscriberForm from "@/components/subscribers/detailsNew/addForm";

export const metadata = {
  title: "Add Subscriber",
};

export default async function AddSubscriber() {
  const isAllow = await checkPermission("/subscribers");
  if (!isAllow) redirect("/");

  const [session] = await Promise.all([getServerSession(options)]);

  return (
    <DetailsPageHeader>
      <ul className={style.tabs}>
        <li className={style.active}>Details</li>
        <li>Plans</li>
        <li>History</li>
      </ul>
      <AddSubscriberForm user={session.user} stateList={[]} />
    </DetailsPageHeader>
  );
}
