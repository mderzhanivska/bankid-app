import React from "react";
import Styles from "./Spinner.module.scss";

const Spinner = () => {
  return (
    <div className={Styles.spinnerBoxContainer}>
      <div className={Styles.container}>
        <div className={Styles.container}>
          <div className={Styles.boxOne} />
          <div className={Styles.boxTwo} />
          <div className={Styles.boxThree} />
          <div className={Styles.boxFour} />
        </div>
      </div>
    </div>
  );
};

export default Spinner;
