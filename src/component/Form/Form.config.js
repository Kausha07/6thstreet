/* eslint-disable no-useless-escape */
/* eslint-disable max-len */
export const MIN_PASSWORD_LENGTH = 6;

export const validateEmail = ({ value }) => value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
export const validateEmails = ({ value = '' }) => value.split(',').every((email) => validateEmail({ value: email.trim() }));
export const validatePassword = ({ value }) => value.length >= MIN_PASSWORD_LENGTH;
export const validateContainNumber = ({ value }) => /\d/.test(value);
export const validateContainCapitalize = ({ value }) => /[A-Z]/.test(value);
export const validateTelephoneAE = ({ value }) => value.length > 0 && value.match(/^[1-9][0-9]{8}$/);
export const validateTelephone = ({ value }) => value.length > 0 && value.match(/^[1-9][0-9]{7}$/);
export const isNotEmpty = ({ value }) => value.trim().length > 0;
export const validatePasswordMatch = ({ value }, { password }) => {
    const { current: { value: passwordValue } } = password || { current: {} };
    return value === passwordValue;
};
export const onlyCharacters = ({value}) => value.trim().match(/^([a-zA-Z]+\s)*[a-zA-Z]+$/);

export default {
    email: {
        validate: validateEmail,
        message: __('Invalid email address')
    },
    emails: {
        validate: validateEmails,
        message: __('Email addresses are not valid')
    },
    password: {
        validate: validatePassword,
        message: __('Password should be at least 6 characters long')
    },
    containNumber: {
        validate: validateContainNumber,
        message: __('This field should contain at least 1 number character')
    },
    containCapitalize: {
        validate: validateContainCapitalize,
        message: __('This field should contain at least 1 capitalized character')
    },
    telephone: {
        validate: validateTelephone,
        message: __('Please ensure you input the correct mobile number')
    },
    telephoneAE: {
        validate: validateTelephoneAE,
        message: __('Please ensure you input the correct mobile number')
    },
    notEmpty: {
        validate: isNotEmpty,
        message: __('This is a required field!')
    },
    password_match: {
        validate: validatePasswordMatch,
        message: __('Password does not match.')
    },
    onlyCharacters: {
        validate: onlyCharacters,
        message: __('This field should contain only alphabets')
    }
};
