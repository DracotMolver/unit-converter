const {
    workspace,
    commands,
    window
} = require('vscode');
const assert = require('assert');
const sinon = require('sinon');

// -================= // =================-
const units = require('./../helpers/units');
const {
    PLACE_HOLDER_INPUT
} = require('./../constants/strings');

describe("Extension Tests", function () {

    it("Executes the commmand extension", function (done) {
        commands.executeCommand('extension.unitConverter')
            .then(resolve => {
                assert(true);
                done();
            }, reject => {
                done();
            });
    });

    describe("Input prompt actions", function () {
        it("Selects `px` from the input prompt", function (done) {
            const selections = window.activeTextEditor.selections;
            const start = selections[0].start;
            const end = selections[0].end;

            if (start.line === end.line || start.character === end.character) {
                const showQuickPick = sinon.stub(window, 'showQuickPick');

                showQuickPick.resolves({
                    label: units[0].label,
                    description: units[0].description
                });

                window.showQuickPick(units, {
                    matchOnDescription: true,
                    placeHolder: PLACE_HOLDER_INPUT
                }).then(resolve => {
                    assert(resolve.label === 'px');
                    assert(resolve.description === 'Pixels');
                    assert(showQuickPick.calledOnce);
                    done();
                });
            }
        });
    });


    // // It displays the input prompt to type the units manually
    // window.showQuickPick(units, {

    // }).then(resolve => {
    //     if (resolve) {
    //         // Displays the input prompt to get the values
    //         window.showInputBox({
    //             promptt: PLACE_HOLDER_PROMPTt,
    //             value: ''
    //         }).then(resolve => {
    //             if (resolve) {
    //                 // Removes the units in case it was entered
    //                 // Converter.value = resolve.toLowerCase().trim().replace(/rem|px|em|#|rgb/ig, '');
    //                 // Converter.setType(resolve.label.toLowerCase());
    //                 window.showInformationMessage(CONVERTED_VALUE);
    //             }
    //         }, reject => {
    //             window.showErrorMessage(ERROR_PROMPTt);
    //         });
    //     }
    // }, reject => {
    //     window.showErrorMessage(ERROR_INPUT);
    // })


});