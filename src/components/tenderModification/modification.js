"use client";

import { useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { AppContext } from "@/contextProvider";
import { searchModification } from "@/controllers/tenderModification";
import style from "@/css/coupon/coupon.module.scss";
import commonStyle from "@/css/common/common.module.scss";

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
};

export default function Modification() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tender_number: "",
      title: "",
      status: "",
    },
  });

  const { showAlert } = useContext(AppContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const resultCountLabel = useMemo(() => {
    if (!hasSearched) {
      return "";
    }

    return `${results.length} tender${results.length === 1 ? "" : "s"} found`;
  }, [hasSearched, results.length]);

  const validation = {
    tender_number: register("tender_number", {
      required: "Tender number is required",
    }),
    tender_title: register("tender_title"),
    status: register("status"),
  };

  const handleFormSubmit = async (formValues) => {
    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await searchModification({
        tenderNumber: formValues.tender_number,
        title: formValues.tender_title,
        status: formValues.status,
      });

      if (!response?.success) {
        setResults([]);
        showAlert(response?.error || "Unable to search tender", 2);
        return;
      }

      setResults(Array.isArray(response.list) ? response.list : []);

      if (!response.list?.length) {
        showAlert("No tender found for the selected criteria", 2);
        return;
      }

      showAlert("Tender search completed successfully", 1);
    } catch (error) {
      console.error("Tender modification search failed:", error);
      setResults([]);
      showAlert("Error while searching tender", 2);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={style.assignCoupon}>
      <div className={style.inner}>
        <div className={style.assignCouponForm}>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="d-flex gap-3">
              <div className={"flex-fill"}>
                <label>
                  Tender Number<span className={style.astrike}>*</span>
                </label>
                <div className={style.inputsWrap}>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter tender number"
                    {...validation.tender_number}
                  />
                  {errors.tender_number && (
                    <span className={commonStyle.errorText}>
                      {errors.tender_number.message}
                    </span>
                  )}
                </div>
              </div>
              <div className={"flex-fill"}>
                <label>Tender Title</label>
                <div className={style.inputsWrap}>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter tender title"
                    {...validation.tender_title}
                  />
                </div>
              </div>
              <div className={"flex-fill"}>
                <label>Status</label>
                <div className={style.inputsWrap}>
                  <select
                    className="form-control"
                    defaultValue=""
                    {...validation.status}
                  >
                    <option value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Archive">Archive</option>
                  </select>
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
          {/* <div className={commonStyle.searchResult}>
            <h2>
              <a href={"#!"}>
                Supply, Installation, testing and Commissioning of Continuous
                Ice Cream Freezer (PLC based) of 600 LPH capacity as per
                technical specification.
              </a>{" "}
              <button
                className={
                  commonStyle.commonBtn +
                  " " +
                  commonStyle.small +
                  " " +
                  commonStyle.light
                }
              >
                Edit
              </button>
            </h2>
            <ul>
              <li>
                <span className={commonStyle.attribute}>Organisation</span>
                <span className={commonStyle.value}>
                  Vaishal Patliputra Dugdh Utpadak Sahkari Sangh Limited (HQ)
                </span>
              </li>
              <li>
                <span className={commonStyle.attribute}>Country</span>
                <span className={commonStyle.value}>sdfds</span>
              </li>
              <li>
                <span className={commonStyle.attribute}>State</span>
                <span className={commonStyle.value}>sdfds</span>
              </li>
              <li>
                <span className={commonStyle.attribute}>City</span>
                <span className={commonStyle.value}>Patna</span>
              </li>
            </ul>
          </div> */}
          {hasSearched && (
            <div style={{ marginTop: "24px" }}>
              {results &&
                results.map((item) => (
                  <div
                    key={item._id}
                    style={{
                      padding: "16px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      background: "#fff",
                      marginBottom: "16px",
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
                        {formatValue(item.tender_number)}
                      </div>
                      <div>
                        <strong>TEB Number:</strong>{" "}
                        {formatValue(item.teb_number)}
                      </div>
                      <div>
                        <strong>Title:</strong> {formatValue(item.tender_title)}
                      </div>
                      <div>
                        <strong>Organisation:</strong>{" "}
                        {formatValue(item.tender_organisation)}
                      </div>
                      <div>
                        <strong>Country:</strong>{" "}
                        {formatValue(item.tender_country)}
                      </div>
                      <div>
                        <strong>State:</strong> {formatValue(item.tender_state)}
                      </div>
                      <div>
                        <strong>City:</strong> {formatValue(item.tender_city)}
                      </div>
                    </div>
                    <div style={{ marginTop: "16px" }}>
                      <button
                        type="button"
                        className={
                          commonStyle.commonBtn +
                          " " +
                          commonStyle.small +
                          " " +
                          commonStyle.light
                        }
                        onClick={() =>
                          router.push(`/tender-modification/${item._id}`)
                        }
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
