"use client";

import CustomDataTable from "@/common/customDatatable";
import { tenderStatus } from "@/utils/masterData";
import { dataTrim, dateIOSConverter, formatDate } from "@/utils/utils";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { leadList } from "@/controllers/leadController";

export default function LeadList() {
  const childRef = useRef();
  const [list, setList] = useState([]);
  const [srNo, setSrNo] = useState(1);
  const hasPublishedTender = list.some(
    (item) => String(item?.status || "").toLowerCase() === "published",
  );

  const columns = [
    "SL NO",
    "Client Name",
    "Client Email",
    "interest",
    "keywords",
    "Tender types",
    "result length",
  ];

  useEffect(() => {
    if (childRef.current) {
      childRef.current.reloadData();
    }
  }, []);

  return (
    <>
      <CustomDataTable
        apiCall={leadList}
        setData={setList}
        setSrNo={setSrNo}
        columns={columns}
        placeholderText="Search by"
        ref={childRef}
        btnLink={{
          label: "Create Lead",
          link: "/api-lead/create",
          hidePlus: true,
        }}
      >
        {list.map((item, index) => {
          return (
            <tr key={`${item.id}`}>
              <td>{srNo + index}</td>
              <td>{item.client_name || "-"}</td>
              <td>{item.client_email || "-"}</td>
              <td>{item.interest_level || "-"}</td>
              <td>
                {Array.isArray(item.keywords) && item.keywords.length > 0
                  ? item.keywords.join(", ")
                  : "-"}
              </td>
              <td>
                {Array.isArray(item.tender_types) &&
                item.tender_types.length > 0
                  ? item.tender_types.join(", ")
                  : "-"}
              </td>{" "}
              <td>{item.result_length || "-"}</td>
            </tr>
          );
        })}
      </CustomDataTable>
    </>
  );
}
