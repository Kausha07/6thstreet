import MagentoAPI from 'Util/API/provider/MagentoAPI';

import MobileAPI from '../../provider/MobileAPI';

export const getStoreCredit = () => MagentoAPI.get('/returns/storecredit') || {};

export const getStoreCredit2 = () => MobileAPI.get('/returns/storecredit2') || {};
