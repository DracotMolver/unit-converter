/**
 * @author Diego Alberto Molina Vera
 * @copyright 2016 - 2018
 */

// -================= // =================-
const colors = require('./helpers/colors');

// -================= // =================-

/**
 * Converts from hexadecimal to rgb or rgba
 *
 * @param {string} content - The text to convert
 * @return {string} - It returns the next structure `rgba() | rgb()`;
 */
const hexToRgb = content => {
  // divide the value in the next possible ways
  // 3 => [f, f, f]
  // 6 => [ff, ff, ff]
  const hexadecimal = content.length > 3
    ? content.match(/[a-f\d]{2}/g)
    : content.split('');

  const rgba = hexadecimal.map(value =>
    parseInt( // Parse the number or the letter using 16 base
      value.length === 2
        ? value
        : `${value}${value}`,
      16
    ).toString()
  ).join(', ');

  return `rgba(${rgba}, 1) | rgb(${rgba})`;
};

/**
 * Converts from rgb or rgba to hexadecimals
 *
 * @param {string} content - The content to convert
 * @return {string} - Returns the next structure `#[hexadecimal]`;
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

  hexadecimal = rgb.map(value => {
    strInt = Number(value);
    return strInt < 10 ? `0${strInt}` : strInt.toString(16);
  });

  // check if the pairs of hexadecimals values can be minified
  // [ff, ff, ff]
  const [a, b, c, ...rest] = hexadecimal;
  if (a[0] === a[1] && b[0] === b[1] && c[0] === c[1]) {
    hexadecimal = [a[0], b[0], c[0], ...rest];
  }

  return `#${hexadecimal.join('')}`;
};

/**
 * Converts from em or rem to pixels
 *
 * @param {string} content - The content to convert
 * @return {string} - Returns the next structure `[number]px`
 */
const emToPx = content => `${Math.round(parseFloat(content) * 16)}px`;

/**
 * Converts from pixels to em or rem (you choose the unit)
 *
 * @param {string} content - The content to convert
 * @return {string} - Returns the next structure `[number]em`
 */
const pxToEm = content => `${Math.round((Number(content) / 16) * 1000) / 1000}em`;

/**
 * Get the color equivalent on hexadecimals
 *
 * @param {string} content - The colour name
 * @return {string} - The hexadecimal equivalent
 */
const colorToHex = content => colors[content].toLowerCase();

/**
 * Cleans the units and the `;` characters
 * This method is use only when the user sets text in the input box
 *
 * @param {string} content - The content to convert
 * @return {string} - Returns the content cleaned
 */
const cleanUnits = content => content.trim().replace(/^((rgb|rgba)\(|#)|(rem|px|em|;)+$/g, '');


// -================= // =================-
const Converter = Object.freeze({
  convert: (content, convertTo) => {
    const objFunc = {
      px: pxToEm,
      em: emToPx,
      rem: emToPx,
      '#': hexToRgb,
      rgb: rgbToHex,
      rgba: rgbToHex,
      color: colorToHex
    };

    return objFunc[convertTo](content) || null;
  }
});

module.exports = Object.freeze({
  Converter,
  cleanUnits,
  // -== test ==-
  TEST_cleanUnits: cleanUnits,
  TEST_pxToEm: pxToEm,
  TEST_emToPx: emToPx,
  TEST_hexToRgb: hexToRgb,
  TEST_rgbToHex: rgbToHex,
  TEST_colorToHex: colorToHex
});
