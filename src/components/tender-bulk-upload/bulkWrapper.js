"use client";
import React from "react";
import { useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import BulkUpload from "./bulkUpload";
import SiteBulkUploadForm from "@/components/webPageWatcher/siteBulkUploadForm";
import style from "@/css/coupon/coupon.module.scss";

export default function BulkWrapper() {
  const [key, setKey] = useState("home");
  return (
    <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k) => setKey(k)}
      className="mb-3"
    >
      <Tab eventKey="home" title="Tender Bulk Upload" className={style["nav-link"]}>
        <BulkUpload />
      </Tab>
      <Tab eventKey="siteVisit" title="Link Add">
        <SiteBulkUploadForm />
      </Tab>
    </Tabs>
  );
}
