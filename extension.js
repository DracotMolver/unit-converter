/**
 * @author Diego Alberto Molina Vera
 * @copyright 2016 - 2018
 */

const {
    // ExtensionContext,
    commands,
    window,
    Range,
    // Position
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

    // When is a single piece of text or multiple selections
    let foundUnits = [];
    let convertedValues = [];
    let startPosition = 0;
    let endPosition = 0;

    // // Expresiones a evaluar cuando se selecciona mucho texto.
    // const regex = {
    //     '#': new RegExp("#[\\d\\w]{3,6}"),
    //     'rgba': new RegExp("rgba\\([\\d,\\s\\.]+\\)"),
    //     'rgb': new RegExp("rgb\\([\\d,\\s]+\\)"),
    //     'px': new RegExp("\\d+px"),
    //     'em': new RegExp("[\\.\\d]+em"),
    //     'rem': new RegExp("[\\.\\d]+rem"),
    // }

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
            const unit = value.trim().match(/^((rgb|rgba)|#)|(rem|px|em)+$/);

            unitsAndvalues.push({
                unit,
                value
            });
        });

        return unitsAndvalues;
    };

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

        for (let index = 0, size = linesOfText.length; index < size; index += 1) {
            if (isUnitsExits(linesOfText[index])) {
                foundUnits = getValuesAndUnits(linesOfText[index]);
            }
        }

        //                 // Más de una unidad en una misma línea
        //                 if (matches.length > 1) {
        //                     continue;
        //                 } else {
        //                     matches[0] = matches[0].replace('(', '');
        //                     textToInspect = textContent[index].match(regex[matches[0]]);

        //                     // Pasamos el valor sin el tipo
        //                     Converter.value = textToInspect[0].replace(matches[0], '');
        //                     Converter.setType(matches[0]);
        //                     textContent[index] = textContent[index].replace(textToInspect[0], Converter.value);
        //                 }
        //             }
        //         }

        //         newTextContent = textContent.join("\n");
        //     }

        // }

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
                    Converter.convert(
                        cleanUnits(textToInspect),
                        foundUnit.replace('(', '')
                    )
                );
            });
        } else if (colorValues[textToInspect]) {
            convertedValues.push(
                Converter.convert(
                    textToInspect,
                    'color'
                )
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
                processSelectedRangeText(selections, document);
            }

            // Replace the selected text by the new values
            window.activeTextEditor.edit(builder => {
                if (isSingleLine) {
                    // specified the correct position of the texts to replace
                    for (let index = 0, size = selections.length; index < size; index += 1) {
                        builder.replace(selections[index], convertedValues[index]);
                    }
                }
            });
            //             builder.replace(selection[0], newTextContent);
            //         }
            //     }).then(() => { }).catch(() => { });
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
