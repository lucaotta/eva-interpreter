const assert = require('assert');

class Eva {
    eval(input) {
        if (isNumber(input))
            return input

        if (isString(input))
            return input.slice(1, -1)

        if (input[0] === '+') {
            // console.log("Evaluating expression " + input)
            let left = this.eval(input[1])
            let right = this.eval(input[2])
            // console.log("Left is " + left)
            // console.log("Right is " + right)

            return left + right
        }

        throw 'Unimplemented expression `' + input + '`'
    }
};

function isNumber(input) {
    return typeof input === 'number'
}

function isString(input) {
    return typeof input === 'string' && input[0] === '"' && input.slice(-1) === '"'
}

// ----------------------- TESTING --------------------
i = new Eva()

assert.strictEqual(i.eval(1), 1)
assert.strictEqual(i.eval('"Hello"'), 'Hello')
assert.strictEqual(i.eval(["+", 1, 5]), 6)
assert.strictEqual(i.eval(['+', ['+', 3, 2], 5]), 10)
assert.strictEqual(i.eval(['+', 5, ['+', 3, 2]]), 10)
assert.strictEqual(i.eval(['+', 5, ['+', ['+', 7, -1], 2]]), 13)

console.log("All tests passed")