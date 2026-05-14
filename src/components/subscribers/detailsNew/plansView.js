"use client";
import { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import style from "@/css/subscribers/subscribers.module.scss";
import PlanSectionAccordion from "./planSectionAccordion";
import { getPlanById } from "@/controllers/subscribers";

export default function PlansView({
  subscriber,
  user,
  planSlot,
  plan1Data,
  plan2Data,
  reloadPlan,
  reloadHistory,
  reloadBothPlan,
  isRedirected,
  setIsRedirected,
}) {
  const [plans, setPlans] = useState();

  useEffect(() => {
    const planId = plan1Data?.[0]?.plan;

    if (!planId) return;

    const fetchPlan = async () => {
      try {
        const res = await getPlanById(planId);
        setPlans(res);
      } catch (err) {
        console.error(
          "Error fetching plans:",
          err.response?.data || err.message,
        );
      }
    };

    fetchPlan();
  }, [plan1Data]);

  console.log("plans", plans);
  // const planDetails = planData.planDetails;
  // const excludePlans = planData.excludePlanDetails;

  // subscriber["planDetails"] = planDetails;
  // subscriber["isp_auto_renew"] = planData.isp_auto_renew;
  // subscriber["subscriber_auto_renew"] = planData.subscriber_auto_renew;
  // subscriber["autoRenewPlan"] = planData.autoRenewPlan;

  let showRenewal = false;

  //   if (
  //     planDetails.length > 0 &&
  //     getDateDifference(planDetails[0].end_date) >= 0 &&
  //     getDateDifference(planDetails[0].start_date) <= 0
  //   ) {
  //     showRenewal = true;
  //   }

  // useEffect(() => {
  //   if (!isRedirected) {
  //     const tempUrl = window.location.href.split("#");

  //     if (tempUrl.length > 1 && tempUrl[1].startsWith("plan" + planSlot)) {
  //       const interval = setInterval(() => {
  //         if (typeof jQuery != "undefined") {
  //           clearInterval(interval);

  //           if (
  //             tempUrl[1].endsWith(planSlot + "adv") &&
  //             jQuery("#" + tempUrl[1])
  //               .children()
  //               .children()
  //               .hasClass("collapsed")
  //           ) {
  //             setIsRedirected(!isRedirected);
  //             jQuery("#" + tempUrl[1])
  //               .children()
  //               .children()
  //               .trigger("click");
  //           }
  //         }
  //       }, 200);
  //     }
  //   }
  // }, []);

  return (
    <>
      <Accordion defaultActiveKey="0" className={style.subscriberAccordion}>
        <PlanSectionAccordion
          eventKey="0"
          sectionName={"Current Active Plan"}
          type="add"
          planDetails={plans}
          subscriber={subscriber}
          planSlot={planSlot}
          // excludePlans={excludePlans}
          reloadPlan={reloadPlan}
          reloadBothPlan={reloadBothPlan}
          reloadHistory={reloadHistory}
          identifier={`plan${planSlot}`}
          isRedirected={isRedirected}
          setIsRedirected={setIsRedirected}
        />

        {showRenewal && (
          <>
            <PlanSectionAccordion
              eventKey="1"
              sectionName="Advanced Renewal"
              type="renew"
              planDetails={plans ? plans : null}
              currentPlan={plans}
              subscriber={subscriber}
              // excludePlans={excludePlans}
              reloadPlan={reloadPlan}
              reloadBothPlan={reloadBothPlan}
              reloadHistory={reloadHistory}
              planSlot={planSlot}
              identifier={`plan${planSlot}adv`}
            />
            {subscriber.plan >= 0 && (
              <PlanSectionAccordion
                eventKey="2"
                sectionName="Auto Renewal"
                type="auto"
                planDetails={subscriber.autoRenewPlan}
                currentPlan={plans}
                subscriber={subscriber}
                user={user}
                excludePlans={excludePlans}
                reloadPlan={reloadPlan}
                reloadBothPlan={reloadBothPlan}
                reloadHistory={reloadHistory}
                planSlot={planSlot}
                identifier={`plan${planSlot}auto`}
              />
            )}
          </>
        )}
      </Accordion>
      {/* {plan1Data.length > 0 && (
        <div className={style.note}>
          If both Advanced &amp; Auto renewal are turned ON, advanced renewal
          will take precedence over auto renewal.
        </div>
      )} */}
    </>
  );
}
