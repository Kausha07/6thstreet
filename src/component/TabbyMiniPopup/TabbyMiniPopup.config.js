/* eslint-disable import/prefer-default-export */
import check from './icons/check.svg';
import clock from './icons/clock.svg';
import procent from './icons/procent.svg';

export const TABBY_MINI_POPUP_ID = 'tabby_popup';

export const TABBY_ROW_DATA = {
    fees: {
        title: __('No fees'),
        text: __('Zero interest and no hidden fees.'),
        img: procent
    },
    card: {
        title: __('No credit card? No problem!'),
        text: __('Use any debit card to repay.'),
        img: check
    },
    easy: {
        title: __('Quick and easy'),
        text: __('Simply verify your details and complete your checkout.'),
        img: clock
    }
};
