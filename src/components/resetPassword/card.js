import { useContext, useState } from "react";
import SimpleTooltip from "@/common/simpleTooltip";
import { AppContext } from "@/contextProvider";
import CommonModal from "@/common/commonModal";
import style from "@/css/resetPassword/resetPassword.module.scss";
import ResetConfirm from "./resetConfirm";
import messages from "@/utils/messages";
import {
  regenerateUserToken,
  resetUserPassword,
} from "@/controllers/resetPassword";

export default function Card({ item, reloadData }) {
  const { showAlert } = useContext(AppContext);

  const [isLoading, setIsLoading] = useState(false);
  const [action, setAction] = useState("");
  const [showModal, setShowModal] = useState(false);

  const toggleConfirmModal = () => {
    setShowModal(!showModal);
  };

  const handleConfirmClick = async () => {
    if (action == "password") {
      handleResetPasswordClick();
    } else if (action == "token") {
      handleRegenerateClick();
    }
  };

  const handleResetPasswordClick = async () => {
    const payload = {
      user_id: item.user_id,
    };

    setIsLoading(true);
    const response = await resetUserPassword(payload);

    if (response.success) {
      toggleConfirmModal();
      showAlert(messages.USER_PASSWORD_RESET_SUCCESS, 1);
      reloadData();
    } else {
      setIsLoading(false);
      showAlert(response.msg);
    }
  };

  const handleRegenerateClick = async () => {
    const payload = {
      user_id: item.user_id,
    };

    setIsLoading(true);
    const response = await regenerateUserToken(payload);

    if (response.success) {
      toggleConfirmModal();
      showAlert(messages.USER_TOKEN_RESET_SUCCESS, 1);
      reloadData();
    } else {
      setIsLoading(false);
      showAlert(response.msg);
    }
  };

  return (
    <>
      <div className={style.passWordCard}>
        {item.is_primary && (
          <div className={style.status}>
            <div className={style.icon}>
              <div className={style.lablename}>Primary</div>
            </div>
          </div>
        )}
        <div className={style.header}>
          <SimpleTooltip text={item.user_name}>
            <h3>{item.user_name}</h3>
          </SimpleTooltip>
        </div>
        <div className={style.row}>
          {item.oper_cat_id == 8 && (
            <div className={style.col}>
              <div className={style.label}>Distributor</div>
              <div className={style.data}>
                <SimpleTooltip text={item.oper_name}>
                  <span>{item.oper_name}</span>
                </SimpleTooltip>
              </div>
            </div>
          )}
        </div>
        <div className={style.row}>
          <div className={style.col}>
            <div className={style.label}>Username</div>
            <div className={style.data}>
              <SimpleTooltip text={item.login_id}>
                <span>{item.login_id}</span>
              </SimpleTooltip>
            </div>
          </div>
          <div className={style.col}>
            <div className={style.label}>Role</div>
            <div className={style.data}>
              <SimpleTooltip text={item.role_name}>
                <span>{item.role_name}</span>
              </SimpleTooltip>
            </div>
          </div>
        </div>
        <div className={style.row}>
          <div className={style.col}>
            <div className={style.label}>Email</div>
            <div className={style.data}>
              <SimpleTooltip text={item.email}>
                <span>{item.email}</span>
              </SimpleTooltip>
            </div>
          </div>
          <div className={style.col}>
            <div className={style.label}>Mobile</div>
            <div className={style.data}>
              <SimpleTooltip text={item.mobile}>
                <span>{item.mobile}</span>
              </SimpleTooltip>
            </div>
          </div>
        </div>
        <div className={style.footer}>
          <a
            className={style.btn1}
            onClick={(e) => {
              e.preventDefault();
              setAction("password");
              toggleConfirmModal();
            }}
          >
            Change Password
          </a>
        </div>
      </div>

      <CommonModal
        show={showModal}
        className="setpricemodel"
        bodyClassName="setpricepad"
        handleClose={toggleConfirmModal}
        animation={false}
      >
        <ResetConfirm
          type={action}
          item={item}
          isLoading={isLoading}
          handleClose={toggleConfirmModal}
          confirmAction={handleConfirmClick}
        />
      </CommonModal>
    </>
  );
}
