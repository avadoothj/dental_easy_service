"use client";
import { useState, useRef, useEffect } from "react";
import { getProjectList } from "@/controllers/project";
import CustomDataTable from "@/common/customDatatable";
import { dateIOSConverter } from "@/utils/utils";

export default function ProjectListTable() {
  const childRef = useRef();
  const [list, setList] = useState([]);
  const [srNo, setSrNo] = useState(1);

  useEffect(() => {
    if (childRef.current) {
      childRef.current.reloadData();
    }
  }, []);

  const columns = [
    "SL NO",
    "Project Name",
    "Country",
    "Purchaser Email",
    "Completion Date",
    "Status",
    "Document"
    ];
  return (
    <>
      <CustomDataTable
        apiCall={getProjectList}
        setData={setList}
        setSrNo={setSrNo}
        columns={columns}
        placeholderText="Search by project name"
        ref={childRef}
        btnLink={{ label: "Add Project", link: "/project-list/add-project", hidePlus: true }}
      >
        {list.map((item, index) => {
          return (
          <tr key={item.id || index}>
            <td>{srNo + index}</td>
            <td>{item.project_name || "-"}</td> 
            <td>{item.project_country || "-"}</td>
            <td>{item.purchaser_email || "-"}</td>
            <td>{item.project_completion_date && dateIOSConverter(item.project_completion_date) || "-"}</td>
            <td>{item.project_status || "-"}</td>
            <td>{item.document ? (
              <a href={item.document} target="_blank" rel="noopener noreferrer">
                Document
              </a>
            ) : "-"}</td>
          </tr>
          );
        })}
      </CustomDataTable>
    </>
  );
}