import MagentoAPI from '../../provider/MagentoAPI';

export const postFeedback = (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
    });

    const options = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }

    return MagentoAPI.post(`contactus`, formData, options) || {};
};