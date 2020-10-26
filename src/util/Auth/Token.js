import BrowserDatabase from 'Util/BrowserDatabase';

export const AUTH_TOKEN = 'auth_token';

export const MOBILE_AUTH_TOKEN = 'mobile_auth_token';

export const ONE_HOUR = 3600;

export const setAuthorizationToken = (token) => BrowserDatabase.setItem(token, AUTH_TOKEN, ONE_HOUR);

export const deleteAuthorizationToken = () => BrowserDatabase.deleteItem(AUTH_TOKEN);

export const getAuthorizationToken = () => BrowserDatabase.getItem(AUTH_TOKEN);

export const setMobileAuthorizationToken = (token) => BrowserDatabase.setItem(token, MOBILE_AUTH_TOKEN, ONE_HOUR);

export const deleteMobileAuthorizationToken = () => BrowserDatabase.deleteItem(MOBILE_AUTH_TOKEN);

export const getMobileAuthorizationToken = () => BrowserDatabase.getItem(MOBILE_AUTH_TOKEN);

export const isSignedIn = () => !!getAuthorizationToken() && !!getMobileAuthorizationToken();
