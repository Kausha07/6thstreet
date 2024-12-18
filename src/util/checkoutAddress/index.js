export const trimCustomerAddressCheckout = (customerAddress = {}) => {
    const {
        city,
        company,
        country_id,
        email,
        firstname,
        lastname,
        method,
        postcode,
        street,
        telephone,
        region,
        country_code,
        area,
        phone,
    } = customerAddress;

    return {
        city,
        company,
        country_id : country_id || country_code,
        email,
        firstname,
        lastname,
        method,
        postcode: postcode ?? street,
        street,
        telephone: telephone ?? phone,
        country_code : country_id || country_code,
        area,
        ...region
    };
};
