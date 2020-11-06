import { getErrorMsg } from './API';

// eslint-disable-next-line
export const doFetch = async (url, options) => {
    const response = await fetch(url, options);
    const { ok } = response;

    if (!ok && !url.match(/tokens\/card|verify|send/)) {
        throw new Error(getErrorMsg(response));
    }

    try {
        return response.json();
    } catch (e) {
        return { error: e };
    }
};
