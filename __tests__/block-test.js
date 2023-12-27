const assert = require('assert');
const testUtil = require('./test-utils.js')

module.exports = eva => {
    assert.strictEqual(eva.eval(['begin',
      ['var', 'x', 10],
      ['var', 'y', 20],
      ['*', 'x', 'y']
    ]), 200)
    assert.strictEqual(eva.eval(
    ['begin',
      ['var', 'x', 10],
      ['begin',
        ['var', 'x', 20],
        ['set', 'x', 30]
      ],
      'x'
    ]), 10)
    testUtil.test(eva,
    `
      (begin
        (var x 10)
        (var y 20)
        (+ (* x 10) y)
      )
    `, 120)

}