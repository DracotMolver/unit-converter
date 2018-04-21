/**
 * @author Diego Alberto Molina Vera
 * @copyright 2016 - 2018
 */

const {
    // workspace,
    commands,
    window
} = require('vscode');
const assert = require('assert');
const sinon = require('sinon');

// -================= // =================-
const {
    Converter,
    TEST_cleanUnits
} = require('./../converter');
const units = require('./../helpers/units');
const {
    PLACE_HOLDER_INPUT,
    PLACE_HOLDER_PROMPT
} = require('./../constants/strings');

describe('Extension Tests', () => {
    it('Executes the commmand extension', done => {
        commands.executeCommand('extension.unitConverter')
            .then(() => {
                assert(true);
                done();
            }, () => {
                done();
            });
    });

    describe('Input prompt actions', () => {
        it('Selects `px` from the input prompt and add a value to convert', done => {
            const { selections } = window.activeTextEditor;
            const { start, end } = selections[0];

            if (start.line === end.line || start.character === end.character) {
                const showQuickPick = sinon.stub(window, 'showQuickPick');
                const showInputBox = sinon.stub(window, 'showInputBox');

                showQuickPick.resolves({
                    label: units[0].label,
                    description: units[0].description
                });

                showInputBox.resolves('19px');

                const quickPick = window.showQuickPick(units, {
                    matchOnDescription: true,
                    placeHolder: PLACE_HOLDER_INPUT
                });

                const inputBox = window.showInputBox({
                    prompt: PLACE_HOLDER_PROMPT,
                    value: ''
                });

                Promise.all([quickPick, inputBox])
                    .then(resolve => {
                        [pick, input] = resolve;

                        assert(pick.label === 'px');
                        assert(pick.description === 'Pixels');
                        assert(showQuickPick.calledOnce);
                        showQuickPick.restore();

                        assert(input === '19px');
                        assert(showInputBox.calledOnce);
                        showInputBox.restore();

                        const result = Converter.convert(TEST_cleanUnits(input), pick.label);
                        assert(result === '1.188em');
                        done();
                    });
            }
        });

        xit('Selects `em|rem` from the input prompt', done => {
            const { selections } = window.activeTextEditor;
            const { start, end } = selections[0];

            if (start.line === end.line || start.character === end.character) {
                const showQuickPick = sinon.stub(window, 'showQuickPick');

                showQuickPick.resolves({
                    label: units[1].label,
                    description: units[1].description
                });

                const pxTest = window.showQuickPick(units, {
                    matchOnDescription: true,
                    placeHolder: PLACE_HOLDER_INPUT
                }).then(resolve => {
                    assert(resolve.label === '[em|rem]');
                    assert(resolve.description === 'M');
                    assert(showQuickPick.calledOnce);
                    showQuickPick.restore();
                    done();
                });
            }
        });

        xit('Selects `#` from the input prompt', done => {
            const { selections } = window.activeTextEditor;
            const { start, end } = selections[0];

            if (start.line === end.line || start.character === end.character) {
                const showQuickPick = sinon.stub(window, 'showQuickPick');

                showQuickPick.resolves({
                    label: units[2].label,
                    description: units[2].description
                });

                const pxTest = window.showQuickPick(units, {
                    matchOnDescription: true,
                    placeHolder: PLACE_HOLDER_INPUT
                }).then(resolve => {
                    assert(resolve.label === '#');
                    assert(resolve.description === 'Hexadecimal');
                    assert(showQuickPick.calledOnce);
                    showQuickPick.restore();
                    done();
                });
            }
        });

        xit('Selects `rgb` from the input prompt', done => {
            const { selections } = window.activeTextEditor;
            const { start, end } = selections[0];

            if (start.line === end.line || start.character === end.character) {
                const showQuickPick = sinon.stub(window, 'showQuickPick');

                showQuickPick.resolves({
                    label: units[3].label,
                    description: units[3].description
                });

                const pxTest = window.showQuickPick(units, {
                    matchOnDescription: true,
                    placeHolder: PLACE_HOLDER_INPUT
                }).then(resolve => {
                    assert(resolve.label === 'rgb');
                    assert(resolve.description === 'Red Green Blue');
                    assert(showQuickPick.calledOnce);
                    showQuickPick.restore();
                    done();
                });
            }
        });

        xit('Selects `rgba` from the input prompt', done => {
            const { selections } = window.activeTextEditor;
            const { start, end } = selections[0];

            if (start.line === end.line || start.character === end.character) {
                const showQuickPick = sinon.stub(window, 'showQuickPick');

                showQuickPick.resolves({
                    label: units[4].label,
                    description: units[4].description
                });

                const pxTest = window.showQuickPick(units, {
                    matchOnDescription: true,
                    placeHolder: PLACE_HOLDER_INPUT
                }).then(resolve => {
                    assert(resolve.label === 'rgba');
                    assert(resolve.description === 'Red Green Blue Alpha');
                    assert(showQuickPick.calledOnce);
                    showQuickPick.restore();
                    done();
                });
            }
        });

        xit('Selects `color` from the input prompt', done => {
            const { selections } = window.activeTextEditor;
            const { start, end } = selections[0];

            if (start.line === end.line || start.character === end.character) {
                const showQuickPick = sinon.stub(window, 'showQuickPick');

                showQuickPick.resolves({
                    label: units[5].label,
                    description: units[5].description
                });

                const pxTest = window.showQuickPick(units, {
                    matchOnDescription: true,
                    placeHolder: PLACE_HOLDER_INPUT
                }).then(resolve => {
                    assert(resolve.label === 'color');
                    assert(resolve.description === 'Color value (e.g. white)');
                    assert(showQuickPick.calledOnce);
                    showQuickPick.restore();
                    done();
                });
            }
        });
    });
});
