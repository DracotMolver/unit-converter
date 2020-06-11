/**
 * @author Diego Alberto Molina Vera
 * @copyright 2016 - 2020
 */

const os = require('os');

const { window, Range } = require('vscode');

const { Converter, cleanUnits } = require('./converter');

const colorValues = require('./helpers/colors');

const { ERROR_SELECTED_TEXT } = require('./helpers/constants/strings');

const REGEX_SELECTED_TEXT = /((rgb|rgba)\([\s\d,.]+\))|#[\d\w]{3,6}|(\d+(rem|px|em))/g;

// -================= // =================-
/**
 * Checks if there's any unit in the line
 *
 * @param {string} textContent - Text to check
 * @return {boolean}
 */
const isUnitsExits = (textContent) =>
  /#[a-f\d]{3,6}|rgb\(|rgba\(|\d+px|[.\d]+(rem|em)/gi.test(textContent);

/**
 * It will get all the values in one line to convert
 *
 * @param {string} textContent - Text to find if it has any value to convert
 * @return {array} - An array of objects {key[units]: value[value]}
 */
const getValuesAndUnits = (textContent) => {
  const values = textContent.match(
    /#[a-f\d]{3,6}|(rgb|rgba)\([\d.,\s]+\)|\d+px|[.\d]+(rem|em)/gi
  );

  // Find the unit and makes and array of objects
  // {
  //   unit: '#',
  //   value: '000'
  // }
  return values.map((value) => {
    const unit = value.trim().match(/rgb\(|rgba\(|#|rem|px|em/)[0];

    return {
      unit,
      value,
    };
  });
};

/**
 * It will process a range of text selected, not item one by one.
 * It means a range of text selected with the cursor.
 *
 * @param {object} selection - An object will several values
 * @param {object} document - The actual document where we are working on
 */
const processSelectedRangeText = (selection, document) => {
  const { start, end } = selection;

  // Get all the content from the selection
  const textRange = new Range(
    start.line,
    start.character,
    end.line,
    end.character
  );
  const textToInspect = document.getText(textRange);

  // Pass every single line of text to an array to go over it
  // to avoid to overwrite what has been replaced.
  const linesOfText = textToInspect.replace(/\r/g, '').split('\n');

  linesOfText
    .map((lines, index) => ({
      position: index,
      text: lines,
    }))
    .filter((line) => isUnitsExits(line.text))
    .forEach((line) => {
      getValuesAndUnits(line.text).forEach((foundLine) => {
        const convertedValue = Converter(
          cleanUnits(foundLine.value),
          foundLine.unit.replace('(', '')
        );

        linesOfText[line.position] = linesOfText[line.position].replace(
          foundLine.value,
          convertedValue
        );
      });
    });

  return linesOfText.join(os.EOL);
};

/**
 * It will get all the content selected one by one and transform their opposite value
 *
 * @param {object} selection - An object will several values
 * @param {function} lineAt - It will get the content at the specified line.
 */
const processSingleLine = (selection, lineAt) => {
  const { start, end, active } = selection;

  const textToInspect = lineAt(active.line)
    .text.slice(start.character, end.character)
    .trim();

  let convertedValues = textToInspect;
  // Check if the selected text has a known unit.
  // Except for colors, they are not considered as units.
  if (REGEX_SELECTED_TEXT.test(convertedValues)) {
    const matchedValues = convertedValues.match(REGEX_SELECTED_TEXT);

    const valToConvert = matchedValues.reduce(
      (prev, current) => [
        ...prev,
        {
          prevVal: current,
          newVal: '',
          unit: current.match(/rgb\(|rgba\(|#|rem|px|em/)[0].replace('(', ''),
        },
      ],
      []
    );

    valToConvert.forEach((val) => {
      val.newVal = Converter(cleanUnits(val.prevVal), val.unit);

      convertedValues = convertedValues.replace(
        new RegExp(val.prevVal.replace(/\(/, '\\(').replace(/\)/, '\\)'), 'g'),
        val.newVal
      );
    });
  } else if (colorValues[convertedValues]) {
    convertedValues = Converter(convertedValues, 'color');
  } else {
    window.showErrorMessage(ERROR_SELECTED_TEXT);
  }

  return convertedValues;
};

module.exports = Object.freeze({
  processSelectedRangeText,
  processSingleLine,
});
