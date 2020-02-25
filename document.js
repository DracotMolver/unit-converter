/**
 * @author Diego Alberto Molina Vera
 * @copyright 2016 - 2018
 */
// -================= // =================-
const {
    window,
    Range
} = require('vscode');

const {
    Converter,
    cleanUnits
} = require('./converter');

const colorValues = require('./helpers/colors');
const {
    ERROR_SELECTED_TEXT
} = require('./helpers/constants/strings');

// -================= // =================-
/**
 * Checks if there's any unit in the line
 *
 * @param {string} textContent - Text to check
 * @return {boolean}
 */
const isUnitsExits = textContent =>
    /#[a-f\d]{3,6}|(rgb|rgba)\(|\d+px|[\.\d]+(rem|em)/ig.test(textContent);

/**
 * It will get all the values in one line to convert
 *
 * @param {string} textContent - Text to find if it has any value to convert
 * @return {array} - An array of objects {key[units]: value[value]}
 */
const getValuesAndUnits = textContent => {
    // Get all the values that could be converted
    const values = textContent.match(
        /#[a-f\d]{3,6}|(rgb|rgba)\([\d\.,\s]+\)|\d+px|[\.\d]+(rem|em)/ig
    );

    // Find the unit and makes and array of objects
    // {
    //   unit: '#',
    //   value: '000'
    // }
    return values.map(value => {
        const unit = value.trim().match(/^((rgb|rgba)\(|#)|(rem|px|em)+$/)[0];

        return {
            unit,
            value
        };
    });
};

/**
 * It will process a range of text selected, not item one by one.
 * It means a range of text selected with the cursor.
 *
 * @param {object} selection - An object will several values
 * @param {object} document - The actual document where we are workin on
 */
const processSelectedRangeText = (selection, document) => {
    const {
        start: {
            line: startLine,
            character: startChar
        },
        end: {
            line: endLine,
            character: endChar
        }
    } = selection;

    // Get all the contenet from the selection
    const textRange = new Range(
        startLine,
        startChar,
        endLine,
        endChar
    );
    const textToInspect = document.getText(textRange);

    // Pass every single line of text to an array to go over it
    // to avoid to overwrite what has been replaced.
    const linesOfText = textToInspect.replace(/\r/g, '').split('\n');

    linesOfText
        .map((lines, index) => {
            if (isUnitsExits(lines)) {
                return {
                    position: index,
                    text: lines
                };
            }

            return null;
        })
        .filter(lines => lines)
        .forEach(lines => {
            getValuesAndUnits(lines.text)
                .forEach(foundLine => {
                    const convertedValue = Converter.convert(
                        cleanUnits(foundLine.value),
                        foundLine.unit.replace('(', '')
                    );

                    linesOfText[lines.position] = linesOfText[lines.position]
                        .replace(foundLine.value, convertedValue);
                });
        });

    return linesOfText.join('\n');
};

/**
 * It will get all the content selected one by one and transform their opposite value
 *
 * @param {object} selection - An object will several values
 * @param {function} lineAt - It will get the content at the specified line.
 */
const processSingleLine = (selection, lineAt) => {
    let convertedValues = '';

    const {
        start: {
            character: startChar
        },
        end: {
            character: endChar
        },
        active: {
            line
        }
    } = selection;

    const textToInspect = lineAt(line).text.slice(startChar, endChar).trim();

    // Check if the selecte text has a known unit. Except for colors
    // They are not considered as units
    if (/^(rgb\(|rgba\(|#)|(rem|px|em|;)+$/.test(textToInspect)) {
        const [foundUnit] = textToInspect.match(/^((rgb|rgba)\(|#)|(rem|px|em)+$/g);
        convertedValues = Converter.convert(cleanUnits(textToInspect), foundUnit.replace('(', ''))
    } else if (colorValues[textToInspect]) {
        convertedValues = Converter.convert(textToInspect, 'color')
    } else {
        convertedValues = textToInspect;
        window.showErrorMessage(ERROR_SELECTED_TEXT);
    }

    return convertedValues;
};

module.exports = Object.freeze({
    processSelectedRangeText,
    processSingleLine
});
