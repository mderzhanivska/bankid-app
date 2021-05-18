import React from "react";
import Styles from "./Header.module.scss";

import { LangSwitcher } from '../index';

const Header = props => {

  const {localize, activeLang, onLangChange, langs } = props;

  return (
    <header className={Styles.header}>
        <div className={Styles.link}>
          <a href="tel:0 800 50 20 30">0 800 50 20 30</a>
          <span>{localize("sign_in", "contact_center")}</span>
        </div>
        <div className={Styles.langSwitcher}>
          <LangSwitcher locale={activeLang} langs={langs} onLangChange={onLangChange} />
        </div>
      </header>
  );
};

export default Header;
