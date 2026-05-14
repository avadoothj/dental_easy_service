"use client";
import { useEffect } from "react";
import Link from "next/link";
import CustomImage from "@/common/customImage";
import style from "@/css/subscribers/subscribers.module.scss";
import { webBackArrowIcon, mobileBackArrowIcon } from "@/utils/imagesPicker";

export default function DetailsPageHeader({ children, subscriber = null }) {
  useEffect(() => {
    document.body.className += " hamburgerHide";

    return () => {
      document.body.className = document.body.className.replace(
        "hamburgerHide",
        "",
      );
    };
  }, []);

  return (
    <>
      <div className="commonBackHeading">
        <div className="headingWrap">
          <Link href="/subscribers">
            <CustomImage
              src={webBackArrowIcon}
              className="web"
              width="20"
              height="18"
            />
            <CustomImage
              src={mobileBackArrowIcon}
              className="mweb"
              width="9"
              height="15"
            />
          </Link>
          {subscriber ? (
            <>
              <h1>Subscriber Details</h1>
              <div className="subscriberName">
                {subscriber.id}
                <span>{subscriber.name}</span>
              </div>
            </>
          ) : (
            <h1>Add Subscriber</h1>
          )}
        </div>
      </div>
      <div className={style.SubscriberDetails} id="headerWrapper">
        {children}
      </div>
    </>
  );
}
