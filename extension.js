const {
    ExtensionContext,
    commands,
    window,
    Range,
    Position
} = require('vscode');

const {
    activeTextEditor
} = window;

// let Converter = require('./converter').Converter
// let colorValues = require('./colours/colours');

function activate(context) {
    // let newTextContent = '';
    // let textToInspect = '';
    // let textContent = '';
    // let selection = [];
    // let matches = [];
    // let values = [];
    // let start = 0;
    // let end = 0;

    // // Expresiones a evaluar cuando se selecciona mucho texto.
    // const regex = {
    //     '#': new RegExp("#[\\d\\w]{3,6}"),
    //     'rgba': new RegExp("rgba\\([\\d,\\s\\.]+\\)"),
    //     'rgb': new RegExp("rgb\\([\\d,\\s]+\\)"),
    //     'px': new RegExp("\\d+px"),
    //     'em': new RegExp("[\\.\\d]+em"),
    //     'rem': new RegExp("[\\.\\d]+rem"),
    // }

    // // Para el input que solicita valores
    // const units = [
    //     { label: 'px', description: 'Pixels' },
    //     { label: 'em | rem', description: 'M' },
    //     { label: '#', description: 'Hexadecimal' },
    //     { label: 'rgb', description: 'Red Green Blue' },
    //     { label: 'rgba', description: 'Red Green Blue Alpha' },
    //     { label: 'color', description: 'Color value (e.g white)' }
    // ];

    // const getValueAndUnit = text => text.match(/rgb\(|rgba\(|rem|em|px|#/g);

    let command = commands.registerCommand('extension.unitConverter', () => {
        // Usar activeTextEditiro.selections ya que devuelve uno o más elementos seleccionados
        // selection = window.activeTextEditor.selections;

        // Si son distintos significa se ha seleccionado un elemento
        // if (selection[0].start.line !== selection[0].end.line ||
        //     selection[0].start.character !== selection[0].end.character) {

        //     // Solo para selecciones múltiples o simples.
        //     // Cualquiera de las dos es siempre en una sola línea.
        //     // De lo contrario no es iSingleLine y abarca un texto completo (más de una línea).
        //     if (selection[0].isSingleLine) {
        //         values = [];
        //         selection.forEach(v => {
        //             start = v.start.character;
        //             end = v.end.character;
        //             textToInspect = activeTextEditor.document.lineAt(v.active.line).text.slice(start, end).trim();

        //             // Validar si se está seleccionando una unidad conocida.
        //             // De ser así, saltarse el paso de preguntar desde "qué unidad va a transformar"
        //             // Para llevar luego a "a qué unidad va a convertir", de lo contrario mostrar mensaje de alerta.
        //             if (/rgb|rgba|rem|em|px|#/g.test(textToInspect) &&
        //                 (matches = getValueAndUnit(textToInspect))) {

        //                 // Más de una unidad en una misma línea
        //                 if (matches.length > 1) {
        //                     console.log(matches);
        //                 } else {
        //                     // Pasamos el valor sin el tipo
        //                     matches[0] = matches[0].replace('(', '');
        //                     Converter.value = textToInspect.replace(matches[0], '');
        //                     Converter.setType(matches[0]);
        //                     values.push(Converter.value);
        //                 }

        //             } else if (colorValues[textToInspect]) {
        //                 // Solo para los palabras con nombre de color
        //                 values.push(colorValues[textToInspect]);
        //             } else {
        //                 window.showErrorMessage('Please, check if you have selected the right values.');
        //             }
        //         });
        //     } else {
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

        //     // Reemplazar el texto seleccionado por el valor nuevo
        //     activeTextEditor.edit(builder => {
        //         if (selection[0].isSingleLine) {
        //             for (var i = 0, size = selection.length; i < size; i++)
        //                 builder.replace(selection[i], values[i]);
        //         } else {
        //             builder.replace(selection[0], newTextContent);
        //         }
        //     }).then(() => { }).catch(() => { });
        // }
        // else {
        //     // Desplegar listado de posibles unidades a convertir
        //     // Desde qué unidad
        //     window.showQuickPick(units, {
        //         matchOnDescription: true,
        //         placeHolder: 'Convert unit from:'
        //     })
        //         .then(resolve => {
        //             if (resolve) {
        //                 // Desplegar un input para recibir el valor a convertir
        //                 window.showInputBox({
        //                     prompt: 'Set the value to convert:',
        //                     value: ''
        //                 }).then(resolve => {
        //                     if (resolve) {
        //                         // Limpiar el valor en caso de que la persona
        //                         // ingrese el valor junto con la unidad
        //                         Converter.value = resolve.toLowerCase().trim().replace(/rem|px|em|#|rgb/ig, '');
        //                         Converter.setType(resolve.label.toLowerCase());
        //                         window.showInformationMessage(`The value is ${Converter.value}`);
        //                     }
        //                 });
        //             }
        //         })
        //         .catch(error => {
        //             console.log(error)
        //         });
        // }
    });

    context.subscriptions.push(command);
}
exports.activate = activate;

function deactivate() {
}
exports.deactivate = deactivate;