"use client";

import { track } from "@/actions/track.action";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function getMiniInfo(window: Window & typeof globalThis) {
  let unknown = "-";

  // screen
  let screenSize = "";
  if (screen.width) {
    const width = screen.width ? screen.width : "";
    const height = screen.height ? screen.height : "";
    screenSize += "" + width + " x " + height;
  }

  // browser
  let nVer = navigator.appVersion;
  let nAgt = navigator.userAgent;
  let browser = navigator.appName;
  let version = "" + parseFloat(nVer);
  let nameOffset, verOffset, ix;

  // Yandex Browser
  if ((verOffset = nAgt.indexOf("YaBrowser")) != -1) {
    browser = "Yandex";
    version = nAgt.substring(verOffset + 10);
  }
  // Samsung Browser
  else if ((verOffset = nAgt.indexOf("SamsungBrowser")) != -1) {
    browser = "Samsung";
    version = nAgt.substring(verOffset + 15);
  }
  // UC Browser
  else if ((verOffset = nAgt.indexOf("UCBrowser")) != -1) {
    browser = "UC Browser";
    version = nAgt.substring(verOffset + 10);
  }
  // Opera Next
  else if ((verOffset = nAgt.indexOf("OPR")) != -1) {
    browser = "Opera";
    version = nAgt.substring(verOffset + 4);
  }
  // Opera
  else if ((verOffset = nAgt.indexOf("Opera")) != -1) {
    browser = "Opera";
    version = nAgt.substring(verOffset + 6);
    if ((verOffset = nAgt.indexOf("Version")) != -1) {
      version = nAgt.substring(verOffset + 8);
    }
  }
  // Legacy Edge
  else if ((verOffset = nAgt.indexOf("Edge")) != -1) {
    browser = "Microsoft Legacy Edge";
    version = nAgt.substring(verOffset + 5);
  }
  // Edge (Chromium)
  else if ((verOffset = nAgt.indexOf("Edg")) != -1) {
    browser = "Microsoft Edge";
    version = nAgt.substring(verOffset + 4);
  }
  // MSIE
  else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
    browser = "Microsoft Internet Explorer";
    version = nAgt.substring(verOffset + 5);
  }
  // Chrome
  else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
    browser = "Chrome";
    version = nAgt.substring(verOffset + 7);
  }
  // Safari
  else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
    browser = "Safari";
    version = nAgt.substring(verOffset + 7);
    if ((verOffset = nAgt.indexOf("Version")) != -1) {
      version = nAgt.substring(verOffset + 8);
    }
  }
  // Firefox
  else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
    browser = "Firefox";
    version = nAgt.substring(verOffset + 8);
  }
  // MSIE 11+
  else if (nAgt.indexOf("Trident/") != -1) {
    browser = "Microsoft Internet Explorer";
    version = nAgt.substring(nAgt.indexOf("rv:") + 3);
  }
  // Other browsers
  else if (
    (nameOffset = nAgt.lastIndexOf(" ") + 1) <
    (verOffset = nAgt.lastIndexOf("/"))
  ) {
    browser = nAgt.substring(nameOffset, verOffset);
    version = nAgt.substring(verOffset + 1);
    if (browser.toLowerCase() == browser.toUpperCase()) {
      browser = navigator.appName;
    }
  }
  // trim the version string
  if ((ix = version.indexOf(";")) != -1) version = version.substring(0, ix);
  if ((ix = version.indexOf(" ")) != -1) version = version.substring(0, ix);
  if ((ix = version.indexOf(")")) != -1) version = version.substring(0, ix);

  let majorVersion = parseInt("" + version, 10);
  if (isNaN(majorVersion)) {
    version = "" + parseFloat(nVer);
    majorVersion = parseInt(nVer, 10);
  }

  // mobile version
  let mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

  // cookie
  let cookieEnabled = navigator.cookieEnabled ? true : false;

  if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled) {
    document.cookie = "testcookie";
    cookieEnabled = document.cookie.indexOf("testcookie") != -1 ? true : false;
  }

  let os = "Unknown OS";
  if (navigator.userAgent.indexOf("Win") != -1) os = "Windows OS";
  if (navigator.userAgent.indexOf("Mac") != -1) os = "Macintosh";
  if (navigator.userAgent.indexOf("Linux") != -1) os = "Linux OS";
  if (navigator.userAgent.indexOf("Android") != -1) os = "Android OS";
  if (navigator.userAgent.indexOf("like Mac") != -1) os = "iOS";

  const obj = {
    screen: screenSize,
    browser: browser,
    browserVersion: version,
    browserMajorVersion: majorVersion,
    mobile: mobile,
    os: os,
    osVersion: "0",
    cookies: cookieEnabled,
  };

  return obj;
}

export default function Track() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== null) {
      fetch("https://api.ipify.org/?format=json")
        .then(async (response) => {
          const ip_data = await response.json();
          let ip = ip_data.ip;
          const data = getMiniInfo(window);
          await track({ ip, ...data, url: pathname });
        })
        .catch(async (err) => {
          let ip = undefined;
          const data = getMiniInfo(window);
          await track({ ip, ...data, url: pathname });
          console.log(err);
          return;
        });
    }
  }, []);
  return <></>;
}
