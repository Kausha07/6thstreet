/* eslint-disable import/prefer-default-export */
import apple from './icons/apple.png';
import card from './icons/card.png';
import cash from './icons/cash.png';
import tabby from './icons/tabby.png';

export const PAYMENTS_DATA = {
    checkoutcom_card_payment: {
        name: 'card',
        mod: { card: true },
        paragraph: __('card'),
        img: card
    },
    checkout: {
        name: 'card',
        mod: { card: true },
        paragraph: __('checkout'),
        img: card
    },
    apple_pay: {
        name: 'apple',
        mod: { apple: true },
        paragraph: null,
        img: apple
    },
    checkout_apple_pay: {
        name: 'apple',
        mod: { apple: true },
        paragraph: __('checkout'),
        img: apple
    },
    tabby_checkout: {
        name: 'tabby',
        mod: { tabby: true },
        paragraph: null,
        img: tabby
    },
    tabby_installments: {
        name: 'tabby',
        mod: { tabby: true },
        paragraph: null,
        img: tabby
    },
    msp_cashondelivery: {
        name: 'cash',
        mod: { cash: true },
        paragraph: __('cash'),
        img: cash
    },
    free: {
        name: 'free',
        mod: { free: true },
        paragraph: __('free'),
        img: cash
    }
};
