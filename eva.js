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
            return this.eval(input[1], env) + this.eval(input[2], env)
        }

        if (input[0] === '*') {
            return this.eval(input[1], env) * this.eval(input[2], env)
        }

        if (input[0] === '-') {
            return this.eval(input[1], env) - this.eval(input[2], env)
        }

        if (input[0] === '/') {
            return this.eval(input[1], env) / this.eval(input[2], env)
        }

        // -------- Variables
        if (input[0] === 'var') {
            return env.define(input[1], this.eval(input[2], env))
        }

        if (input[0] === 'set') {
            const [_, variable, value] = input
            return env.assign(variable, this.eval(value, env))
        }

        if (input[0] === 'begin') {
            let result = null
            let blockEnv = new Environment({}, env)
            for (let i = 1; i < input.length; i++) {
                result = this.eval(input[i], blockEnv)
            }
            return result
        }

        if (isVariableName(input)) {
            return env.lookup(input)
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
i = new Eva(new Environment({
    'true': true,
    'false': false,
    'null': null,
    'VERSION': 0.1,
}))

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
assert.strictEqual(i.eval(['var', 'x', 'true']), true)
assert.strictEqual(i.eval(['var', 'x', ['*', 10, 10]]), 100)
assert.strictEqual(i.eval('x'), 100)
assert.strictEqual(i.eval(['var', '_x3', 42]), 42)
assert.strictEqual(i.eval('_x3'), 42)
assert.strictEqual(i.eval(['set', '_x3', -1]), -1)
assert.strictEqual(i.eval(['set', '_x3', ['/', 3, 2]]), 1.5)

// --- BLOCKS ---
assert.strictEqual(i.eval(['begin',
  ['var', 'x', 10],
  ['var', 'y', 20],
  ['*', 'x', 'y']
]), 200)
assert.strictEqual(i.eval(
['begin',
  ['var', 'x', 10],
  ['begin',
    ['var', 'x', 20],
    ['set', 'x', 30]
  ],
  'x'
]), 10)

console.log("All tests passed")