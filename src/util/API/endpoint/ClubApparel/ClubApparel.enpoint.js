import MobileAPI from '../../provider/MobileAPI';

// eslint-disable-next-line import/prefer-default-export
export const getMember = ({ userId }) => MobileAPI.get(
    `/club-apparel/members/${userId}`
) || {};

export const linkAccount = (data) => MobileAPI.post(
    '/club-apparel/link',
    data
) || {};

export const verifyOtp = (data) => MobileAPI.post(
    '/club-apparel/verify',
    data
) || {};
