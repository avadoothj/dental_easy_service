import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { checkPermission } from "@/controllers/permission";
import DetailsPageHeader from "@/components/subscribers/detailsNew/detailsPageHeader";
import DetailsWrapper from "@/components/subscribers/detailsNew/detailsWrapper";
import { options } from "@/nextAuth/options";
import { getSubscriberDetails } from "@/controllers/subscribers";

export const metadata = {
  title: "Subscriber Details",
};

export default async function PlansPage({ params }) {
  const isAllow = await checkPermission("/subscribers");
  if (!isAllow) redirect("/");

  const { id } = params;
  const [session, subscriberResponse] = await Promise.all([
    getServerSession(options),
    getSubscriberDetails(id),
  ]);

  return (
    <>
      <DetailsPageHeader subscriber={subscriberResponse}>
        <DetailsWrapper subscriber={subscriberResponse} user={session.user} />
      </DetailsPageHeader>
    </>
  );
}
