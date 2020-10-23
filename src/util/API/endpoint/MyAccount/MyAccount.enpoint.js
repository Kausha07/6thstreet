import MobileAPI from '../../provider/MobileAPI';

/**
 * Authorize user for mobile API
 *
 * @param data object in a format of { username, password, cart_id }
 * @returns {*|{}}
 */
// eslint-disable-next-line import/prefer-default-export
export const getMobileApiAuthorizationToken = (data) => MobileAPI.post('/login', data) || {};
