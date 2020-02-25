/**
 * @author Diego Alberto Molina Vera
 * @copyright 2016 - 2018
 */

const assert = require('assert');

// -================= // =================-
const {
    TEST_cleanUnits,
    TEST_pxToEm,
    TEST_emToPx,
    TEST_hexToRgb,
    TEST_rgbToHex,
    TEST_colorToHex,
    Converter
} = require('../../converter');

// -================= // =================-

describe('Converter module', () => {
    it('Converts from `px` to `em`', () => {
        const passed = '19';
        const expected = '1.188em';

        // after had been cleaned
        assert(TEST_pxToEm(passed) === expected);

        // clean in case is not type as expected
        assert(TEST_pxToEm(TEST_cleanUnits(`${passed}px;`)) === expected);
        assert(TEST_pxToEm(TEST_cleanUnits(`    ${passed}px  `)) === expected);

        // using as expected
        assert(Converter.convert(TEST_cleanUnits(`${passed}px`), 'px') === expected);
    });

    it('Converts from `em|rem` to `px`', () => {
        const passed = '1.188';
        const expected = '19px';

        // em
        // after had been cleaned
        assert(TEST_emToPx(passed) === expected);

        // clean in case is not type as expected
        assert(TEST_emToPx(TEST_cleanUnits(`${passed}em;`)) === expected);
        assert(TEST_emToPx(TEST_cleanUnits(`    ${passed}em    `)) === expected);

        // using as expected
        assert(Converter.convert(TEST_cleanUnits(`${passed}em;`), 'em') === expected);

        // rem
        // clean in case is not type as expected
        assert(TEST_emToPx(TEST_cleanUnits(`${passed}rem;`)) === expected);
        assert(TEST_emToPx(TEST_cleanUnits(`    ${passed}rem    `)) === expected);

        // using as expected
        assert(Converter.convert(TEST_cleanUnits(`${passed}rem;`), 'rem') === expected);
    });

    it('Converts from `hexadecimal` to `rgb|rgba`', () => {
        const expected01 = 'rgba(255, 255, 255, 1) | rgb(255, 255, 255)';
        const expected02 = 'rgba(102, 255, 102, 1) | rgb(102, 255, 102)';
        const expected03 = 'rgba(230, 230, 0, 1) | rgb(230, 230, 0)';

        // after had been cleaned
        assert(TEST_hexToRgb('fff') === expected01);
        assert(TEST_hexToRgb('ffffff') === expected01);

        // clean in case is not type as expected
        assert(TEST_hexToRgb(TEST_cleanUnits('#ffffff;')) === expected01);
        assert(TEST_hexToRgb(TEST_cleanUnits('   #66ff66  ')) === expected02);
        assert(TEST_hexToRgb(TEST_cleanUnits('#e6e600')) === expected03);

        // // using as expected
        assert(Converter.convert(TEST_cleanUnits('#66ff66;'), '#') === expected02);
        assert(Converter.convert(TEST_cleanUnits('#e6e600;'), '#') === expected03);
        assert(Converter.convert(TEST_cleanUnits('#6f6;'), '#') === expected02);
    });

    it('Converts from `rgb|rgba` to `hexadecimal`', () => {
        const passed01 = '255, 255, 255';
        const passed02 = 'rgba(102, 255, 102, 1)';
        const passed03 = 'rgb(230, 230, 0)';

        // after had been cleaned
        assert(TEST_rgbToHex(passed01) === '#fff');

        // clean in case is not type as expected
        assert(TEST_rgbToHex(TEST_cleanUnits(passed01)) === '#fff');
        assert(TEST_rgbToHex(TEST_cleanUnits(passed02)) === '#6f6');
        assert(TEST_rgbToHex(TEST_cleanUnits(passed03)) === '#e6e600');

        // using as expected
        assert(Converter.convert(TEST_cleanUnits(passed01), 'rgb') === '#fff');
        assert(Converter.convert(TEST_cleanUnits(passed02), 'rgba') === '#6f6');
        assert(Converter.convert(TEST_cleanUnits(passed03), 'rgb') === '#e6e600');
    });

    it('Converts from `Color` to `hexadecimal`', () => {
        const passed = 'yellowgreen';

        // after had been cleaned
        assert(TEST_colorToHex(passed) === '#9acd32');

        // clean in case is not type as expected
        assert(TEST_colorToHex(passed) === '#9acd32');

        // using as expected
        assert(Converter.convert(passed, 'color') === '#9acd32');
    });
});
