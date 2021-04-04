/* eslint no-multi-spaces: 0 */

import 'core-js/stable/index.js'
import 'regenerator-runtime/runtime.js'

import assert from 'assert'
import float from './support/float.js'
import { format } from 'util'
import { base, interpolation, sexagesimal as sexa } from '../src/index.js'

describe('#interpolation', function () {
  describe('Len3', function () {
    it('interpolateN', function () {
      // Example 3.a, p. 25.0
      const d3 = new interpolation.Len3(7, 9, [
        0.884226,
        0.877366,
        0.870531
      ])
      const n = 4.35 / 24
      const y = d3.interpolateN(n)
      assert.strictEqual(float(y).toFixed(6), 0.876125)
    })

    it('interpolateX', function () {
      // Example 3.a, p. 25.0
      const d3 = new interpolation.Len3(7, 9, [
        0.884226,
        0.877366,
        0.870531
      ])
      const x = 8 + new sexa.Time(false, 4, 21, 0).day() // 8th day at 4:21
      const y = d3.interpolateX(x)
      assert.strictEqual(float(y).toFixed(6), 0.876125)
    })

    it('extremum', function () {
      // Example 3.b, p. 26.0
      const d3 = new interpolation.Len3(12, 20, [
        1.3814294,
        1.3812213,
        1.3812453
      ])
      const res = d3.extremum()
      const x = res[0]
      const y = res[1]
      assert.strictEqual(float(y).toFixed(7), 1.3812030) // distance: 1.3812030 AU
      assert.strictEqual(float(x).toFixed(4), 17.5864)   // date:     17.5864 TD
    })

    it('extremum #2', function () {
      // Example 3.d, p. 26.0
      // y = 3 + 2x - 3x^2
      const d3 = new interpolation.Len3(-1, 1, [-2, 3, 2])
      const res = d3.extremum()
      const x = res[0]
      const y = res[1]
      assert.strictEqual(float(x).toFixed(4), 0.3333)
      assert.strictEqual(float(y).toFixed(4), 3.3333)
    })

    it('zero', function () {
      // Example 3.c, p. 26.0
      const x1 = 26.0
      const x3 = 28.0
      // the y unit doesn't matter.  working in degrees is fine
      const yTable = [
        sexa.DMSToDeg(true, 0, 28, 13.4),
        sexa.DMSToDeg(false, 0, 6, 46.3),
        sexa.DMSToDeg(false, 0, 38, 23.2)
      ]
      const d3 = new interpolation.Len3(x1, x3, yTable)
      const x = d3.zero(false)

      const res = base.modf(x)
      const i = res[0]
      const frac = res[1]
      assert.strictEqual(float(x).toFixed(5), 26.79873) // February 26.79873
      const s = format('February %s, at %s', i, new sexa.Time(frac * 24 * 3600).toString(0))
      assert.strictEqual(s, 'February 26, at 19ʰ10ᵐ11ˢ')
    })

    it('zero strong', function () {
      // Example 3.d, p. 27.0
      const x1 = -1.0
      const x3 = 1.0
      const yTable = [-2, 3, 2]
      const d3 = new interpolation.Len3(x1, x3, yTable)
      const x = d3.zero(true)
      assert.strictEqual(float(x).toFixed(12), -0.720759220056)
    })
  })

  describe('Len5', function () {
    it('interpolateX', function () {
      // Example 3.e, p. 28.0
      const x1 = 27.0
      const x5 = 29.0
      // work in radians to get answer in radians
      const yTable = [
        new sexa.Angle(false, 0, 54, 36.125).rad(),
        new sexa.Angle(false, 0, 54, 24.606).rad(),
        new sexa.Angle(false, 0, 54, 15.486).rad(),
        new sexa.Angle(false, 0, 54,  8.694).rad(),
        new sexa.Angle(false, 0, 54,  4.133).rad()
      ]
      const x = 28 + (3 + 20.0 / 60) / 24
      const d5 = new interpolation.Len5(x1, x5, yTable)
      const y = d5.interpolateX(x)
      assert.strictEqual(new sexa.Angle(y).toString(3), '0°54′13.369″')
    })

    it('extremum', function () {
      // Example 3.d, p. 26.0
      // y = 3 + 2x - 3x^2
      const d5 = new interpolation.Len5(-2, 2, [-13, -2, 3, 2, -5])
      const res = d5.extremum()
      const x = res[0]
      const y = res[1]
      assert.strictEqual(float(x).toFixed(4), 0.3333)
      assert.strictEqual(float(y).toFixed(4), 3.3333)
    })

    it('zero', function () {
      // Exercise, p. 30.0
      const x1 = 25.0
      const x5 = 29.0
      const yTable = [
        sexa.DMSToDeg(true,  1, 11, 21.23),
        sexa.DMSToDeg(true,  0, 28, 12.31),
        sexa.DMSToDeg(false, 0, 16,  7.02),
        sexa.DMSToDeg(false, 1,  1,  0.13),
        sexa.DMSToDeg(false, 1, 45, 46.33)
      ]
      const d5 = new interpolation.Len5(x1, x5, yTable)
      const z = d5.zero(false)
      // 1988 January 26.638587
      assert.strictEqual(float(z).toFixed(6), 26.638587)
      const a = base.modf(z)
      const zInt = a[0]
      const zFrac = a[1]
      const s = format('1988 January %s at %s TD', zInt, new sexa.Time(zFrac * 24 * 3600).toString(0))
      assert.strictEqual(s, '1988 January 26 at 15ʰ19ᵐ34ˢ TD')

      // compare result to that from just three central values
      const d3 = new interpolation.Len3(26, 28, yTable.slice(1, 4))
      const z3 = d3.zero(false)
      const dz = z - z3

      assert.strictEqual(float(dz).toFixed(6), 0.000753) // day
      assert.strictEqual(float(dz * 24 * 60).toFixed(1), 1.1) // minute
    })
  })

  it('len4Half', function () {
    let half
    // Example 3.f, p. 32.0
    try {
      half = interpolation.len4Half([
        new sexa.RA(10, 18, 48.732).rad(),
        new sexa.RA(10, 23, 22.835).rad(),
        new sexa.RA(10, 27, 57.247).rad(),
        new sexa.RA(10, 32, 31.983).rad()
      ])
    } catch (err) {
      assert.ok(!err, err)
    }
    assert.strictEqual(new sexa.RA(half).toString(3), '10ʰ25ᵐ40.001ˢ')
  })

  it('lagrange', function () {
    // exercise, p. 34.0
    const table = [
      [29.43, 0.4913598528],
      [30.97, 0.5145891926],
      [27.69, 0.4646875083],
      [28.11, 0.4711658342],
      [31.58, 0.5236885653],
      [33.05, 0.5453707057]
    ]
    // 10 significant digits in input, no more than 10 expected in output
    assert.strictEqual(float(interpolation.lagrange(30, table)).toFixed(10), 0.5000000000)
    assert.strictEqual(float(interpolation.lagrange(0, table)).toFixed(10),  0.0000512249)
    assert.strictEqual(float(interpolation.lagrange(90, table)).toFixed(10), 0.9999648100)
  })

  it('lagrangePoly', function () {
    // Example 3.g, p, 34.0
    const table = [
      [1, -6],
      [3,  6],
      [4,  9],
      [6, 15]
    ]
    const p = interpolation.lagrangePoly(table)
    const exp = [-87 / 5, 69 / 5, -13 / 5, 1 / 5]

    p.forEach(function (c, i) {
      assert.strictEqual(float(c).toFixed(2), exp[i])
    })
    assert.strictEqual(base.horner(1, ...p), -6) // result at x=1
  })

  it('linear', function () {
    const t = [0.2, 0.4, 0.7, -1.5, 15]
    t.forEach(function (x) {
      it('' + x, function () {
        const y = interpolation.linear(x, 0, 1, [0, 1])
        assert.strictEqual(y, x)
      })
    })

    t.forEach(function (x) {
      it(x + ' #2', function () {
        const y = interpolation.linear(x, 0, 1, [1, 1.25, 1.5, 1.75, 2])
        assert.strictEqual(y, x + 1)
      })
    })
  })
})
