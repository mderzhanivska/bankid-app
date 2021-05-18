import React from "react";
import cx from 'classnames'
import Styles from "./QRCode.module.scss";

import OBank from "../../images/oBankLogo.svg";


const token = window.localStorage.getItem('token');
const serviceId = JSON.stringify({
  serviceName: 'bankid.qr.auth',
  prefilledValues: {
    token: token,
    qrLink: 1
  }
})

const qrCodeLink = `obank://ideaonline.ua/bankid/?serviceId=${encodeURIComponent(serviceId)}`;

const QRCode = (props) => {
  const { qr, localize } = props;
  return (
    <div className={Styles.qr}>
      <div className={cx(Styles.title, Styles.desktop)}>{localize("sign_in", "click_or_scan")}</div>
      <div className={cx(Styles.title, Styles.mobile)}>{localize("sign_in", "click_qr")}</div>
      <div className={Styles.subtitle}>
        {localize("sign_in", "qr_code")} <img src={OBank} alt="obank" />
      </div>

      {token && token !== null && token.length > 0 && (
        <a
          className={Styles.code}
          href={qrCodeLink}
          dangerouslySetInnerHTML={{ __html: qr }}
        ></a>
      )}

      <div
        className={Styles.desktopcode}
        dangerouslySetInnerHTML={{ __html: qr }}
      ></div>
      <div className={Styles.mobileInfo}>
        {localize("sign_in", "or_enter_phone")}
      </div>
    </div >
  );
};

export default QRCode;
