import Link from "next/link";
import style from "@/css/subscribers/subscribers.module.scss";
import SimpleTooltip from "@/common/simpleTooltip";
import { subscriberStatusInfo } from "@/utils/masterData";
import messages from "@/utils/messages";

export default function Card({ item, planMap }) {
  let subscriberStatus = "";
  let statusStyle = "";
  let statusInfo = "";

  const planId = item.userPurchasesPlans?.docs?.[0]?.plan;
  const planName = planMap?.[planId] || "No Plan Active";

  if (item.userPurchasesPlans?.docs?.[0]?.is_active == true) {
    subscriberStatus = "Active";
    statusStyle = style.avtive;
  }

  statusInfo =
    subscriberStatusInfo[subscriberStatus.toLowerCase(subscriberStatus)];

  return (
    <Link href={`/subscribers/details/${item.id}`}>
      <div className={style.inbox}>
        <div className={style.tname}>
          {item.name ? (
            <SimpleTooltip text={item.sub_name}>
              <div className={style.tnamelft}>
                <span>{item.email}</span>
                {item.name}
              </div>
            </SimpleTooltip>
          ) : (
            <div className={style.tnamelft}>----</div>
          )}
        </div>

        <div className={style.topname}>
          <div className={style.topnamesec}>
            <p className={style.tptxt}>Mobile</p>
            <p className={style.btmtxt}>{item.phone ?? "---"}</p>
          </div>
          <div className={style.topnamesec}>
            <p className={style.tptxt}>Status</p>
            <div className={`${style.btmtxt} ${statusStyle}`}>
              <SimpleTooltip text={statusInfo}>
                <div className={style.tnamelft}>
                  <span>{subscriberStatus}</span>
                </div>
              </SimpleTooltip>
            </div>
          </div>
        </div>

        <div className={style.topname}>
          {item.display_status == "Scheduled" ? (
            <>
              <div className={style.topnamesec}>
                <SimpleTooltip text={messages.DISABLED_UPGRADE}>
                  <span
                    className={`${style.cardActionButton} ${style.disabled}`}
                    onClick={(e) => e.preventDefault()}
                  >
                    Upgrade
                  </span>
                </SimpleTooltip>
              </div>
              <div className={style.topnamesec}>
                <SimpleTooltip text={messages.DISABLED_ADVANCE_RENEWAL}>
                  <span
                    className={`${style.cardActionButton} ${style.disabled}`}
                    onClick={(e) => e.preventDefault()}
                  >
                    Advance Renewal
                  </span>
                </SimpleTooltip>
              </div>
            </>
          ) : (
            <>
              <div className={style.topnamesec}>
                {item.userPurchasesPlans.docs[0]?.is_active == true ? (
                  <SimpleTooltip text={messages.SUBSCRIBER_UPGRADE_ACTION}>
                    <Link
                      href={`/subscribers/details/${item.id}#plan1upgrade`}
                      className={style.cardActionButton}
                    >
                      Upgrade
                    </Link>
                  </SimpleTooltip>
                ) : (
                  <SimpleTooltip text={messages.PLAN_NOT_FOUND_UPGRADE}>
                    <span
                      className={`${style.cardActionButton} ${style.disabled}`}
                      onClick={(e) => e.preventDefault()}
                    >
                      Upgrade
                    </span>
                  </SimpleTooltip>
                )}
              </div>
              <div className={style.topnamesec}>
                <SimpleTooltip text={messages.ADVANCE_RENEWAL_ACTION}>
                  <Link
                    href={`/subscribers/details/${item.id}#plan1adv`}
                    className={style.cardActionButton}
                  >
                    Advance Renewal
                  </Link>
                </SimpleTooltip>
              </div>
            </>
          )}
        </div>

        <div className={style.btmname}>
          <div className={style.topnamesec}>
            <p className={style.tptxt}>Plan Name</p>
            <p className={style.btmtxt}>{planName}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
