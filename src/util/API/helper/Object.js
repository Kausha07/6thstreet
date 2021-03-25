export const queryString = (obj = {}) => Object.keys(obj)
    .map((key) => `${key}=${encodeURIComponent(obj[key])}`)
    .join('&');

export const clean = (obj = {}) => {
    const newObj = {};

    Object.keys(obj).forEach((key) => {
        if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
            newObj[key] = obj[key];
        }
    });

    return newObj;
};
