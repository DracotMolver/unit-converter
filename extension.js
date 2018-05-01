/**
 * @author Diego Alberto Molina Vera
 * @copyright 2016 - 2018
 */

const {
    // ExtensionContext,
    commands,
    window,
    // Range,
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
    // let newTextContent = '';
    let textToInspect = '';
    // let textContent = '';
    // let selection = [];
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


    // const getValueAndUnit = text => text.match(/rgb\(|rgba\(|rem|em|px|#/g);

    /**
     * It will get all the content selected one by one and transform their opposite value
     *
     * @param {object} selection - object will several values
     * @param {function} lineAt - It will get the content at the specified line.
     */
    const processSingleLine = (selection, lineAt) => {
        const { start, end, active } = selection;
        startPosition = start.character;
        endPosition = end.character;
        textToInspect = lineAt(active.line).text.slice(startPosition, endPosition).trim();

        // Check if the selecte text has a known unit. Except for colors
        // They are not considered as units
        if (/^(rgb\(|rgba\(|#)|(rem|px|em|;)+$/g.test(textToInspect)) {
            foundUnits = textToInspect.match(/^(rgb\(|rgba\(|#)|(rem|px|em)+$/g);
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
            //         if (selection[0].isSingleLine) {
            //         } else {
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
        //     // Solo para selecciones múltiples o simples.
        //     // Cualquiera de las dos es siempre en una sola línea.
        //     // De lo contrario no es iSingleLine y abarca un texto completo (más de una línea).
        //         const textRange = new Range(
        //             selection[0].start.line,
        //             selection[0].start.character,
        //             selection[0].end.line,
        //             selection[0].end.character
        //         );

        //         textContent = activeTextEditor.document.getText(textRange);
        //         // let _e = [];
        //         // Pasar cada línea del texto obtenido a un array para reccorrer línea por lína,
        //         // así evitar que se sobre escriba lo que ya ha sido reemplazado.
        //         textContent = textContent.replace(/\r/g, '').split("\n");

        //         for (let index = 0, size = textContent.length; index < size; index++) {
        //             if (
        //                 /#[a-f0-9]{3,6}|rgba\([\d,\s\.]+\)|rgb\([\d,\s]+\)|\d+px|[\.\d]+em|[\.\d]+rem/ig.test(textContent[index])
        //             ) {

        //                 matches = getValueAndUnit(textContent[index]);
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
    });

    context.subscriptions.push(command);
}
exports.activate = activate;

function deactivate() {
}
exports.deactivate = deactivate;
