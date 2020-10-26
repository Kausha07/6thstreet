/* eslint-disable no-magic-numbers */

export const CONST_TEN = 10;

export const CONXT_HUNDRED = 100;

export const appendOrdinalSuffix = (number) => {
    const mod10x = number % CONST_TEN;
    const mod100x = number % CONXT_HUNDRED;

    if (mod10x === 1 && mod100x !== 11) {
        return `${ number }st`;
    }

    if (mod10x === 2 && mod100x !== 12) {
        return `${ number }nd`;
    }

    if (mod10x === 3 && mod100x !== 13) {
        return `${ number }rd`;
    }

    return `${ number }th`;
};
