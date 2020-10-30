import { APP_CONFIG_CACHE_KEY } from 'Store/AppConfig/AppConfig.reducer';
import { APP_STATE_CACHE_KEY } from 'Store/AppState/AppState.reducer';
import BrowserDatabase from 'Util/BrowserDatabase';

export const getCurrency = () => {
    const { country } = BrowserDatabase.getItem(APP_STATE_CACHE_KEY) || {};
    const { config: { countries = {} } = {} } = BrowserDatabase.getItem(APP_CONFIG_CACHE_KEY) || {};
    const { currency } = countries[country] || {};

    return currency || '';
};

export const isDiscountApplied = (cartTotals, totalsCode) => {
    const { total_segments: totals = [] } = cartTotals || {};
    const { value: storeCreditBalance } = totals.find(({ code }) => code === totalsCode) || 0;

    return !!(storeCreditBalance && storeCreditBalance !== 0);
};

export const isArabic = () => JSON.parse(localStorage.getItem('APP_STATE_CACHE_KEY')).data.language === 'ar';

export default {};
