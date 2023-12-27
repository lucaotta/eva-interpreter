const assert = require('assert');

module.exports = eva => {
    assert.strictEqual(eva.eval(['<', 1, 5]), true)
    assert.strictEqual(eva.eval(['>', 1, 5]), false)
    assert.strictEqual(eva.eval(['=', 5, 5]), true)
}