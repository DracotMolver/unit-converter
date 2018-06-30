/**
 * @author Diego Alberto Molina Vera
 * @copyright 2016 - 2018
 */

const {
    commands,
    window
} = require('vscode');

const {
    Converter,
    cleanUnits
} = require('./converter');
const {
    processSelectedRangeText,
    processSingleLine
} = require('./document');

const units = require('./helpers/units');
const {
    PLACE_HOLDER_INPUT,
    PLACE_HOLDER_PROMPT,
    CONVERTED_VALUE,
    ERROR_INPUT,
    ERROR_PROMPT
} = require('./constants/strings');

function activate(context) {
    // When is a range of text.
    let convertedRangeText = '';

    // When is a single piece of text or multiple selections
    let convertedValues = [];

    const command = commands.registerCommand('extension.unitConverter', () => {
        // Use the activeTextEditiro.selections because it returns one or more selected text
        const {
            selections,
            selections: [{
                start: {
                    line: startLine,
                    character: startChar
                },
                end: {
                    line: endLine,
                    character: endChar
                },
                isSingleLine
            }],
            document
        } = window.activeTextEditor;

        // If the start line and end line are differents it means it was selected some text.
        // To make sure of this we use also start character and end character
        if (startLine !== endLine || startChar !== endChar) {
            // Only for multiple selection or one selection onto a singleline
            if (isSingleLine) {
                const { lineAt } = document;
                convertedValues = selections.map(selection => processSingleLine(selection, lineAt));
            } else {
                // Here is when the selection includes a long piece of code
                // Not single elements selected one by one or just one element
                // selected
                [selection] = selections;
                convertedRangeText = processSelectedRangeText(selection, document);
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
                    [selection] = selections;
                    builder.replace(selection, convertedRangeText);
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
