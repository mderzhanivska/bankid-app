import React from "react";
import Styles from "./Error.module.scss";

import { ReactComponent as Viber } from "../../images/viber.svg";
import { ReactComponent as Telegram } from "../../images/telegram.svg";
import { ReactComponent as Phone } from "../../images/phone.svg";

import ErrorIcon from "../../images/error.svg";

const Error = (props) => {
  const { errorMessage, localize } = props;

  return (
    <div className={Styles.errorWindow}>
      {errorMessage ? (
        <div className={Styles.description}>{errorMessage}</div>
      ) : (
        <div className={Styles.description}>
          {localize("sign_in", "error_description")}
        </div>
      )}

      <div className={Styles.errorImg}>
        <img src={ErrorIcon} alt="error" />
      </div>

      <div className={Styles.media}>
        <div className={Styles.description}>
          {localize("sign_in", "customer_support")}
        </div>
        <ul>
          <li className={Styles.item}>
            <div className={Styles.mediaIcon}>
              <Viber />
            </div>
            <a href="viber://pa?chatURI=obankua" rel="noopener noreferrer" target="_blank" className={Styles.mediaName}>Viber</a>
          </li>
          <li className={Styles.item}>
            <div className={Styles.mediaIcon}>
              <Telegram />
            </div>
            <a href="https://t.me/Obankuabot" rel="noopener noreferrer" target="_blank" className={Styles.mediaName}>Telegram</a>
          </li>

          <li className={Styles.item}>
            <div className={Styles.mediaIcon}>
              <Phone />
            </div>
            <a href="tel:0 800 50 20 30" rel="noopener noreferrer" className={Styles.mediaName}>
              <span>0 800 50 20 30</span>
              <span>{localize("sign_in", "contact_center")}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Error;
