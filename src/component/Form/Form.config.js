/* eslint-disable no-useless-escape */
/* eslint-disable max-len */
export const MIN_PASSWORD_LENGTH = 6;

export const validateEmail = ({ value }) => value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
export const validateEmails = ({ value }) => value.split(',').every((email) => validateEmail({ value: email.trim() }));
export const validatePassword = ({ value }) => value.length >= MIN_PASSWORD_LENGTH;
export const validateTelephone = ({ value }) => value.length > 0 && value.match(/^\+(?:[0-9-] ?){6,14}[0-9]$/);
export const isNotEmpty = ({ value }) => value.trim().length > 0;
export const validatePasswordMatch = ({ value }, { password }) => {
    const { current: { value: passwordValue } } = password || { current: {} };
    return value === passwordValue;
};

export default {
    email: {
        validate: validateEmail,
        message: __('Email is invalid.')
    },
    emails: {
        validate: validateEmails,
        message: __('Email addresses are not valid')
    },
    password: {
        validate: validatePassword,
        message: __('Password should be at least 6 characters long')
    },
    telephone: {
        validate: validateTelephone,
        message: __('Phone number is invalid!')
    },
    notEmpty: {
        validate: isNotEmpty,
        message: __('This field is required!')
    },
    password_match: {
        validate: validatePasswordMatch,
        message: __('Password does not match.')
    }
};
