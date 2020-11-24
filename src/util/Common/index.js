/* eslint-disable no-magic-numbers */

export const CONST_TEN = 10;

export const CONST_HUNDRED = 100;

export const appendOrdinalSuffix = (number) => {
    const mod10x = number % CONST_TEN;
    const mod100x = number % CONST_HUNDRED;

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

export const SPECIAL_COLORS = {
    beige: '#f5f5dc',
    clear: '#fff',
    cream: '#ffe4b5',
    metallic: '#cdb5cd',
    multi: '#000',
    nude: '#faebd7',
    opaque_color: '#FBFBFB',
    gray400: '#222222',
    darkGray: '#333333',
    lightGray: '#f9f9f9',
    pureWhite: '#FFFFFF',
    offWhite: '#f7f7f7',
    lightOrange: '#cb9f7f',
    ltPink: '#F4E3E0',
    pinkTransparent: 'rgba(255, 161, 155, .8)',
    altGrey: '#554C4C',
    fadedGrey: 'rgba(85, 76, 76, 0.45)',
    fadedBlack: '#434343',
    doubleDarkPink: '#7E7070',
    silver: '#CAC0C0',
    silver2: '#BFBBBB',
    silver3: '#D1D3D4',
    ltPink2: '#C0BBBB',
    salmon: '#FA8072',
    pinkLine: '#ECE5E5',
    pinkText: '#D6817B',
    pinkBg: '#FDF0EF',
    lightPinkText: '#BDB3B3',
    separator: '#ECE5E5',
    inActiveLightPink: '#ECE5E5',
    dkBlack: '#000000',
    coffee: '#D0C8C8',
    boulder: '#7C7676',
    mercury: '#E4E4E4',
    cararra: '#FAFAF8',
    spring_wood: '#FAFAF8',
    spring_wood2: '#FBFAF8',
    chambray: '#3C5193',
    corn_blue: '#4285F4',
    white_linen: '#FBF0EF',
    contessa: '#CB857E',
    desertStorm: '#EDEDEA',
    silver_chalice: '#AEA9A9',
    green: '#81BE4A',
    pink_red: '#FF918D',
    categoriesGrey: '#F3F3F3',
    yuma: '#C8B581',
    nobel: '#9B9B9B',
    fire_red: '#D12229',
    charcoal: '#4A4A4A',
    zumthor: '#D1D3D4',
    white_smoke: '#EFEFEF',
    snow: '#F9F9F9',
    alto: '#D6D6D6',
    white: '#FFF',
    black: '#000',
    black2: '#4A4A4A',
    black3: '#555',
    black4: '#282828',
    transparent_black: 'rgba(0,0,0,0.7)',
    red: '#D12229',
    red2: '#ff3232',
    red3: '#FF0029',
    red4: '#F01136',
    pink: '#FFA19B',
    pink2: '#F4E3E0',
    gray: '#F5F5F5',
    gray2: '#D1D3D4',
    gray3: '#CCCCCC',
    gray4: '#EFEFEF',
    gray5: '#9B9B9B',
    gray6: '#F9F9F9',
    gray7: '#D8D8D8',
    gray8: '#F3F4F6',
    grey9: '#F0F0F0',
    gray10: '#ECECEC',
    orange: '#F96446',
    gold: '#C8B581',
    shamrock: '#28D9AA',
    thunder: '#231F20',
    alabaster: '#F8F8F8',
    turquoise: '#3EEDBF',
    sorell_brown: '#CCBA8A',
    wildSand: '#F6F6F6',
    resolutionBlue: '#042295',
    brightTurquoise: '#20EFBE',
    lavenderBlush: '#FFF9FA',
    peach: '#FF7355',
    blush: '#FFC0B2'
};
