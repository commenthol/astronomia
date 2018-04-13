import assert from 'assert'
import {iterate} from '..'

describe('#iterate', function () {
  it('decimalPlaces', function () {
    // Example 5.a, p. 48.0
    var betterSqrt = function (N) {
      return function (n) {
        return (n + N / n) / 2
      }
    }
    var start = 12.0
    var places = 8
    var maxIter = 20
    var n = iterate.decimalPlaces(betterSqrt(159), start, places, maxIter)
    assert.equal(n.toFixed(8), 12.60952021)
  })

  it('fullPrecision', function () {
    // Example 5.b, p. 48.0
    var betterRoot = function (x) {
      return (8 - Math.pow(x, 5)) / 17
    }
    var x = iterate.fullPrecision(betterRoot, 0, 20)
    assert.equal(x, 0.4692498784547387)
  })

  it('fullPrecision diverging', function () {
    var err
    // Example 5.c, p. 49.0
    var betterRoot = function (x) {
      return (8 - Math.pow(x, 5)) / 3
    }
    try {
      var x = iterate.fullPrecision(betterRoot, 0, 20) // eslint-disable-line
    } catch (e) {
      err = e
    }
    assert.equal(err.message, 'Maximum iterations reached')
  })

  it('fullPrecision converging', function () {
    // Example 5.d, p.49.
    var betterRoot = function (x) {
      return Math.pow(8 - 3 * x, 0.2)
    }
    var x = iterate.fullPrecision(betterRoot, 0, 30)
    assert.equal(x, 1.321785627117658)
  })

  it('binaryRoot', function () {
    // Example  from p. 53.0
    var f = function (x) {
      return Math.pow(x, 5) + 17 * x - 8
    }
    var x = iterate.binaryRoot(f, 0, 1)
    assert.equal(x, 0.46924987845473876)
  })
})
