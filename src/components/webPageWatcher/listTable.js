"use client";

import CommonModal from "@/common/commonModal";
import CustomDataTable from "@/common/customDatatable";
import AddLinkForm from "@/components/webPageWatcher/addLinkForm";
import { AppContext } from "@/contextProvider";
import {
  deleteSiteVisitData,
  editPendingSiteAction,
  getWebPageWatcherList,
  updateSiteVisitData,
} from "@/controllers/webPageWatcher";
import { siteVisitStatus } from "@/utils/masterData";
import { dateIOSConverter, getConstant } from "@/utils/utils";
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";
import commonStyle from "@/css/common/common.module.scss";

export default function ListTable({
  listType = "total",
  title = "All Links",
  userId,
}) {
  const childRef = useRef();
  const { showAlert } = useContext(AppContext);
  const [list, setList] = useState([]);
  const [srNo, setSrNo] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [editConfirmationModal, setEditConfirmationModal] = useState(false);
  const [pendingEditData, setPendingEditData] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(siteVisitStatus[0].id);
  const showEditAction = selectedStatus === "changes";
  const selectedCommentList = Array.isArray(selectedItem?.comment_list)
    ? selectedItem.comment_list
    : [];

  const columns = [
    "SL NO",
    "Link",
    "Country",
    "Groups",
    "Notice Type",
    "last visited",
    "Action",
  ];

  useEffect(() => {
    if (childRef.current) {
      childRef.current.reloadData({ userId });
    }
  }, [userId]);

  useEffect(() => {
    setSelectedStatus(siteVisitStatus[0].id);
  }, [listType]);

  const handleRemarkClick = (item) => {
    setSelectedItem(item);
    setComment("");
    setShowRemarkModal(true);
  };

  const handleViewClick = (item) => {
    setSelectedItem(item);
    setViewModal(true);
  };

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleCloseViewModal = () => {
    setViewModal(false);
    setSelectedItem(null);
  };

  const handleDeleteData = (item) => {
    setSelectedItem(item);
    setDeleteModal(true);
  };

  const handleCloseModal = (forceClose = false) => {
    if (isSubmitting && !forceClose) {
      return;
    }

    setShowRemarkModal(false);
    setShowEditModal(false);
    setEditConfirmationModal(false);
    setSelectedItem(null);
    setPendingEditData(null);
    setComment("");
  };

  const handleSubmitPendingSite = async () => {
    if (!selectedItem) return;
    if (!comment.trim()) {
      showAlert("Please enter comment");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await editPendingSiteAction({
        ...selectedItem,
        comment,
        userId,
      });

      if (response.success) {
        showAlert(response.msg, 1);
        handleCloseModal(true);
        childRef.current?.reloadData({ userId });
      } else {
        showAlert(response.msg);
      }
    } catch (error) {
      showAlert(error?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const extraFilters = [
    {
      label: "Status",
      filter: "status",
      data: siteVisitStatus,
    },
  ];
  const handleDeleteClick = async () => {
    const result = await deleteSiteVisitData(selectedItem.id);
    if (result.success) {
      setDeleteModal(false);
      setSelectedItem(null);
      showAlert(result.msg, 1);
      childRef.current?.reloadData({ userId });
    }
  };

  const handleEditFormSuccess = async (formPayload) => {
    setPendingEditData(formPayload);
    setEditConfirmationModal(true);
  };

  const handleUpdateLink = async () => {
    if (!selectedItem?.id || !pendingEditData) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await updateSiteVisitData(
        selectedItem.id,
        pendingEditData,
      );

      if (result.success) {
        showAlert(result.msg, 1);
        setEditConfirmationModal(false);
        setShowEditModal(false);
        setSelectedItem(null);
        setPendingEditData(null);
        childRef.current?.reloadData({ userId });
      } else {
        showAlert(result.msg);
      }
    } catch (error) {
      showAlert(error?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <CustomDataTable
        apiCall={getWebPageWatcherList}
        setData={setList}
        setSrNo={setSrNo}
        columns={columns}
        placeholderText="Search by URL link"
        ref={childRef}
        btnLink={{
          label: "Add Link",
          link: "/site-visit/add-link",
          hidePlus: true,
        }}
        extraFilters={extraFilters}
        onExtraFiltersChange={(filters) => {
          setSelectedStatus(filters.status ?? "");
        }}
      >
        {list.map((item, index) => (
          <tr key={item.id || index}>
            <td>{srNo + index}</td>
            <td>
              <Link href={item.url_link} target="_blank">
                {item?.url_link?.slice(0, 40) || "-"}
              </Link>
            </td>
            <td>{item.country || "-"}</td>
            <td>{item.groups || "-"}</td>
            <td>{item.notice_type || "-"}</td>
            <td>
              {item.last_visited_date
                ? dateIOSConverter(item.last_visited_date)
                : "-"}
            </td>
            <td>
              {[
                {
                  label: "Edit",
                  action: () => handleEditClick(item),
                },
                {
                  label: "View",
                  action: () => handleViewClick(item),
                },
                {
                  label: "Delete",
                  action: () => handleDeleteData(item),
                },
                showEditAction && {
                  label: "Remark",
                  action: () => handleRemarkClick(item),
                },
              ]
                .filter(Boolean)
                .map((btn, index, arr) => (
                  <span key={index}>
                    <span
                      onClick={btn.action}
                      className={`${commonStyle.small} ${commonStyle.light}`}
                      style={{ cursor: "pointer" }}
                    >
                      {btn.label}
                    </span>
                    {index < arr.length - 1 && <span className="mx-2">|</span>}
                  </span>
                ))}
            </td>
          </tr>
        ))}
      </CustomDataTable>
      <CommonModal
        show={deleteModal}
        handleClose={() => setDeleteModal(false)}
        centered={true}
      >
        <div style={{ padding: "8px" }}>
          <p
            style={{ marginBottom: "12px", color: "#4b5563", fontSize: "14px" }}
          >
            Are you sure you want to delete this link?
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              marginTop: "16px",
            }}
          >
            <button
              type="button"
              className={commonStyle.commonBtn}
              onClick={handleDeleteClick}
              disabled={isSubmitting}
            >
              {isSubmitting ? getConstant("LOADING_TEXT") : "Yes"}
            </button>
            <button
              type="button"
              className={commonStyle.commonBtn + " " + commonStyle.stroke}
              onClick={() => setDeleteModal(false)}
              disabled={isSubmitting}
            >
              No
            </button>
          </div>
        </div>
      </CommonModal>
      <CommonModal
        show={viewModal}
        handleClose={handleCloseViewModal}
        centered={true}
      >
        <div style={{ padding: "8px" }}>
          <h4
            style={{
              margin: "0 0 16px",
              fontSize: "20px",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Comment List
          </h4>
          <div
            style={{
              marginBottom: "12px",
              fontSize: "13px",
              color: "#374151",
              wordBreak: "break-word",
            }}
          >
            {selectedItem?.url_link || "-"}
          </div>
          <p
            style={{
              marginBottom: "16px",
              color: "#4b5563",
              fontSize: "14px",
            }}
          >
            Total users commented: {selectedItem?.comment_user_count || 0}
          </p>
          <div style={{ maxHeight: "420px", overflowY: "auto" }}>
            {selectedCommentList.length > 0 ? (
              selectedCommentList.map((commentItem, index) => (
                <div
                  key={commentItem.id || `${commentItem.user_id}-${index}`}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "12px",
                    marginBottom: "12px",
                    backgroundColor: "#f9fafb",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "12px",
                      marginBottom: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    <strong style={{ color: "#111827", fontSize: "14px" }}>
                      {commentItem.user_name ||
                        commentItem.login_id ||
                        `User ${commentItem.user_id || "-"}`}
                    </strong>
                    <span style={{ color: "#6b7280", fontSize: "12px" }}>
                      {commentItem.created_at
                        ? dateIOSConverter(commentItem.created_at)
                        : "-"}
                    </span>
                  </div>
                  <div style={{ color: "#6b7280", fontSize: "12px" }}>
                    Login ID: {commentItem.login_id || "-"}
                  </div>
                  <p
                    style={{
                      margin: "8px 0 0",
                      color: "#374151",
                      fontSize: "14px",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {commentItem.comment || "-"}
                  </p>
                </div>
              ))
            ) : (
              <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>
                No comments found for this link.
              </p>
            )}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "16px",
            }}
          >
            <button
              type="button"
              className={commonStyle.commonBtn + " " + commonStyle.stroke}
              onClick={handleCloseViewModal}
            >
              Close
            </button>
          </div>
        </div>
      </CommonModal>
      <CommonModal
        show={showRemarkModal}
        handleClose={handleCloseModal}
        centered={true}
      >
        <div style={{ padding: "8px" }}>
          <h4
            style={{
              margin: "0 0 16px",
              fontSize: "20px",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Update Pending Site
          </h4>
          <p
            style={{ marginBottom: "12px", color: "#4b5563", fontSize: "14px" }}
          >
            Add comment and move this entry to site visit user.
          </p>
          <div
            style={{
              marginBottom: "12px",
              fontSize: "13px",
              color: "#374151",
              wordBreak: "break-word",
            }}
          >
            {selectedItem?.url_link || "-"}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter comment"
            className={commonStyle.formControl}
            rows={3}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              marginTop: "16px",
            }}
          >
            <button
              type="button"
              className={commonStyle.commonBtn}
              onClick={handleSubmitPendingSite}
              disabled={isSubmitting}
            >
              {isSubmitting ? getConstant("LOADING_TEXT") : "Submit"}
            </button>
            <button
              type="button"
              className={commonStyle.commonBtn + " " + commonStyle.stroke}
              onClick={handleCloseModal}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </div>
      </CommonModal>
      <CommonModal
        show={showEditModal}
        handleClose={handleCloseModal}
        centered={true}
        modalSize="xl"
      >
        <div style={{ padding: "8px" }}>
          <h4
            style={{
              margin: "0 0 16px",
              fontSize: "20px",
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Edit site visit
          </h4>
          <AddLinkForm
            mode="edit"
            isModal={true}
            initialData={selectedItem || undefined}
            onSuccess={handleEditFormSuccess}
            onCancel={handleCloseModal}
          />
        </div>
      </CommonModal>
      <CommonModal
        show={editConfirmationModal}
        handleClose={() => {
          if (!isSubmitting) {
            setEditConfirmationModal(false);
          }
        }}
        centered={true}
      >
        <div style={{ padding: "8px" }}>
          <p
            style={{ marginBottom: "12px", color: "#4b5563", fontSize: "14px" }}
          >
            Are you sure you want to update this link?
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              marginTop: "16px",
            }}
          >
            <button
              type="button"
              className={commonStyle.commonBtn}
              onClick={handleUpdateLink}
              disabled={isSubmitting}
            >
              {isSubmitting ? getConstant("LOADING_TEXT") : "OK"}
            </button>
            <button
              type="button"
              className={commonStyle.commonBtn + " " + commonStyle.stroke}
              onClick={() => setEditConfirmationModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </div>
      </CommonModal>
    </>
  );
}
