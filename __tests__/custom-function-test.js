const assert = require('assert');
const testUtil = require('./test-utils')

module.exports = eva => {
    testUtil.test(eva, `
    (begin
        (def square (x) (* x x))
        (square 6)
    )`,
    36)

    testUtil.test(eva,
        `
          (begin

            (def calc (x y)
              (begin
                (var z 30)
                (+ (* x y) z)
              ))

            (calc 10 20)

          )

        `,
        230);

    // Closure:
    testUtil.test(eva,
    `
      (begin

        (var value 100)

        (def calc (x y)
          (begin
            (var z (+ x y))

            (def inner (foo)
              (+ (+ foo z) value))

            inner

          ))

        (var fn (calc 10 20))

        (fn 30)

      )

    `,
    160);
}