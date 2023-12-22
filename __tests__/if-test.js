const assert = require('assert');

module.exports = eva => {
    assert.strictEqual(eva.eval(
        ['begin',
            ['var', 'x', 10],
            ['if', ['<', 5, 'x'],
                ['set', 'x', 100],
            ]
    ]
    ), 100)
    assert.strictEqual(eva.eval(
        ['begin',
            ['var', 'x', 20],
            ['if', ['>', 5, 'x'],
                ['set', 'x', 100],
                ['*', 'x', 'x']
            ]
    ]
    ), 400)
}