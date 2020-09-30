// @ts-nocheck
/**
 * @author Diego Alberto Molina Vera
 * @copyright 2016 - 2018
 */

const assert = require('assert');

// -================= // =================-
const {
  cleanUnits,
  colorToHex,
  Converter,
  hexToRgb,
  rgbToHex,
  emToPx,
  pxToEm,
} = require('../../converter');

// -================= // =================-

describe('Converter module', () => {
  it('Converts from `px` to `em`', () => {
    const passed = '19';
    const expected = '1.188em';

    // after had been cleaned
    assert(pxToEm(passed) === expected);

    // clean in case is not type as expected
    assert(pxToEm(cleanUnits(`${passed}px;`)) === expected);
    assert(pxToEm(cleanUnits(`    ${passed}px  `)) === expected);

    // using as expected
    assert(Converter(cleanUnits(`${passed}px`), 'px') === expected);
  });

  it('Converts from `em|rem` to `px`', () => {
    const passed = '1.188';
    const expected = '19px';

    // em
    // after had been cleaned
    assert(emToPx(passed) === expected);

    // clean in case is not type as expected
    assert(emToPx(cleanUnits(`${passed}em;`)) === expected);
    assert(emToPx(cleanUnits(`    ${passed}em    `)) === expected);

    // using as expected
    assert(Converter(cleanUnits(`${passed}em;`), 'em') === expected);

    // rem
    // clean in case is not type as expected
    assert(emToPx(cleanUnits(`${passed}rem;`)) === expected);
    assert(emToPx(cleanUnits(`    ${passed}rem    `)) === expected);

    // using as expected
    assert(Converter(cleanUnits(`${passed}rem;`), 'rem') === expected);
  });

  it('Converts from `hexadecimal` to `rgb|rgba`', () => {
    const expected01 = 'rgba(255, 255, 255, 1) | rgb(255, 255, 255)';
    const expected02 = 'rgba(102, 255, 102, 1) | rgb(102, 255, 102)';
    const expected03 = 'rgba(230, 230, 0, 1) | rgb(230, 230, 0)';
    const expected04 = 'rgba(244, 37, 52, 1) | rgb(244, 37, 52)';

    // after had been cleaned
    assert(hexToRgb('fff') === expected01);
    assert(hexToRgb('ffffff') === expected01);

    // clean in case is not type as expected
    assert(hexToRgb(cleanUnits('#ffffff;')) === expected01);
    assert(hexToRgb(cleanUnits('   #66ff66  ')) === expected02);
    assert(hexToRgb(cleanUnits('#e6e600')) === expected03);

    assert(hexToRgb(cleanUnits('#F42534')) === expected04);

    // using as expected
    assert(Converter(cleanUnits('#66ff66;'), '#') === expected02);
    assert(Converter(cleanUnits('#e6e600;'), '#') === expected03);
    assert(Converter(cleanUnits('#6f6;'), '#') === expected02);
  });

  it('Converts from `rgb|rgba` to `hexadecimal`', () => {
    const passed01 = '255, 255, 255';
    const passed02 = 'rgba(102, 255, 102, 1)';
    const passed03 = 'rgb(230, 230, 0)';

    // after had been cleaned
    assert(rgbToHex(passed01) === '#fff');

    // clean in case is not type as expected
    assert(rgbToHex(cleanUnits(passed01)) === '#fff');
    assert(rgbToHex(cleanUnits(passed02)) === '#6f6');
    assert(rgbToHex(cleanUnits(passed03)) === '#e6e600');

    // using as expected
    assert(Converter(cleanUnits(passed01), 'rgb') === '#fff');
    assert(Converter(cleanUnits(passed02), 'rgba') === '#6f6');
    assert(Converter(cleanUnits(passed03), 'rgb') === '#e6e600');
  });

  it('Converts from `Color` to `hexadecimal`', () => {
    const passed = 'yellowgreen';

    // after had been cleaned
    assert(colorToHex(passed) === '#9acd32');

    // clean in case is not type as expected
    assert(colorToHex(passed) === '#9acd32');

    // using as expected
    assert(Converter(passed, 'color') === '#9acd32');
  });
});
