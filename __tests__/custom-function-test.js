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

    // Recursive function:
    testUtil.test(eva,
        `
          (begin
    
            (def fact (n)
              (begin
                (if (= n 1)
                    1
                    (* n (fact (- n 1)))
                )
              )
            )
    
            (fact 2)
          )
    
        `,
        2);
}