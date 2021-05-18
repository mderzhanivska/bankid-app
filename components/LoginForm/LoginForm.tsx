/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable eqeqeq */
import React, { useState } from "react";
import InputMask from "react-input-mask";
import Fingerprint2 from "fingerprintjs2";
import UAParser from "ua-parser-js";
import Styles from "./LoginForm.module.scss";

import OBank from "../../images/oBankLogo.svg";
import { ReactComponent as AppStore } from "../../images/AppStore.svg";
import { ReactComponent as GooglePlay } from "../../images/GooglePlay.svg";
import { ReactComponent as Viber } from "../../images/viber.svg";
import { ReactComponent as Telegram } from "../../images/telegram.svg";
import { ReactComponent as Phone } from "../../images/phone.svg";
import Error from "../../images/error.svg";

import { OTPForm } from "../index";

const parser = new UAParser();
const browserInformation = parser.getResult();
const SHA1 = require("crypto-js/sha1");

const LoginForm = (props) => {
  const { qr } = props;
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [passType, setPassType] = useState("password");
  const [isFieldEntered, setFieldEntered] = useState(true);
  const [isLoginValid, setLoginValid] = useState(true);
  const [isCyrilic, setCyrilic] = useState(false);
  const [isOtp, setOtpForm] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [loginData, setLoginData] = useState("");
  const [otpData, setOtpData] = useState("");
  const [isError, setIsError] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const token  = window.localStorage.getItem('token');

  const handleLogin = (e) => {
    const { value } = e.currentTarget;
    setLogin(value);
  };

  const handlePassword = (e) => {
    const { value } = e.currentTarget;

    if (/^[^А-ЩЁёЫЬЮЯҐЭЄІЇа-щьюяґыъэєії\s]*?$/.test(value)) {
      setPassword(value);
      return setCyrilic(false);
    } else {
      return setCyrilic(true);
    }
  };

  // const handlePassVisibility = () => {
  //   if (passType === "password") {
  //     setPassword("text");
  //   } else {
  //     setPassword("password");
  //   }
  // };

  // const onAuth = () => {};

  const generateFingerPrint = () => {
    return new Promise((resolve) => {
      Fingerprint2.get((result) => {
        const fingerString = Fingerprint2.x64hash128(
          JSON.stringify(result),
          31
        );
        resolve(fingerString);
      });
    });
  };

  const loginUser = (login, password, deviceInfo, locale, token) => {
    const url = `/auth`;

    var params = {
      login,
      password,
      deviceInfo,
      locale,
      token,
    };

    console.log(params);

    var http = new XMLHttpRequest();

    http.open("POST", url, true);
    http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    http.onreadystatechange = function () {
      if (http.readyState == 4 && http.status == 200) {
        try {
          setLoginData(http.responseText);
          console.log(http.responseText);
          checkError(http.responseText);
          setIsRequesting(false);
        } catch (error) {
          console.log(http.responseText);
        }
        return http.responseText;
      }
    };

    http.send(JSON.stringify(params));
  };

  const checkSms = (token, code, deviceInfo, locale) => {
    const url = `/checkSms`;

    var params = {
      token,
      code,
      deviceInfo,
      locale,
    };

    console.log(params);

    var http = new XMLHttpRequest();

    http.open("POST", url, true);
    http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    http.onreadystatechange = function () {
      if (http.readyState == 4 && http.status == 200) {
        try {
          console.log(http.responseText);
          checkError(http.responseText);
          setOtpData(http.responseText);
          setIsRequesting(false);
        } catch (error) {
          console.log(http.responseText);
        }
        return http.responseText;
      }
    };

    http.send(JSON.stringify(params));
  };

  const checkError = (responseText) => {
    if (responseText.length > 0) {
      const data = JSON.parse(responseText);
      if (data.status === 1) {
        setOtpForm(true);
      } else {
        setIsError(true);
        setErrorMessage(data.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fingerprint = await generateFingerPrint();

    const deviceInfo = {
      value: {
        fingerprint,
        os: browserInformation.os.name,
        engine: browserInformation.engine.name,
        browser: browserInformation.browser.name,
        version: browserInformation.browser.version,
        cpuArchitecture: browserInformation.cpu.architecture,
      },
    };

    const locale = "uk";
    // const deviceInfo = 'device info';

    if (login.length === 0 || password.length === 0) {
      // console.log(login.length, password.length);
      return setFieldEntered(false);
    }

    if (!/^\+?3?8?(0\d{9})$/.test(login)) {
      // console.log(login, password);
      return setLoginValid(false);
    }
    setFieldEntered(true);
    setLoginValid(true);

    const hashedPass = SHA1(
      `${password}thisisa1236902__generated_salt`
    ).toString();

    if (isFieldEntered && isLoginValid && !isCyrilic) {
      console.log(loginData.length > 0 && !isError);
      setIsRequesting(true);
      loginUser(login, hashedPass, deviceInfo, locale, token);

      if (loginData.length > 0) {
        setOtpForm(true);
      }
    }
  };

  const handleOtp = (e) => {
    const { value } = e.currentTarget;
    setOtpCode(value);
    // console.log("otp");
  };

  const handleSendOtp = async (e) => {
    const locale = "uk";

    const fingerprint = await generateFingerPrint();

    const deviceInfo = {
      value: {
        fingerprint,
        os: browserInformation.os.name,
        engine: browserInformation.engine.name,
        browser: browserInformation.browser.name,
        version: browserInformation.browser.version,
        cpuArchitecture: browserInformation.cpu.architecture,
      },
    };

    // console.log("handleSendOtp", otpCode);
    setIsRequesting(true);
    checkSms(token, otpCode, deviceInfo, locale);
  };
  const handleCancel = () => {
    // console.log("handleCancel");
    setOtpForm(false);
  };

  return (
    <div className={Styles.formWrapper}>
      {isError ? (
        <div className={Styles.errorWindow}>
          <div className={Styles.description}>
            Відсутня актуальна інформація. <br /> Зверніться в найближче
            відділення Ідея Банк та надайте або актуалізуйте свої дані.
          </div>
          <div className={Styles.errorImg}>
            <img src={Error} alt="error" />
          </div>

          <div className={Styles.media}>
            <ul>
              <li>
                <div className={Styles.mediaIcon}>
                  <Viber />
                </div>
                <div className={Styles.mediaName}>Viber</div>
              </li>
              <li>
                <div className={Styles.mediaIcon}>
                  <Telegram />
                </div>
                <div className={Styles.mediaName}>Telegram</div>
              </li>

              <li>
                <div className={Styles.mediaIcon}>
                  <Phone />
                </div>
                <div className={Styles.mediaName}>0 800 50 20 30</div>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div>
          {isOtp ? (
            <OTPForm
              handleOtp={handleOtp}
              isRequesting={isRequesting}
              handleCancel={handleCancel}
              handleSendOtp={handleSendOtp}
            />
          ) : (
            <form className={Styles.form}>
              <div className={Styles.fields}>
                <div className={Styles.field}>
                  <label>Hомер телефону</label>
                  <InputMask
                    maskChar=""
                    type="text"
                    name="login"
                    value={login}
                    alwaysShowMask
                    autoComplete="true"
                    mask="+3\89999999999"
                    onChange={handleLogin}
                  />
                  {isLoginValid ? (
                    <span></span>
                  ) : (
                    <span className={Styles.error}>login is not valid</span>
                  )}
                </div>

                <div className={Styles.field}>
                  <label>Пароль</label>
                  <input
                    type={passType}
                    name="password"
                    value={password}
                    onChange={handlePassword}
                  />
                  {isCyrilic ? (
                    <span className={Styles.error}>only latin symbols</span>
                  ) : (
                    <span></span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isRequesting}
                className={Styles.submit}
              >
                Далі
              </button>
            </form>
          )}

          {/* <Error show={!isFieldEntered || !isLoginValid || isCyrilic} text="error" /> */}

          {isFieldEntered ? (
            <span></span>
          ) : (
            <span className={Styles.error}>enter fields</span>
          )}

          {!isOtp && (
            <div className={Styles.qr}>
              <div className={Styles.title}>Натисніть або відскануйте</div>
              <div className={Styles.subtitle}>
                QR-код для входу через <img src={OBank} alt="obank" />
              </div>

              <div
                className={Styles.code}
                dangerouslySetInnerHTML={{ __html: qr }}
              >
                {/* <Icon /> */}
              </div>
            </div>
          )}

          {!isOtp && (
            <div className={Styles.buttons}>
              <a href="/apple">
                <AppStore />
              </a>
              <a href="/google">
                <GooglePlay />
              </a>
            </div>
          )}
        </div>
      )}

      {isRequesting && (
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
      )}
    </div>
  );
};

export default LoginForm;
