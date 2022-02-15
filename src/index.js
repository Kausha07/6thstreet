/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

/* eslint-disable simple-import-sort/sort */
/* eslint-disable func-names */
/* eslint-disable no-console */
import "SourceUtil/Polyfill";
import "Style/main";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import {Workbox} from 'workbox-window';


import { render } from "react-dom";

import App from "Component/App";

window.__DEV__ = process.env.NODE_ENV === "development";
Sentry.init({ dsn: process.env.REACT_APP_SENTRY_ENDPOINT });
// let's register service-worker
// but not in development mode, the cache can destroy the DX
if (process.env.NODE_ENV  === "development" && "serviceWorker" in navigator) {
  window.addEventListener("beforeinstallprompt", ev => { 
    ev.preventDefault();
  });
  
  window.addEventListener("load", () => {
    const swUrl = '/sw.js';
    window.wb = new Workbox(swUrl);
    const newVersionPopupEvent = new Event("showNewVersionPopup");
  
    const showSkipWaitingPrompt = (event) => {
      window.dispatchEvent(newVersionPopupEvent)
    }
    window.wb.addEventListener('waiting', showSkipWaitingPrompt);
    window.wb.register();


    // navigator.serviceWorker.register(swUrl).then((reg) => {
    //   const newVersionPopupEvent = new Event("showNewVersionPopup");

    //   // eslint-disable-next-line no-param-reassign
    //   reg.onupdatefound = function () {
    //     const installingWorker = reg.installing;

    //     installingWorker.onstatechange = function () {
    //       if (installingWorker.state === "redundant") {
    //         console.error(
    //           "***",
    //           "The installing service worker became redundant."
    //         );
    //         window.dispatchEvent(newVersionPopupEvent);
    //       }
    //     };
    //   };
    // })
  });
}
render(<App />, document.getElementById("root"));
