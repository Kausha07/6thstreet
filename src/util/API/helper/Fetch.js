import { getErrorMsg } from './API';

// eslint-disable-next-line
export const doFetch = async (url, options) => {
    try {
        const response = await fetch(url, options);
        const { ok } = response;
        const regExpUrl = /verify|send/;

        if (!ok && !url.match(regExpUrl)) {
            const error = getErrorMsg(response);

            if (typeof error !== 'object') {
                throw new Error(error);
            } else {
                return error;
            }
        }
        return response.json();
    } catch (e) {
        return { error: e };
    }
};
