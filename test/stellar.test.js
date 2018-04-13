import assert from 'assert'
import {stellar} from '..'

describe('#stellar', function () {
  it('sum()', function () {
    // Example 56.a, p. 393
    var res = stellar.sum(1.96, 2.89)
    assert.equal(res.toFixed(2), 1.58)
  })

  it('sumN_triple()', function () {
    // Example 56.b, p. 394
    var res = stellar.sumN([4.73, 5.22, 5.6])
    assert.equal(res.toFixed(2), 3.93)
  })

  it('sumN_cluster()', function () {
    // Example 56.c, p. 394
    var c = []
    var i
    for (i = 0; i < 4; i++) {
      c.push(5)
    }
    for (i = 0; i < 14; i++) {
      c.push(6)
    }
    for (i = 0; i < 23; i++) {
      c.push(7)
    }
    for (i = 0; i < 38; i++) {
      c.push(8)
    }
    var res = stellar.sumN(c)
    assert.equal(res.toFixed(2), 2.02)
  })

  it('ratio()', function () {
    // Example 56.d, p. 395
    var res = stellar.ratio(0.14, 2.12)
    assert.equal(res.toFixed(2), 6.19)
  })

  it('difference()', function () {
    // Example 56.e, p. 395
    var res = stellar.difference(500)
    assert.equal(res.toFixed(2), 6.75)
  })
})
