const assert = require('assert');

module.exports = eva => {
    assert.strictEqual(eva.eval(
    ['begin',
        ['var', 'x', 0],
        ['while', ['<', 'x', 10],
            ['begin',
                ['set', 'x', ['+', 'x', 1]],
            ],
        ],
        'x'
    ]
    ), 10)
}