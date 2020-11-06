import { getErrorMsg } from './API';

// eslint-disable-next-line
export const doFetch = async (url, options) => {
    const response = await fetch(url, options);
    const { ok } = response;
    const regExpUrl = /tokens\/card|\/tabby\/payments|create-order2/;

    if (!ok && !url.match(regExpUrl)) {
        throw new Error(getErrorMsg(response));
    }

    try {
        return response.json();
    } catch (e) {
        return { error: e };
    }
};
