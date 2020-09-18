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
import 'Util/Polyfill';
import 'Style/main';

import { render } from 'react-dom';

import App from 'Component/App';

window.__DEV__ = process.env.NODE_ENV === 'development';

render(<App />, document.getElementById('root'));
