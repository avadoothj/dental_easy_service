"use client";
import { useContext, useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import moment from "moment-timezone";
import PlanInfo from "./planInfo";
import style from "@/css/subscribers/subscribers.module.scss";
import NoActivePlans from "./noActivePlans";
import PlansList from "./plansList";
import PlanSelect from "./planSelect";
import CommonModal from "@/components/common/commonModal";
import PlanInfoNoData from "./planInfoNoData";
import ConfirmPlanActivation from "./confirmPlanActivation";
import PlanActivationSuccess from "./planActivationSuccess";
import PlanSchedularSuccess from "./planSchedularSuccess";
import { currentDate, addNoOfDays } from "@/utils/dateHelper";
import { getConstant } from "@/utils/utils";
import {
  updateAutoRenewStatus,
  updateAutoRenewPlan,
} from "@/controllers/subscribers";
import { AppContext } from "@/contextProvider";
import ForceCancelPlan from "./forceCancelPlan";
import UpgradePlanList from "./upgradePlanList";
import UpgradePlanSelect from "./upgradePlanSelect";
import ConfirmPlanUpgrade from "./confirmPlanUpgrade";
import ViewHistoryModal from "./viewHistoryModal";

export default function PlanSectionAccordion({
  subscriber,
  planDetails,
  type,
  user,
  eventKey,
  currentPlan = {},
  sectionName,
  planSlot,
  excludePlans,
  reloadPlan,
  reloadHistory,
  reloadBothPlan,
  identifier,
  isRedirected = true,
  setIsRedirected = () => {},
}) {
  const { showAlert } = useContext(AppContext);

  const [currentStep, setCurrentStep] = useState(
    !planDetails && type == "renew" ? 1 : 0,
  );
  const [selectedPlan, setSelectedPlan] = useState({});
  const [keyword, setKeyword] = useState("");
  const [searchText, setSearchText] = useState("");
  const [showPlanConfirmModal, setShowPlanConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPlanCancelModal, setShowPlanCancelModal] = useState(false);
  const [autoRenewIsLoading, setAutoRenewIsLoading] = useState(false);
  const [dataEdited, setDataEdited] = useState(false);
  const [upgradePlanInfo, setUpgradePlanInfo] = useState({});
  const [autoRenewOnoff, setAutoRenewOnoff] = useState(
    subscriber.subscriber_auto_renew == 1 ? true : false,
  );
  const [showUpgradePlan, setShowUpgradePlanList] = useState(false);
  const [upgradePlanTitle, setUpgradePlanTitle] = useState(false);
  const [planUpgradeSteps, setPlanUpgradeStep] = useState(0);
  const [showUpgradeConfirmation, setShowUpgradeConfirmation] = useState(false);
  const [viewHistoryModal, setViewHistoryModal] = useState(false);
  const [isForceCancel, setIsForceCancel] = useState(false);

  const [planDate, setPlanDate] = useState(
    type == "renew" ? addNoOfDays(currentPlan.end_date, 1) : currentDate(),
  );

  useEffect(() => {
    const checkKeyword = setTimeout(() => {
      setSearchText(keyword);
    }, 500);

    return () => clearTimeout(checkKeyword);
  }, [keyword]);

  const prevStep = () => {
    setCurrentStep((value) => {
      return --value;
    });
  };

  const nextStep = () => {
    setCurrentStep((value) => {
      return ++value;
    });
  };

  const prevStepPlanUpgrade = () => {
    setPlanUpgradeStep((value) => {
      return --value;
    });
  };

  const nextStepPlanUpgrade = () => {
    setPlanUpgradeStep((value) => {
      return ++value;
    });
  };

  const toggleUpgradePlanBtn = () => {
    setShowUpgradePlanList(!showUpgradePlan);
    // setKeyword("");
  };

  useEffect(() => {
    if (showUpgradePlan) {
      setUpgradePlanTitle(true);
    } else {
      setUpgradePlanTitle(false);
    }
  }, [showUpgradePlan]);

  const handleUpgradePlanSelect = (item) => {
    setUpgradePlanInfo(item);
    nextStepPlanUpgrade();
  };

  const toggleUpgradePlanConfirmModal = () => {
    setShowUpgradeConfirmation(!showUpgradeConfirmation);
  };

  const togglePlanConfirmModal = () => {
    setShowPlanConfirmModal(!showPlanConfirmModal);
  };

  const toggleAutoRenew = () => {
    setAutoRenewOnoff(!autoRenewOnoff);
  };

  const togglePlanCancelModal = () => {
    setIsForceCancel(false);
    setShowPlanCancelModal(!showPlanCancelModal);
  };

  const toggleForcePlanCancelModal = () => {
    setIsForceCancel(true);
    setShowPlanCancelModal(!showPlanCancelModal);
  };

  const toggleHistoryModal = () => {
    setViewHistoryModal(!viewHistoryModal);
  };

  const handleActionClick = () => {
    setViewHistoryModal(true);
  };

  const changeAutoRenewStatus = async () => {
    const payload = {
      sub_id: subscriber.sub_id,
      status: autoRenewOnoff ? 1 : 0,
      plan_slot: planSlot,
    };

    if (user.user_type == "internal") {
      payload.oper_id = subscriber.oper_id;
      payload.oper_code = subscriber.oper_code;
    }

    setAutoRenewIsLoading(true);
    const response = await updateAutoRenewStatus(payload);
    setAutoRenewIsLoading(false);

    if (response.success) {
      setTimeout(() => {
        jQuery("#resetPlanPageBtn").trigger("click");
      }, 200);
      reloadBothPlan();
      reloadHistory();
      showAlert(response.msg, 1);
    } else {
      showAlert(response.msg);
    }
  };

  const changeAutoRenewPlan = async () => {
    const payload = {
      sub_id: subscriber.sub_id,
      bouquet_id: selectedPlan.bouquet_id,
      plan_slot: planSlot,
    };

    setAutoRenewIsLoading(true);
    const response = await updateAutoRenewPlan(payload);
    setAutoRenewIsLoading(false);

    if (response.success) {
      setTimeout(() => {
        jQuery("#resetPlanPageBtn").trigger("click");
      }, 1000);
      showAlert(response.msg, 1);
      reloadBothPlan();
      reloadHistory();
    } else {
      showAlert(response.msg);
    }
  };

  const togglePlanSuccessModal = () => {
    if (showSuccessModal) {
      setTimeout(() => {
        jQuery("#resetPlanPageBtn").trigger("click");
      }, 200);
    }
    setShowSuccessModal(!showSuccessModal);
  };

  const toggleSuccessModal = () => {
    setShowSuccessModal(true);
  };

  const handlePlanSelect = (planItem) => {
    setSelectedPlan(planItem);
    nextStep();
  };

  const inputMaxLength = getConstant("INPUT_MAXLENGTH");

  return (
    <>
      <Accordion.Item
        id={identifier}
        eventKey={eventKey}
        className={style.subscriberAccordionItem}
      >
        <Accordion.Header className={style.subscriberAccordionHeader}>
          {currentStep == 2 && type == "add"
            ? "Activate Plan for Subscriber"
            : upgradePlanTitle
              ? "Upgrade Plan"
              : sectionName}
        </Accordion.Header>
        <Accordion.Body className={style.subscriberAccordionBody}>
          {planDetails ? (
            <>
              {subscriber.subscriber_auto_renew == 0 && type == "auto" ? (
                <PlanInfoNoData />
              ) : showUpgradePlan ? (
                planUpgradeSteps == 0 ? (
                  <>
                    <div className={style.currentPlanwrap}>
                      <div className={style.currentPlanSearch}>
                        <input
                          type="text"
                          value={keyword}
                          onChange={(e) => setKeyword(e.target.value)}
                          placeholder="Search Plans"
                          maxLength={inputMaxLength}
                        />
                        {keyword.length > 0 && (
                          <div
                            onClick={() => setKeyword("")}
                            className={style.closeBtn}
                          ></div>
                        )}
                      </div>
                    </div>
                    <div className={style.McurrentPlanwrap}>
                      <div className={style.searchWrap}>
                        <h3>Plans</h3>
                        <div className={style.searchBtn}>
                          {keyword.length == 0 && (
                            <button
                              className={style.btnsearch}
                              onClick={() => {
                                jQuery("#sub_plan_search_mob").trigger("focus");
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={style.svgiconsearchmob}
                                viewBox="0 0 16 16"
                              >
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
                              </svg>
                            </button>
                          )}
                          <input
                            type="text"
                            value={keyword}
                            id="sub_plan_search_mob"
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Search"
                            maxLength={inputMaxLength}
                          />
                          {keyword.length > 0 && (
                            <div
                              onClick={() => setKeyword("")}
                              className={style.closeBtn}
                            ></div>
                          )}
                        </div>
                      </div>
                    </div>
                    <UpgradePlanList
                      toggleUpgradePlanBtn={toggleUpgradePlanBtn}
                      keyword={searchText}
                      planSlot={planSlot}
                      currentPlanId={planDetails.bouquet_id}
                      subId={subscriber.sub_id}
                      handleUpgradePlanSelect={handleUpgradePlanSelect}
                    />
                  </>
                ) : (
                  <UpgradePlanSelect
                    prevStep={prevStepPlanUpgrade}
                    upgradePlanInfo={upgradePlanInfo}
                    autoRenewIsLoading={autoRenewIsLoading}
                    toggleUpgradePlanConfirmModal={
                      toggleUpgradePlanConfirmModal
                    }
                  />
                )
              ) : (
                <PlanInfo
                  togglePlanCancelModal={togglePlanCancelModal}
                  toggleForcePlanCancelModal={toggleForcePlanCancelModal}
                  item={planDetails}
                  planSlot={planSlot}
                  type={type}
                  subscriber={subscriber}
                  toggleUpgradePlanBtn={toggleUpgradePlanBtn}
                  isRedirected={isRedirected}
                  setIsRedirected={setIsRedirected}
                />
              )}
              {type == "auto" && (
                <div className={style.subsPlanTable}>
                  <div className={style.plantableSec}>
                    <div
                      className={`${style.planRow1} ${style.AutoRenewalRow}`}
                    >
                      <div className={style.col}>Auto Renewal</div>
                      <div className={style.col}>
                        <div className={style.onoff}>
                          <span className={autoRenewOnoff ? "" : style.active}>
                            OFF
                          </span>
                          <div
                            onClick={() => {
                              setDataEdited(!dataEdited);
                              toggleAutoRenew();
                            }}
                            className={autoRenewOnoff ? style.active : ""}
                          ></div>
                          <span className={autoRenewOnoff ? style.active : ""}>
                            ON
                          </span>
                        </div>
                        <div
                          className={style.arHistory}
                          onClick={(e) => {
                            e.preventDefault();
                            handleActionClick();
                          }}
                        >
                          View History
                        </div>
                        <div className={style.btnWrapper2}>
                          {subscriber.subscriber_auto_renew == 1 && (
                            <button
                              type="button"
                              className="commonBtn borderBtn"
                              disabled={autoRenewIsLoading}
                              onClick={handleChangePlanClick}
                            >
                              {planDetails === null ? "Cancel" : "Change Plan"}
                            </button>
                          )}
                          <button
                            type="button"
                            className="commonBtn dark"
                            disabled={autoRenewIsLoading || !dataEdited}
                            onClick={changeAutoRenewStatus}
                          >
                            {autoRenewIsLoading
                              ? getConstant("LOADING_TEXT")
                              : "Confirm"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {currentStep == 0 && (
                <NoActivePlans handleActiveClick={nextStep} />
              )}
              {currentStep == 1 && (
                <>
                  <div className={style.currentPlanwrap}>
                    {/* {planCounts.price_not_set > 0 && (
                      <h4>
                        Price not set for {planCounts.price_not_set}/
                        {planCounts.total}
                        &nbsp;plans&nbsp;
                        <Link href="/plans">Set Price</Link>
                      </h4>
                    )} */}
                    <div className={style.currentPlanSearch}>
                      <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Search Plans"
                        maxLength={inputMaxLength}
                      />
                      {keyword.length > 0 && (
                        <div
                          onClick={() => setKeyword("")}
                          className={style.closeBtn}
                        ></div>
                      )}
                    </div>
                  </div>
                  <div className={style.McurrentPlanwrap}>
                    <div className={style.searchWrap}>
                      <h3>Plans</h3>
                      <div className={style.searchBtn}>
                        {keyword.length == 0 && (
                          <button
                            className={style.btnsearch}
                            onClick={() => {
                              jQuery("#sub_plan_search_mob").trigger("focus");
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className={style.svgiconsearchmob}
                              viewBox="0 0 16 16"
                            >
                              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
                            </svg>
                          </button>
                        )}
                        <input
                          type="text"
                          value={keyword}
                          id="sub_plan_search_mob"
                          onChange={(e) => setKeyword(e.target.value)}
                          placeholder="Search"
                          maxLength={inputMaxLength}
                        />
                        {keyword.length > 0 && (
                          <div
                            onClick={() => setKeyword("")}
                            className={style.closeBtn}
                          ></div>
                        )}
                      </div>
                    </div>
                    {/* {planCounts.price_not_set > 0 && (
                      <div className={style.setPriceWrap}>
                        <h4>
                          Price not set for {planCounts.price_not_set}/
                          {planCounts.total}
                          &nbsp;plans&nbsp;
                        </h4>
                        <Link href="/plans">Set Price</Link>
                      </div>
                    )} */}
                  </div>

                  <PlansList
                    keyword={searchText}
                    currentPlanId={currentPlan.bouquet_id}
                    handlePlanSelect={handlePlanSelect}
                    subId={subscriber.sub_id}
                    planDetails={planDetails}
                    excludePlans={excludePlans}
                    planSlot={planSlot}
                  />
                  {type == "auto" && planDetails == null && (
                    <div className={style.currentPlanCardButton}>
                      <button
                        className="commonBtn borderBtn"
                        onClick={handleChangePlanClick}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </>
              )}
              {currentStep == 2 && (
                <PlanSelect
                  type={type}
                  prevStep={prevStep}
                  planDate={planDate}
                  selectedPlan={selectedPlan}
                  autoRenewIsLoading={autoRenewIsLoading}
                  handlePlanConfirm={() => {
                    type == "auto"
                      ? changeAutoRenewPlan()
                      : togglePlanConfirmModal();
                  }}
                  setPlanDate={setPlanDate}
                />
              )}
            </>
          )}
        </Accordion.Body>
      </Accordion.Item>
      <CommonModal
        show={showPlanConfirmModal}
        className="setpricemodel"
        bodyClassName="setpricepad"
        handleClose={togglePlanConfirmModal}
        animation={false}
      >
        <ConfirmPlanActivation
          subscriber={subscriber}
          selectedPlan={selectedPlan}
          type={type}
          planDate={planDate}
          handleClose={togglePlanConfirmModal}
          toggleSuccessModal={toggleSuccessModal}
          planSlot={planSlot}
          reloadPlan={reloadPlan}
          reloadBothPlan={reloadBothPlan}
          reloadHistory={reloadHistory}
        />
      </CommonModal>
      <CommonModal
        show={showSuccessModal}
        className="setpricemodel"
        bodyClassName="setpricepad"
        handleClose={togglePlanSuccessModal}
        animation={false}
      >
        {(planDate && planDate > moment().format("YYYY-MM-DD")) ||
        type == "renew" ? (
          <PlanSchedularSuccess
            subscriber={subscriber}
            selectedPlan={selectedPlan}
            type={type}
            handleClose={togglePlanSuccessModal}
            startDate={planDate}
          />
        ) : (
          <PlanActivationSuccess
            subscriber={subscriber}
            selectedPlan={
              planUpgradeSteps == 1 ? upgradePlanInfo : selectedPlan
            }
            type={type}
            handleClose={togglePlanSuccessModal}
          />
        )}
      </CommonModal>
      <CommonModal
        className="setpricemodel"
        bodyClassName="setpricepad"
        animation={false}
        show={showPlanCancelModal}
        handleClose={togglePlanCancelModal}
      >
        <ForceCancelPlan
          isForceCancel={isForceCancel}
          subscriber={subscriber}
          handleClose={togglePlanCancelModal}
          planSlot={planSlot}
          reloadPlan={reloadPlan}
          reloadBothPlan={reloadBothPlan}
          reloadHistory={reloadHistory}
        />
      </CommonModal>
      <CommonModal
        show={showUpgradeConfirmation}
        className="setpricemodel"
        bodyClassName="setpricepad"
        handleClose={toggleUpgradePlanConfirmModal}
        animation={false}
      >
        <ConfirmPlanUpgrade
          subscriber={subscriber}
          selectedPlan={upgradePlanInfo}
          handleClose={toggleUpgradePlanConfirmModal}
          toggleSuccessModal={toggleSuccessModal}
          currentPlan={planDetails}
          reloadBothPlan={reloadBothPlan}
          reloadHistory={reloadHistory}
          planSlot={planSlot}
        />
      </CommonModal>
      <CommonModal
        show={viewHistoryModal}
        handleClose={toggleHistoryModal}
        animation={false}
        className="setpricemodel"
        bodyClassName="setpricepad"
      >
        <ViewHistoryModal
          sub_id={subscriber.sub_id}
          handleClose={toggleHistoryModal}
          planSlot={planSlot}
        />
      </CommonModal>
    </>
  );
}
