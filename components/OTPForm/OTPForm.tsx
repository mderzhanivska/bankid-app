import React, { memo, useRef, useState, useEffect, useCallback } from "react";
import cx from "classnames";


import Styles from "./OTPForm.module.scss";

const OTPForm = memo((props) => {
  const { handleOtp, handleCancel, isRequesting, localize } = props;
  const locale = 'uk';
  const token = window.localStorage.getItem('token');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const form = document.getElementById('otpForm');

    form.addEventListener('submit', (event) => {
      if (loading) {
        event?.preventDefault();
      }

      setLoading(true)
    });
  }, []);





  return (
    <form id="otpForm" action="/checkSms" method="post" className={Styles.form} >
      <div className={Styles.fields}>
        <div className={Styles.description}>
          {localize('sign_in', 'confirm_description')}
        </div>
        <ul className={Styles.list}>
          <li>- {localize('sign_in', 'full_name')}</li>
          <li>- {localize('sign_in', 'birthdate')}</li>
          <li>- {localize('sign_in', 'passport')}</li>
          <li>- {localize('sign_in', 'id_number')}</li>
          <li>- {localize('sign_in', 'registration_address')}</li>
        </ul>
        <div className={Styles.description}>
          {localize('sign_in', 'enter_code')}
        </div>

        <div className={cx(Styles.field, Styles.otpField)}>
          <label>{localize('sign_in', 'otp_code')}</label>
          <input type="number" name="code" onChange={handleOtp} />
        </div>
        <input type="hidden" name="token" value={token ? token : ''} />
        <input type="hidden" name="locale" value={locale} />
      </div>

      <button
        type="submit"
        id='submit'
        disabled={loading}
        className={Styles.submit}
      >
        {localize('sign_in', 'confirm')}
      </button>
      <button className={Styles.reject} disabled={isRequesting} onClick={handleCancel} type="button">
        {localize('sign_in', 'cancel')}
      </button>
    </form>
  );
});

export default OTPForm;
