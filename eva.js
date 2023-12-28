
const Environment = require("./environment")
const Transformer = require("./transformer/trasformer")

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
        this._transformer = new Transformer()
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
            const [_, ref, value] = input

            // prop access
            if (ref[0] === 'prop') {
                const [_tag, instance, propName] = ref
                let instanceEnv = this.eval(instance, env)
                return instanceEnv.define(propName, this.eval(value, env))
            }

            // Simple assigment
            return env.assign(ref, this.eval(value, env))
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

        // Function declaration
        if (input[0] === 'def') {
            return this.eval(this._transformer.defToLambda(input), env)
        }

        // Lambda function (lambda (x) (* x x))
        if (input[0] === 'lambda') {
            const [_tag, params, body] = input
            return {
                env: env,
                params: params,
                body: body
            }
        }

        if (input[0] === 'switch') {
            return this.eval(this._transformer.switchToIf(input), env)
        }

        if (input[0] === 'for') {
            return this.eval(this._transformer.forToWhile(input), env)
        }

        // Increment: (++ x)
        if (input[0] === '++') {
            return this.eval(this._transformer.incrementToSet(input), env)
        }
        // Increment: (-- x)
        if (input[0] === '--') {
            return this.eval(this._transformer.decrementToSet(input), env)
        }
        // Increment: (+= x 4)
        if (input[0] === '+=') {
            return this.eval(this._transformer.addAndStore(input), env)
        }
        // Increment: (-= x 4)
        if (input[0] === '-=') {
            return this.eval(this._transformer.subAndStore(input), env)
        }

        // `(class <name> <parent> <body>)`
        if (input[0] === 'class') {
            const [_tag, name, parent, body] = input

            const parentEnv = this.eval(parent, env) || env
            const classEnv = new Environment({}, parentEnv)

            const e = this.eval(body, classEnv)

            return env.define(name, e.env)
        }

        // `(new <class> <arguments>)`
        if (input[0] === 'new') {
            const classEnv = this.eval(input[1], env)
            const instance = new Environment({}, classEnv)

            // copy from function invocation
            const args = input.slice(2).map(arg => this.eval(arg, env))
            const fn = classEnv.lookup('constructor')
            this._callUserDefinedFunction(fn, [instance, ...args])

            return instance
        }

        // `(prop <instance> <name>)`
        if (input[0] === 'prop') {
            const [_tag, instance, name] = input
            const instanceEnv = this.eval(instance, env)
            return instanceEnv.lookup(name)
        }

        if (this._isVariableName(input)) {
            return env.lookup(input)
        }

        if (Array.isArray(input)) {
            const fn = this.eval(input[0], env)

            const args = input.slice(1).map(arg => this.eval(arg, env))
            if (typeof fn === 'function')
                return fn(...args)
            
            return this._callUserDefinedFunction(fn, args)
        }

        throw `Unimplemented expression ${JSON.stringify(input)}`
    }

    _callUserDefinedFunction(fn, args) {
        const activationRecord = {}
        if (fn.params.length != args.length)
            throw `Wrong number of parameters for function ${fn.name}`
        fn.params.forEach((element, index) => {
            activationRecord[element] = args[index]
        });
        const activationEnvironment = new Environment(activationRecord, fn.env)
        return this._evalBody(fn.body, activationEnvironment)
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