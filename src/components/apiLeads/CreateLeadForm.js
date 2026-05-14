"use client";

import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import genLeadLink from "@/controllers/leadController";
import { AppContext } from "@/contextProvider";
import { useRouter } from "next/navigation";

export default function CreateLeadForm() {
  const [step, setStep] = useState(1);
  const [keywords, setKeywords] = useState([]);
  const [input, setInput] = useState("");
  const { showAlert } = useContext(AppContext);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm();

  const nextStep = async () => {
    let valid = false;

    if (step === 1) valid = await trigger(["name", "email", "interest"]);
    if (step === 2) valid = await trigger(["tenderType"]);
    if (step === 3) valid = await trigger(["expiry", "resultLength"]);

    if (valid) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const addKeyword = () => {
    if (input.trim()) {
      const updated = [...keywords, input.trim()];
      setKeywords(updated);
      setValue("keywords", updated);
      setInput("");
    }
  };

  const removeKeyword = (index) => {
    const updated = keywords.filter((_, i) => i !== index);
    setKeywords(updated);
    setValue("keywords", updated);
  };

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      keywords,
    };

    const res = await genLeadLink(payload);

    if (res?.success) {
      showAlert(res.msg, 1);
      reset();
      setKeywords([]);
      setInput("");
      setStep(1);
      router.push("/api-lead");
    }
  };

  const values = getValues();

  return (
    <div className="container mt-2">
      <div className="card p-4">
        {/* <h4>Step {step} of 4</h4> */}
        {/* 
        <div className="progress mb-3">
          <div
            className="progress-bar"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div> */}

        <form onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && (
            <>
              <div className="mb-3">
                <label>Client Name</label>
                <input
                  className="form-control"
                  placeholder="Enter client name"
                  {...register("name", { required: "Client name is required" })}
                />
                <small className="text-danger">{errors.name?.message}</small>
              </div>

              <div className="mb-3">
                <label>Email</label>
                <input
                  className="form-control"
                  placeholder="Enter email"
                  {...register("email", { required: "Email is required" })}
                />
                <small className="text-danger">{errors.email?.message}</small>
              </div>

              <div className="mb-3">
                <label>Interest Level</label>
                <select
                  className="form-control"
                  {...register("interest", {
                    required: "Select interest level",
                  })}
                >
                  <option value="">Select Interest</option>
                  <option value="hot">Hot</option>
                  <option value="warm">Warm</option>
                  <option value="cold">Cold</option>
                </select>
                <small className="text-danger">
                  {errors.interest?.message}
                </small>
              </div>
            </>
          )}

          {step === 2 && (
            <div className="mb-3">
              <label className="form-label">Select Tender Type</label>

              <div className="form-check">
                <input
                  type="checkbox"
                  value="contract"
                  {...register("tenderType", {
                    validate: (value) =>
                      (value && value.length > 0) ||
                      "Please select at least one tender type",
                  })}
                  className="form-check-input"
                />
                <label className="form-check-label">Contract Award</label>
              </div>

              <div className="form-check">
                <input
                  type="checkbox"
                  value="live"
                  {...register("tenderType")}
                  className="form-check-input"
                />
                <label className="form-check-label">Live Tender</label>
              </div>

              <div className="form-check">
                <input
                  type="checkbox"
                  value="archive"
                  {...register("tenderType")}
                  className="form-check-input"
                />
                <label className="form-check-label">Archive Tender</label>
              </div>

              {errors.tenderType && (
                <small className="text-danger d-block mt-1">
                  {errors.tenderType.message}
                </small>
              )}
            </div>
          )}

          {step === 3 && (
            <>
              <div className="mb-3">
                <label>Keywords</label>
                <div className="d-flex">
                  <input
                    className="form-control"
                    placeholder="Enter keyword"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-primary ms-2"
                    onClick={addKeyword}
                  >
                    Add
                  </button>
                </div>

                <div className="mt-2">
                  {keywords.map((k, i) => (
                    <span key={i} className="badge bg-secondary me-2">
                      {k}
                      <span
                        style={{ cursor: "pointer", marginLeft: 5 }}
                        onClick={() => removeKeyword(i)}
                      >
                        ✕
                      </span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <label>Result Length</label>
                <select
                  className="form-control"
                  {...register("resultLength", {
                    required: "Select result length",
                  })}
                >
                  <option value="">Select</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                  <option value="40">40</option>
                  <option value="50">50</option>
                </select>
                <small className="text-danger">
                  {errors.resultLength?.message}
                </small>
              </div>

              <div className="mb-3">
                <label>Expiry (Days)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter expiry in days"
                  {...register("expiry", { required: "Expiry is required" })}
                />
                <small className="text-danger">{errors.expiry?.message}</small>
              </div>
            </>
          )}

          {step === 4 && (
            <div className="card p-3 bg-light">
              <h5>Preview</h5>
              <p>
                <b>Name:</b> {values.name}
              </p>
              <p>
                <b>Email:</b> {values.email}
              </p>
              <p>
                <b>Interest:</b> {values.interest}
              </p>
              <p>
                <b>Tender Type:</b> {values.tenderType?.join(", ")}
              </p>
              <p>
                <b>Keywords:</b> {keywords.join(", ")}
              </p>
              <p>
                <b>Result Length:</b> {values.resultLength}
              </p>
              <p>
                <b>Expiry:</b> {values.expiry} days
              </p>
            </div>
          )}

          <div className="d-flex mt-3">
            {step > 1 && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={prevStep}
              >
                Back
              </button>
            )}

            {step < 4 && (
              <button
                type="button"
                className="btn btn-primary ms-auto"
                onClick={nextStep}
              >
                Next
              </button>
            )}

            {step === 4 && (
              <button type="submit" className="btn btn-success ms-auto">
                Generate API
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
