"use client";

import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { AppContext } from "@/contextProvider";
import { addSender } from "@/controllers/sender";
import style from "@/styles/coupon/coupon.module.scss";
import commonStyle from "@/css/common/common.module.scss";

export default function AddSender() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const { showAlert } = useContext(AppContext);

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    const res = await addSender(data);
    setLoading(false);

    if (res?.success) {
      showAlert("Sender added", 1);
      router.push("/senders");
    } else {
      showAlert(res?.msg || "Error");
    }
  };

  return (
    <div className={style.assignCoupon}>
      <div className={style.inner}>
        <div className={style.assignCouponForm}>
          <h5>Add Sender</h5>

          <form onSubmit={handleSubmit(onSubmit)} className="row">
            <div className="col-md-12">
              <label>Email</label>
              <input
                className={commonStyle.formControl}
                {...register("email", { required: "Email required" })}
              />
              {errors.email && <span>{errors.email.message}</span>}
            </div>

            <div className="col-md-12 mt-3">
              <label>App Password</label>
              <input
                className={commonStyle.formControl}
                {...register("app_password", { required: "Required" })}
              />
              {errors.app_password && (
                <span>{errors.app_password.message}</span>
              )}
            </div>

            <div className={commonStyle.formBtnWrap}>
              <button disabled={loading} className={commonStyle.commonBtn}>
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
