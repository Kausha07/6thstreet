import { getErrorMsg } from './API';

// eslint-disable-next-line import/prefer-default-export
export const doFetch = async (url, options) => {
    const response = await fetch(url, options);
    const { ok } = response;

    if (!ok) {
        throw new Error(getErrorMsg(response));
    }

    try {
        return response.json();
    } catch (e) {
        return { error: e };
    }
};
