export const asyncTimeout = (callBack, timeout) => new Promise((resolve) => {
    setTimeout(() => resolve(callBack()), timeout);
});

export const getErrSource = (json) => {
    if (json === 'string') {
        return json;
    }

    const { data } = json;

    if (!data) {
        return json;
    }

    return data;
};

export const getErrorMsg = async (res) => {
    try {
        const json = await res.json();
        const data = getErrSource(json);

        if (typeof data === 'string') {
            return data;
        }

        const { error, message } = data;

        if (!error && !message) {
            return __('Something Went Wrong');
        }

        if (message) {
            return message;
        }

        if (typeof error === 'string') {
            return error;
        }

        if (error.error) {
            return error.error;
        }

        return __('Something Went Wrong');
    } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
        return __('Something Went Wrong');
    }
};
