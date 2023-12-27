const Environment = require('../environment.js')
const Eva = require('../eva.js')

const tests = [
    require('./self-eval-test.js'),
    require('./math-test.js'),
    require('./variables-test.js'),
    require('./block-test.js'),
    require('./comparison-test.js'),
    require('./if-test.js'),
    require('./while-test.js'),
    require('./built-in-function-test.js'),
]

const eva = new Eva()

tests.forEach(test => test(eva))

console.log("All tests passed")