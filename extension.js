/**
 * @author Diego Alberto Molina Vera
 * @copyright 2016 - 2020
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
  ERROR_PROMPT,
  ERROR_INPUT
} = require('./helpers/constants/strings');

function activate(context) {
  const command = commands.registerCommand('extension.unitConverter', () => {
    // Use the activeTextEditiro.selections because it returns one or more selected text
    const {
      selections,
      selections: [{
        start,
        end,
        isSingleLine
      }],
      document
    } = window.activeTextEditor;

    // If the start line and end line are different it means it was selected some text.
    // To make sure of this, we use start character and end character
    if (start.line !== end.line || start.character !== end.character) {
      let convertedValues = []; // When is a single piece of text or multiple selections
      let convertedRangeText = ''; // When is a range of text.

      // Only for multiple selection or one selection onto a singleline
      if (isSingleLine) {
        convertedValues = selections.map(selection => processSingleLine(selection, document.lineAt)
        );
      } else {
        // Here is when the selection includes a long piece of code
        // Not single elements selected one by one or just one element
        // selected
        const [selection] = selections;
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
          const [selection] = selections;
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
              const convertedValue = Converter(content, pickedUnit);
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
