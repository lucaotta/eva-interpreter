
const Environment = require("./environment")

const GlobalEnvironment = new Environment({
    'true': true,
    'false': false,
    'null': null,
    'VERSION': 0.1,
    '+'(op1, op2) {
        return op1 + op2
    },
    '*'(op1, op2) {
        return op1 * op2
    },
    '-'(op1, op2) {
        return op1 - op2
    },
    '/'(op1, op2) {
        return op1 / op2
    },
    '<'(op1, op2) {
        return op1 < op2
    },
    '>'(op1, op2) {
        return op1 > op2
    },
    '<='(op1, op2) {
        return op1 <= op2
    },
    '>='(op1, op2) {
        return op1 >= op2
    },
    '='(op1, op2) {
        return op1 === op2
    },
})

class Eva {
    constructor(global = GlobalEnvironment) {
        this.env = global
    }
    eval(input, env = this.env) {
        if (this._isNumber(input))
            return input

        if (this._isString(input))
            return input.slice(1, -1)

        // -------- Variables
        if (input[0] === 'var') {
            return env.define(input[1], this.eval(input[2], env))
        }

        if (input[0] === 'set') {
            const [_, variable, value] = input
            return env.assign(variable, this.eval(value, env))
        }

        if (input[0] === 'begin') {
            let blockEnv = new Environment({}, env)
            return this._evalBlock(input, blockEnv)
        }

        if (input[0] === 'if') {
            const [_tag, condition, true_branch, false_branch] = input
            if (this.eval(condition, env))
                return this.eval(true_branch, env)
            else
                return this.eval(false_branch, env)
        }

        if (input[0] === 'while') {
            const [_tag, condition, code] = input
            let result;
            while (this.eval(condition, env)) {
                result = this.eval(code, env)
            }
            return result
        }

        // Function declaration (def square (x) (* x x))
        if (input[0] === 'def') {
            const [_tag, name, params, body] = input
            const fn = {name: name, env: env, body: body, params: params}
            return env.define(name, fn)
        }

        if (this._isVariableName(input)) {
            return env.lookup(input)
        }

        if (Array.isArray(input)) {
            const fn = this.eval(input[0], env)

            const args = input.slice(1).map(arg => this.eval(arg, env))
            if (typeof fn === 'function')
                return fn(...args)

            if (fn.params.length != args.length)
                throw `Wrong number of parameters for function ${fn.name}`
            const newRecord = {}
            fn.params.forEach((element, index) => {
                newRecord[element] = args[index]
            });
            const newEnv = new Environment(newRecord, fn.env)
            return this._evalBody(fn.body, newEnv)
        }

        throw `Unimplemented expression ${JSON.stringify(input)}`
    }

    _evalBlock(input, env) {
        let result = null
        for (let i = 1; i < input.length; i++) {
            result = this.eval(input[i], env)
        }
        return result
    }

    _evalBody(input, env) {
        if (input[0] === 'begin')
            return this._evalBlock(input, env)
        return this.eval(input, env)
    }

    _isNumber(input) {
        return typeof input === 'number'
    }
    
    _isString(input) {
        return typeof input === 'string' && input[0] === '"' && input.slice(-1) === '"'
    }
    
    _isVariableName(input) {
        // FIXME: this allows `+zebra` or `*999` as a variable name.
        // Also we must keep this is sync with the BNF grammar, otherwise we end up
        // accepting different syntaxes
        return typeof input === 'string' && /^[a-zA-Z_+\-*/<>=\d]+$/.exec(input)
    }
};

module.exports = Eva