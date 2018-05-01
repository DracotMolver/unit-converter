/**
 * @author Diego Alberto Molina Vera
 * @copyright 2016 - 2018
 */

// -================= // =================-
const colors = require('./helpers/colors/colors');
// -================= // =================-

/**
 * Converts from hexadecimal to rgb or rgba
 *
 * @param {string} content
 */
const hexToRgb = content => {
    const rgba = [];

    // divide the value in the next possible ways
    // 3 => [f, f, f]
    // 6 => [ff, ff, ff]
    const hexadecimal = content.length > 3
        ? content.match(/[a-f\d]{2}/g)
        : content;

    for (let index = 0, size = hexadecimal.length; index < size; index += 1) {
        rgba.push(
            parseInt( // Parse the number or the letter using 16 base
                hexadecimal[index].length === 2
                    ? hexadecimal[index]
                    : `${hexadecimal[index]}${hexadecimal[index]}`,
                16
            ).toString()
        );
    }

    const rgbOrRgba = rgba.join(', ');
    return `rgba(${rgbOrRgba}, 1) | rgb(${rgbOrRgba})`;
};
/* -=test=- This is only for testing -=test=- */
const TEST_hexToRgb = hexToRgb;

/**
 * Converts from rgb or rgba to hexadecimals
 *
 * @param {string} content
 */
const rgbToHex = content => {
    let strInt = 0;
    let hexadecimal = [];

    // Remove the parenthesis of the value and convert the value into an array
    // As the convertion is to hexadecimal of 6 digits we need to avoid the alpha
    // channel
    // /\b(rgb|rgba)(\(.+\)|;)+/g
    const rgb = content.replace(')', '').split(',');
    if (rgb.length === 4) {
        rgb.pop();
    }

    for (let index = 0, size = rgb.length; index < size; index += 1) {
        strInt = Number(rgb[index]);

        hexadecimal.push(
            strInt < 10 ? `0${strInt}` : strInt.toString(16)
        );
    }

    // check if the pairs of hexadecimals values can be minified
    // [ff, ff, ff]
    const [a, b, c, ...rest] = hexadecimal;
    if (a[0] === a[1] && b[0] === b[1] && c[0] === c[1]) {
        hexadecimal = [a[0], b[0], c[0], ...rest];
    }

    return `#${hexadecimal.join('')}`;
};
/* -=test=- This is only for testing -=test=- */
const TEST_rgbToHex = rgbToHex;

/**
 * Converts from em or rem to pixels
 * @param {string} content
 */
const emToPx = content => `${Math.round(parseFloat(content) * 16)}px`;
/* -=test=- This is only for testing -=test=- */
const TEST_emToPx = emToPx;

/**
 * Converts from pixels to em or rem (you choose the unit)
 * @param {string} content
 */
const pxToEm = content => `${Math.round((Number(content) / 16) * 1000) / 1000}em`;
/* -=test=- This is only for testing -=test=- */
const TEST_pxToEm = pxToEm;

const colorToHex = content => colors[content].toLowerCase();
/* -=test=- This is only for testing -=test=- */
const TEST_colorToHex = colorToHex;

/**
 * Cleans the units and the `;` characters
 * This method is use only when the user sets text in the input box
 *
 * @param {string} content
 */
const cleanUnits = content => content.trim().replace(/^(rgb\(|rgba\(|#)|(rem|px|em|;)+$/g, '');
/* -=test=- This is only for testing -=test=- */
const TEST_cleanUnits = cleanUnits;

const Converter = Object.freeze({
    convert: (content, convertTo) => {
        switch (convertTo) {
            case 'px':
                return pxToEm(content);
            case 'em':
            case 'rem':
                return emToPx(content);
            case '#':
                return hexToRgb(content);
            case 'rgb':
            case 'rgba':
                return rgbToHex(content);
            case 'color':
                return colorToHex(content);
            default:
                return null;
        }
    }
});

module.exports = Object.freeze({
    Converter,
    cleanUnits,
    // -== test ==-
    TEST_cleanUnits,
    TEST_pxToEm,
    TEST_emToPx,
    TEST_hexToRgb,
    TEST_rgbToHex,
    TEST_colorToHex
});
