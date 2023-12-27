const assert = require('assert');
const testUtil = require('./test-utils')

module.exports = eva => {
    assert.strictEqual(eva.eval(["+", 1, 5]), 6)
    assert.strictEqual(eva.eval(['+', ['+', 3, 2], 5]), 10)
    assert.strictEqual(eva.eval(['+', 5, ['+', 3, 2]]), 10)
    assert.strictEqual(eva.eval(['+', 5, ['+', ['+', 7, -1], 2]]), 13)
    assert.strictEqual(eva.eval(['+', 5, ['*', 3, 2]]), 11)
    assert.strictEqual(eva.eval(['-', 5, ['*', 3, 2]]), -1)
    testUtil.test(eva, '(- 5 (/ 3 2))', 3.5)
}