"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "@/contextProvider";
import commonStyle from "@/css/common/common.module.scss";
import style from "@/styles/coupon/coupon.module.scss";
import CustomDatepicker from "../common/customDatepicker";
import { getSenderDrop } from "@/controllers/sender";
import { addCampaign } from "@/controllers/campaign";
import { useRouter } from "next/navigation";

const ALLOWED_EXTENSIONS = [".csv", ".xls", ".xlsx"];

export default function CampaignCreate() {
  const { showAlert } = useContext(AppContext);
  const fileRef = useRef(null);
  const imageRef = useRef(null);
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [subject, setSubject] = useState("");
  const [senderList, setSenderList] = useState([]);
  const [senderId, setSenderId] = useState("");
  const [toDate, setToDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    const isValid = ALLOWED_EXTENSIONS.some((ext) =>
      f.name.toLowerCase().endsWith(ext),
    );

    if (!isValid) {
      showAlert("Upload valid Excel/CSV", 2);
      fileRef.current.value = "";
      return;
    }

    setFile(f);
  };

  const handleImageChange = (e) => {
    const img = e.target.files?.[0];
    if (!img) return;

    setImage(img);
    setImagePreview(URL.createObjectURL(img));
  };

  const loadSenders = () => {
    getSenderDrop()
      .then((res) => {
        if (res.success) setSenderList(res.list);
      })
      .catch(console.error);
  };

  useEffect(() => {
    loadSenders();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return showAlert("Select Excel file", 2);
    if (!image) return showAlert("Upload image", 2);
    if (!subject) return showAlert("Enter subject", 2);
    if (!senderId) return showAlert("Select sender", 2);
    if (!toDate) return showAlert("Select date", 2);

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("image", image);
      formData.append("subject", subject);
      formData.append("senderId", senderId);
      formData.append("date", toDate);

      const res = await addCampaign(formData);

      if (res.success) {
        showAlert("Campaign created", 1);
        setFile(null);
        setImage(null);
        setImagePreview("");
        setSubject("");
        setSenderId("");
        setToDate(null);
        fileRef.current.value = "";
        imageRef.current.value = "";
        router.push("/campaigns");
      }
    } catch (err) {
      console.error("Campaign frontend create error::", err);
      showAlert("Failed to create campaign", 2);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.assignCoupon}>
      <div className={style.inner}>
        <div className={style.assignCouponForm}>
          <h5>Create Email Campaign</h5>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-7">
                <div className="row gap-3">
                  <div className="col-md-12">
                    <label>Email Subject</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Enter subject"
                      className={commonStyle.formControl}
                    />
                  </div>

                  <div className="col-md-12">
                    <label>Upload Excel (Clients)</label>
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".csv,.xls,.xlsx"
                      onChange={handleFileChange}
                      className={commonStyle.formControl}
                    />
                    {file && <p className="text-success mt-2">{file.name}</p>}
                  </div>

                  <div className="col-md-12">
                    <label>Upload Image</label>
                    <input
                      ref={imageRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className={commonStyle.formControl}
                    />
                  </div>

                  <div className="col-md-12">
                    <label>Select Email</label>
                    <select
                      className="form-select"
                      value={senderId}
                      onChange={(e) => setSenderId(e.target.value)}
                    >
                      <option value="">Select email</option>
                      {senderList.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.email}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-12">
                    <label>Select Date</label>
                    <CustomDatepicker
                      value={toDate}
                      callback={(d) => setToDate(d)}
                      minDate={new Date()}
                    />
                  </div>

                  <div className={commonStyle.formBtnWrap}>
                    <button
                      type="submit"
                      className={commonStyle.commonBtn}
                      disabled={loading}
                    >
                      {loading ? "Creating..." : "Create Campaign"}
                    </button>

                    <button
                      type="button"
                      className={
                        commonStyle.commonBtn + " " + commonStyle.stroke
                      }
                      disabled={loading}
                      onClick={() => router.push("/campaigns")}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-md-5">
                <div
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    padding: "20px",
                    minHeight: "350px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f8fafc",
                  }}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "400px",
                        borderRadius: "8px",
                      }}
                    />
                  ) : (
                    <p style={{ color: "#64748b" }}>Image Preview</p>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
