const assert = require('assert');
const testUtil = require('./test-utils')

module.exports = eva => {
    assert.strictEqual(eva.eval(['var', 'x', 10]), 10)
    assert.strictEqual(eva.eval(['var', 'x', 'true']), true)
    assert.strictEqual(eva.eval(['var', 'x', ['*', 10, 10]]), 100)
    assert.strictEqual(eva.eval('x'), 100)
    assert.strictEqual(eva.eval(['var', '_x3', 42]), 42)
    assert.strictEqual(eva.eval('_x3'), 42)
    assert.strictEqual(eva.eval(['set', '_x3', -1]), -1)
    assert.strictEqual(eva.eval(['set', '_x3', ['/', 3, 2]]), 1.5)
    // FIXME: what chars constitute a variable?
    testUtil.test(eva, `(var +99s 40)`, 40)
}