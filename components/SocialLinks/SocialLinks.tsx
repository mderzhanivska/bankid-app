import React from "react";
import Styles from "./SocialLinks.module.scss";

import { ReactComponent as AppStore } from "../../images/AppStore.svg";
import { ReactComponent as GooglePlay } from "../../images/GooglePlay.svg";

const googlePlayLink = "http://bit.ly/2tSBHwz";
const appleStoreLink = "https://apple.co/2tcdUaY";

const SocialLinks = (props) => {
  return (
    <div className={Styles.buttons}>
      <a href={appleStoreLink} target="_blank" rel="noopener noreferrer">
        <AppStore />
      </a>
      <a href={googlePlayLink} target="_blank" rel="noopener noreferrer">
        <GooglePlay />
      </a>
    </div>
  );
};

export default SocialLinks;
