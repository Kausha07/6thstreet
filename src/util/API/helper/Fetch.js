import { getErrorMsg } from './API';

// eslint-disable-next-line
export const doFetch = async (url, options) => {
    const response = await fetch(url, options);
    const { ok } = response;
<<<<<<< Updated upstream
    const regExpUrl = /tokens\/card|\/tabby\/payments|create-order2/;
=======
    const regExpUrl = /verify|send/;
>>>>>>> Stashed changes

    if (!ok && !url.match(regExpUrl)) {
        const error = getErrorMsg(response);

        if (typeof error !== 'object') {
            throw new Error(error);
        }
    }

    try {
        return response.json();
    } catch (e) {
        return { error: e };
    }
};
