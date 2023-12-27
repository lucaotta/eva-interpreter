const assert = require('assert');
const testUtil = require('./test-utils')

module.exports = eva => {
    testUtil.test(eva, '(- 5 (/ 3 2))', 3.5)
    testUtil.test(eva, `(- 4 3.5)`, 0.5)
    testUtil.test(eva, `(< 5 5)`, false)
    testUtil.test(eva, `(<= 5 5)`, true)
    testUtil.test(eva, `(= 5 5)`, true)
}