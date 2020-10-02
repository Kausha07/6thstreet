export const isArabic = () => JSON.parse(localStorage.getItem('APP_STATE_CACHE_KEY')).data.language === 'ar';

export default {};
