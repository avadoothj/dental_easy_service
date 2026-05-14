"use client";

import CustomDataTable from "@/common/customDatatable";
import { getApprovalData } from "@/controllers/tender";
import { dateIOSConverter } from "@/utils/utils";
import Link from "next/link";

import { useEffect, useRef, useState } from "react";

export default function TenderApprovalListingTable() {
  const childRef = useRef();
  const [list, setList] = useState([]);
  const [srNo, setSrNo] = useState(1);

  const columns = [
    "SL NO",
    "TEB Number",
    "Tender Number",
    "Tender Title",
    "Country",
    "State",
    "Request By",
    "Created At"
  ];

  useEffect(() => {
    if (childRef.current) {
      childRef.current.reloadData();
    }
  }, []);

  return (
    <>
      <CustomDataTable
        apiCall={getApprovalData}
        setData={setList}
        setSrNo={setSrNo}
        columns={columns}
        placeholderText="Search by tender number, TEB number, title, organisation"
        ref={childRef}
        btnLink={null}
      >
        {list.map((item, index) => (
          <tr
            key={`${item.teb_number || item.tender_number || "tender"}-${index}`}
          >
            <td>{srNo + index}</td>
            <td>
              <Link href={`/tender-approve/${item.id}`}>
                {item.teb_number || "-"}
              </Link>
            </td>
            <td>{item.tender_number || "-"}</td>
            <td>{item.tender_title.slice(0, 30) || "-"} ...</td>
            <td>{item.tender_country || "-"}</td>
            <td>{item.tender_state || "-"}</td>
            <td>{item.user_name || "-"}</td>
            <td>{item.created_at ? dateIOSConverter(item.created_at) : "-"}</td>
          </tr>
        ))}
      </CustomDataTable>
    </>
  );
}
