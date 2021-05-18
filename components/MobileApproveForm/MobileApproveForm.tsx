import React from "react";
import Styles from "./MobileApproveForm.module.scss";

const MobileApproveForm = props => {
  const { token, isRequesting, handleCancel } = props;

  return (
    <form
      action="/mobileApprove"
      method="post"
      id="mobileAproval"
      className={Styles.formhidden}
    >
      <div className={Styles.fields}>
        <input type="hidden" name="token" value={token} />
      </div>

      <button
        type="submit"
        disabled={isRequesting}
        // onClick={handleSendOtp}
        className={Styles.submit}
      >
        Підтвердити
      </button>
      <button className={Styles.reject} disabled={isRequesting} onClick={handleCancel} type="button">
        Скасувати
      </button>
    </form>
  );
};

export default MobileApproveForm;
