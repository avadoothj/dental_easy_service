"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import style from "@/css/subscribers/subscribers.module.scss";
import DetailsView from "./detailsView";
import PlansView from "./plansView";
import HistoryView from "./historyView";
import PageViewNew from "../loading/pageViewNew";
import PlanViewLoading from "../loading/planViewLoading";
import HistoryLoading from "../loading/historyLoading";
import {
  getSubscriberHistoryNew,
  getSubscriberDetails,
} from "@/controllers/subscribers";

export default function DetailsWrapper({ subscriber, user, stateList }) {
  const [isRedirected, setIsRedirected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPlan1, setIsLoadingPlan1] = useState(false);
  const [isLoadingPlan2, setIsLoadingPlan2] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [plan1Data, setPlan1Data] = useState([]);
  const [plan2Data, setPlan2Data] = useState([]);
  const [plan1History, setPlan1History] = useState([]);
  const [plan2History, setPlan2History] = useState([]);

  const handleFetchHistoryData = async () => {
    setIsLoadingHistory(true);
    // setPlan1Data(subscriber.userPurchasesPlans.docs);
    const data = await getSubscriberDetails(subscriber.id);
    setIsLoadingHistory(false);

    setPlan1Data(data.userPurchasesPlans.docs);
    // if (data.success) {
    //   if (data.history1) {
    //     setPlan1History(data.history1);
    //   }
    //   if (data.history2) {
    //     setPlan2History(data.history2);
    //   }
    // }
  };

  useEffect(() => {
    const tempUrl = window.location.href.split("#");
    if (tempUrl.length > 1) {
      if (tempUrl[1] == "details" || tempUrl[1] == "history") {
        setActiveTab(tempUrl[1]);
      } else if (tempUrl[1] == "activate") {
        handleActivePlanClick(1);
      } else if (tempUrl[1].startsWith("plan1")) {
        setActiveTab("plan1");
      } else if (tempUrl[1].startsWith("plan2")) {
        setActiveTab("plan2");
      }
    }

    handleFetchHistoryData();
  }, []);

  useEffect(() => {
    if (typeof jQuery == "undefined") {
      const interval = setInterval(() => {
        if (typeof jQuery != "undefined") {
          clearInterval(interval);
          addRemoveClass();
        }
      }, 200);
    } else {
      addRemoveClass();
    }
  }, [activeTab]);

  const reloadPlan1 = () => {
    setPlan1Data(subscriber.userPurchasesPlans.docs);
  };

  const reloadBothPlan = () => {
    setPlan1Data(subscriber.userPurchasesPlans.docs);
  };

  const reloadHistory = () => {
    handleFetchHistoryData();
  };

  const addRemoveClass = () => {
    const elem = jQuery("#headerWrapper");
    if (activeTab == "details") {
      elem.addClass(style.SubscriberDetails);
      elem.removeClass(style.SubscriberPlans);
      elem.removeClass(style.SubscriberHistory);
    } else if (activeTab == "plan1") {
      elem.removeClass(style.SubscriberDetails);
      elem.addClass(style.SubscriberPlans);
      elem.removeClass(style.SubscriberHistory);
    } else if (activeTab == "plan2") {
      elem.removeClass(style.SubscriberDetails);
      elem.addClass(style.SubscriberPlans);
      elem.removeClass(style.SubscriberHistory);
    } else if (activeTab == "history") {
      elem.removeClass(style.SubscriberDetails);
      elem.removeClass(style.SubscriberPlans);
      elem.addClass(style.SubscriberHistory);
    }
  };

  const handleActivePlanClick = (planSlot = 1) => {
    setActiveTab("plan" + planSlot);

    const interval = setInterval(() => {
      if (jQuery("#activatePlanBtn").length > 0) {
        clearInterval(interval);
        jQuery("#activatePlanBtn").trigger("click");
      }
    }, 50);
  };

  const handleResetPlanPage = () => {
    handleFetchPlan1Data();
    handleFetchPlan2Data();

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <>
      <ul className={style.tabs}>
        <li
          className={activeTab == "details" ? style.active : ""}
          onClick={() => setActiveTab("details")}
        >
          Details
        </li>
        <li
          className={activeTab == "plan1" ? style.active : ""}
          onClick={() => setActiveTab("plan1")}
        >
          Plan
        </li>
        {/* {subscriber.status != "DIS" && (
          <li
            className={activeTab == "plan2" ? style.active : ""}
            onClick={() => setActiveTab("plan2")}
          >
            Plan 2
          </li>
        )} */}
        <li
          className={activeTab == "history" ? style.active : ""}
          onClick={() => setActiveTab("history")}
        >
          History
        </li>
      </ul>

      <>
        {activeTab == "details" &&
          (isLoading ? (
            <PageViewNew />
          ) : (
            <DetailsView
              subscriber={subscriber}
              user={user}
              stateList={stateList}
            />
          ))}
        {activeTab == "plan1" &&
          (isLoadingPlan1 ? (
            <PlanViewLoading />
          ) : (
            <PlansView
              subscriber={subscriber}
              user={user}
              planSlot={1}
              plan1Data={plan1Data}
              reloadPlan={reloadPlan1}
              reloadBothPlan={reloadBothPlan}
              reloadHistory={reloadHistory}
              isRedirected={isRedirected}
              setIsRedirected={setIsRedirected}
            />
          ))}
        {activeTab == "plan2" &&
          (isLoadingPlan2 ? (
            <PlanViewLoading />
          ) : (
            <PlansView
              subscriber={subscriber}
              user={user}
              planSlot={2}
              plan1Data={plan1Data}
              plan2Data={plan2Data}
              reloadPlan={reloadPlan2}
              reloadBothPlan={reloadBothPlan}
              reloadHistory={reloadHistory}
              isRedirected={isRedirected}
              setIsRedirected={setIsRedirected}
            />
          ))}
        {activeTab == "history" &&
          (isLoadingHistory ? (
            <HistoryLoading noOfItems="1" />
          ) : (
            <HistoryView
              plan1History={plan1History}
              plan2History={plan2History}
            />
          ))}
      </>

      <div className={style.btnWrapper}>
        <Link href="/subscribers" className="commonBtn borderBtn">
          All Subscribers
        </Link>
        {activeTab == "details" && subscriber.status != "CON" && (
          <button
            className="commonBtn dark"
            onClick={() => handleActivePlanClick(1)}
          >
            Activate Plan
          </button>
        )}
        {activeTab == "details" &&
          subscriber.status == "CON" &&
          subscriber.pl2_current_plan_bouquet_id == null && (
            <button
              className="commonBtn dark"
              onClick={() => handleActivePlanClick(2)}
            >
              <>
                Activate More Plan
                <span className={style.newTag}>New</span>
              </>
            </button>
          )}
        <button
          id="resetPlanPageBtn"
          onClick={handleResetPlanPage}
          className="d-none"
        ></button>
      </div>
    </>
  );
}
