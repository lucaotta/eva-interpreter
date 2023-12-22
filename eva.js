
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

        // Comparison operators
        if (input[0] === '<') {
            const [_tag, left, right] = input
            return this.eval(left, env) < this.eval(right, env);
        }
        if (input[0] === '>') {
            const [_tag, left, right] = input
            return this.eval(left, env) > this.eval(right, env);
        }
        if (input[0] === '==') {
            const [_tag, left, right] = input
            return this.eval(left, env) == this.eval(right, env);
        }
        if (input[0] === '!=') {
            const [_tag, left, right] = input
            return this.eval(left, env) != this.eval(right, env);
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

        if (input[0] === 'if') {
            const [_tag, condition, true_branch, false_branch] = input
            if (this.eval(condition, env))
                return this.eval(true_branch, env)
            else
                return this.eval(false_branch, env)
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

module.exports = Eva