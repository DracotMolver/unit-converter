/**
 * @author Diego Alberto Molina Vera
 * @copyright 2016 - 2018
 */

const assert = require('assert');

// -================= // =================-
const {
    TEST_cleanUnits,
    TEST_pxToEm,
    Converter
} = require('./../converter');

describe('Converter module', () => {
    it('Converts from `px` to `em`', () => {
        assert(TEST_pxToEm('19') === '1.188em');
        assert(TEST_pxToEm(TEST_cleanUnits('19px') === '1.188em'));
        assert(TEST_pxToEm(TEST_cleanUnits('   19px  ')) === '1.188em');
        assert(Converter.convert(TEST_cleanUnits('   19px  '), 'px') === '1.188em');
    });
});
