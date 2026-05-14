"use client";

import CustomDataTable from "@/common/customDatatable";
import CommonModal from "@/common/commonModal";
import { formatDate } from "@/utils/utils";
import { useEffect, useRef, useState, useContext } from "react";
import { getSenderList, deleteSender } from "@/controllers/sender";
import { AppContext } from "@/contextProvider";
import commonStyle from "@/css/common/common.module.scss";

export default function SenderList() {
  const childRef = useRef();
  const { showAlert } = useContext(AppContext);

  const [list, setList] = useState([]);
  const [srNo, setSrNo] = useState(1);

  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const columns = ["SL NO", "Email", "Created At", "Action"];

  useEffect(() => {
    childRef.current?.reloadData();
  }, []);

  const handleDelete = (item) => {
    setSelectedItem(item);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    const res = await deleteSender(selectedItem.id);
    setLoading(false);

    if (res.success) {
      showAlert(res.msg, 1);
      setDeleteModal(false);
      childRef.current?.reloadData();
    } else {
      showAlert(res.msg);
    }
  };

  return (
    <>
      <CustomDataTable
        apiCall={getSenderList}
        setData={setList}
        setSrNo={setSrNo}
        columns={columns}
        placeholderText="Search email..."
        ref={childRef}
        btnLink={{
          label: "Add Sender",
          link: "/senders/create",
        }}
      >
        {list.map((item, index) => (
          <tr key={item.id}>
            <td>{srNo + index}</td>
            <td>{item.email}</td>
            <td>{formatDate(item.created_at, 5)}</td>
            <td>
              <span
                onClick={() => handleDelete(item)}
                className={`${commonStyle.small} ${commonStyle.light}`}
                style={{ cursor: "pointer" }}
              >
                Delete
              </span>
            </td>
          </tr>
        ))}
      </CustomDataTable>

      <CommonModal show={deleteModal} handleClose={() => setDeleteModal(false)}>
        <div style={{ padding: 10 }}>
          <p>Delete this sender?</p>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={confirmDelete}
              className={commonStyle.commonBtn}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Yes"}
            </button>

            <button
              onClick={() => setDeleteModal(false)}
              className={commonStyle.commonBtn + " " + commonStyle.stroke}
            >
              No
            </button>
          </div>
        </div>
      </CommonModal>
    </>
  );
}
