/**
 * @author Diego Alberto Molina Vera
 * @copyright 2016 - 2018
 */

const assert = require('assert');
const sinon = require('sinon');
const path = require('path');

const {
  workspace,
  commands,
  window
} = require('vscode');

// -================= // =================-
const {
  cleanUnits,
  Converter,
} = require('../../converter');
const units = require('../../helpers/units');
const {
  PLACE_HOLDER_INPUT,
  PLACE_HOLDER_PROMPT
} = require('../../helpers/constants/strings');

describe('Extension Tests', () => {
  // -================= // =================-
  const getQuickPick = () => window.showQuickPick(units, {
      matchOnDescription: true,
      placeHolder: PLACE_HOLDER_INPUT
    });

  const getInputBox = () => window.showInputBox({
      prompt: PLACE_HOLDER_PROMPT,
      value: ''
    });

  const getUnitAt = position => {
    const { label, description } = units[position];

    return {
      label,
      description
    };
  };

  const isNotTextSelected = () => {
    const {
      selections: [{
        start,
        end
      }]
    } = window.activeTextEditor;

    return start.line === end.line || start.character === end.character;
  };

  // -================= // =================-

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
      workspace.openTextDocument(path.join(workspace.rootPath || '', './style.css'))
        .then(document => {
          window.showTextDocument(document)
            .then(() => {
              if (isNotTextSelected()) {
                const showQuickPick = sinon.stub(window, 'showQuickPick');
                const showInputBox = sinon.stub(window, 'showInputBox');

                showQuickPick.resolves(getUnitAt(0));
                const quickPick = getQuickPick();

                showInputBox.resolves('19px');
                const inputBox = getInputBox();

                Promise.all([quickPick, inputBox])
                  .then(resolve => {
                    const [pick, input] = resolve;

                    assert(pick.label === 'px');
                    assert(pick.description === 'Pixels');
                    assert(showQuickPick.calledOnce);
                    showQuickPick.restore();

                    assert(input === '19px');
                    assert(showInputBox.calledOnce);
                    showInputBox.restore();

                    const result = Converter(cleanUnits(input), pick.label);
                    assert(result === '1.188em');
                    done();
                  });
              }
            });
        });
    });

    it('Selects `em|rem` from the input prompt and add a value', done => {
      workspace.openTextDocument(path.join(workspace.rootPath || '', './style.css'))
        .then(document => {
          window.showTextDocument(document)
            .then(() => {
              if (isNotTextSelected()) {
                const showQuickPick = sinon.stub(window, 'showQuickPick');
                const showInputBox = sinon.stub(window, 'showInputBox');

                showQuickPick.resolves(getUnitAt(1));
                const quickPick = getQuickPick();

                showInputBox.resolves('1.188em');
                const inputBox = getInputBox();

                Promise.all([quickPick, inputBox])
                  .then(resolve => {
                    const [pick, input] = resolve;

                    assert(pick.label === '[em|rem]');
                    assert(pick.description === 'M');
                    assert(showQuickPick.calledOnce);
                    showQuickPick.restore();

                    assert(input === '1.188em');
                    assert(showInputBox.calledOnce);
                    showInputBox.restore();

                    const result = Converter(
                      cleanUnits(input), pick.label === '[em|rem]' && 'em'
                    );
                    assert(result === '19px');
                    done();
                  });
              }
            });
        });
    });

    it('Selects `#` from the input prompt and add a value', done => {
      workspace.openTextDocument(path.join(workspace.rootPath || '', './style.css'))
        .then(document => {
          window.showTextDocument(document)
            .then(() => {
              if (isNotTextSelected()) {
                const showQuickPick = sinon.stub(window, 'showQuickPick');
                const showInputBox = sinon.stub(window, 'showInputBox');

                showQuickPick.resolves(getUnitAt(2));
                const quickPick = getQuickPick();

                showInputBox.resolves('#f1f1f1');
                const inputBox = getInputBox();

                Promise.all([quickPick, inputBox])
                  .then(resolve => {
                    const [pick, input] = resolve;

                    assert(pick.label === '#');
                    assert(pick.description === 'Hexadecimal');
                    assert(showQuickPick.calledOnce);
                    showQuickPick.restore();

                    assert(input === '#f1f1f1');
                    assert(showInputBox.calledOnce);
                    showInputBox.restore();

                    const result = Converter(
                      cleanUnits(input), pick.label
                    );
                    assert(result === 'rgba(241, 241, 241, 1) | rgb(241, 241, 241)');
                    done();
                  });
              }
            });
        });
    });

    it('Selects `rgb` from the input prompt', done => {
      workspace.openTextDocument(path.join(workspace.rootPath || '', './style.css'))
        .then(document => {
          window.showTextDocument(document)
            .then(() => {
              if (isNotTextSelected()) {
                const showQuickPick = sinon.stub(window, 'showQuickPick');
                const showInputBox = sinon.stub(window, 'showInputBox');

                showQuickPick.resolves(getUnitAt(3));
                const quickPick = getQuickPick();

                showInputBox.resolves('rgb(137, 94, 173)');
                const inputBox = getInputBox();

                Promise.all([quickPick, inputBox])
                  .then(resolve => {
                    const [pick, input] = resolve;

                    assert(pick.label === 'rgb');
                    assert(pick.description === 'Red Green Blue');
                    assert(showQuickPick.calledOnce);
                    showQuickPick.restore();

                    assert(input === 'rgb(137, 94, 173)');
                    assert(showInputBox.calledOnce);
                    showInputBox.restore();

                    const result = Converter(
                      cleanUnits(input), pick.label
                    );
                    assert(result === '#895ead');
                    done();
                  });
              }
            });
        });
    });

    it('Selects `rgba` from the input prompt', done => {
      workspace.openTextDocument(path.join(workspace.rootPath || '', './style.css'))
        .then(document => {
          window.showTextDocument(document)
            .then(() => {
              if (isNotTextSelected()) {
                const showQuickPick = sinon.stub(window, 'showQuickPick');
                const showInputBox = sinon.stub(window, 'showInputBox');

                showQuickPick.resolves(getUnitAt(4));
                const quickPick = getQuickPick();

                showInputBox.resolves('rgb(137, 94, 173, 1)');
                const inputBox = getInputBox();

                Promise.all([quickPick, inputBox])
                  .then(resolve => {
                    const [pick, input] = resolve;

                    assert(pick.label === 'rgba');
                    assert(pick.description === 'Red Green Blue Alpha');
                    assert(showQuickPick.calledOnce);
                    showQuickPick.restore();

                    assert(input === 'rgb(137, 94, 173, 1)');
                    assert(showInputBox.calledOnce);
                    showInputBox.restore();

                    const result = Converter(
                      cleanUnits(input), pick.label
                    );
                    assert(result === '#895ead');
                    done();
                  });
              }
            });
        });
    });

    it('Selects `color` from the input prompt', done => {
      workspace.openTextDocument(path.join(workspace.rootPath || '', './style.css'))
        .then(document => {
          window.showTextDocument(document)
            .then(() => {
              if (isNotTextSelected()) {
                const showQuickPick = sinon.stub(window, 'showQuickPick');
                const showInputBox = sinon.stub(window, 'showInputBox');

                showQuickPick.resolves(getUnitAt(5));
                const quickPick = getQuickPick();

                showInputBox.resolves('white');
                const inputBox = getInputBox();

                Promise.all([quickPick, inputBox])
                  .then(resolve => {
                    const [pick, input] = resolve;

                    assert(pick.label === 'color');
                    assert(pick.description === 'Color value (e.g. white)');
                    assert(showQuickPick.calledOnce);
                    showQuickPick.restore();

                    assert(input === 'white');
                    assert(showInputBox.calledOnce);
                    showInputBox.restore();
                    const result = Converter(input, pick.label);
                    assert(result === '#fff');
                    done();
                  });
              }
            });
        });
    });
  });
});
