"use client";

import CustomDataTable from "@/common/customDatatable";
import { tenderData } from "@/controllers/tender";
import { tenderStatus } from "@/utils/masterData";
import { dataTrim, dateIOSConverter, formatDate } from "@/utils/utils";
import Link from "next/link";

import { useEffect, useRef, useState } from "react";

export default function TenderListingTable() {
  const childRef = useRef();
  const [list, setList] = useState([]);
  const [srNo, setSrNo] = useState(1);
  const hasPublishedTender = list.some(
    (item) => String(item?.status || "").toLowerCase() === "published",
  );

  const columns = [
    "SL NO",
    "TEB Number",
    "Tender Number",
    "Tender Title",
    "Country",
    "State",
    "Status",
    "Last Action",
    ...(hasPublishedTender ? ["View Page"] : []),
  ];

  const extraFilters = [
    {
      label: "Status",
      filter: "status",
      data: tenderStatus,
    },
  ];

  useEffect(() => {
    if (childRef.current) {
      childRef.current.reloadData();
    }
  }, []);

  const statusData = (id) => {
    const status = tenderStatus.find((v) => v.id === id);
    return status ? status.label : "";
  };
  return (
    <>
      <CustomDataTable
        apiCall={tenderData}
        setData={setList}
        setSrNo={setSrNo}
        columns={columns}
        placeholderText="Search by tender number, TEB number, title, organisation"
        ref={childRef}
        btnLink={{ label: "Create Tender", link: "/tenders/create-tender", hidePlus: true }}
        extraFilters={extraFilters}
      >
        {list.map((item, index) => {
          const normalizedStatus = String(item?.status || "").toLowerCase();
          const isDraft =
            normalizedStatus === "draft" || normalizedStatus === "rejected" || normalizedStatus === "filtered";
          const isPublished = normalizedStatus === "published";

          return (
            <tr
              key={`${item.teb_number || item.tender_number || "tender"}-${index}`}
            >
              <td>{srNo + index}</td>
              <td>
                <Link href={!isDraft ? `/tenders/view/${item.id}` : `/tenders/edit/${item.id}`}>
                  {item.teb_number || "-"}
                </Link>
              </td>
              <td>{dataTrim(item.tender_number) || "-"}</td>
              <td>{dataTrim(item.tender_title) || "-"}</td>
              <td>{item.tender_country || "-"}</td>
              <td>{item.tender_state || "-"}</td>
              <td>{dataTrim(statusData(item.status))}</td>
              <td>
                {item.last_action ? formatDate(item.last_action,6) : "-"}
              </td>
              {hasPublishedTender && (
                <td>{isPublished ? <Link href={`${process.env.NEXT_PUBLIC_TENDER_FRONTEND_DOMAIN}/${item.slug}`}>view</Link> : "-"}</td>
              )}
            </tr>
          );
        })}
      </CustomDataTable>
    </>
  );
}
