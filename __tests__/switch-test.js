const assert = require('assert');
const {test} = require('./test-utils');

module.exports = eva => {

  test(eva,
  `
    (begin

      (var x 9)

      (switch ((= x 10) 100)
              ((> x 10) 200)
              (else     300))

    )

  `,
  300);

};