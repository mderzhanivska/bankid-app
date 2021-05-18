/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import Fingerprint2 from "fingerprintjs2";
import UAParser from "ua-parser-js";
import cx from 'classnames';

import InputMask from "react-input-mask";

import { ReactComponent as Logo } from "../../images/logo.svg";

import Styles from "./Auth.module.scss";

import {
  Header,
  OTPForm,
  Error,
  Spinner,
  QRCode,
  SocialLinks,
  MobileApproveForm,
} from "../../components";

export interface values {
  ru: string;
  en: string;
  uk: string;
}
export interface localization {
  app: string;
  id: number;
  key: string;
  section: string;
  values: values[];
}
export interface SettingsTypes {
  status: number;
  data: {
    localization: localization[];
  };
}

const ONE_MINUTE = 500;
const INTERVAL = 10;
const TIMER = ONE_MINUTE * INTERVAL;

const parser = new UAParser();
const browserInformation = parser.getResult();
const SHA1 = require("crypto-js/sha1");

const generateFingerPrint = () => {
  return new Promise((resolve) => {
    Fingerprint2.get((result) => {
      const fingerString = Fingerprint2.x64hash128(JSON.stringify(result), 31);
      resolve(fingerString);
    });
  });
};

const Auth = () => {
  const [qrEn, setQr] = useState("");
  const [login, setLogin] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isOtp, setOtpForm] = useState(false);
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [isCyrilic, setCyrilic] = useState(false);
  const [isLoginValid, setLoginValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [passType, setPassType] = useState("password");
  const [isRequesting, setIsRequesting] = useState(false);
  const [isFieldEntered, setFieldEntered] = useState(true);
  const [localization, setLocalization] = useState([]);
  const [currentLang, setLang] = useState("uk");

  const getLocalization = () => {
    const url = `/localization`;

    var params = {};

    var http = new XMLHttpRequest();

    http.open("POST", url, true);
    http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    http.onreadystatechange = function () {
      if (http.readyState == 4 && http.status == 200) {
        try {
          setLocalization(JSON.parse(http.responseText).data);
        } catch (error) {
          console.log(http.responseText);
        }
        return http.responseText;
      }
    };

    http.send(JSON.stringify(params));
  };

  useEffect(() => {
    window.localStorage.setItem("activeLang", "uk");
    getLocalization();
    const tokenElement = document.getElementById("token");
    const qrElement = document.getElementById("qr");
    let checkTokenByTimer;
    if (tokenElement !== null) {
      const token = tokenElement.getAttribute("data-token");

      const storedToken = window.localStorage.getItem('token');
      const storedStatus = window.localStorage.getItem('tokenStatus');
     
      
      if ((storedToken && storedStatus) && (storedToken.length > 0 && storedStatus.length > 0) && storedStatus === '7') {
        sendForm();
        window.localStorage.setItem('token', '');
        window.localStorage.setItem('tokenStatus', '');
      } else {
        // @ts-ignore
        window.localStorage.setItem("token", token);
        checkToken(token, window.localStorage.getItem('activeLang'));
        checkTokenByTimer = setInterval(
          () => checkToken(token, window.localStorage.getItem('activeLang')),
          TIMER
        );
      };
    };
    if (qrElement !== null) {
      const qr = qrElement.getAttribute("data-qr");

      if (qr !== null) {
        setQr(decodeURIComponent(qr));
      }
    };
    return () => {
      clearInterval(checkTokenByTimer);
    };
  }, []);

  const handleLogin = (e) => {
    const { value } = e.currentTarget;
    setLogin(value);

    if (!isLoginValid) {
      if (!/^\+?3?8?(0\d{9})$/.test(value)) {
        return setLoginValid(false);
      } else {
        return setLoginValid(true);
      }
    }
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

  const sendForm = () => {
    document.forms["mobileAproval"].submit();
  };

  const checkTokenStatus = (responseText) => {
    if (responseText.length > 0) {
      const data = JSON.parse(responseText);
      switch (data.data.tokenStatus) {
        case 1:
          // console.log(data.data.tokenStatus);
          window.localStorage.setItem('tokenStatus', data.data.tokenStatus);
          break;
        case 5:
          setIsRequesting(true);
          window.localStorage.setItem('tokenStatus', data.data.tokenStatus);
          break;
        case 7:
          sendForm();
          window.localStorage.setItem('tokenStatus', data.data.tokenStatus);
          break;
        case 10:
        case 11:
        case 13:
          setIsError(true);
          window.localStorage.setItem('tokenStatus', data.data.tokenStatus);
          break;
        default:
          console.log(data.data.tokenStatus);
          window.localStorage.setItem('tokenStatus', data.data.tokenStatus);
          break;
      }
    }
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

  const loginUser = (login, password, deviceInfo, locale, token) => {
    const url = `/auth`;

    var params = {
      login,
      password,
      deviceInfo,
      locale,
      token,
    };

    var http = new XMLHttpRequest();

    http.open("POST", url, true);
    http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    http.onreadystatechange = function () {
      if (http.readyState == 4 && http.status == 200) {
        try {
          checkError(http.responseText);
          setIsRequesting(false);
          setOtpForm(true);
        } catch (error) {
          console.log(http.responseText);
        }
        return http.responseText;
      }
    };

    http.send(JSON.stringify(params));
  };

  const checkToken = async (token, locale) => {
    const url = `/checkToken`;

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

    var params = {
      token,
      deviceInfo,
      locale,
    };

    var http = new XMLHttpRequest();

    http.open("POST", url, true);
    http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    http.onreadystatechange = function () {
      if (http.readyState == 4 && http.status == 200) {
        try {
          checkTokenStatus(http.responseText);
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

    var http = new XMLHttpRequest();

    http.open("POST", url, true);
    http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    http.onreadystatechange = function () {
      if (http.readyState == 4 && http.status == 200) {
        try {
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

  const handleOtp = (e) => {
    const { value } = e.currentTarget;
    setOtpCode(value);
  };

  const handleCancel = () => {
    setOtpForm(false);
  };

  const handleSendOtp = async (e) => {
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

    setIsRequesting(true);
    checkSms(window.localStorage.getItem('token'), otpCode, deviceInfo, window.localStorage.getItem('activeLang'));
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

    if (login.length === 0 || password.length === 0) {
      return setFieldEntered(false);
    }

    if (!/^\+?3?8?(0\d{9})$/.test(login)) {
      return setLoginValid(false);
    }
    setFieldEntered(true);
    setLoginValid(true);

    const hashedPass = SHA1(
      `${password}thisisa1236902__generated_salt`
    ).toString();

    console.log(window.localStorage.getItem('token'))

    if (isFieldEntered && isLoginValid && !isCyrilic) {
      setIsRequesting(true);
      loginUser(login, hashedPass, deviceInfo, window.localStorage.getItem('activeLang'), window.localStorage.getItem('token'));
    }
  };

  const handleKeypress = (e) => {
    if (e.keyCode === 13) {
      handleSubmit(e);
    }
  };

  const localize = (section, key) => {
    const term = localization.find(
      // @ts-ignore
      (term) => term.section === section && term.key === key
      // @ts-ignore
    )?.values[currentLang];
    const template = `${section}:${key}`;

    if (term) {
      return term;
    } else return template;
  };

  const langs = [
    {
      str: "ru",
      int: 0,
    },
    {
      str: "uk",
      int: 1,
    },
    {
      str: "en",
      int: 2,
    },
  ];

  const onLangChange = (e) => {
    const { id } = e.currentTarget;
    const updatedLang = langs.find((lang) => String(lang.int) === id);
    if (updatedLang) {
      setLang(updatedLang.str);
      window.localStorage.setItem("activeLang", updatedLang.str);
    }
  };

  console.log(isRequesting)

  return (
    <div className={Styles.page}>
      <Header
        localize={localize}
        langs={langs}
        onLangChange={onLangChange}
        activeLang={window.localStorage.getItem('activeLang')}
      />

      <div className={Styles.content}>
        <div className={Styles.logo}>
          <div className={Styles.text}>{localize("sign_in", "bank_id")}</div>
          <div className={Styles.icon}>
            <Logo />
          </div>
          {!isOtp && <div className={cx(Styles.text, Styles.desktop)}>{localize("sign_in", "log_in")}</div>}
        </div>

        <div className={Styles.formWrapper}>
          {isError ? (
            <Error localize={localize} errorMessage={errorMessage} />
          ) : isRequesting ? (
            <div></div>
          ) : (
                <div className={Styles.wrapper}>
                  {isOtp ? (
                    <OTPForm
                      localize={localize}
                      handleOtp={handleOtp}
                      isRequesting={isRequesting}
                      handleCancel={handleCancel}
                      handleSendOtp={handleSendOtp}
                    />
                  ) : (
                      <form className={Styles.form}>
                        <div className={Styles.fields}>
                          <div className={Styles.field}>
                            <label>{localize("sign_in", "phone_number")}</label>
                            <InputMask
                              maskChar=""
                              type="text"
                              name="login"
                              value={login}
                              alwaysShowMask
                              autoComplete="true"
                              mask="+3\89999999999"
                              onChange={handleLogin}
                              onKeyPress={handleKeypress}
                            />
                            {isLoginValid ? (
                              <span></span>
                            ) : (
                                <span className={Styles.error}>
                                  {localize("sign_in", "login_not_valid")}
                                </span>
                              )}
                          </div>

                          <div className={Styles.field}>
                            <label>{localize("sign_in", "password")}</label>
                            <input
                              type={passType}
                              name="password"
                              value={password}
                              onKeyPress={handleKeypress}
                              onChange={handlePassword}
                            />
                            {isCyrilic ? (
                              <span className={Styles.error}>
                                {localize("sign_in", "only_latin_symbols")}
                              </span>
                            ) : (
                                <span></span>
                              )}
                          </div>
                        </div>
                        <button
                          type="submit"
                          id="loginBtn"
                          onClick={handleSubmit}
                          disabled={isRequesting}
                          className={Styles.submit}
                        >
                          {localize("sign_in", "next")}
                        </button>
                      </form>
                    )}

                  {/* <Error show={!isFieldEntered || !isLoginValid || isCyrilic} text="error" /> */}

                  {!isFieldEntered && (
                    <span className={Styles.error}>
                      {localize("sign_in", "enter_fields")}
                    </span>
                  )}

                  {!isOtp && <QRCode qr={qrEn} localize={localize} />}

                  {!isOtp && <SocialLinks />}
                </div>
              )}

          <MobileApproveForm
            isRequesting={isRequesting}
            handleCancel={handleCancel}
            token={window.localStorage.getItem('token')}
          />

          {isRequesting && window.localStorage.getItem('tokenStatus') === '5' &&  <div className={Styles.text}>{localize("sign_in", "mobile_login")}</div> }

          {isRequesting && <Spinner />}
        </div>
      </div>
    </div>
  );
};

export default Auth;
