const assert = require('assert');
const Environment = require("./environment")

class Eva {
    constructor(global = new Environment()) {
        this.env = global
    }
    eval(input, env = this.env) {
        if (isNumber(input))
            return input

        if (isString(input))
            return input.slice(1, -1)

        // ---- Math operations
        if (input[0] === '+') {
            // console.log("Evaluating expression " + input)
            let left = this.eval(input[1])
            let right = this.eval(input[2])
            // console.log("Left is " + left)
            // console.log("Right is " + right)

            return left + right
        }

        if (input[0] === '*') {
            return this.eval(input[1]) * this.eval(input[2], env)
        }

        if (input[0] === '-') {
            return this.eval(input[1]) - this.eval(input[2], env)
        }

        if (input[0] === '/') {
            return this.eval(input[1]) / this.eval(input[2], env)
        }

        // -------- Variables
        if (input[0] === 'var') {
            return this.env.set(input[1], this.eval(input[2], env))
        }
        if (isVariableName(input)) {
            return this.env.lookup(input)
        }

        throw `Unimplemented expression ${JSON.stringify(input)}`
    }
};

function isNumber(input) {
    return typeof input === 'number'
}

function isString(input) {
    return typeof input === 'string' && input[0] === '"' && input.slice(-1) === '"'
}

function isVariableName(input) {
    return typeof input === 'string' && /^[a-zA-Z_][a-zA-Z_\d]*$/.exec(input)
}

// ----------------------- TESTING --------------------
i = new Eva()

assert.strictEqual(i.eval(1), 1)
assert.strictEqual(i.eval('"Hello"'), 'Hello')
assert.strictEqual(i.eval(["+", 1, 5]), 6)
assert.strictEqual(i.eval(['+', ['+', 3, 2], 5]), 10)
assert.strictEqual(i.eval(['+', 5, ['+', 3, 2]]), 10)
assert.strictEqual(i.eval(['+', 5, ['+', ['+', 7, -1], 2]]), 13)
assert.strictEqual(i.eval(['+', 5, ['*', 3, 2]]), 11)
assert.strictEqual(i.eval(['-', 5, ['*', 3, 2]]), -1)
assert.strictEqual(i.eval(['-', 5, ['/', 3, 2]]), 3.5)

assert.strictEqual(i.eval(['var', 'x', 10]), 10)
assert.strictEqual(i.eval(['var', 'x', ['*', 10, 10]]), 100)
assert.strictEqual(i.eval('x'), 100)
assert.strictEqual(i.eval(['var', '_x3', 42]), 42)
assert.strictEqual(i.eval('_x3'), 42)

assert.strictEqual(i.eval(['begin',
  ['var', 'x', 10]
]))

console.log("All tests passed")