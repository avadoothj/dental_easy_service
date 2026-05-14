import style from "@/css/resetPassword/resetPassword.module.scss";
import { getConstant } from "@/utils/utils";

export default function ResetConfirm({
  type,
  isLoading,
  handleClose,
  confirmAction,
  item,
}) {
  return (
    <div className={style.resetPassModal}>
      <div className={style.header}>
        <span className={style.closeBtn} onClick={handleClose}></span>
      </div>
      <div className={style.main}>
        {type == "password" && (
          <>
            <h4>Confirm Password Change</h4>
            <h5>Are you sure you want to reset the password for this user?</h5>
          </>
        )}
        {type == "token" && (
          <>
            <h4>Confirm Regenerate Token</h4>
            <h5>Are you sure you want to regenerate token this ISP?</h5>
          </>
        )}
        <div className={style.plandtlbox}>
          <div className={style.row}>
            <div className={style.col}>Display Name -</div>
            <div className={style.col}>
              <b>{item.user_name}</b>
            </div>
          </div>
          <div className={style.row}>
            <div className={style.col}>Username -</div>
            <div className={style.col}>
              <b>{item.login_id}</b>
            </div>
          </div>
          <div className={style.row}>
            <div className={style.col}>Mobile -</div>
            <div className={style.col}>
              <b>{item.mobile}</b>
            </div>
          </div>
          <div className={style.row}>
            <div className={style.col}>Email -</div>
            <div className={style.col}>
              <b>{item.email}</b>
            </div>
          </div>

          <div className={style.row}>
            <div className={style.col}>Role -</div>
            <div className={style.col}>
              <b>{item.role_name}</b>
            </div>
          </div>
        </div>
        <div className={style.btnWrapper}>
          <button className={style.cancelBtn} onClick={handleClose}>
            Cancel
          </button>
          <button
            className={style.confirmBtn}
            disabled={isLoading}
            onClick={confirmAction}
          >
            {isLoading ? getConstant("LOADING_TEXT") : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
