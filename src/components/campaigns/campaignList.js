"use client";

import CustomDataTable from "@/common/customDatatable";
import { getCampaignList } from "@/controllers/campaign";
// import { tenderStatus } from "@/utils/masterData";
import { formatDate } from "@/utils/utils";
import { useEffect, useRef, useState } from "react";

export default function CampaignList() {
  const childRef = useRef();
  const [list, setList] = useState([]);
  const [srNo, setSrNo] = useState(1);

  const columns = ["SL NO", "Subject", "Send By", "sechuleAt", "status"];

  //   const extraFilters = [
  //     {
  //       label: "Status",
  //       filter: "status",
  //       data: tenderStatus,
  //     },
  //   ];

  useEffect(() => {
    if (childRef.current) {
      childRef.current.reloadData();
    }
  }, []);

  //   const statusData = (id) => {
  //     const status = tenderStatus.find((v) => v.id === id);
  //     return status ? status.label : "";
  //   };

  return (
    <>
      <CustomDataTable
        apiCall={getCampaignList}
        setData={setList}
        setSrNo={setSrNo}
        columns={columns}
        placeholderText="Search"
        ref={childRef}
        btnLink={{
          label: "Create Campaign",
          link: "/campaigns/create",
          hidePlus: true,
        }}
        // extraFilters={extraFilters}
      >
        {list.map((item, index) => {
          const statusText =
            item.status === 0 ? "Pending" : item.status === 1 ? "Done" : "-";

          return (
            <tr key={index}>
              <td>{srNo + index}</td>
              <td>{item.subject || "-"}</td>
              <td>{item.sender_email || "-"}</td>
              <td>{formatDate(item.schedule_at, 5) || "-"}</td>
              <td>{statusText}</td>
            </tr>
          );
        })}
      </CustomDataTable>
    </>
  );
}
