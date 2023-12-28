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
    require('./custom-function-test.js'),
    require('./lambda-function-test.js'),
    require('./switch-test.js'),
    require('./for-loop-test.js'),
    require('./class-test.js'),
    require('./module-test.js'),
    require('./import-test.js'),
]

const eva = new Eva()

tests.forEach(test => test(eva))

console.log("All tests passed")