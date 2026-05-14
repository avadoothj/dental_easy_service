"use client";

import { useState, useContext, useEffect } from "react";
import { formatDate, formatPrice } from "@/utils/utils";
import style from "@/css/subscribers/subscribers.module.scss";
import SimpleTooltip from "@/components/common/simpleTooltip";
import messages from "@/utils/messages";
import CommonModal from "@/common/commonModal";
import { AppContext } from "@/contextProvider";
import { checkOttActivationStatus } from "@/controllers/subscribers";
import OttStatusCheckModal from "./ottStatusCheckModal";
import { getDateDifference } from "@/utils/dateHelper";

export default function PlanInfo({
  item,
  type,
  toggleUpgradePlanBtn,
  subscriber,
  planSlot = 1,
  isRedirected,
  setIsRedirected,
}) {
  const { showAlert } = useContext(AppContext);

  let viewReceiptLink =
    "/subscribers/receipt/" + subscriber.sub_id + "-" + planSlot;

  if (type == "renew") {
    viewReceiptLink += "-adv";
  }

  const isFutureSubscription =
    getDateDifference(item.end_date) >= 0 &&
    getDateDifference(item.start_date) <= 0
      ? false
      : true;

  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isActivationLoading, setIsActivationLoading] = useState(false);
  const [showOttStatusModal, setShowOttStatusModal] = useState(false);
  const [activationInfo, setActivationInfo] = useState({ status: "loading" });

  const togglePreviewModal = () => {
    if (!isLoading) {
      setShowPreviewModal(!showPreviewModal);
    }
  };

  const toggleOttStatusModal = () => {
    setShowOttStatusModal(!showOttStatusModal);
  };

  useEffect(() => {
    if (!isRedirected) {
      const tempUrl = window.location.href.split("#");

      if (tempUrl.length > 1 && tempUrl[1].startsWith("plan" + planSlot)) {
        const interval = setInterval(() => {
          if (typeof jQuery != "undefined") {
            clearInterval(interval);
            setIsRedirected(!isRedirected);

            if (
              tempUrl[1].endsWith(planSlot + "upgrade") &&
              item.upgrade_packs
            ) {
              toggleUpgradePlanBtn();
            }
          }
        }, 200);
      }
    }
  }, []);

  const handleFormSubmit = async () => {
    const payload = {
      sub_id: subscriber.sub_id,
      oper_id: subscriber.oper_id,
    };

    let response;

    setIsLoading(true);
    // if (addonFor == "jio_star") response = await jioStarUpgradeRequest(payload);
    // if (addonFor == "prime_video")
    //   response = await primeVideoUpgradeRequest(payload);
    setIsLoading(false);

    if (response.success) {
      togglePreviewModal();
      // showAlert(
      //   addonFor == "jio_star"
      //     ? messages.JIOSTAR_ADDON_UPDATED
      //     : messages.PRIME_VIDEO_ADDON_UPDATED,
      //   1,
      // );
      setTimeout(() => {
        jQuery("#resetPlanPageBtn").trigger("click");
      }, 200);
    } else {
      showAlert(response.msg);
    }
  };

  const checkApvActivationStatus = async () => {
    const payload = {
      sub_id: subscriber.sub_id,
      plan_slot: planSlot,
      ott: "apv",
    };

    setIsActivationLoading(true);
    const response = await checkOttActivationStatus(payload);
    setIsActivationLoading(false);

    if (response.success) {
      toggleOttStatusModal();
      setActivationInfo({
        msg: response.msg,
        status: response.status,
        recovery_link: response.recovery_link ?? null,
        activation_url: response.activation_url ?? null,
      });
    } else {
      showAlert(response.msg);
    }
  };

  return (
    <>
      <div className={style.subsPlanTable}>
        <>
          <h3 className={style.heading}>
            <span>{item.name}</span>
          </h3>

          {/* <div className={style.plantableSec}>
            <div className={style.planRow1}>
              <div className={style.col3}>
                <div className={style.tableData3}>
                  <div className={style.tableDataCol3}>
                    <div>Start Date</div>
                    <div>
                      <b>
                        {formatDate(
                          subscriber.userPurchasesPlans.docs[0]?.start_date,
                        )}
                      </b>
                    </div>
                  </div>
                  <div className={style.tableDataCol3}>
                    <div>Expiry Date</div>
                    <div>
                      <b>
                        {formatDate(
                          subscriber.userPurchasesPlans.docs[0]?.end_date,
                        )}
                      </b>
                    </div>
                  </div>
                  <div className={style.tableDataCol3}>
                    <div>Status</div>
                    <div>
                      <b>
                        {subscriber.userPurchasesPlans.docs[0]?.is_active ===
                        true
                          ? "Active"
                          : "Inactive"}
                      </b>
                    </div>
                  </div>

                  <div className={style.tableDataCol3}>
                    <div>Your Price</div>
                    <div>
                      <b>{formatPrice(item.lco_price)}</b>
                    </div>
                  </div>
                  {item.features && item.features.length > 0 && (
                    <div>
                      <div>Features</div>
                      <div>
                        <ul>
                          {item.features.map((feature, index) => (
                            <li key={index}>
                              <b>{feature.featureLabel}</b>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div> */}

          <div className="p-3">
            <div className="row g-3">
              <div className="col-6">
                <div className="text-muted small">Start Date</div>
                <div className="fw-semibold">
                  {formatDate(
                    subscriber.userPurchasesPlans.docs[0]?.start_date,
                  )}
                </div>
              </div>

              <div className="col-6">
                <div className="text-muted small">Expiry Date</div>
                <div className="fw-semibold">
                  {formatDate(subscriber.userPurchasesPlans.docs[0]?.end_date)}
                </div>
              </div>

              <div className="col-6">
                <div className="text-muted small">Status</div>
                <span
                  className={`badge ${
                    subscriber.userPurchasesPlans.docs[0]?.is_active
                      ? "bg-success"
                      : "bg-danger"
                  }`}
                >
                  {subscriber.userPurchasesPlans.docs[0]?.is_active
                    ? "Active"
                    : "Inactive"}
                </span>
              </div>

              <div className="col-6">
                <div className="text-muted small">Your Price</div>
                <div className="fw-semibold">
                  {formatPrice(item.price)}
                  <span className="text-muted">
                    {" "}
                    + {item.gstPercentage}% GST
                  </span>
                </div>
              </div>
            </div>

            {item.features && item.features.length > 0 && (
              <div className="mt-3">
                <div className="fw-semibold mb-2">Features</div>
                <div className="d-flex flex-wrap gap-2">
                  {item.features.map((feature, index) => (
                    <span
                      key={index}
                      className="badge bg-light text-dark border"
                    >
                      {feature.featureLabel}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>

        {type != "auto" && (
          <div className={style.plantableSec}>
            <div className={`${style.planRow1} ${style.viewReceipt}`}>
              <div className={style.receiptBtnwrap}>
                {/* <Link
                  href={viewReceiptLink}
                  target="_blank"
                  className={style.receiptanchor}
                >
                  View Receipt
                </Link> */}

                {type == "add" && (
                  <>
                    {isFutureSubscription ? (
                      <SimpleTooltip text={messages.DISABLED_UPGRADE}>
                        <button className="commonBtn dark" disabled={true}>
                          Upgrade Plan
                        </button>
                      </SimpleTooltip>
                    ) : (
                      <>
                        {item.upgrade_packs ? (
                          <button
                            onClick={toggleUpgradePlanBtn}
                            className="commonBtn dark"
                          >
                            Upgrade Plan
                          </button>
                        ) : (
                          <SimpleTooltip text={messages.PLAN_NOT_FOUND_UPGRADE}>
                            <button className="commonBtn dark" disabled={true}>
                              Upgrade Plan
                            </button>
                          </SimpleTooltip>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
              <span>&nbsp;</span>
              {/* <div className="threedotpop">
                <Dropdown>
                  <Dropdown.Toggle className="threedot" id="dropdown-basic">
                    <span>&#x2026;</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={togglePlanCancelModal}>
                      Cancel Plan
                    </Dropdown.Item>
                    {user?.role_id == getConstant("SUPER_ADMIN_ROLE_ID") && (
                      <Dropdown.Item onClick={toggleForcePlanCancelModal}>
                        Force Cancel Plan
                      </Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </div> */}
            </div>
          </div>
        )}
      </div>

      <CommonModal
        show={showOttStatusModal}
        handleClose={toggleOttStatusModal}
        centered={true}
      >
        <OttStatusCheckModal
          activationInfo={activationInfo}
          handleClose={toggleOttStatusModal}
        />
      </CommonModal>
    </>
  );
}
