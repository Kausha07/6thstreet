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
import 'SourceUtil/Polyfill';
import 'Style/main';

import { render } from 'react-dom';

import App from 'Component/App';

window.__DEV__ = process.env.NODE_ENV === 'development';

// let's register service-worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('./service-worker.js')
            .then(
                (reg) => {
                    const newVersionPopupEvent = new Event('showNewVersionPopup');

                    // eslint-disable-next-line no-param-reassign
                    reg.onupdatefound = function () {
                        const installingWorker = reg.installing;

                        installingWorker.onstatechange = function () {
                            if (installingWorker.state === 'redundant') {
                                console.error('***', 'The installing service worker became redundant.');
                                window.dispatchEvent(newVersionPopupEvent);
                            }
                        };
                    };
                }
            );
    });
}

render(<App />, document.getElementById('root'));
