import assert from 'assert'
import float from './support/float.js'
import { iterate } from '../src/index.js'

describe('#iterate', function () {
  it('decimalPlaces', function () {
    // Example 5.a, p. 48.0
    const betterSqrt = function (N) {
      return function (n) {
        return (n + N / n) / 2
      }
    }
    const start = 12.0
    const places = 8
    const maxIter = 20
    const n = iterate.decimalPlaces(betterSqrt(159), start, places, maxIter)
    assert.strictEqual(float(n).toFixed(8), 12.60952021)
  })

  it('fullPrecision', function () {
    // Example 5.b, p. 48.0
    const betterRoot = function (x) {
      return (8 - Math.pow(x, 5)) / 17
    }
    const x = iterate.fullPrecision(betterRoot, 0, 20)
    assert.strictEqual(x, 0.4692498784547387)
  })

  it('fullPrecision diverging', function () {
    let err
    // Example 5.c, p. 49.0
    const betterRoot = function (x) {
      return (8 - Math.pow(x, 5)) / 3
    }
    try {
      let x = iterate.fullPrecision(betterRoot, 0, 20) // eslint-disable-line
    } catch (e) {
      err = e
    }
    assert.strictEqual(err.message, 'Maximum iterations reached')
  })

  it('fullPrecision converging', function () {
    // Example 5.d, p.49.
    const betterRoot = function (x) {
      return Math.pow(8 - 3 * x, 0.2)
    }
    const x = iterate.fullPrecision(betterRoot, 0, 30)
    assert.strictEqual(x, 1.321785627117658)
  })

  it('binaryRoot', function () {
    // Example  from p. 53.0
    const f = function (x) {
      return Math.pow(x, 5) + 17 * x - 8
    }
    const x = iterate.binaryRoot(f, 0, 1)
    assert.strictEqual(x, 0.46924987845473876)
  })
})
