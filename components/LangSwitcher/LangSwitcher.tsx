import React, { useState } from "react";
import cx from "classnames";
import Styles from "./LangSwitcher.module.scss";

const LangSwitcher = props => {
  const { onLangChange, langs, locale } = props;

  
  const [isListVisible, setListVisible] = useState(false);

  const handleListOpen = () => {
    setListVisible(true);
  };

  const handleLangChange = (e) => {
    onLangChange(e);
    setListVisible(false);
  }



  return (
    <div className={Styles.switcher}>
      <button onClick={handleListOpen} className={Styles.current} type="button">
        {locale}
        <span className={Styles.arrow}></span>
      </button>

      <ul
        className={cx(Styles.list, {
          [Styles.visible]: isListVisible,
        })}
      >
        {langs.map((lang) => (
          <li
            key={String(lang.int)}
            id={String(lang.int)}
            className={Styles.lang}
            onClick={handleLangChange}
          >
            <button type="button">{lang.str}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LangSwitcher;
