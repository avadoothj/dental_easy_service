"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { AppContext } from "@/contextProvider";
import style from "@/css/coupon/coupon.module.scss";
import commonStyle from "@/css/common/common.module.scss";
import {
  findTenderInDb,
  updateTenderAwardResults,
} from "../../controllers/contractAward";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { formatPrice } from "@/utils/utils";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
};

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
};

export default function ContractPage() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tender_number: "",
    },
  });

  const { showAlert } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    register: registerModal,
    handleSubmit: handleSubmitModal,
    reset: resetModal,
  } = useForm();

  const handleSearch = async (formValues) => {
    setIsLoading(true);
    setHasSearched(true);
    try {
      const response = await findTenderInDb(formValues);

      if (!response?.success) {
        setResults(null);
        showAlert(response?.msg || "Unable to search tender", 2);
        return;
      }

      const fixed = {
        ...response.data,
        bid_awarded_result: (response.data.bid_awarded_result || []).map(
          (i) => ({
            ...i,
            row_id: i.row_id || uuidv4(),
          }),
        ),
      };

      setResults(fixed);
      showAlert("Tender data loaded successfully", 1);
    } catch (error) {
      setResults(null);
      showAlert("Error while searching tender", 2);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setIsEditMode(false);
    resetModal({ seller_name: "", total_price: "", rank: "", email_id: "" });
    setOpen(true);
  };

  const handleOpenEdit = (item) => {
    setIsEditMode(true);
    resetModal({
      row_id: item.row_id,
      seller_name: item.seller_name,
      total_price: item.total_price,
      rank: item.rank,
      email_id: item.email_id,
    });
    setOpen(true);
  };

  const handleLocalDelete = (row_id) => {
    setResults((prev) => {
      const updated = prev.bid_awarded_result.map((item) =>
        item.row_id === row_id ? { ...item, is_deleted: true } : item,
      );
      return { ...prev, bid_awarded_result: updated };
    });
  };

  const onModalSubmit = (data) => {
    setResults((prev) => {
      const list = [...(prev.bid_awarded_result || [])];

      if (isEditMode) {
        const idx = list.findIndex((i) => i.row_id === data.row_id);
        if (idx > -1) {
          list[idx] = {
            ...list[idx],
            ...data,
            is_updated: true,
            is_deleted: false,
          };
        }
      } else {
        list.push({
          ...data,
          row_id: uuidv4(),
          is_new: true,
          is_deleted: false,
        });
      }

      return { ...prev, bid_awarded_result: list };
    });

    setOpen(false);
  };

  const handleFinalSave = async () => {
    const tenderNumber = getValues("tender_number");

    const payload = {
      tender_number: tenderNumber,
      seller_data_list: results.bid_awarded_result,
    };

    try {
      setIsLoading(true);
      const response = await updateTenderAwardResults(payload);

      if (response?.success) {
        showAlert("All changes saved to database successfully", 1);
        handleSearch({ tender_number: tenderNumber });
      } else {
        showAlert(response?.msg || "Save failed", 2);
      }
    } catch (error) {
      showAlert("Error during save", 2);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={style.assignCoupon}>
        <div className={style.inner}>
          <div className={style.assignCouponForm}>
            <form onSubmit={handleSubmit(handleSearch)}>
              <div className="d-flex gap-3">
                <div className={"flex-fill"}>
                  <label>
                    Tender TEB Number<span className={style.astrike}>*</span>
                  </label>
                  <div className={style.inputsWrap}>
                    <input
                      className="form-control"
                      {...register("tender_number", {
                        required: "Enter Tender TEB number",
                      })}
                    />

                    {errors.tender_number && (
                      <span
                        style={{
                          color: "red",
                          display: "block",
                          marginTop: "4px",
                        }}
                      >
                        {errors.tender_number.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className={style.formBtnWrap}>
                <button
                  type="submit"
                  className={commonStyle.commonBtn}
                  disabled={isLoading}
                >
                  {isLoading ? "Searching..." : "Search"}
                </button>
              </div>
            </form>

            {hasSearched && results && (
              <div style={{ marginTop: "24px" }}>
                <div
                  style={{
                    padding: "16px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    background: "#fff",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: "12px 16px",
                    }}
                  >
                    <div>
                      <strong>Tender Number:</strong>{" "}
                      {formatValue(results.tender_number)}
                    </div>
                    <div>
                      <strong>TEB Number:</strong>{" "}
                      {formatValue(results.teb_number)}
                    </div>
                    <div>
                      <strong>Title:</strong>{" "}
                      {formatValue(results.tender_title)}
                    </div>
                    <div>
                      <strong>Organisation:</strong>{" "}
                      {formatValue(results.tender_organisation)}
                    </div>
                    <div>
                      <strong>Country:</strong>{" "}
                      {formatValue(results.tender_country)}
                    </div>
                    <div>
                      <strong>State:</strong>{" "}
                      {formatValue(results.tender_state)}
                    </div>
                    <div>
                      <strong>City:</strong> {formatValue(results.tender_city)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {hasSearched && results && (
        <div className={`${style.assignCoupon} mt-4`}>
          <div className={style.inner}>
            <div className={style.assignCouponForm}>
              {hasSearched && results && (
                <div style={{ marginTop: "24px" }}>
                  <div
                    style={{
                      padding: "16px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      background: "#fff",
                    }}
                  >
                    <div style={{ marginTop: "20px" }}>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="m-0">Bid Results (Draft Mode)</h6>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={handleOpenAdd}
                          className={commonStyle.commonBtn}
                        >
                          Add New Data
                        </Button>
                      </div>

                      <div className={commonStyle.tableResponsive}>
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Rank</th>
                              <th>Seller Name</th>
                              <th>Email ID</th>
                              <th>Total Price</th>
                              <th>Actions</th>
                            </tr>
                          </thead>

                          <tbody>
                            {results.bid_awarded_result?.filter(
                              (i) => !i.is_deleted,
                            ).length > 0 ? (
                              results.bid_awarded_result
                                .filter((i) => !i.is_deleted)
                                .map((item, index) => (
                                  <tr key={item.row_id || index}>
                                    <td>{index + 1}</td>
                                    <td>{item.rank}</td>
                                    <td>{item.seller_name}</td>
                                    <td>{item.email_id || "-"}</td>
                                    <td>{formatPrice(item.total_price)}</td>

                                    <td>
                                      <div className="d-flex gap-2">
                                        <button
                                          type="button"
                                          onClick={() => handleOpenEdit(item)}
                                          className={`${commonStyle.commonBtn} ${commonStyle.small} ${commonStyle.light}`}
                                        >
                                          Edit
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleLocalDelete(item.row_id)
                                          }
                                          className={`${commonStyle.commonBtn} ${commonStyle.small}`}
                                          style={{
                                            backgroundColor: "#dc3545",
                                            color: "#fff",
                                          }}
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                            ) : (
                              <tr>
                                <td colSpan="6" className="text-center">
                                  No records in draft
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-4 d-flex justify-content-end">
                        <Button
                          variant="contained"
                          onClick={handleFinalSave}
                          disabled={isLoading}
                          style={{ backgroundColor: "#198754", color: "#fff" }}
                        >
                          {isLoading ? "Saving..." : "Save All"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Modal open={open} onClose={() => setOpen(false)}>
            <Box sx={modalStyle}>
              <Typography variant="h6" mb={2}>
                {isEditMode ? "Edit Seller Details" : "Add New Seller"}
              </Typography>

              <form onSubmit={handleSubmitModal(onModalSubmit)}>
                <Box display="flex" flexDirection="column" gap={2}>
                  <TextField
                    label="Seller Name"
                    fullWidth
                    size="small"
                    {...registerModal("seller_name", { required: "Required" })}
                  />
                  <TextField
                    label="Total Price"
                    fullWidth
                    size="small"
                    {...registerModal("total_price")}
                  />
                  <TextField
                    label="Rank"
                    fullWidth
                    size="small"
                    {...registerModal("rank", {
                      required: "Required",
                      pattern: {
                        value: /^[lL]\d+$/,
                        message:
                          "Rank must start with 'L' followed by a number (e.g., L1, L2)",
                      },
                    })}
                  />
                  <TextField
                    label="Email ID"
                    fullWidth
                    size="small"
                    {...registerModal("email_id")}
                  />

                  <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
                    <Button onClick={() => setOpen(false)} variant="outlined">
                      Cancel
                    </Button>
                    <Button type="submit" variant="contained">
                      {isEditMode ? "Apply Changes" : "Add to Draft"}
                    </Button>
                  </Box>
                </Box>
              </form>
            </Box>
          </Modal>
        </div>
      )}
    </>
  );
}
