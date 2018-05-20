/**
 * @author Diego Alberto Molina Vera
 * @copyright 2016 - 2018
 */

const {
    commands,
    window,
    Range
} = require('vscode');

const {
    Converter,
    cleanUnits
} = require('./converter');
const colorValues = require('./helpers/colors/colors');
const units = require('./helpers/units');
const {
    PLACE_HOLDER_INPUT,
    PLACE_HOLDER_PROMPT,
    CONVERTED_VALUE,
    ERROR_INPUT,
    ERROR_PROMPT,
    ERROR_SELECTED_TEXT
} = require('./constants/strings');

function activate(context) {
    let textToInspect = '';

    // When is a range of text.
    let textRange;
    let linesOfText = [];
    let convertedRangeText = '';

    // When is a single piece of text or multiple selections
    let foundUnits = [];
    let convertedValues = [];
    let startPosition = 0;
    let endPosition = 0;

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
        const unitsAndvalues = [];

        // Get all the values that could be converted
        const values = textContent.match(
            /#[a-f\d]{3,6}|(rgb|rgba)\([\d\.,\s]+\)|\d+px|[\.\d]+(rem|em)/ig
        );

        // Find the unit and makes and array of objects
        // {
        //   unit: '#',
        //   value: '000'
        // }
        values.forEach(value => {
            const unit = value.trim().match(/^((rgb|rgba)\(|#)|(rem|px|em)+$/)[0];

            unitsAndvalues.push({
                unit,
                value
            });
        });

        return unitsAndvalues;
    };

    /**
     * It will process a range of text selected, not item one by one.
     * It means a range of text selected with the cursor.
     *
     * @param {object} selection - An object will several values
     * @param {object} document - The actual document where we are workin on
     */
    const processSelectedRangeText = (selection, document) => {
        const { start, end } = selection;

        // Get all the contenet from the selection
        textRange = new Range(
            start.line,
            start.character,
            end.line,
            end.character
        );
        textToInspect = document.getText(textRange);

        // Pass every single line of text to an array to go over it
        // to avoid to overwrite what has been replaced.
        linesOfText = textToInspect.replace(/\r/g, '').split('\n');

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
        const { start, end, active } = selection;
        startPosition = start.character;
        endPosition = end.character;
        textToInspect = lineAt(active.line).text.slice(startPosition, endPosition).trim();

        // Check if the selecte text has a known unit. Except for colors
        // They are not considered as units
        if (/^(rgb\(|rgba\(|#)|(rem|px|em|;)+$/.test(textToInspect)) {
            foundUnits = textToInspect.match(/^((rgb|rgba)\(|#)|(rem|px|em)+$/);
            foundUnits.forEach(foundUnit => {
                convertedValues.push(
                    Converter.convert(cleanUnits(textToInspect), foundUnit.replace('(', ''))
                );
            });
        } else if (colorValues[textToInspect]) {
            convertedValues.push(
                Converter.convert(textToInspect, 'color')
            );
        } else {
            convertedValues.push(textToInspect);
            window.showErrorMessage(ERROR_SELECTED_TEXT);
        }
    };

    const command = commands.registerCommand('extension.unitConverter', () => {
        // Use the activeTextEditiro.selections because it returns one or more selected text
        const { selections, document } = window.activeTextEditor;
        const { start, end, isSingleLine } = selections[0];

        // If the start line and end line are differents it means it was selected some text.
        // To make sure of this we use also start character and end character
        if (start.line !== end.line || start.character !== end.character) {
            // Only for multiple selection or one selection onto a singleline
            if (isSingleLine) {
                convertedValues = [];
                const { lineAt } = document;
                selections.forEach(selection => processSingleLine(selection, lineAt));
            } else {
                // Here is when the selection includes a long piece of code
                // Not single elements selected one by one or just one element
                // selected
                convertedRangeText = processSelectedRangeText(selections[0], document);
            }

            // Replace the selected text by the new values
            window.activeTextEditor.edit(builder => {
                if (isSingleLine) {
                    // specified the correct position of the texts to replace
                    const size = selections.length;
                    for (let index = 0; index < size; index += 1) {
                        builder.replace(selections[index], convertedValues[index]);
                    }
                } else {
                    builder.replace(selections[0], convertedRangeText);
                }
            });
        } else {
            // It displays the input prompt to type the units manually
            window.showQuickPick(units, {
                matchOnDescription: true,
                placeHolder: PLACE_HOLDER_INPUT
            }).then(unit => {
                if (unit) {
                    // Displays the input prompt to get the values
                    window.showInputBox({
                        prompt: PLACE_HOLDER_PROMPT,
                        value: ''
                    }).then(value => {
                        if (value) {
                            // Removes the units in case it was entered
                            const content = cleanUnits(value);
                            const pickedUnit = unit.label === '[em|rem]' ? 'em' : unit.label;
                            const convertedValue = Converter.convert(content, pickedUnit);
                            window.showInformationMessage(`${CONVERTED_VALUE}`.replace('$s', convertedValue));
                        }
                    }, () => {
                        window.showErrorMessage(ERROR_PROMPT);
                    });
                }
            }, () => {
                window.showErrorMessage(ERROR_INPUT);
            });
        }
    });

    context.subscriptions.push(command);
}
exports.activate = activate;

function deactivate() {
}
exports.deactivate = deactivate;
