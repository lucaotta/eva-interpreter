class Transformer {
    // Function declaration (def square (x) (* x x))
    // equivalent to: (var square (lambda (x) (* x x)))
    defToLambda(input) {
        const [_tag, name, params, body] = input
        return ['var', name, ['lambda', params, body]]
    }
    // Convert `(switch (cond1 block1) (condN blockN) (else alternate))` to
    // `(if cond1 block1 (if condN blockN alternate))`
    switchToIf(input) {
        let ret = ['if']
        return this._buildSwitchArg(input.slice(1))
    }

    // For loop
    // `(for <init> <condition> <modifier> <expr>)` to
    // `(begin <init> (while <condition> (begin (<expr> <modifier>))))`
    forToWhile(input) {
        const [_tag, init, condition, modifier, expr] = input
        const whileBody = ['begin', expr, modifier]
        const whileExpr = ['while', condition, whileBody]
        return ['begin', init, whileExpr];
    }

    // Increment with store
    // `(++ x)` to `(set x (+ x 1))`
    incrementToSet(input) {
        return ['set', input[1], ['+', input[1], 1]]
    }

    // Decrement with store
    // `(-- x)` to `(set x (- x 1))`
    decrementToSet(input) {
        return ['set', input[1], ['-', input[1], 1]]
    }

    // Addition with store
    // `(+= x <value>)` to `(set x (+ x <value>))`
    addAndStore(input) {
        return ['set', input[1], ['+', input[1], input[2]]]
    }

    // Subtraction with store
    // `(-= x <value>)` to `(set x (- x <value>))`
    subAndStore(input) {
        return ['set', input[1], ['-', input[1], input[2]]]
    }

    _buildSwitchArg(input) {
        const [cond, block] = input[0]
        if (cond === 'else')
            return block
        return ['if', cond, block, this._buildSwitchArg(input.slice(1))]
    }
}

module.exports = Transformer