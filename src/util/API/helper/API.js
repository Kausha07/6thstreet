export const asyncTimeout = (callBack, timeout) => new Promise((resolve) => {
    setTimeout(() => resolve(callBack()), timeout);
});

export const getErrorMsg = (res) => {
    const { error, message } = res.data || {};
    // eslint-disable-next-line fp/no-let
    let msg = '';

    // TODO: Talk to backend team
    // to standardize error messages

    if (typeof error === 'string') {
        msg += ` ${error}`;
    } else if (error?.error) {
        msg += ` ${error?.error}`;
    } else if (message) {
        msg += ` ${message}`;
    } else {
        msg += ` ${__('Something Went Wrong')}`;
    }

    return msg;
};
