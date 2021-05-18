/* eslint-disable eqeqeq */


import Fingerprint2 from "fingerprintjs2";
import UAParser from "ua-parser-js";

const parser = new UAParser();
const browserInformation = parser.getResult();

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

export const getAppSettings = () => {
  const url = `http://194.44.209.213/api/`;

  var params = {
    args: "",
    action: "web.settings.appSettings",
  };

  var http = new XMLHttpRequest();

  http.open("POST", url, true);
  http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  http.onreadystatechange = function () {
    if (http.readyState == 4 && http.status == 200) {
      try {
        console.log("http.responseText");
        // console.log(http.responseText);
      } catch (error) {
        console.log(http.responseText);
      }
      return http.responseText;
    }
  };

  http.send(JSON.stringify(params));
  console.log(http.responseText);
  return http.responseText;
};

export const loginUser = (login, password, deviceInfo, locale, token) => {
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
        console.log("http.responseText");
        console.log(http.responseText);
        
      } catch (error) {
        console.log(http.responseText);
      }
      return http.responseText;
    }
  };

  http.send(JSON.stringify(params));
};

export const checkSms = (token, code, deviceInfo, locale) => {
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
        console.log("http.responseText");
        console.log(http.responseText);
      } catch (error) {
        console.log(http.responseText);
      }
      return http.responseText;
    }
  };

  http.send(JSON.stringify(params));
};

export const checkToken = async (token,locale) => {
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

  console.log(params);

  var http = new XMLHttpRequest();

  http.open("POST", url, true);
  http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  http.onreadystatechange = function () {
    if (http.readyState == 4 && http.status == 200) {
      try {
        console.log("http.responseText");
        console.log(http.responseText);
      } catch (error) {
        console.log(http.responseText);
      }
      return http.responseText;
    }
  };

  http.send(JSON.stringify(params));
};